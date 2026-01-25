const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 180, 192, 384, 512];
const svgPath = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Read SVG file
const svgBuffer = fs.readFileSync(svgPath);

async function generateIcons() {
  console.log('Generating PNG icons from SVG...\n');

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);

    console.log(`Created: icons/icon-${size}x${size}.png`);
  }

  // Also create apple-touch-icon.png (180x180)
  const appleTouchPath = path.join(__dirname, '../public/apple-touch-icon.png');
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(appleTouchPath);
  console.log('Created: apple-touch-icon.png');

  // Create favicon.ico compatible PNG (32x32)
  const faviconPath = path.join(__dirname, '../public/favicon-32x32.png');
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(faviconPath);
  console.log('Created: favicon-32x32.png');

  // Create favicon 16x16
  const favicon16Path = path.join(__dirname, '../public/favicon-16x16.png');
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(favicon16Path);
  console.log('Created: favicon-16x16.png');

  console.log('\nDone! PNG icons generated successfully.');
}

generateIcons().catch(console.error);
