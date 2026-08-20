// Image URLs
const url1200 = 'https://v3b.fal.media/files/b/0aa396bf/rSKk8TheJTmvuKhXKFbe8_3n8NUarb.png';
const url600 = 'https://v3b.fal.media/files/b/0aa396bf/rSKk8TheJTmvuKhXKFbe8_3n8NUarb.png';
// Image paths
const path1200 = '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/public/images/augusta-ga-birth-doula-skyline-1200.webp';
const path600 = '/Users/socializerender/.openclaw/workspace/Kit/life/brands/TrueJoyBirthing/projects/truejoybirthing-website/public/images/augusta-ga-birth-doula-skyline-1200-600.webp';
// Download and save images
const https = require('https');

function download(url, path) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(path);
    https.get(url, response => {
      response.pipe(file);
      // After the file is saved, resolve the promise
      file.on('finish', () => {
        file.close();
        console.log(`Saved ${path}`);
        resolve();
      });  
    }).on('error', err => {
      // Handle errors
      fs.unlink(path);
      reject(err.message);
    }); 
  });
}
// Usage
(async () => {
  await download(url1200, path1200);
  await download(url600, path600);
  console.log('All images saved');
})();