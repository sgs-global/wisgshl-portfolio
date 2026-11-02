import { readdir } from "node:fs/promises";
import path from "node:path";
import { insideSgsAlt, type GalleryCategory, type GalleryImages } from "./insideSgsConfig";

// Server/build-time discovery keeps filesystem code out of the browser bundle.
export async function discoverInsideSgsImages(): Promise<GalleryImages> {
  const base = "/images/assets/inside_sgs";
  const result: GalleryImages = { team: [], manufacturing: [], quality: [], supply: [] };
  const entries = await readdir(path.join(process.cwd(), "public", base.slice(1)), { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile()).map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true, sensitivity: "base" }));
  for (const filename of files) {
    const match = /^(team|manufacturing|quality|supply)_(\d+)\.(jpe?g|png|webp)$/i.exec(filename);
    if (!match) continue;
    const category = match[1].toLowerCase() as GalleryCategory;
    result[category].push({
      src: `${base}/${encodeURIComponent(filename)}`,
      alt: insideSgsAlt[filename.toLowerCase()] ?? `WISGSHL ${category} photograph ${match[2]}`,
    });
  }
  return result;
}
