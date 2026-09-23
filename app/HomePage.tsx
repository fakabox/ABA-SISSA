import { albums, shine, sitePath, socials } from "./album-data";
import { BrandIcon } from "./BrandIcon";

export function HomePage() {
  return (
    <main className="artist-home">
      <section className="home-hero" id="top" aria-labelledby="home-title">
        <div
          className="home-hero-backdrop"
          style={{ backgroundImage: `url("${shine.cover}")` }}
          aria-hidden="true"
        />
        <header className="site-header">
          <a className="wordmark" href="#top" aria-label="ABA SISSA — haut de page">
            <span>ABA</span> SISSA
          </a>
          <nav aria-label="Navigation principale">
            <a href="#albums">Albums</a>
          </nav>
          <div className="header-socials" aria-label="Suivre ABA SISSA">
            <a href={socials.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <BrandIcon name="instagram" />
            </a>
            <a href={socials.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
              <BrandIcon name="tiktok" />
            </a>
          </div>
        </header>

        <div className="home-hero-content">
          <div className="home-cover-wrap">
            <div className="home-cover-glow" aria-hidden="true" />
            <img
              src={shine.cover}
              alt="Pochette de l’album SHINE d’ABA SISSA"
              width="3000"
              height="3000"
            />
          </div>
          <div className="home-release-copy">
            <p className="eyebrow">Nouvel album · Disponible maintenant</p>
            <h1 id="home-title">SHINE</h1>
            <p className="home-artist">ABA SISSA</p>
            <p className="home-release-date">Disponible depuis le 18 septembre 2026</p>
            <p className="home-lead">
              Le deuxième album d’ABA SISSA est en ligne. Écoutez-le sur votre plateforme
              préférée ou découvrez ici les extraits de ses 14 titres.
            </p>
            <div className="hero-platforms" aria-label="Écouter SHINE">
              {shine.platforms.map((platform) => (
                <a
                  href={platform.url}
                  target="_blank"
                  rel="noreferrer"
                  key={platform.name}
                  aria-label={`SHINE sur ${platform.name}`}
                >
                  <BrandIcon name={platform.icon} />
                  <span>{platform.name}</span>
                </a>
              ))}
            </div>
            <a className="primary-cta" href={sitePath("/shine/")}>
              Découvrir les 14 extraits <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </section>

      <section className="discography-section" id="albums" aria-labelledby="albums-title">
        <div className="home-section-heading">
          <p className="eyebrow">Discographie</p>
          <h2 id="albums-title">Les albums</h2>
          <p>Deux albums, leurs plateformes d’écoute et tous les extraits à découvrir.</p>
        </div>

        <div className="album-grid">
          {albums.map((album, index) => (
            <article className={`home-album-card home-album-card-${album.slug}`} key={album.slug}>
              <a className="home-album-cover" href={sitePath(`/${album.slug}/`)}>
                <img
                  src={album.cover}
                  alt={`Pochette de ${album.title}`}
                  width="1200"
                  height="1200"
                />
              </a>
              <div className="home-album-copy">
                <div className="home-album-meta">
                  <span className="status-badge">Disponible</span>
                  <span>{album.tracks.length} titres</span>
                  <span>{album.releaseDate}</span>
                </div>
                <p className="album-order">{index === 0 ? "Nouvel album" : "Premier album"}</p>
                <h3>{album.title}</h3>
                <p>{album.description}</p>

                <div className="card-platforms" aria-label={`Écouter ${album.title}`}>
                  {album.platforms.map((platform) => (
                    <a
                      href={platform.url}
                      target="_blank"
                      rel="noreferrer"
                      key={platform.name}
                      aria-label={`${album.title} sur ${platform.name}`}
                    >
                      <BrandIcon name={platform.icon} />
                      <span>{platform.name}</span>
                    </a>
                  ))}
                </div>

                <a className="album-link" href={sitePath(`/${album.slug}/`)}>
                  Découvrir les extraits <span aria-hidden="true">→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="follow-section" aria-labelledby="follow-title">
        <div>
          <p className="eyebrow">À suivre</p>
          <h2 id="follow-title">Retrouvez ABA SISSA</h2>
        </div>
        <div className="follow-links">
          <a href={socials.instagram} target="_blank" rel="noreferrer"><BrandIcon name="instagram" />Instagram</a>
          <a href={socials.tiktok} target="_blank" rel="noreferrer"><BrandIcon name="tiktok" />TikTok</a>
        </div>
      </section>

      <footer className="site-footer">
        <a className="wordmark" href="#top"><span>ABA</span> SISSA</a>
        <p>© 2026 · Tous droits réservés</p>
      </footer>
    </main>
  );
}
