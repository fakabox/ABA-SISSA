import { type CSSProperties } from "react";
import { assetPath } from "./album-data";

export function BrandIcon({ name }: { name: string }) {
  return (
    <span
      className="brand-icon"
      style={{ "--icon": `url("${assetPath(`/icons/${name}.svg`)}")` } as CSSProperties}
      aria-hidden="true"
    />
  );
}
