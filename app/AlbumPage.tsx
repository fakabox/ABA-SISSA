"use client";

import { type CSSProperties, useEffect, useRef, useState } from "react";
import { album, assetPath, type Track } from "./album-data";

function PlayIcon({ playing }: { playing: boolean }) {
  return playing ? (
    <span className="pause-icon" aria-hidden="true"><i /><i /></span>
  ) : (
    <span className="play-icon" aria-hidden="true" />
  );
}

function BrandIcon({ name }: { name: string }) {
  return (
    <span
      className="brand-icon"
      style={{ "--icon": `url("${assetPath(`/icons/${name}.svg`)}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}

export function AlbumPage() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const activeTrackRef = useRef<Track | null>(null);
  const [activeTrack, setActiveTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

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
      const index = album.tracks.findIndex((track) => track.number === currentTrack.number);
      const nextTrack = album.tracks[index + 1];
      if (!nextTrack?.preview) {
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
  }, []);

  useEffect(() => {
    if (!showShare) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowShare(false);
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [showShare]);

  const toggleTrack = async (track: Track) => {
    if (!track.preview || !audioRef.current) return;
    const audio = audioRef.current;
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

  const shareText = `Découvre ${album.title}, l’album de ${album.artist}.`;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedText = encodeURIComponent(shareText);
  const encodedTitle = encodeURIComponent(`${album.title} — ${album.artist}`);

  return (
    <main>
      <audio ref={audioRef} preload="none" />

      <section className="hero" id="top" aria-labelledby="album-title">
        <div
          className="hero-backdrop"
          style={{ backgroundImage: `url("${album.cover}")` }}
          aria-hidden="true"
        />
        <div className="topbar">
          <a className="wordmark" href="#top">ABA <span>SISSA</span></a>
          <a className="catalog-link" href="#prochainement">La suite <span>↓</span></a>
        </div>

        <div className="hero-content">
          <div className="cover-wrap">
            <div className="cover-glow" aria-hidden="true" />
            <img
              className="cover"
              src={album.cover}
              alt={`Pochette de l’album ${album.title} d’${album.artist}`}
              width="1254"
              height="1254"
            />
          </div>

          <div className="album-intro">
            <p className="eyebrow">Album · 11 titres</p>
            <h1 id="album-title">{album.title}</h1>
            <div className="artist-row">
              <p className="artist">{album.artist}</p>
              <div className="social-actions" aria-label={`Suivre et partager ${album.artist}`}>
                <a className="social-pill" href={album.socials.instagram} target="_blank" rel="noreferrer">
                  <BrandIcon name="instagram" /><span>Suivre</span>
                </a>
                <a className="social-pill" href={album.socials.tiktok} target="_blank" rel="noreferrer">
                  <BrandIcon name="tiktok" /><span>Suivre</span>
                </a>
                <button className="social-pill" type="button" onClick={() => setShowShare(true)}>
                  <BrandIcon name="share" /><span>Partager</span>
                </button>
              </div>
            </div>
            <p className="release">{album.releaseLabel}</p>

            <div className="streaming-block">
              <p>Écouter sur</p>
              <div className="platforms" aria-label="Plateformes de streaming">
                {album.platforms.map((platform) =>
                  platform.url ? (
                    <a className="platform-button" href={platform.url} target="_blank" rel="noreferrer" key={platform.name}>
                      <BrandIcon name={platform.icon} /><span>{platform.name}</span><span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="platform-button is-pending" key={platform.name}>
                      <BrandIcon name={platform.icon} /><span>{platform.name}</span><small>Bientôt</small>
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tracks-section" id="titres" aria-labelledby="tracks-title">
        <div className="section-heading">
          <p className="eyebrow">Tracklist</p>
          <h2 id="tracks-title">Découvrez des extraits de l’album</h2>
        </div>

        <ol className="track-list">
          {album.tracks.map((track) => {
            const isActive = activeTrack?.number === track.number;
            const canPlay = Boolean(track.preview);
            return (
              <li className={isActive ? "track is-active" : "track"} key={track.number}>
                <span className="track-number">{String(track.number).padStart(2, "0")}</span>
                <button
                  className="track-play"
                  type="button"
                  disabled={!canPlay}
                  onClick={() => toggleTrack(track)}
                  aria-label={canPlay ? `${isActive && isPlaying ? "Mettre en pause" : "Écouter"} ${track.title}` : `Extrait de ${track.title} bientôt disponible`}
                >
                  <PlayIcon playing={isActive && isPlaying} />
                </button>
                <div className="track-info">
                  <strong>{track.title}</strong><span>{album.artist}</span>
                  {isActive && <i className="progress" style={{ width: `${progress}%` }} />}
                </div>
                {!canPlay && <span className="track-status">Extrait bientôt</span>}
              </li>
            );
          })}
        </ol>
      </section>

      <section className="future-section" id="prochainement" aria-labelledby="future-title">
        <div className="future-heading">
          <div>
            <p className="eyebrow">La suite</p>
            <h2 id="future-title">L’histoire continue.</h2>
          </div>
          <p>Une passerelle élégante entre les albums : le projet actuel reste accessible et le prochain commence déjà à vivre.</p>
        </div>

        <div className="album-shelf">
          <article className="album-card is-current">
            <img src={album.cover} alt="" width="600" height="600" />
            <div className="album-card-copy">
              <span>Vous écoutez</span>
              <h3>{album.title}</h3>
              <p>11 titres · disponible</p>
            </div>
          </article>

          <article className="album-card is-next">
            <div className="future-art" aria-hidden="true">
              <span>02</span>
              <strong>NOUVELLE<br />ERA</strong>
              <i>ABA SISSA</i>
            </div>
            <div className="album-card-copy">
              <span>{album.nextAlbum.label}</span>
              <h3>{album.nextAlbum.title}</h3>
              <p>{album.nextAlbum.trackCount} titres · {album.nextAlbum.status.toLowerCase()}</p>
            </div>
            <div className="coming-pill">Prochainement</div>
          </article>
        </div>

        <div className="follow-banner">
          <p>Ne manquez pas le prochain chapitre.</p>
          <div>
            <a href={album.socials.instagram} target="_blank" rel="noreferrer"><BrandIcon name="instagram" />Instagram</a>
            <a href={album.socials.tiktok} target="_blank" rel="noreferrer"><BrandIcon name="tiktok" />TikTok</a>
          </div>
        </div>
      </section>

      <footer><p>{album.artist}</p><p>© 2026 · Tous droits réservés</p></footer>

      {showShare && (
        <div className="share-overlay" onMouseDown={() => setShowShare(false)}>
          <section className="share-modal" role="dialog" aria-modal="true" aria-labelledby="share-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="share-close" type="button" onClick={() => setShowShare(false)} aria-label="Fermer">×</button>
            <p className="eyebrow">Partager</p>
            <h2 id="share-title">{album.title}</h2>
            <p className="share-intro">Faites découvrir l’album d’{album.artist}.</p>
            <div className="share-options">
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noreferrer"><BrandIcon name="facebook" />Facebook</a>
              <a href={`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`} target="_blank" rel="noreferrer"><BrandIcon name="x" />X</a>
              <a href={`https://wa.me/?text=${encodedText}%20${encodedUrl}`} target="_blank" rel="noreferrer"><BrandIcon name="whatsapp" />WhatsApp</a>
              <a href={`mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`}><BrandIcon name="email" />E-mail</a>
              <button type="button" onClick={copyLink}><BrandIcon name="copy" />{copied ? "Lien copié" : "Copier le lien"}</button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
