const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const W = 1200, H = 1200;

const pages = [
  { file: 'og-image.png', title: '일산명월관요정', sub: '문 열고 들어서면, 시간이 멈춘다', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-first.png', title: '처음 가본 날', sub: '솔직히 기대 안 했다', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-business.png', title: '비즈니스 접대', sub: '거래처 사장님을 모셔야 했다', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-food.png', title: '15가지 한정식', sub: '하나하나 먹으면서 메모했다', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-music.png', title: '국악 라이브', sub: '소름 돋았던 그 순간', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-vip.png', title: 'VIP 접대', sub: '회장님을 모셔야 했다', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-compare.png', title: '호텔 vs 한정식', sub: '뭐가 나을까', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-seasonal.png', title: '계절별 매력', sub: '같은 곳, 다른 경험', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-private.png', title: '프라이빗 공간', sub: '남들 눈치 안 보는 곳', nick: '신실장', tel: '010-3695-4929' },
  { file: 'og-after.png', title: '마무리 코스', sub: '끝나고 어디 갈까', nick: '신실장', tel: '010-3695-4929' },
];

function makeSvg(p) {
  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8B0000"/>
      <stop offset="40%" stop-color="#3a0000"/>
      <stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="35%" r="50%">
      <stop offset="0%" stop-color="#C9A96E" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- 배경 -->
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- 상단: 일산명월관요정 브랜드 -->
  <text x="600" y="200" text-anchor="middle" font-family="sans-serif" font-size="52" font-weight="700" fill="#C9A96E" letter-spacing="4">일산명월관요정</text>

  <!-- 구분선 -->
  <rect x="500" y="240" width="200" height="3" rx="1.5" fill="#C9A96E" opacity="0.5"/>

  <!-- 가운데: 신실장 크게! -->
  <text x="600" y="520" text-anchor="middle" font-family="sans-serif" font-size="220" font-weight="900" fill="#FFFFFF" opacity="0.95">${p.nick}</text>

  <!-- 전화번호 -->
  <text x="600" y="620" text-anchor="middle" font-family="sans-serif" font-size="48" font-weight="700" fill="#C9A96E">${p.tel}</text>

  <!-- 하단 구분선 -->
  <rect x="100" y="720" width="1000" height="1" fill="#ffffff" opacity="0.08"/>

  <!-- 페이지 제목 -->
  <text x="600" y="840" text-anchor="middle" font-family="sans-serif" font-size="56" font-weight="700" fill="#f5f0e8" opacity="0.9">${p.title}</text>

  <!-- 서브 타이틀 -->
  <text x="600" y="920" text-anchor="middle" font-family="sans-serif" font-size="34" font-weight="400" fill="#a89b8c" opacity="0.8">${p.sub}</text>

  <!-- 하단 장식 달 -->
  <circle cx="600" cy="1080" r="40" fill="none" stroke="#C9A96E" stroke-width="2" opacity="0.3"/>
  <path d="M580 1060c-15 0-28 12-28 28s12 28 28 28c4 0 7-1 10-2-14-4-24-16-24-26s10-22 24-26c-3-1-6-2-10-2z" fill="#C9A96E" opacity="0.4"/>

  <!-- 광고문의 -->
  <text x="600" y="1160" text-anchor="middle" font-family="sans-serif" font-size="22" font-weight="400" fill="#666666">광고문의 카톡 besta12</text>
</svg>`;
}

async function generate(p) {
  const svg = makeSvg(p);
  const out = path.join(__dirname, '..', p.file);
  await sharp(Buffer.from(svg))
    .png({ quality: 90, compressionLevel: 8 })
    .toFile(out);
  const stat = fs.statSync(out);
  console.log('  ✓', p.file, `(${Math.round(stat.size / 1024)}KB) ${W}x${H}`);
}

(async () => {
  console.log('Generating 1:1 OG images with 신실장...');
  for (const p of pages) await generate(p);
  console.log(`Done: ${pages.length} images (${W}x${H})`);
})();
