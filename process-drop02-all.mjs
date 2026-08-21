import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const baseDir = process.cwd();
const drop02Dir = path.join(baseDir, 'DROP002 UMBRAL');
const publicAssetsDir = path.join(baseDir, 'public', 'assets');
const drop02AssetsDir = path.join(publicAssetsDir, 'drop02');
const framesWhiteDir = path.join(publicAssetsDir, 'drop02-frames-white');
const framesBlackDir = path.join(publicAssetsDir, 'drop02-frames-black');

[drop02AssetsDir, framesWhiteDir, framesBlackDir].forEach((d) => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

async function processHeroImages() {
  console.log('--- Processing 16:9 Hero & Detail Images ---');
  const images = [
    { src: 'white-hero-1920.jpg', dest: 'white-hero.webp', width: 1920 },
    { src: 'white-neck-1920.jpg', dest: 'white-neck.webp', width: 1920 },
    { src: 'white-tpu-1920.jpg', dest: 'white-tpu.webp', width: 1920 },
    { src: 'black-hero-1920.jpg', dest: 'black-hero.webp', width: 1920 },
    { src: 'black-neck-1920.jpg', dest: 'black-neck.webp', width: 1920 },
    { src: 'black-tpu-1920.jpg', dest: 'black-tpu.webp', width: 1920 },
    { src: 'white-hero.jpg', dest: 'white-hero-sq.webp', width: 1200 },
    { src: 'black-hero.jpg', dest: 'black-hero-sq.webp', width: 1200 },
  ];

  for (const img of images) {
    const srcPath = path.join(drop02Dir, img.src);
    const destPath = path.join(drop02AssetsDir, img.dest);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize({ width: img.width, withoutEnlargement: true })
        .webp({ quality: 88, effort: 4 })
        .toFile(destPath);
      const stat = fs.statSync(destPath);
      console.log(`Optimized image: ${img.dest} (${Math.round(stat.size / 1024)} KB)`);
    } else {
      console.warn(`File not found: ${srcPath}`);
    }
  }
}

async function processFrames(srcFolderName, destDir, label) {
  console.log(`--- Processing Frames for ${label} ---`);
  const srcDir = path.join(drop02Dir, srcFolderName);
  if (!fs.existsSync(srcDir)) {
    console.error(`Source frames directory not found: ${srcDir}`);
    return;
  }

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))
    .sort();

  console.log(`Found ${files.length} frames in ${srcFolderName}`);

  let count = 0;
  for (const file of files) {
    const srcPath = path.join(srcDir, file);
    const baseName = path.parse(file).name;
    const destPath = path.join(destDir, `${baseName}.webp`);

    await sharp(srcPath)
      .resize({ width: 1280, withoutEnlargement: true })
      .webp({ quality: 82, effort: 4 })
      .toFile(destPath);

    count++;
    if (count % 30 === 0 || count === files.length) {
      console.log(`Converted ${count}/${files.length} frames for ${label}`);
    }
  }
}

async function main() {
  await processHeroImages();
  await processFrames('ezgif-drop02-white', framesWhiteDir, 'WHITE');
  await processFrames('ezgif-drop02-black', framesBlackDir, 'BLACK');
  console.log('=== All Drop 002 Assets Processed Successfully! ===');
}

main().catch(console.error);
