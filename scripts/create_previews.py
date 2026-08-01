#!/usr/bin/env python3
"""Create 30-second, chorus-oriented MP3 preview candidates from album masters."""

from __future__ import annotations

import argparse
import json
import math
import subprocess
import tempfile
import wave
from pathlib import Path

import numpy as np


TRACKS = [
    (1, "Miranda", "01-miranda.m4a"),
    (2, "Mec Mature", "02-mec-mature.m4a"),
    (3, "Ta Daronne", "03-ta-daronne.m4a"),
    (4, "Ultimatum", "04-ultimatum.m4a"),
    (5, "Pas Dubaï", "05-pas-dubai.m4a"),
    (6, "Problématique", "06-problematique.m4a"),
    (7, "Mon CV", "07-mon-cv.m4a"),
    (8, "Chut", "08-chut.m4a"),
    (9, "Je Freeze", "09-je-freeze.m4a"),
    (10, "Dancefloor", "10-dancefloor.m4a"),
    (11, "La Clé Tourne", "11-la-cle-tourne.m4a"),
]

PREVIEW_SECONDS = 30.0
FADE_SECONDS = 1.0
ANALYSIS_RATE = 11025
FRAME_SECONDS = 0.5


def run(command: list[str]) -> None:
    subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)


def decode(source: Path, destination: Path, rate: int, channels: int) -> None:
    run(
        [
            "/usr/bin/afconvert",
            str(source),
            "-o",
            str(destination),
            "-f",
            "WAVE",
            "-d",
            f"LEI16@{rate}",
            "-c",
            str(channels),
        ]
    )


def read_pcm(path: Path) -> tuple[np.ndarray, int, int]:
    with wave.open(str(path), "rb") as wav:
        channels = wav.getnchannels()
        rate = wav.getframerate()
        frames = wav.getnframes()
        samples = np.frombuffer(wav.readframes(frames), dtype="<i2")
    return samples.reshape(-1, channels), rate, channels


def chroma_features(samples: np.ndarray, rate: int) -> tuple[np.ndarray, np.ndarray]:
    mono = samples.mean(axis=1).astype(np.float64) / 32768.0
    hop = max(1, int(rate * FRAME_SECONDS))
    fft_size = 4096
    window = np.hanning(fft_size)
    freqs = np.fft.rfftfreq(fft_size, 1.0 / rate)
    valid = (freqs >= 70.0) & (freqs <= 5000.0)
    valid_freqs = freqs[valid]
    midi = 69.0 + 12.0 * np.log2(valid_freqs / 440.0)
    pitch_classes = np.mod(np.rint(midi).astype(int), 12)
    band_edges = np.array([70, 140, 280, 560, 1120, 2240, 5000], dtype=float)
    band_indexes = np.clip(np.digitize(valid_freqs, band_edges) - 1, 0, 5)

    features: list[np.ndarray] = []
    rms_values: list[float] = []
    for offset in range(0, max(1, len(mono) - fft_size), hop):
        frame = mono[offset : offset + fft_size]
        if len(frame) < fft_size:
            frame = np.pad(frame, (0, fft_size - len(frame)))
        rms_values.append(float(np.sqrt(np.mean(frame * frame) + 1e-12)))
        spectrum = np.abs(np.fft.rfft(frame * window))[valid]
        spectrum = np.log1p(20.0 * spectrum)
        chroma = np.bincount(pitch_classes, weights=spectrum, minlength=12).astype(float)
        bands = np.bincount(band_indexes, weights=spectrum, minlength=6).astype(float)
        vector = np.concatenate([chroma / (chroma.sum() + 1e-9), bands / (bands.sum() + 1e-9)])
        features.append(vector)

    feature_matrix = np.vstack(features)
    feature_matrix -= feature_matrix.mean(axis=0, keepdims=True)
    feature_matrix /= feature_matrix.std(axis=0, keepdims=True) + 1e-6
    feature_matrix /= np.linalg.norm(feature_matrix, axis=1, keepdims=True) + 1e-9
    return feature_matrix, np.asarray(rms_values)


def choose_start(samples: np.ndarray, rate: int) -> tuple[float, dict[str, float]]:
    features, rms = chroma_features(samples, rate)
    frame_count = len(features)
    duration = len(samples) / rate
    similarity = features @ features.T
    exclusion = int(35.0 / FRAME_SECONDS)
    frame_ids = np.arange(frame_count)
    near = np.abs(frame_ids[:, None] - frame_ids[None, :]) < exclusion
    similarity[near] = -1.0
    repetition = np.maximum(similarity.max(axis=1), 0.0)

    loudness = 20.0 * np.log10(rms + 1e-8)
    loudness = np.clip((loudness - np.percentile(loudness, 10)) /
                       (np.percentile(loudness, 90) - np.percentile(loudness, 10) + 1e-6), 0.0, 1.0)
    frame_score = 0.72 * repetition + 0.28 * loudness

    window_frames = max(1, int(PREVIEW_SECONDS / FRAME_SECONDS))
    kernel = np.ones(window_frames) / window_frames
    window_score = np.convolve(frame_score, kernel, mode="valid")
    starts = np.arange(len(window_score)) * FRAME_SECONDS

    # Avoid intros/outros and gently favor the central part of the song.
    valid = (starts >= 12.0) & (starts + PREVIEW_SECONDS <= duration - 5.0)
    position = (starts + PREVIEW_SECONDS / 2.0) / max(duration, 1.0)
    centrality = np.exp(-0.5 * ((position - 0.56) / 0.30) ** 2)
    final_score = window_score * (0.78 + 0.22 * centrality)
    final_score[~valid] = -np.inf

    best_index = int(np.argmax(final_score))
    start = float(starts[best_index])
    return start, {
        "duration": round(duration, 3),
        "repetition_score": round(float(np.mean(repetition[best_index : best_index + window_frames])), 4),
        "energy_score": round(float(np.mean(loudness[best_index : best_index + window_frames])), 4),
    }


def write_preview(source_wav: Path, destination_wav: Path, start: float) -> None:
    samples, rate, channels = read_pcm(source_wav)
    start_frame = int(round(start * rate))
    frame_count = int(round(PREVIEW_SECONDS * rate))
    clip = samples[start_frame : start_frame + frame_count].astype(np.float64)
    if len(clip) < frame_count:
        clip = np.pad(clip, ((0, frame_count - len(clip)), (0, 0)))

    fade_frames = min(int(round(FADE_SECONDS * rate)), len(clip) // 2)
    fade_in = np.linspace(0.0, 1.0, fade_frames, endpoint=True)
    fade_out = np.linspace(1.0, 0.0, fade_frames, endpoint=True)
    clip[:fade_frames] *= fade_in[:, None]
    clip[-fade_frames:] *= fade_out[:, None]
    clip = np.clip(np.rint(clip), -32768, 32767).astype("<i2")

    with wave.open(str(destination_wav), "wb") as wav:
        wav.setnchannels(channels)
        wav.setsampwidth(2)
        wav.setframerate(rate)
        wav.writeframes(clip.tobytes())


def encode_aac(source_wav: Path, destination_m4a: Path) -> None:
    destination_m4a.parent.mkdir(parents=True, exist_ok=True)
    if destination_m4a.exists():
        destination_m4a.unlink()
    run(
        [
            "/usr/bin/afconvert",
            str(source_wav),
            "-o",
            str(destination_m4a),
            "-f",
            "m4af",
            "-d",
            "aac",
            "-b",
            "192000",
        ]
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()

    source_files = sorted(args.source.glob("*.mp3"))
    if len(source_files) != len(TRACKS):
        raise SystemExit(f"Expected {len(TRACKS)} MP3 files, found {len(source_files)}")

    report: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix="aba-sissa-previews-") as temporary:
        temp = Path(temporary)
        for source, (number, title, output_name) in zip(source_files, TRACKS, strict=True):
            analysis_wav = temp / f"{number:02d}-analysis.wav"
            master_wav = temp / f"{number:02d}-master.wav"
            preview_wav = temp / f"{number:02d}-preview.wav"

            decode(source, analysis_wav, ANALYSIS_RATE, 1)
            analysis_samples, analysis_rate, _ = read_pcm(analysis_wav)
            start, metrics = choose_start(analysis_samples, analysis_rate)

            decode(source, master_wav, 44100, 2)
            write_preview(master_wav, preview_wav, start)
            output = args.destination / output_name
            encode_aac(preview_wav, output)

            report.append(
                {
                    "number": number,
                    "title": title,
                    "source": source.name,
                    "file": output_name,
                    "start_seconds": round(start, 1),
                    "end_seconds": round(start + PREVIEW_SECONDS, 1),
                    **metrics,
                }
            )
            print(f"{number:02d} {title}: {start:.1f}s–{start + PREVIEW_SECONDS:.1f}s")

    args.destination.mkdir(parents=True, exist_ok=True)
    (args.destination / "timecodes.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
