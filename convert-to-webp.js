import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const srcDir = './public/assets/frames';
const brandingDir = './public/assets/branding';

async function convertFrames() {
  const files = fs.readdirSync(srcDir).filter((f) => f.endsWith('.png'));
  console.log(`Converting ${files.length} PNG frames to optimized WebP...`);

  let count = 0;
  for (const file of files) {
    const inputPath = path.join(srcDir, file);
    const outputPath = path.join(srcDir, file.replace('.png', '.webp'));

    await sharp(inputPath)
      .webp({ quality: 80, effort: 4 })
      .toFile(outputPath);

    fs.unlinkSync(inputPath);
    count++;
    if (count % 25 === 0 || count === files.length) {
      console.log(`Processed ${count}/${files.length} frames`);
    }
  }

  const brandFiles = fs.readdirSync(brandingDir).filter((f) => f.endsWith('.jpg') || f.endsWith('.png'));
  for (const file of brandFiles) {
    const inputPath = path.join(brandingDir, file);
    const outputPath = path.join(brandingDir, file.replace(/\.(jpg|png)$/, '.webp'));
    await sharp(inputPath)
      .webp({ quality: 82, effort: 4 })
      .toFile(outputPath);
    fs.unlinkSync(inputPath);
    console.log(`Converted branding image: ${file} -> ${path.basename(outputPath)}`);
  }

  console.log('Conversion completed!');
}

convertFrames().catch(console.error);
