#!/usr/bin/env python3
"""Create the 30-second SHINE previews from the supplied WAV masters."""

from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

from create_previews import (
    PREVIEW_SECONDS,
    choose_start,
    decode,
    read_pcm,
    write_preview,
)


TRACKS = [
    (1, "Dead la gentille", "01-dead-la-gentille.m4a", None),
    (2, "Shine", "02-shine.m4a", None),
    (3, "Mes Go", "03-mes-go.m4a", 16.0),
    (4, "Prévisible", "04-previsible.m4a", 16.0),
    (5, "Température", "05-temperature.m4a", None),
    (6, "Mariés au premier regard", "06-maries-au-premier-regard.m4a", None),
    (7, "Pas ton numéro", "07-pas-ton-numero.m4a", 0.0),
    (8, "Fort Boyard", "08-fort-boyard.m4a", 0.0),
    (9, "Hashtag mytho", "09-hashtag-mytho.m4a", 0.0),
    (10, "J’le vaux bien", "10-jle-vaux-bien.m4a", 0.0),
    (11, "Ca veut pas dire oui", "11-ca-veut-pas-dire-oui.m4a", 20.0),
    (12, "Mes rivales", "12-mes-rivales.m4a", None),
    (13, "Pas ma DA", "13-pas-ma-da.m4a", None),
    (14, "Aba Sissa", "14-aba-sissa.m4a", None),
]


def encode_aac(source_wav: Path, destination_m4a: Path) -> None:
    ffmpeg = shutil.which("ffmpeg")
    if not ffmpeg:
        raise SystemExit("ffmpeg is required to encode the M4A previews")
    if destination_m4a.exists():
        destination_m4a.unlink()
    subprocess.run(
        [
            ffmpeg,
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(source_wav),
            "-c:a",
            "aac",
            "-b:a",
            "192k",
            "-movflags",
            "+faststart",
            str(destination_m4a),
        ],
        check=True,
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()

    source_files = sorted(args.source.glob("*.wav"))
    if len(source_files) != len(TRACKS):
        raise SystemExit(f"Expected {len(TRACKS)} WAV files, found {len(source_files)}")

    args.destination.mkdir(parents=True, exist_ok=True)
    report: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix="aba-sissa-shine-previews-") as temporary:
        temp = Path(temporary)
        for source, (number, title, output_name, manual_start) in zip(
            source_files, TRACKS, strict=True
        ):
            analysis_wav = temp / f"{number:02d}-analysis.wav"
            master_wav = temp / f"{number:02d}-master.wav"
            preview_wav = temp / f"{number:02d}-preview.wav"

            decode(source, analysis_wav, 11025, 1)
            analysis_samples, analysis_rate, _ = read_pcm(analysis_wav)
            duration = len(analysis_samples) / analysis_rate
            if manual_start is None:
                start, metrics = choose_start(analysis_samples, analysis_rate)
                selection = "automatic chorus candidate"
            else:
                start = manual_start
                metrics = {
                    "duration": round(duration, 3),
                    "repetition_score": None,
                    "energy_score": None,
                }
                selection = "Notion TikTok timecode"

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
                    "selection": selection,
                    **metrics,
                }
            )
            print(f"{number:02d} {title}: {start:.1f}s–{start + PREVIEW_SECONDS:.1f}s ({selection})")

    (args.destination / "timecodes.json").write_text(
        json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
