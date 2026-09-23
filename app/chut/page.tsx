import type { Metadata } from "next";
import { AlbumPage } from "../AlbumPage";
import { chut } from "../album-data";

export const metadata: Metadata = {
  title: "CHUT !",
  description: "Écoutez CHUT !, le premier album d’ABA SISSA, et découvrez les extraits de ses 11 titres.",
  openGraph: {
    type: "music.album",
    title: "CHUT ! — ABA SISSA",
    description: "Découvrez les 11 titres et les extraits de l’album CHUT ! d’ABA SISSA.",
    url: "https://fakabox.github.io/ABA-SISSA/chut/",
    images: ["https://fakabox.github.io/ABA-SISSA/chut-album-cover-v2.png"],
  },
};

export default function ChutPage() {
  return <AlbumPage album={chut} />;
}
