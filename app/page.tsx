import type { Metadata } from "next";
import { HomePage } from "./HomePage";

export const metadata: Metadata = {
  title: "ABA SISSA — SHINE & CHUT !",
  description:
    "Retrouvez les albums SHINE et CHUT ! d’ABA SISSA, les liens d’écoute et tous les extraits.",
};

export default function Home() {
  return <HomePage />;
}
