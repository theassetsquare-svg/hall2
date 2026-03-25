const sharp = require('sharp');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

async function generateOgImage() {
  // Create dark red to black gradient with gold moon accent
  const svgImage = `
  <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8B0000"/>
        <stop offset="40%" style="stop-color:#4a0000"/>
        <stop offset="100%" style="stop-color:#0d0d0d"/>
      </linearGradient>
      <radialGradient id="glow" cx="75%" cy="30%">
        <stop offset="0%" style="stop-color:#C9A96E;stop-opacity:0.3"/>
        <stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>
      </radialGradient>
    </defs>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
    <!-- Moon -->
    <circle cx="900" cy="180" r="80" fill="none"/>
    <path d="M900 100c-44.18 0-80 35.82-80 80s35.82 80 80 80c11.05 0 20-2.25 29-6C895 244 870 215 870 180s25-64 59-74c-9-3.75-17.95-6-29-6z" fill="#C9A96E" opacity="0.8"/>
    <!-- Title -->
    <text x="120" y="300" font-family="sans-serif" font-size="72" font-weight="800" fill="#C9A96E" letter-spacing="4">일산명월관요정</text>
    <!-- Subtitle -->
    <text x="120" y="370" font-family="sans-serif" font-size="32" fill="#f5f0e8" opacity="0.8">문 열고 들어서면, 시간이 멈춘다</text>
    <!-- Line -->
    <rect x="120" y="410" width="80" height="3" fill="#C9A96E" opacity="0.6"/>
    <!-- Contact -->
    <text x="120" y="470" font-family="sans-serif" font-size="24" fill="#a89b8c">신실장 010-3695-4929</text>
  </svg>`;

  const outputPath = path.join(__dirname, '..', 'og-image.png');

  await sharp(Buffer.from(svgImage))
    .resize(WIDTH, HEIGHT)
    .png({ quality: 90 })
    .toFile(outputPath);

  console.log('OG image generated:', outputPath);
}

generateOgImage().catch(console.error);
