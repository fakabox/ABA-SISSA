"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { type Album, sitePath, socials, type Track } from "./album-data";
import { BrandIcon } from "./BrandIcon";

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <span className="pause-icon" aria-hidden="true"><i /><i /></span>
  ) : (
    <span className="play-icon" aria-hidden="true" />
  );
}

export function AlbumPage({ album }: { album: Album }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeTrackRef = useRef<Track | null>(null);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      setProgress(audio.duration ? (audio.currentTime / audio.duration) * 100 : 0);
    };
    const stop = () => setIsPlaying(false);
    const start = () => setIsPlaying(true);
    const playNext = () => {
      const currentTrack = activeTrackRef.current;
      if (!currentTrack) return;
      const currentIndex = album.tracks.findIndex(
        (track) => track.number === currentTrack.number,
      );
      const nextTrack = album.tracks[currentIndex + 1];
      if (!nextTrack) {
        setIsPlaying(false);
        return;
      }
      activeTrackRef.current = nextTrack;
      setActiveTrack(nextTrack);
      setProgress(0);
      audio.src = nextTrack.preview;
      void audio.play();
    };

    audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", playNext);
    audio.addEventListener("pause", stop);
    audio.addEventListener("play", start);
    return () => {
      audio.removeEventListener("timeupdate", updateProgress);
      audio.removeEventListener("ended", playNext);
      audio.removeEventListener("pause", stop);
      audio.removeEventListener("play", start);
    };
  }, [album]);

  useEffect(() => {
    if (!showShare) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowShare(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [showShare]);

  const toggleTrack = async (track: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeTrack?.number === track.number) {
      if (audio.paused) await audio.play();
      else audio.pause();
      return;
    }
    activeTrackRef.current = track;
    setActiveTrack(track);
    setProgress(0);
    audio.src = track.preview;
    await audio.play();
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl || window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  const openShare = () => {
    setShareUrl(window.location.href);
    setShowShare(true);
  };

  const shareText = `Découvre ${album.title}, l’album d’${album.artist}.`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(`${album.title} — ${album.artist}`);
  const albumStyle = {
    "--album-bg": album.theme.background,
    "--album-bg-soft": album.theme.backgroundSoft,
    "--album-accent": album.theme.accent,
  } as CSSProperties;

  return (
    <main className={`album-page album-page-${album.slug}`} style={albumStyle}>
      <audio ref={audioRef} preload="none" />

      <section className="album-hero" aria-labelledby="album-title">
        <div
          className="album-hero-backdrop"
          style={{ backgroundImage: `url("${album.cover}")` }}
          aria-hidden="true"
        />
        <header className="album-header">
          <a className="wordmark" href={sitePath("/")}><span>ABA</span> SISSA</a>
          <a className="back-link" href={sitePath("/#albums")}>← Tous les albums</a>
        </header>

        <div className="album-hero-content" id="top">
          <div className="album-cover-wrap">
            <div className="album-cover-glow" aria-hidden="true" />
            <img
              className="album-cover"
              src={album.cover}
              alt={`Pochette de l’album ${album.title} d’${album.artist}`}
              width="1400"
              height="1400"
            />
          </div>

          <div className="album-intro">
            <p className="eyebrow">Album · {album.tracks.length} titres</p>
            <h1 id="album-title">{album.title}</h1>
            <div className="artist-row">
              <p className="artist">{album.artist}</p>
              <div className="social-actions" aria-label={`Suivre et partager ${album.artist}`}>
                <a className="social-pill" href={socials.instagram} target="_blank" rel="noreferrer">
                  <BrandIcon name="instagram" /><span>Suivre</span>
                </a>
                <a className="social-pill" href={socials.tiktok} target="_blank" rel="noreferrer">
                  <BrandIcon name="tiktok" /><span>Suivre</span>
                </a>
                <button className="social-pill" type="button" onClick={openShare}>
                  <BrandIcon name="share" /><span>Partager</span>
                </button>
              </div>
            </div>
            <p className="release">{album.releaseLabel}</p>
            <p className="album-description">{album.description}</p>

            <div className="streaming-block">
              <p>Écouter sur</p>
              <div className="platforms" aria-label="Plateformes de streaming">
                {album.platforms.map((platform) => (
                  <a
                    className="platform-button"
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                    key={platform.name}
                  >
                    <BrandIcon name={platform.icon} />
                    <span>{platform.name}</span>
                    <span aria-hidden="true">↗</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tracks-section" id="titres" aria-labelledby="tracks-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Tracklist</p>
            <h2 id="tracks-title">Découvrez des extraits de l’album</h2>
          </div>
          <p className="autoplay-note">Les extraits s’enchaînent automatiquement.</p>
        </div>

        <ol className="track-list">
          {album.tracks.map((track) => {
            const isActive = activeTrack?.number === track.number;
            return (
              <li className={isActive ? "track is-active" : "track"} key={track.number}>
                <span className="track-number">{String(track.number).padStart(2, "0")}</span>
                <button
                  className="track-play"
                  type="button"
                  onClick={() => toggleTrack(track)}
                  aria-label={`${isActive && isPlaying ? "Mettre en pause" : "Écouter"} ${track.title}`}
                >
                  <PlayIcon playing={isActive && isPlaying} />
                </button>
                <div className="track-info">
                  <strong>{track.title}</strong>
                  <span>{album.artist}</span>
                  {isActive && <i className="progress" style={{ width: `${progress}%` }} />}
                </div>
              </li>
            );
          })}
        </ol>
      </section>

      <footer className="album-footer">
        <a href={sitePath("/#albums")}>← Retour aux albums</a>
        <p>© 2026 · ABA SISSA</p>
      </footer>

      {showShare && (
        <div className="share-overlay" onMouseDown={() => setShowShare(false)}>
          <section
            className="share-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="share-title"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button className="share-close" type="button" onClick={() => setShowShare(false)} aria-label="Fermer">×</button>
            <p className="eyebrow">Partager</p>
            <h2 id="share-title">{album.title}</h2>
            <p className="share-intro">Faites découvrir l’album d’{album.artist}.</p>
            <div className="share-options">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer"><BrandIcon name="facebook" /><span>Facebook</span></a>
              <a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noreferrer"><BrandIcon name="x" /><span>X</span></a>
              <a href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noreferrer"><BrandIcon name="whatsapp" /><span>WhatsApp</span></a>
              <a href={`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`}><BrandIcon name="email" /><span>E-mail</span></a>
              <button type="button" onClick={copyLink}><BrandIcon name="copy" /><span>{copied ? "Lien copié" : "Copier le lien"}</span></button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
