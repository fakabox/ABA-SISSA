import type { Metadata } from "next";
import { AlbumPage } from "./AlbumPage";

export const metadata: Metadata = {
  title: "CHUT ! — ABA SISSA",
  description:
    "Écoutez CHUT !, l’album d’ABA SISSA, et découvrez ses prochains projets.",
};

export default function Home() {
  return <AlbumPage />;
}
