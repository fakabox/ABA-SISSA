export type StreamingPlatform = {
  name: string;
  icon: string;
  url: string | null;
};

export type Track = {
  number: number;
  title: string;
  preview: string | null;
};

export const assetPath = (path: string) =>
  `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;

// MISE À JOUR FACILE
// - Collez les nouveaux liens de streaming à la place de null.
// - Placez les extraits dans public/audio/ puis renseignez leur chemin.
// - Modifiez nextAlbum lorsque le prochain projet est prêt.
export const album = {
  artist: "ABA SISSA",
  title: "CHUT !",
  releaseLabel: "Disponible maintenant",
  cover: assetPath("/chut-album-cover.jpg"),
  socials: {
    instagram: "https://www.instagram.com/aba_sissa/",
    tiktok: "https://www.tiktok.com/@aba.sissa",
  },
  platforms: [
    {
      name: "Spotify",
      icon: "spotify",
      url: "https://open.spotify.com/album/2UB0BSujgOr6G3lcNV0Fhe",
    },
    {
      name: "Apple Music",
      icon: "applemusic",
      url: "https://music.apple.com/fr/album/chut/6790554865",
    },
    {
      name: "Deezer",
      icon: "deezer",
      url: "https://www.deezer.com/fr/album/1028342842",
    },
    {
      name: "YouTube Music",
      icon: "youtubemusic",
      url: "https://music.youtube.com/playlist?list=OLAK5uy_mtruoRWS_uqj08vroVHagKJx82UCaiuIY",
    },
    {
      name: "Amazon Music",
      icon: "amazonmusic",
      url: "https://music.amazon.fr/tracks/B0H8QPM3NS/",
    },
  ] satisfies StreamingPlatform[],
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
  ] satisfies Track[],
  nextAlbum: {
    title: "Nouvelle Era",
    trackCount: 15,
    label: "Prochain album",
    status: "En préparation",
  },
};
