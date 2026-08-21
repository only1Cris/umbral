import fs from 'fs';
import path from 'path';

const baseDir = process.cwd();
const publicAssets = path.join(baseDir, 'public', 'assets');
const brandingDir = path.join(publicAssets, 'branding');
const drop01Dir = path.join(publicAssets, 'drop01');
const framesDir = path.join(publicAssets, 'frames');
const drop01FramesDir = path.join(publicAssets, 'drop01-frames');

// 1. Crear carpeta public/assets/drop01
if (!fs.existsSync(drop01Dir)) {
  fs.mkdirSync(drop01Dir, { recursive: true });
}

// 2. Copiar y renombrar imágenes de Drop 01
const drop01Images = [
  { from: '1.webp', to: 'core-hero.webp' },
  { from: '2.webp', to: 'core-neck.webp' },
  { from: '3.webp', to: 'core-back.webp' },
  { from: '4.webp', to: 'core-macro.webp' },
];

drop01Images.forEach(({ from, to }) => {
  const src = path.join(brandingDir, from);
  const dest = path.join(drop01Dir, to);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log(`Copied Drop 01 image: ${from} -> drop01/${to}`);
  }
});

// 3. Crear/Copiar frames a public/assets/drop01-frames
if (!fs.existsSync(drop01FramesDir)) {
  fs.mkdirSync(drop01FramesDir, { recursive: true });
}

if (fs.existsSync(framesDir)) {
  const frames = fs.readdirSync(framesDir).filter((f) => f.endsWith('.webp'));
  frames.forEach((f) => {
    const src = path.join(framesDir, f);
    const dest = path.join(drop01FramesDir, f);
    fs.copyFileSync(src, dest);
  });
  console.log(`Copied ${frames.length} frames from frames/ to drop01-frames/`);
}

console.log('--- Organization migration complete! ---');
