const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const W = 1200, H = 630;

const pages = [
  { file: 'og-image.png', title: '일산명월관요정', sub: '문 열고 들어서면, 시간이 멈춘다', contact: '신실장 010-3695-4929' },
  { file: 'og-first.png', title: '처음 가본 날', sub: '솔직히 기대 안 했다', contact: '일산명월관요정' },
  { file: 'og-business.png', title: '비즈니스 접대', sub: '거래처 사장님을 모셔야 했다', contact: '일산명월관요정' },
  { file: 'og-food.png', title: '15가지 한정식', sub: '하나하나 먹으면서 메모했다', contact: '일산명월관요정' },
  { file: 'og-music.png', title: '국악 라이브', sub: '소름 돋았던 그 순간', contact: '일산명월관요정' },
  { file: 'og-vip.png', title: 'VIP 접대', sub: '회장님을 모셔야 했다', contact: '일산명월관요정' },
  { file: 'og-compare.png', title: '호텔 vs 한정식', sub: '뭐가 나을까', contact: '일산명월관요정' },
  { file: 'og-seasonal.png', title: '계절별 매력', sub: '같은 곳, 다른 경험', contact: '일산명월관요정' },
  { file: 'og-private.png', title: '프라이빗 공간', sub: '남들 눈치 안 보는 곳', contact: '일산명월관요정' },
  { file: 'og-after.png', title: '2차 코스 추천', sub: '끝나고 어디 갈까', contact: '일산명월관요정' },
];

async function generate(p) {
  // Create background with gradient using raw pixels
  const bg = await sharp({
    create: { width: W, height: H, channels: 4, background: { r: 10, g: 0, b: 0, alpha: 1 } }
  }).png().toBuffer();

  // Create gradient overlay
  const gradientSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#8B0000"/>
        <stop offset="45%" stop-color="#3a0000"/>
        <stop offset="100%" stop-color="#0a0a0a"/>
      </linearGradient>
      <radialGradient id="glow" cx="78%" cy="22%" r="45%">
        <stop offset="0%" stop-color="#C9A96E" stop-opacity="0.18"/>
        <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <path d="M940 90c-50 0-90 40-90 90s40 90 90 90c12 0 24-3 34-7C934 252 905 218 905 180s29-72 69-83c-10-5-22-7-34-7z" fill="#C9A96E" opacity="0.5"/>
    <rect x="100" y="235" width="50" height="4" rx="2" fill="#C9A96E" opacity="0.6"/>
    <rect x="100" y="420" width="1000" height="1" fill="#ffffff" opacity="0.06"/>
  </svg>`;

  const bgBuffer = await sharp(Buffer.from(gradientSvg)).png().toBuffer();

  // Create text overlay using Noto Sans KR (referenced as system font)
  const textSvg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <text x="100" y="310" font-family="Noto Sans KR, NotoSansKR, sans-serif" font-size="62" font-weight="700" fill="#C9A96E" letter-spacing="1">${p.title}</text>
    <text x="100" y="375" font-family="Noto Sans KR, NotoSansKR, sans-serif" font-size="28" font-weight="700" fill="#f5f0e8" opacity="0.85">${p.sub}</text>
    <text x="100" y="475" font-family="Noto Sans KR, NotoSansKR, sans-serif" font-size="20" font-weight="700" fill="#a89b8c">${p.contact}</text>
  </svg>`;

  const textBuffer = await sharp(Buffer.from(textSvg)).png().toBuffer();

  const out = path.join(__dirname, '..', p.file);
  await sharp(bgBuffer)
    .composite([{ input: textBuffer, top: 0, left: 0 }])
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(out);

  const stat = fs.statSync(out);
  console.log('✓', p.file, `(${Math.round(stat.size / 1024)}KB)`);
}

(async () => {
  console.log('Generating OG images...');
  for (const p of pages) await generate(p);
  console.log(`Done: ${pages.length} images`);
})();
