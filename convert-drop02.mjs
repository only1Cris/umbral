import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = path.join(process.cwd(), 'DROP002 UMBRAL');
const targetDir = path.join(process.cwd(), 'public', 'assets', 'drop02');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const conversions = [
  { src: path.join(srcDir, '1.jpg'), dest: path.join(targetDir, 'white-hero.webp'), width: 1400 },
  { src: path.join(srcDir, '2.jpg'), dest: path.join(targetDir, 'white-neck.webp'), width: 1200 },
  { src: path.join(srcDir, '3.jpg'), dest: path.join(targetDir, 'white-tpu.webp'), width: 1200 },
  { src: path.join(srcDir, '4.jpg'), dest: path.join(targetDir, 'spec-card.webp'), width: 1200 },
  { src: path.join(srcDir, 'BLACK', '1.jpg'), dest: path.join(targetDir, 'black-hero.webp'), width: 1400 },
  { src: path.join(srcDir, 'BLACK', '2.jpg'), dest: path.join(targetDir, 'black-neck.webp'), width: 1200 },
  { src: path.join(srcDir, 'BLACK', '3.jpg'), dest: path.join(targetDir, 'black-tpu.webp'), width: 1200 },
];

async function run() {
  for (const item of conversions) {
    if (fs.existsSync(item.src)) {
      await sharp(item.src)
        .resize({ width: item.width, withoutEnlargement: true })
        .webp({ quality: 90, effort: 4 })
        .toFile(item.dest);
      const stat = fs.statSync(item.dest);
      console.log(`Created: ${path.basename(item.dest)} (${Math.round(stat.size / 1024)} KB)`);
    } else {
      console.error(`Not found: ${item.src}`);
    }
  }
}

run().catch(console.error);
