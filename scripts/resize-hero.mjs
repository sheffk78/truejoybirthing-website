import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const imageUrl = 'https://v3b.fal.media/files/b/0aa396bf/rSKk8TheJTmvuKhXKFbe8_3n8NUarb.png';
const publicDir = path.join(process.cwd(), 'public/images');

async function run() {
  // Download the image
  const response = await fetch(imageUrl);
  const buffer = await response.buffer();
  
  console.log(`Downloaded ${buffer.length} bytes`);
  
  // 1200x800 full hero
  await sharp(buffer)
    .resize(1200, 800, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(path.join(publicDir, 'augusta-ga-birth-doula-skyline-1200.webp'));
  console.log('Saved 1200x800 hero image');
  
  // 600x400 variant
  await sharp(buffer)
    .resize(600, 400, { fit: 'cover', position: 'center' })
    .webp({ quality: 80 })
    .toFile(path.join(publicDir, 'augusta-ga-birth-doula-skyline-1200-600.webp'));
  console.log('Saved 600x400 variant');
  
  console.log('Done!');
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
