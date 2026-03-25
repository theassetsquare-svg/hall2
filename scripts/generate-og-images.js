const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const W = 1200, H = 630;
const fontPath = path.join(__dirname, '..', 'fonts', 'NotoSansKR-Bold.ttf');
const fontData = fs.readFileSync(fontPath).toString('base64');

const pages = [
  { file: 'og-image.png', title: '일산명월관요정', sub: '문 열고 들어서면, 시간이 멈춘다', accent: '#C9A96E' },
  { file: 'og-first.png', title: '처음 가본 날', sub: '솔직히 기대 안 했다', accent: '#C9A96E' },
  { file: 'og-business.png', title: '비즈니스 접대', sub: '거래처 사장님을 모셔야 했다', accent: '#C9A96E' },
  { file: 'og-food.png', title: '15가지 한정식', sub: '하나하나 먹으면서 메모했다', accent: '#e8c882' },
  { file: 'og-music.png', title: '국악 라이브', sub: '소름 돋았던 그 순간', accent: '#9b8ec9' },
  { file: 'og-vip.png', title: 'VIP 접대', sub: '회장님을 모셔야 했다', accent: '#C9A96E' },
  { file: 'og-compare.png', title: '호텔 vs 한정식', sub: '뭐가 나을까', accent: '#C9A96E' },
  { file: 'og-seasonal.png', title: '계절별 매력', sub: '같은 곳, 다른 경험', accent: '#8bc98b' },
  { file: 'og-private.png', title: '프라이빗 공간', sub: '남들 눈치 안 보는 곳', accent: '#7a9ec9' },
  { file: 'og-after.png', title: '2차 코스 추천', sub: '끝나고 어디 갈까', accent: '#c9a07a' },
];

function makeSvg(p) {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      @font-face {
        font-family: 'NotoKR';
        src: url('data:font/ttf;base64,${fontData}');
        font-weight: 700;
      }
    </style>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B0000"/>
      <stop offset="45%" stop-color="#3a0000"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="glow" cx="78%" cy="22%" r="45%">
      <stop offset="0%" stop-color="${p.accent}" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <path d="M940 90c-50 0-90 40-90 90s40 90 90 90c12 0 24-3 34-7C934 252 905 218 905 180s29-72 69-83c-10-5-22-7-34-7z" fill="${p.accent}" opacity="0.5"/>
  <rect x="100" y="235" width="50" height="4" rx="2" fill="${p.accent}" opacity="0.6"/>
  <text x="100" y="310" font-family="NotoKR, sans-serif" font-size="62" font-weight="700" fill="${p.accent}" letter-spacing="1">${p.title}</text>
  <text x="100" y="375" font-family="NotoKR, sans-serif" font-size="28" font-weight="700" fill="#f5f0e8" opacity="0.85">${p.sub}</text>
  <rect x="100" y="420" width="1000" height="1" fill="#ffffff" opacity="0.08"/>
  <text x="100" y="475" font-family="NotoKR, sans-serif" font-size="20" font-weight="700" fill="#a89b8c">일산명월관요정</text>
  <text x="100" y="510" font-family="NotoKR, sans-serif" font-size="18" font-weight="700" fill="#777">신실장 010-3695-4929</text>
</svg>`;
}

async function generate(p) {
  const svg = makeSvg(p);
  const out = path.join(__dirname, '..', p.file);
  await sharp(Buffer.from(svg)).png({ quality: 90, compressionLevel: 8 }).toFile(out);
  const stat = fs.statSync(out);
  console.log('✓', p.file, `(${Math.round(stat.size/1024)}KB)`);
}

(async () => {
  console.log('Generating with Noto Sans KR...');
  for (const p of pages) await generate(p);
  console.log(`Done: ${pages.length} images`);
})();
