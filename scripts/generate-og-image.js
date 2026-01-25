const sharp = require('sharp');
const path = require('path');

// Create OG image (1200x630 - standard Open Graph size)
async function generateOGImage() {
  const width = 1200;
  const height = 630;

  // Create SVG with game branding
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b"/>
          <stop offset="100%" style="stop-color:#0f172a"/>
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#14b8a6"/>
          <stop offset="100%" style="stop-color:#0d9488"/>
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bgGrad)"/>

      <!-- Decorative border -->
      <rect x="20" y="20" width="${width - 40}" height="${height - 40}" fill="none" stroke="#14b8a6" stroke-width="2" rx="20" opacity="0.5"/>

      <!-- Card 1 (left) -->
      <g transform="translate(200, 150) rotate(-15, 80, 120)" filter="url(#glow)">
        <rect x="0" y="0" width="160" height="220" rx="12" fill="#1e293b" stroke="url(#cardGrad)" stroke-width="3"/>
        <text x="20" y="50" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#14b8a6">A</text>
        <text x="20" y="90" font-family="Arial, sans-serif" font-size="32" fill="#ef4444">♥</text>
        <text x="80" y="140" font-family="Arial, sans-serif" font-size="64" fill="#ef4444">♥</text>
      </g>

      <!-- Card 2 (center) -->
      <g transform="translate(350, 130)" filter="url(#glow)">
        <rect x="0" y="0" width="160" height="220" rx="12" fill="#1e293b" stroke="url(#cardGrad)" stroke-width="3"/>
        <text x="20" y="50" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#14b8a6">K</text>
        <text x="20" y="90" font-family="Arial, sans-serif" font-size="32" fill="#14b8a6">♠</text>
        <text x="80" y="140" font-family="Arial, sans-serif" font-size="64" fill="#14b8a6">♠</text>
      </g>

      <!-- Card 3 (right) -->
      <g transform="translate(500, 150) rotate(15, 80, 120)" filter="url(#glow)">
        <rect x="0" y="0" width="160" height="220" rx="12" fill="#1e293b" stroke="url(#cardGrad)" stroke-width="3"/>
        <text x="20" y="50" font-family="Arial, sans-serif" font-size="42" font-weight="bold" fill="#14b8a6">Q</text>
        <text x="20" y="90" font-family="Arial, sans-serif" font-size="32" fill="#ef4444">♦</text>
        <text x="80" y="140" font-family="Arial, sans-serif" font-size="64" fill="#ef4444">♦</text>
      </g>

      <!-- GUTS text -->
      <text x="850" y="280" font-family="Arial Black, sans-serif" font-size="120" font-weight="bold" fill="url(#cardGrad)" text-anchor="middle" filter="url(#glow)">GUTS</text>

      <!-- Tagline -->
      <text x="850" y="350" font-family="Arial, sans-serif" font-size="32" fill="#94a3b8" text-anchor="middle">The Ultimate Card Game</text>

      <!-- Features -->
      <text x="850" y="430" font-family="Arial, sans-serif" font-size="24" fill="#14b8a6" text-anchor="middle">🎰 Hold or Drop • 👻 Beat the Ghost • 🏆 Win Big</text>

      <!-- CTA -->
      <rect x="700" y="480" width="300" height="60" rx="30" fill="url(#cardGrad)"/>
      <text x="850" y="520" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#0f172a" text-anchor="middle">Play Free Now</text>
    </svg>
  `;

  const outputPath = path.join(__dirname, '../public/og-image.png');

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath);

  console.log('Created: public/og-image.png (1200x630)');

  // Also create Twitter card image (same dimensions work)
  const twitterPath = path.join(__dirname, '../public/twitter-image.png');
  await sharp(Buffer.from(svg))
    .png()
    .toFile(twitterPath);

  console.log('Created: public/twitter-image.png');
}

generateOGImage().catch(console.error);
