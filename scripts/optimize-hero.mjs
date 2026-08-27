import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "public/hero");

const slides = [
  { input: "public/insitutuion.jpeg", output: "institution.webp" },
  { input: "public/campus1.jpg", output: "campus1.webp" },
  { input: "public/campus2.jpg", output: "campus2.webp" },
  { input: "public/campus3.jpg", output: "campus3.webp" },
  { input: "public/campus4.jpg", output: "campus4.webp" },
  { input: "public/campus5.jpg", output: "campus5.webp" },
  { input: "public/campus6.jpg", output: "campus6.webp" },
  { input: "public/campus7.jpg", output: "campus7.webp" },
  { input: "public/campus8.jpg", output: "campus8.webp" },
];

fs.mkdirSync(outDir, { recursive: true });

for (const slide of slides) {
  const dest = path.join(outDir, slide.output);
  await sharp(path.join(root, slide.input))
    .rotate()
    .resize({ width: 1920, height: 1080, fit: "cover", withoutEnlargement: true })
    .webp({ quality: 72, effort: 6 })
    .toFile(dest);

  const { size } = fs.statSync(dest);
  console.log(`${slide.output}: ${(size / 1024).toFixed(0)} KB`);
}
