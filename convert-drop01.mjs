import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const drop01Dir = path.join(process.cwd(), 'public', 'assets', 'drop01');

async function convertDrop01Jpgs() {
  const files = fs.readdirSync(drop01Dir).filter((f) => f.endsWith('.jpg') || f.endsWith('.jpeg') || f.endsWith('.png'));

  console.log(`Found ${files.length} images to convert in public/assets/drop01/`);

  for (const file of files) {
    const srcPath = path.join(drop01Dir, file);
    const baseName = path.parse(file).name;
    const destPath = path.join(drop01Dir, `${baseName}.webp`);

    await sharp(srcPath)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 86, effort: 4 })
      .toFile(destPath);

    const oldStat = fs.statSync(srcPath);
    const newStat = fs.statSync(destPath);
    console.log(`✓ Converted ${file} (${Math.round(oldStat.size / 1024)} KB) -> ${baseName}.webp (${Math.round(newStat.size / 1024)} KB)`);

    // Eliminar archivo original JPG para mantener limpio el directorio
    fs.unlinkSync(srcPath);
  }

  console.log('=== All Drop 01 images converted to WebP successfully! ===');
}

convertDrop01Jpgs().catch(console.error);
