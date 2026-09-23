import type { Metadata } from "next";
import { AlbumPage } from "./AlbumPage";

export const metadata: Metadata = {
  title: "CHUT ! & SHINE — ABA SISSA",
  description:
    "Écoutez CHUT ! et SHINE, les albums d’ABA SISSA, et découvrez les extraits disponibles.",
};

export default function Home() {
  return <AlbumPage />;
}
