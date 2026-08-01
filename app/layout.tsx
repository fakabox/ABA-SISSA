import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicUrl = "https://fakabox.github.io/ABA-SISSA/";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: {
    default: "CHUT ! — ABA SISSA",
    template: "%s — ABA SISSA",
  },
  description: "La page officielle de l’album CHUT ! d’ABA SISSA.",
  icons: {
    icon: `${basePath}/chut-album-cover.jpg`,
    shortcut: `${basePath}/chut-album-cover.jpg`,
  },
  openGraph: {
    type: "music.album",
    title: "CHUT ! — ABA SISSA",
    description: "Écoutez l’album CHUT ! et découvrez l’univers d’ABA SISSA.",
    url: publicUrl,
    images: [`${publicUrl}og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "CHUT ! — ABA SISSA",
    description: "Écoutez l’album CHUT ! et découvrez l’univers d’ABA SISSA.",
    images: [`${publicUrl}og.png`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
