const sharp = require('sharp');
const path = require('path');

const OUT = path.join(__dirname, '..');
const W = 1200, H = 1200;

// 8개 페이지 각각 고유 설정
const PAGES = [
  {
    file: 'og-first.png',
    bg1: '#1a0e00', bg2: '#2e1c00', bg3: '#0e0800',
    band: '#3d2200',
    jeogori1: '#c47820', jeogori2: '#7a4a08',
    chima1: '#f5ecd0', chima2: '#ddd0a0',
    shoe: '#c47820',
    deco1: '#f5d060', deco2: '#fff0a0',
    flowerColor: '#f5d060',
    patternStroke: '#f5d060',
    line1: '일산명월관', line2: '신 실 장',
    footer: '일산 첫 방문 완벽 가이드',
    header: '일 산 명 월 관 요 정',
    decoShape: 'diamond',
  },
  {
    file: 'og-business.png',
    bg1: '#080808', bg2: '#141414', bg3: '#040404',
    band: '#1a1a1a',
    jeogori1: '#2a2a2a', jeogori2: '#101010',
    chima1: '#8b1a2a', chima2: '#5c0010',
    shoe: '#2a2a2a',
    deco1: '#c9932a', deco2: '#f5d060',
    flowerColor: '#c9932a',
    patternStroke: '#c9932a',
    line1: '일산명월관', line2: '신 실 장',
    footer: '비즈니스 접대 전문 요정',
    header: '일 산 명 월 관 요 정',
    decoShape: 'hex',
  },
  {
    file: 'og-food.png',
    bg1: '#140800', bg2: '#241200', bg3: '#0a0400',
    band: '#3a1800',
    jeogori1: '#8b4513', jeogori2: '#5c2a08',
    chima1: '#f5d5a0', chima2: '#d4a870',
    shoe: '#8b4513',
    deco1: '#d4a020', deco2: '#f5e080',
    flowerColor: '#f5c060',
    patternStroke: '#d4a020',
    line1: '일산명월관', line2: '신 실 장',
    footer: '15코스 전통 한정식',
    header: '일 산 명 월 관 요 정',
    decoShape: 'wave',
  },
  {
    file: 'og-music.png',
    bg1: '#0a0018', bg2: '#140028', bg3: '#050010',
    band: '#1e0040',
    jeogori1: '#4a1a8c', jeogori2: '#2a0860',
    chima1: '#e0c8f0', chima2: '#c0a0d8',
    shoe: '#4a1a8c',
    deco1: '#c060e0', deco2: '#f0a0ff',
    flowerColor: '#d080f0',
    patternStroke: '#9040c0',
    line1: '일산명월관', line2: '신 실 장',
    footer: '가야금 라이브 요정',
    header: '일 산 명 월 관 요 정',
    decoShape: 'circle',
  },
  {
    file: 'og-vip.png',
    bg1: '#000000', bg2: '#080808', bg3: '#000000',
    band: '#0a0a0a',
    jeogori1: '#0a0a0a', jeogori2: '#000000',
    chima1: '#c8a820', chima2: '#a08010',
    shoe: '#0a0a0a',
    deco1: '#f5d060', deco2: '#ffffff',
    flowerColor: '#f5d060',
    patternStroke: '#f5d060',
    line1: '일산명월관', line2: '신 실 장',
    footer: 'VIP 프리미엄 요정',
    header: '일 산 명 월 관 요 정',
    decoShape: 'star',
  },
  {
    file: 'og-compare.png',
    bg1: '#001818', bg2: '#002828', bg3: '#000e0e',
    band: '#003838',
    jeogori1: '#006868', jeogori2: '#004040',
    chima1: '#e8f5f0', chima2: '#c0e0d8',
    shoe: '#006868',
    deco1: '#40d0c0', deco2: '#a0f0e8',
    flowerColor: '#40c8b8',
    patternStroke: '#20a898',
    line1: '일산명월관', line2: '신 실 장',
    footer: '호텔 뷔페 vs 요정 비교',
    header: '일 산 명 월 관 요 정',
    decoShape: 'diamond',
  },
  {
    file: 'og-seasonal.png',
    bg1: '#001400', bg2: '#002800', bg3: '#000a00',
    band: '#003800',
    jeogori1: '#1a6020', jeogori2: '#0a3810',
    chima1: '#c8f0c0', chima2: '#a0d898',
    shoe: '#1a6020',
    deco1: '#60d040', deco2: '#c0f0a0',
    flowerColor: '#80d860',
    patternStroke: '#40a820',
    line1: '일산명월관', line2: '신 실 장',
    footer: '사계절 제철 코스 요정',
    header: '일 산 명 월 관 요 정',
    decoShape: 'wave',
  },
  {
    file: 'og-private.png',
    bg1: '#180010', bg2: '#280018', bg3: '#0e0008',
    band: '#3a0028',
    jeogori1: '#8c1060', jeogori2: '#580838',
    chima1: '#f0d0e8', chima2: '#d8a8c8',
    shoe: '#8c1060',
    deco1: '#d060a0', deco2: '#f8c0e0',
    flowerColor: '#e080c0',
    patternStroke: '#b04888',
    line1: '일산명월관', line2: '신 실 장',
    footer: '완전 프라이빗 개인실',
    header: '일 산 명 월 관 요 정',
    decoShape: 'hex',
  },
];

function makeSVG(p) {
  // 상단 테두리 패턴
  let topPattern = '';
  if (p.decoShape === 'diamond') {
    topPattern = Array.from({length:25},(_,i)=>{
      const x = i*50+25;
      return `<polygon points="${x},2 ${x+18},36 ${x},70 ${x-18},36" fill="none" stroke="${p.patternStroke}" stroke-width="1" opacity="0.4"/>`;
    }).join('');
  } else if (p.decoShape === 'hex') {
    topPattern = Array.from({length:20},(_,i)=>{
      const x = i*62+30;
      return `<polygon points="${x},4 ${x+18},15 ${x+18},50 ${x},62 ${x-18},50 ${x-18},15" fill="none" stroke="${p.patternStroke}" stroke-width="1" opacity="0.4"/>`;
    }).join('');
  } else if (p.decoShape === 'wave') {
    topPattern = `<path d="M0,36 ${Array.from({length:25},(_,i)=>`Q${i*50+25},${i%2===0?4:68} ${(i+1)*50},36`).join(' ')}" stroke="${p.patternStroke}" stroke-width="2" fill="none" opacity="0.4"/>`;
  } else if (p.decoShape === 'circle') {
    topPattern = Array.from({length:20},(_,i)=>`<circle cx="${i*62+30}" cy="36" r="22" fill="none" stroke="${p.patternStroke}" stroke-width="1" opacity="0.35"/>`).join('');
  } else if (p.decoShape === 'star') {
    topPattern = Array.from({length:15},(_,i)=>{
      const x = i*82+40;
      return `<polygon points="${x},4 ${x+8},28 ${x+34},28 ${x+13},44 ${x+21},68 ${x},52 ${x-21},68 ${x-13},44 ${x-34},28 ${x-8},28" fill="none" stroke="${p.patternStroke}" stroke-width="1" opacity="0.3"/>`;
    }).join('');
  }

  // 꽃 장식 (상단 좌우)
  const flower = (cx, cy) => Array.from({length:6},(_,i)=>{
    const a = i*60*Math.PI/180;
    return `<ellipse cx="${cx+Math.cos(a)*14}" cy="${cy+Math.sin(a)*14}" rx="12" ry="5" fill="${p.flowerColor}" transform="rotate(${i*60},${cx},${cy})" opacity="0.8"/>`;
  }).join('') + `<circle cx="${cx}" cy="${cy}" r="7" fill="${p.deco2}" opacity="0.9"/>`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
    <stop offset="0%" stop-color="${p.bg1}"/>
    <stop offset="50%" stop-color="${p.bg2}"/>
    <stop offset="100%" stop-color="${p.bg3}"/>
  </linearGradient>
  <linearGradient id="gold" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fff5b0"/>
    <stop offset="30%" stop-color="${p.deco1}"/>
    <stop offset="60%" stop-color="#a07010"/>
    <stop offset="100%" stop-color="${p.deco1}"/>
  </linearGradient>
  <linearGradient id="jg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${p.jeogori1}"/>
    <stop offset="100%" stop-color="${p.jeogori2}"/>
  </linearGradient>
  <linearGradient id="cg" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="${p.chima1}"/>
    <stop offset="100%" stop-color="${p.chima2}"/>
  </linearGradient>
  <linearGradient id="skin" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fce8d5"/>
    <stop offset="100%" stop-color="#f0d0b8"/>
  </linearGradient>
  <filter id="gg" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="7" result="b"/>
    <feFlood flood-color="${p.deco1}" flood-opacity="0.65" result="c"/>
    <feComposite in="c" in2="b" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="wg" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="5" result="b"/>
    <feFlood flood-color="#ffffff" flood-opacity="0.55" result="c"/>
    <feComposite in="c" in2="b" operator="in" result="s"/>
    <feMerge><feMergeNode in="s"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  <filter id="ds">
    <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.95"/>
  </filter>
</defs>

<!-- BG -->
<rect width="${W}" height="${H}" fill="url(#bg)"/>
<radialGradient id="rl" cx="50%" cy="42%" r="40%">
  <stop offset="0%" stop-color="${p.jeogori1}" stop-opacity="0.3"/>
  <stop offset="100%" stop-color="${p.bg1}" stop-opacity="0"/>
</radialGradient>
<rect width="${W}" height="${H}" fill="url(#rl)"/>

<!-- TOP/BOTTOM BANDS -->
<rect x="0" y="0" width="${W}" height="72" fill="${p.band}" opacity="0.9"/>
<rect x="0" y="69" width="${W}" height="4" fill="url(#gold)"/>
<rect x="0" y="${H-72}" width="${W}" height="72" fill="${p.band}" opacity="0.9"/>
<rect x="0" y="${H-75}" width="${W}" height="4" fill="url(#gold)"/>

${topPattern}

<!-- CORNERS -->
<path d="M0,0 L100,0 L100,8 L8,8 L8,100 L0,100 Z" fill="url(#gold)" opacity="0.7"/>
<path d="M${W},0 L${W-100},0 L${W-100},8 L${W-8},8 L${W-8},100 L${W},100 Z" fill="url(#gold)" opacity="0.7"/>
<path d="M0,${H} L100,${H} L100,${H-8} L8,${H-8} L8,${H-100} L0,${H-100} Z" fill="url(#gold)" opacity="0.7"/>
<path d="M${W},${H} L${W-100},${H} L${W-100},${H-8} L${W-8},${H-8} L${W-8},${H-100} L${W},${H-100} Z" fill="url(#gold)" opacity="0.7"/>
<line x1="30" y1="120" x2="30" y2="${H-120}" stroke="url(#gold)" stroke-width="1" opacity="0.18"/>
<line x1="${W-30}" y1="120" x2="${W-30}" y2="${H-120}" stroke="url(#gold)" stroke-width="1" opacity="0.18"/>

<!-- DECO FLOWERS -->
<g opacity="0.7">${flower(88,114)}</g>
<g opacity="0.7">${flower(W-88,114)}</g>

<!-- FIGURE AURA -->
<ellipse cx="600" cy="490" rx="270" ry="420" fill="${p.jeogori2}" opacity="0.35"/>

<!-- HAIR -->
<ellipse cx="600" cy="138" rx="82" ry="60" fill="#0f0a06"/>
<ellipse cx="600" cy="102" rx="42" ry="28" fill="#1a1008"/>
<ellipse cx="600" cy="96" rx="35" ry="22" fill="#231510"/>
<path d="M518,155 Q510,180 515,210" stroke="#0f0a06" stroke-width="18" fill="none" stroke-linecap="round"/>
<path d="M682,155 Q690,180 685,210" stroke="#0f0a06" stroke-width="18" fill="none" stroke-linecap="round"/>

<!-- HAIRPIN -->
<rect x="548" y="93" width="104" height="5" rx="2.5" fill="${p.deco1}"/>
<circle cx="548" cy="96" r="7" fill="${p.deco2}"/>
<circle cx="652" cy="96" r="7" fill="${p.deco2}"/>
<g transform="translate(548,83)">
  ${Array.from({length:6},(_,i)=>`<ellipse cx="${Math.cos(i*60*Math.PI/180)*9}" cy="${Math.sin(i*60*Math.PI/180)*9}" rx="7" ry="4" fill="${p.flowerColor}" transform="rotate(${i*60},0,0)"/>`).join('')}
  <circle cx="0" cy="0" r="5" fill="${p.deco2}"/>
</g>

<!-- FACE -->
<ellipse cx="600" cy="210" rx="74" ry="86" fill="url(#skin)"/>
<path d="M530,230 Q528,280 600,310 Q672,280 670,230" fill="url(#skin)"/>
<rect x="573" y="288" width="54" height="60" rx="15" fill="url(#skin)"/>

<!-- EYEBROWS -->
<path d="M550,188 Q568,178 584,185" stroke="#2a1808" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M616,185 Q632,178 650,188" stroke="#2a1808" stroke-width="4" fill="none" stroke-linecap="round"/>

<!-- EYES -->
<path d="M544,205 Q568,192 592,205 Q568,220 544,205 Z" fill="#1a1008"/>
<circle cx="572" cy="204" r="7" fill="#0a0805"/>
<circle cx="576" cy="200" r="3" fill="white" opacity="0.9"/>
<path d="M608,205 Q632,192 656,205 Q632,220 608,205 Z" fill="#1a1008"/>
<circle cx="628" cy="204" r="7" fill="#0a0805"/>
<circle cx="632" cy="200" r="3" fill="white" opacity="0.9"/>
<path d="M544,203 Q568,195 592,203" stroke="#0a0805" stroke-width="2" fill="none"/>
<path d="M608,203 Q632,195 656,203" stroke="#0a0805" stroke-width="2" fill="none"/>

<!-- NOSE -->
<path d="M594,240 Q600,252 606,240" stroke="#c8a090" stroke-width="2.5" fill="none" stroke-linecap="round"/>

<!-- LIPS -->
<path d="M572,272 Q586,264 600,267 Q614,264 628,272 Q614,286 600,290 Q586,286 572,272 Z" fill="#c84060"/>
<ellipse cx="600" cy="268" rx="12" ry="4" fill="#f090a8" opacity="0.4"/>

<!-- CHEEKS -->
<ellipse cx="538" cy="232" rx="30" ry="18" fill="#ffaac0" opacity="0.28"/>
<ellipse cx="662" cy="232" rx="30" ry="18" fill="#ffaac0" opacity="0.28"/>

<!-- COLLAR (동정) -->
<path d="M572,340 L600,390 L628,340 L615,328 C605,348 600,358 600,358 C600,358 595,348 585,328 Z" fill="#f0ece8"/>

<!-- JEOGORI -->
<path d="M572,328 C555,322 528,338 508,375 L488,480 L578,480 L578,400 L600,415 L622,400 L622,480 L712,480 L692,375 C672,338 645,322 628,328 L615,318 C605,330 600,338 600,338 C600,338 595,330 585,318 Z" fill="url(#jg)"/>

<!-- GOREUM (고름) -->
<path d="M582,368 C560,375 540,360 528,372 C520,382 530,398 548,393 C562,388 580,400 594,388" fill="${p.deco1}" opacity="0.9"/>
<path d="M618,368 C640,375 660,360 672,372 C680,382 670,398 652,393 C638,388 620,400 606,388" fill="${p.deco1}" opacity="0.9"/>
<ellipse cx="600" cy="378" rx="10" ry="7" fill="${p.deco2}"/>

<!-- SLEEVES -->
<path d="M490,375 L400,420 L360,515 L410,535 L458,460 L490,435 Z" fill="url(#jg)"/>
<path d="M360,515 Q380,540 410,535 L425,510 Q395,508 375,490 Z" fill="#f0ece8"/>
<ellipse cx="374" cy="530" rx="22" ry="14" fill="url(#skin)" transform="rotate(-20,374,530)"/>
<path d="M710,375 L800,420 L840,515 L790,535 L742,460 L710,435 Z" fill="url(#jg)"/>
<path d="M840,515 Q820,540 790,535 L775,510 Q805,508 825,490 Z" fill="#f0ece8"/>
<ellipse cx="826" cy="530" rx="22" ry="14" fill="url(#skin)" transform="rotate(20,826,530)"/>

<!-- CHIMA -->
<path d="M490,478 Q440,510 400,620 Q360,740 355,860 Q360,900 400,910 Q480,930 600,935 Q720,930 800,910 Q840,900 845,860 Q840,740 800,620 Q760,510 710,478 Z" fill="url(#cg)"/>
<path d="M508,490 Q492,620 488,820" stroke="${p.chima2}" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M545,484 Q532,614 530,820" stroke="${p.chima2}" stroke-width="2" fill="none" opacity="0.45"/>
<path d="M600,478 Q600,608 600,820" stroke="${p.chima2}" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M655,484 Q668,614 670,820" stroke="${p.chima2}" stroke-width="2" fill="none" opacity="0.45"/>
<path d="M692,490 Q708,620 712,820" stroke="${p.chima2}" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M492,480 Q600,468 708,480" stroke="${p.deco1}" stroke-width="4" fill="none"/>
<path d="M355,862 Q480,930 600,936 Q720,930 845,862" stroke="${p.deco1}" stroke-width="5" fill="none" opacity="0.7"/>
${Array.from({length:10},(_,i)=>{
  const t=i/9; const x=380+t*(820-380); const y=870+Math.sin(Math.PI*t)*45;
  return `<circle cx="${x}" cy="${y}" r="5" fill="${p.deco1}" opacity="0.6"/>`;
}).join('')}

<!-- SHOES -->
<path d="M488,902 Q480,918 510,928 Q545,936 570,925 Q580,912 568,902 Z" fill="${p.shoe}"/>
<path d="M488,905 Q510,896 540,903" stroke="${p.deco1}" stroke-width="2.5" fill="none"/>
<path d="M712,902 Q720,918 690,928 Q655,936 630,925 Q620,912 632,902 Z" fill="${p.shoe}"/>
<path d="M712,905 Q690,896 660,903" stroke="${p.deco1}" stroke-width="2.5" fill="none"/>

<!-- TEXT OVERLAY BAND ON FIGURE -->
<rect x="0" y="528" width="${W}" height="344" fill="#000000" opacity="0.6"/>
<line x1="40" y1="530" x2="${W-40}" y2="530" stroke="url(#gold)" stroke-width="3" opacity="0.9"/>
<line x1="40" y1="870" x2="${W-40}" y2="870" stroke="url(#gold)" stroke-width="3" opacity="0.9"/>

<!-- HEADER -->
<text x="600" y="52" text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic',serif"
  font-size="30" fill="url(#gold)" letter-spacing="10" filter="url(#ds)">${p.header}</text>

<!-- MAIN TITLE -->
<text x="600" y="678" text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic',serif"
  font-size="170" font-weight="900"
  fill="url(#gold)" filter="url(#gg)" letter-spacing="4">${p.line1}</text>

<!-- SUBTITLE -->
<text x="600" y="838" text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic',serif"
  font-size="130" font-weight="900"
  fill="#ffffff" filter="url(#wg)" letter-spacing="24">${p.line2}</text>

<!-- FOOTER -->
<text x="600" y="${H-28}" text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic',serif"
  font-size="22" fill="url(#gold)" letter-spacing="5" opacity="0.85">${p.footer}</text>

</svg>`;
}

async function generateAll() {
  console.log('🎨 8개 썸네일 이미지 생성 시작...\n');
  for (const p of PAGES) {
    const svg = makeSVG(p);
    const outPath = path.join(OUT, p.file);
    await sharp(Buffer.from(svg)).png({ quality: 98 }).toFile(outPath);
    console.log(`✅ ${p.file} — ${p.footer}`);
  }
  console.log('\n🎉 전체 완료!');
}

generateAll().catch(e => { console.error('❌', e); process.exit(1); });
