const sharp = require('sharp');
const path = require('path');

// Create PWA screenshots for app store listings
async function generateScreenshots() {
  // Narrow screenshot (phone) - 540x720
  const narrowSvg = `
    <svg width="540" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b"/>
          <stop offset="100%" style="stop-color:#0f172a"/>
        </linearGradient>
        <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#14b8a6"/>
          <stop offset="100%" style="stop-color:#0d9488"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="540" height="720" fill="url(#bgGrad)"/>

      <!-- Status bar mockup -->
      <rect x="0" y="0" width="540" height="44" fill="#0f172a"/>
      <text x="270" y="30" font-family="Arial" font-size="14" fill="#94a3b8" text-anchor="middle">9:41</text>

      <!-- Header -->
      <rect x="0" y="44" width="540" height="60" fill="#1e293b"/>
      <text x="270" y="82" font-family="Arial Black" font-size="24" fill="#14b8a6" text-anchor="middle">GUTS</text>
      <text x="480" y="82" font-family="Arial" font-size="18" fill="#14b8a6">500</text>
      <text x="510" y="82" font-family="Arial" font-size="18" fill="#fbbf24">🪙</text>

      <!-- Pot display -->
      <rect x="170" y="130" width="200" height="50" rx="25" fill="#14b8a6" opacity="0.2"/>
      <text x="270" y="163" font-family="Arial" font-size="20" fill="#14b8a6" text-anchor="middle">POT: 25 🪙</text>

      <!-- Ghost card (face down) -->
      <g transform="translate(220, 200)">
        <rect width="100" height="140" rx="10" fill="#1e293b" stroke="#14b8a6" stroke-width="2"/>
        <text x="50" y="80" font-family="Arial" font-size="40" fill="#14b8a6" text-anchor="middle">👻</text>
      </g>

      <!-- Player cards -->
      <g transform="translate(120, 380)">
        <rect width="120" height="170" rx="12" fill="#1e293b" stroke="url(#cardGrad)" stroke-width="3"/>
        <text x="20" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="#14b8a6">A</text>
        <text x="20" y="80" font-family="Arial" font-size="28" fill="#ef4444">♥</text>
        <text x="60" y="120" font-family="Arial" font-size="48" fill="#ef4444">♥</text>
      </g>
      <g transform="translate(300, 380)">
        <rect width="120" height="170" rx="12" fill="#1e293b" stroke="url(#cardGrad)" stroke-width="3"/>
        <text x="20" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="#14b8a6">K</text>
        <text x="20" y="80" font-family="Arial" font-size="28" fill="#14b8a6">♠</text>
        <text x="60" y="120" font-family="Arial" font-size="48" fill="#14b8a6">♠</text>
      </g>

      <!-- Action buttons -->
      <rect x="50" y="590" width="200" height="60" rx="30" fill="#ef4444"/>
      <text x="150" y="628" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">DROP</text>

      <rect x="290" y="590" width="200" height="60" rx="30" fill="url(#cardGrad)"/>
      <text x="390" y="628" font-family="Arial" font-size="22" font-weight="bold" fill="white" text-anchor="middle">HOLD</text>

      <!-- Bottom nav hint -->
      <rect x="220" y="695" width="100" height="5" rx="2" fill="#94a3b8"/>
    </svg>
  `;

  // Wide screenshot (tablet) - 720x540
  const wideSvg = `
    <svg width="720" height="540" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e293b"/>
          <stop offset="100%" style="stop-color:#0f172a"/>
        </linearGradient>
        <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#14b8a6"/>
          <stop offset="100%" style="stop-color:#0d9488"/>
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="720" height="540" fill="url(#bgGrad2)"/>

      <!-- Header -->
      <rect x="0" y="0" width="720" height="60" fill="#1e293b"/>
      <text x="360" y="40" font-family="Arial Black" font-size="28" fill="#14b8a6" text-anchor="middle">GUTS - The Card Game</text>

      <!-- Left panel - Stats -->
      <rect x="20" y="80" width="180" height="380" rx="15" fill="#1e293b" opacity="0.5"/>
      <text x="110" y="120" font-family="Arial" font-size="16" fill="#94a3b8" text-anchor="middle">TOKENS</text>
      <text x="110" y="155" font-family="Arial" font-size="32" fill="#fbbf24" text-anchor="middle">500 🪙</text>
      <text x="110" y="200" font-family="Arial" font-size="16" fill="#94a3b8" text-anchor="middle">WIN STREAK</text>
      <text x="110" y="235" font-family="Arial" font-size="32" fill="#14b8a6" text-anchor="middle">🔥 3</text>

      <!-- Center - Game area -->
      <text x="420" y="100" font-family="Arial" font-size="20" fill="#14b8a6" text-anchor="middle">POT: 50 🪙</text>

      <!-- Ghost card -->
      <g transform="translate(370, 120)">
        <rect width="100" height="140" rx="10" fill="#1e293b" stroke="#14b8a6" stroke-width="2"/>
        <text x="50" y="85" font-family="Arial" font-size="50" fill="#14b8a6" text-anchor="middle">👻</text>
      </g>

      <!-- Player cards -->
      <g transform="translate(280, 290)">
        <rect width="120" height="170" rx="12" fill="#1e293b" stroke="url(#cardGrad2)" stroke-width="3"/>
        <text x="20" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="#14b8a6">Q</text>
        <text x="20" y="80" font-family="Arial" font-size="28" fill="#ef4444">♦</text>
        <text x="60" y="120" font-family="Arial" font-size="48" fill="#ef4444">♦</text>
      </g>
      <g transform="translate(440, 290)">
        <rect width="120" height="170" rx="12" fill="#1e293b" stroke="url(#cardGrad2)" stroke-width="3"/>
        <text x="20" y="45" font-family="Arial" font-size="36" font-weight="bold" fill="#14b8a6">Q</text>
        <text x="20" y="80" font-family="Arial" font-size="28" fill="#14b8a6">♣</text>
        <text x="60" y="120" font-family="Arial" font-size="48" fill="#14b8a6">♣</text>
      </g>

      <!-- PAIR indicator -->
      <rect x="340" y="470" width="160" height="40" rx="20" fill="#14b8a6" opacity="0.3"/>
      <text x="420" y="497" font-family="Arial" font-size="18" fill="#14b8a6" text-anchor="middle">🎉 PAIR!</text>

      <!-- Right panel - Buttons -->
      <rect x="620" y="200" width="80" height="80" rx="15" fill="#ef4444"/>
      <text x="660" y="250" font-family="Arial" font-size="14" fill="white" text-anchor="middle">DROP</text>

      <rect x="620" y="300" width="80" height="80" rx="15" fill="url(#cardGrad2)"/>
      <text x="660" y="350" font-family="Arial" font-size="14" fill="white" text-anchor="middle">HOLD</text>
    </svg>
  `;

  const outputDir = path.join(__dirname, '../public/screenshots');
  const fs = require('fs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Generate narrow screenshot
  await sharp(Buffer.from(narrowSvg))
    .png()
    .toFile(path.join(outputDir, 'screenshot-narrow.png'));
  console.log('Created: screenshots/screenshot-narrow.png (540x720)');

  // Generate wide screenshot
  await sharp(Buffer.from(wideSvg))
    .png()
    .toFile(path.join(outputDir, 'screenshot-wide.png'));
  console.log('Created: screenshots/screenshot-wide.png (720x540)');
}

generateScreenshots().catch(console.error);
