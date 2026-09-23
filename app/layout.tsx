import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicUrl = "https://fakabox.github.io/ABA-SISSA/";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: {
    default: "ABA SISSA — SHINE & CHUT !",
    template: "%s — ABA SISSA",
  },
  description: "Les albums SHINE et CHUT ! d’ABA SISSA, les plateformes d’écoute et tous les extraits.",
  icons: {
    icon: `${basePath}/shine-album-cover.jpg`,
    shortcut: `${basePath}/shine-album-cover.jpg`,
  },
  openGraph: {
    type: "music.album",
    title: "ABA SISSA — SHINE & CHUT !",
    description: "Écoutez les albums SHINE et CHUT ! et découvrez l’univers d’ABA SISSA.",
    url: publicUrl,
    images: [`${publicUrl}shine-album-cover.jpg`],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABA SISSA — SHINE & CHUT !",
    description: "Écoutez les albums SHINE et CHUT ! et découvrez l’univers d’ABA SISSA.",
    images: [`${publicUrl}shine-album-cover.jpg`],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
