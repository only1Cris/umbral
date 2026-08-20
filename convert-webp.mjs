import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const dir = path.join(process.cwd(), 'public', 'assets', 'branding');
const files = [
  { in: 'editorial-1.jpg', out: 'editorial-1.webp', width: 1400 },
  { in: 'editorial-2.jpg', out: 'editorial-2.webp', width: 1000 },
  { in: 'editorial-3.jpg', out: 'editorial-3.webp', width: 1000 },
  { in: 'editorial-4.jpg', out: 'editorial-4.webp', width: 1000 },
  { in: 'editorial-5.jpg', out: 'editorial-5.webp', width: 1000 },
  { in: 'hoodie-drop2.jpg', out: 'hoodie-drop2.webp', width: 1000 },
  { in: 'tote-drop3.jpg', out: 'tote-drop3.webp', width: 1000 },
];

async function convert() {
  for (const item of files) {
    const srcPath = path.join(dir, item.in);
    const destPath = path.join(dir, item.out);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize({ width: item.width, withoutEnlargement: true })
        .webp({ quality: 85, effort: 4 })
        .toFile(destPath);
      const stat = fs.statSync(destPath);
      console.log(`Converted: ${item.out} (${Math.round(stat.size / 1024)} KB)`);
    } else {
      console.error(`Source not found: ${item.in}`);
    }
  }
}

convert().catch(console.error);
