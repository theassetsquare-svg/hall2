const sharp = require('sharp');
const path = require('path');

const W = 1200, H = 630;

const pages = [
  { file: 'og-image.png', title: '일산명월관요정', sub: '문 열고 들어서면, 시간이 멈춘다' },
  { file: 'og-first.png', title: '처음 가본 날', sub: '솔직히 기대 안 했다' },
  { file: 'og-business.png', title: '비즈니스 접대', sub: '거래처 사장님을 모셔야 했다' },
  { file: 'og-food.png', title: '15가지 한정식', sub: '하나하나 먹으면서 메모했다' },
  { file: 'og-music.png', title: '국악 라이브', sub: '소름 돋았던 순간' },
  { file: 'og-vip.png', title: 'VIP 접대', sub: '회장님을 모셔야 했다' },
  { file: 'og-compare.png', title: '호텔 vs 한정식', sub: '뭐가 나을까' },
  { file: 'og-seasonal.png', title: '계절별 매력', sub: '같은 곳, 다른 경험' },
  { file: 'og-private.png', title: '프라이빗 공간', sub: '남들 눈치 안 보는 곳' },
  { file: 'og-after.png', title: '2차 코스 추천', sub: '끝나고 어디 갈까' },
];

async function generate(p) {
  const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#8B0000"/>
        <stop offset="40%" style="stop-color:#4a0000"/>
        <stop offset="100%" style="stop-color:#0d0d0d"/>
      </linearGradient>
      <radialGradient id="glow" cx="80%" cy="25%">
        <stop offset="0%" style="stop-color:#C9A96E;stop-opacity:0.25"/>
        <stop offset="100%" style="stop-color:transparent;stop-opacity:0"/>
      </radialGradient>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect width="${W}" height="${H}" fill="url(#glow)"/>
    <path d="M920 100c-44 0-80 36-80 80s36 80 80 80c11 0 20-2 29-6-34-10-59-41-59-74s25-64 59-74c-9-4-18-6-29-6z" fill="#C9A96E" opacity="0.6"/>
    <text x="100" y="290" font-family="sans-serif" font-size="64" font-weight="800" fill="#C9A96E" letter-spacing="2">${p.title}</text>
    <text x="100" y="360" font-family="sans-serif" font-size="30" fill="#f5f0e8" opacity="0.8">${p.sub}</text>
    <rect x="100" y="400" width="60" height="3" fill="#C9A96E" opacity="0.5"/>
    <text x="100" y="460" font-family="sans-serif" font-size="22" fill="#a89b8c">일산명월관요정 · 신실장 010-3695-4929</text>
  </svg>`;

  const out = path.join(__dirname, '..', p.file);
  await sharp(Buffer.from(svg)).resize(W, H).png({ quality: 85 }).toFile(out);
  console.log('✓', p.file);
}

(async () => {
  for (const p of pages) await generate(p);
  console.log('Done:', pages.length, 'images');
})();
