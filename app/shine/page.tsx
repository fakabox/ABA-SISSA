import type { Metadata } from "next";
import { AlbumPage } from "../AlbumPage";
import { shine } from "../album-data";

export const metadata: Metadata = {
  title: "SHINE",
  description: "Écoutez SHINE, le nouvel album d’ABA SISSA, et découvrez les extraits de ses 14 titres.",
  openGraph: {
    type: "music.album",
    title: "SHINE — ABA SISSA",
    description: "Le nouvel album d’ABA SISSA est disponible. Découvrez ses 14 titres et leurs extraits.",
    url: "https://fakabox.github.io/ABA-SISSA/shine/",
    images: ["https://fakabox.github.io/ABA-SISSA/shine-album-cover.jpg"],
  },
};

export default function ShinePage() {
  return <AlbumPage album={shine} />;
}
