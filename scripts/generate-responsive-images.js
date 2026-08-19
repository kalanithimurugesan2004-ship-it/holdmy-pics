import fs from "fs";
import path from "path";
import sharp from "sharp";

const inputName = "holdmy-pics-1.jpg";
const srcInputPath = path.resolve(process.cwd(), "src", "assets", inputName);
const publicInputPath = path.resolve(process.cwd(), "public", "assets", inputName);
const outputDir = path.resolve(process.cwd(), "public", "assets");
const sizes = [400, 800, 1600];

async function generate() {
  let inputPath = null;
  if (fs.existsSync(srcInputPath)) inputPath = srcInputPath;
  else if (fs.existsSync(publicInputPath)) inputPath = publicInputPath;
  else {
    console.error(`Source image not found. Checked:\n - ${srcInputPath}\n - ${publicInputPath}`);
    console.error("Place the original image at src/assets/holdmy-pics-1.jpg or public/assets/holdmy-pics-1.jpg and run this script.");
    process.exit(1);
  }

  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  for (const w of sizes) {
    const outJpg = path.join(outputDir, `holdmy-pics-1-${w}.jpg`);
    const outWebp = path.join(outputDir, `holdmy-pics-1-${w}.webp`);
    console.log(`Generating ${outJpg} and ${outWebp}...`);
    await sharp(inputPath).resize({ width: w }).jpeg({ quality: 80 }).toFile(outJpg);
    await sharp(inputPath).resize({ width: w }).webp({ quality: 75 }).toFile(outWebp);
  }

  console.log("Done. Generated responsive images in src/assets/");
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
