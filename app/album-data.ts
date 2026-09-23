export type StreamingPlatform = {
  name: string;
  icon: string;
  url: string;
};

export type Track = {
  number: number;
  title: string;
  preview: string;
};

export type Album = {
  slug: string;
  artist: string;
  title: string;
  cover: string;
  releaseLabel: string;
  releaseDate: string;
  description: string;
  platforms: StreamingPlatform[];
  tracks: Track[];
  theme: {
    background: string;
    backgroundSoft: string;
    accent: string;
  };
};

export const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const sitePath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

export const socials = {
  instagram: "https://www.instagram.com/aba_sissa/",
  tiktok: "https://www.tiktok.com/@aba.sissa",
};

// MISE À JOUR FACILE
// - Ajoutez les plateformes dans l’album lorsque de nouveaux liens sont disponibles.
// - Placez les extraits dans public/audio/<album>/ puis renseignez leur chemin.
// - Ajoutez un nouvel objet Album et sa page dédiée pour le prochain projet.
export const shine: Album = {
  slug: "shine",
  artist: "ABA SISSA",
  title: "SHINE",
  cover: assetPath("/shine-album-cover.jpg"),
  releaseLabel: "Disponible maintenant",
  releaseDate: "18 septembre 2026",
  description: "Le deuxième album d’ABA SISSA, solaire et affirmé, en 14 titres.",
  theme: {
    background: "#0d3147",
    backgroundSoft: "#397b94",
    accent: "#d6a34b",
  },
  platforms: [
    { name: "Spotify", icon: "spotify", url: "https://open.spotify.com/album/7e9LHNJ0BFjnYgkAAosLwi" },
    { name: "Apple Music", icon: "applemusic", url: "https://music.apple.com/fr/album/shine/6810778558" },
    { name: "YouTube Music", icon: "youtubemusic", url: "https://music.youtube.com/browse/MPREb_xmRbXaf9A3i" },
    { name: "Deezer", icon: "deezer", url: "https://www.deezer.com/album/1075859592" },
    { name: "Amazon Music", icon: "amazonmusic", url: "https://music.amazon.fr/albums/B0HJFHP8VC" },
    { name: "TIDAL", icon: "tidal", url: "https://tidal.com/album/560129527" },
  ],
  tracks: [
    { number: 1, title: "Dead la gentille", preview: assetPath("/audio/shine/01-dead-la-gentille.m4a") },
    { number: 2, title: "Shine", preview: assetPath("/audio/shine/02-shine.m4a") },
    { number: 3, title: "Mes Go", preview: assetPath("/audio/shine/03-mes-go.m4a") },
    { number: 4, title: "Prévisible", preview: assetPath("/audio/shine/04-previsible.m4a") },
    { number: 5, title: "Température", preview: assetPath("/audio/shine/05-temperature.m4a") },
    { number: 6, title: "Mariés au premier regard", preview: assetPath("/audio/shine/06-maries-au-premier-regard.m4a") },
    { number: 7, title: "Pas ton numéro", preview: assetPath("/audio/shine/07-pas-ton-numero.m4a") },
    { number: 8, title: "Fort Boyard", preview: assetPath("/audio/shine/08-fort-boyard.m4a") },
    { number: 9, title: "Hashtag mytho", preview: assetPath("/audio/shine/09-hashtag-mytho.m4a") },
    { number: 10, title: "J’le vaux bien", preview: assetPath("/audio/shine/10-jle-vaux-bien.m4a") },
    { number: 11, title: "Ca veut pas dire oui", preview: assetPath("/audio/shine/11-ca-veut-pas-dire-oui.m4a") },
    { number: 12, title: "Mes rivales", preview: assetPath("/audio/shine/12-mes-rivales.m4a") },
    { number: 13, title: "Pas ma DA", preview: assetPath("/audio/shine/13-pas-ma-da.m4a") },
    { number: 14, title: "Aba Sissa", preview: assetPath("/audio/shine/14-aba-sissa.m4a") },
  ],
};

export const chut: Album = {
  slug: "chut",
  artist: "ABA SISSA",
  title: "CHUT !",
  cover: assetPath("/chut-album-cover.jpg"),
  releaseLabel: "Disponible maintenant",
  releaseDate: "2026",
  description: "Le premier album d’ABA SISSA, en 11 titres.",
  theme: {
    background: "#071d3b",
    backgroundSoft: "#102c55",
    accent: "#f06da2",
  },
  platforms: [
    { name: "Spotify", icon: "spotify", url: "https://open.spotify.com/album/2UB0BSujgOr6G3lcNV0Fhe" },
    { name: "Apple Music", icon: "applemusic", url: "https://music.apple.com/fr/album/chut/6790554865" },
    { name: "Deezer", icon: "deezer", url: "https://www.deezer.com/fr/album/1028342842" },
    { name: "YouTube Music", icon: "youtubemusic", url: "https://music.youtube.com/playlist?list=OLAK5uy_mtruoRWS_uqj08vroVHagKJx82UCaiuIY" },
    { name: "Amazon Music", icon: "amazonmusic", url: "https://music.amazon.fr/tracks/B0H8QPM3NS/" },
  ],
  tracks: [
    { number: 1, title: "Miranda", preview: assetPath("/audio/01-miranda.m4a") },
    { number: 2, title: "Mec Mature", preview: assetPath("/audio/02-mec-mature.m4a") },
    { number: 3, title: "Ta Daronne", preview: assetPath("/audio/03-ta-daronne.m4a") },
    { number: 4, title: "Ultimatum", preview: assetPath("/audio/04-ultimatum.m4a") },
    { number: 5, title: "Pas Dubaï", preview: assetPath("/audio/05-pas-dubai.m4a") },
    { number: 6, title: "Problématique", preview: assetPath("/audio/06-problematique.m4a") },
    { number: 7, title: "Mon CV", preview: assetPath("/audio/07-mon-cv.m4a") },
    { number: 8, title: "Chut", preview: assetPath("/audio/08-chut.m4a") },
    { number: 9, title: "Je Freeze", preview: assetPath("/audio/09-je-freeze.m4a") },
    { number: 10, title: "Dancefloor", preview: assetPath("/audio/10-dancefloor.m4a") },
    { number: 11, title: "La Clé Tourne", preview: assetPath("/audio/11-la-cle-tourne.m4a") },
  ],
};

export const albums = [shine, chut];
