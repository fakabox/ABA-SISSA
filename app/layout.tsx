import type { Metadata } from "next";
import "./globals.css";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const publicUrl = "https://fakabox.github.io/ABA-SISSA/";

export const metadata: Metadata = {
  metadataBase: new URL(publicUrl),
  title: {
    default: "ABA SISSA — CHUT ! & SHINE",
    template: "%s — ABA SISSA",
  },
  description: "Les albums CHUT ! et SHINE d’ABA SISSA, les plateformes d’écoute et les extraits.",
  icons: {
    icon: `${basePath}/chut-album-cover.jpg`,
    shortcut: `${basePath}/chut-album-cover.jpg`,
  },
  openGraph: {
    type: "music.album",
    title: "ABA SISSA — CHUT ! & SHINE",
    description: "Écoutez les albums CHUT ! et SHINE et découvrez l’univers d’ABA SISSA.",
    url: publicUrl,
    images: [`${publicUrl}og.png`],
  },
  twitter: {
    card: "summary_large_image",
    title: "ABA SISSA — CHUT ! & SHINE",
    description: "Écoutez les albums CHUT ! et SHINE et découvrez l’univers d’ABA SISSA.",
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
