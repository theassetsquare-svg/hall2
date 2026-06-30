const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 1200;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- Background: deep black-navy -->
  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
    <stop offset="0%" stop-color="#000810"/>
    <stop offset="50%" stop-color="#050d1a"/>
    <stop offset="100%" stop-color="#000308"/>
  </linearGradient>

  <!-- Gold gradient for text & borders -->
  <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fff5b0"/>
    <stop offset="25%" stop-color="#f5d060"/>
    <stop offset="60%" stop-color="#b87c10"/>
    <stop offset="100%" stop-color="#f5d060"/>
  </linearGradient>

  <!-- Jeogori: dark navy blue -->
  <linearGradient id="jeogoriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#1a2a6c"/>
    <stop offset="100%" stop-color="#0a1040"/>
  </linearGradient>

  <!-- Chima: deep forest green -->
  <linearGradient id="chimaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#c8e6c0"/>
    <stop offset="100%" stop-color="#8ab888"/>
  </linearGradient>

  <!-- Skin -->
  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fce8d5"/>
    <stop offset="100%" stop-color="#f0d0b8"/>
  </linearGradient>

  <!-- Text overlay background -->
  <linearGradient id="textBg" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#000000" stop-opacity="0.1"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.75"/>
  </linearGradient>

  <!-- Gold glow filter -->
  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="7" result="blur"/>
    <feFlood flood-color="#d4a010" flood-opacity="0.7" result="color"/>
    <feComposite in="color" in2="blur" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>

  <!-- White glow -->
  <filter id="whiteGlow" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="6" result="blur"/>
    <feFlood flood-color="#ffffff" flood-opacity="0.6" result="color"/>
    <feComposite in="color" in2="blur" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>

  <!-- Drop shadow -->
  <filter id="deepShadow">
    <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.95"/>
  </filter>

  <!-- Figure radial glow -->
  <radialGradient id="figLight" cx="50%" cy="42%" r="42%">
    <stop offset="0%" stop-color="#1a2a6c" stop-opacity="0.45"/>
    <stop offset="100%" stop-color="#000810" stop-opacity="0"/>
  </radialGradient>
</defs>

<!-- ═══ BACKGROUND ═══ -->
<rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
<rect width="${W}" height="${H}" fill="url(#figLight)"/>

<!-- Stars/sparkles background -->
${Array.from({length:40},(_,i)=>{
  const x = (i*137)%1200;
  const y = (i*97)%800;
  const r = (i%3)+1;
  return `<circle cx="${x}" cy="${y}" r="${r}" fill="#f5d060" opacity="${0.1+(i%5)*0.05}"/>`;
}).join('')}

<!-- ═══ BORDER BANDS ═══ -->
<!-- Top band: dark navy -->
<rect x="0" y="0" width="${W}" height="72" fill="#0a1840" opacity="0.9"/>
<rect x="0" y="69" width="${W}" height="4" fill="url(#goldText)"/>
<!-- Bottom band -->
<rect x="0" y="${H-72}" width="${W}" height="72" fill="#0a1840" opacity="0.9"/>
<rect x="0" y="${H-75}" width="${W}" height="4" fill="url(#goldText)"/>

<!-- Top band diamond pattern -->
${Array.from({length:25},(_,i)=>{
  const x = i*50+25;
  return `<polygon points="${x},2 ${x+18},36 ${x},70 ${x-18},36" fill="none" stroke="#f5d060" stroke-width="1" opacity="0.35"/>`;
}).join('')}

<!-- Gold corner frames -->
<path d="M0,0 L100,0 L100,8 L8,8 L8,100 L0,100 Z" fill="url(#goldText)" opacity="0.7"/>
<path d="M${W},0 L${W-100},0 L${W-100},8 L${W-8},8 L${W-8},100 L${W},100 Z" fill="url(#goldText)" opacity="0.7"/>
<path d="M0,${H} L100,${H} L100,${H-8} L8,${H-8} L8,${H-100} L0,${H-100} Z" fill="url(#goldText)" opacity="0.7"/>
<path d="M${W},${H} L${W-100},${H} L${W-100},${H-8} L${W-8},${H-8} L${W-8},${H-100} L${W},${H-100} Z" fill="url(#goldText)" opacity="0.7"/>

<!-- Side gold lines -->
<line x1="30" y1="120" x2="30" y2="${H-120}" stroke="#f5d060" stroke-width="1" opacity="0.2"/>
<line x1="${W-30}" y1="120" x2="${W-30}" y2="${H-120}" stroke="#f5d060" stroke-width="1" opacity="0.2"/>

<!-- Chrysanthemum (국화) top-left -->
<g transform="translate(88,114)" opacity="0.65">
  ${Array.from({length:12},(_,i)=>{
    const a = (i*30)*Math.PI/180;
    const x = Math.cos(a)*22; const y = Math.sin(a)*22;
    return `<ellipse cx="${x/2}" cy="${y/2}" rx="14" ry="5" fill="#f5d060" transform="rotate(${i*30},0,0)" opacity="0.9"/>`;
  }).join('')}
  <circle cx="0" cy="0" r="8" fill="#fff5b0"/>
</g>
<!-- Chrysanthemum top-right -->
<g transform="translate(${W-88},114)" opacity="0.65">
  ${Array.from({length:12},(_,i)=>{
    const a = (i*30)*Math.PI/180;
    return `<ellipse cx="${Math.cos(a)*11}" cy="${Math.sin(a)*11}" rx="14" ry="5" fill="#f5d060" transform="rotate(${i*30},0,0)" opacity="0.9"/>`;
  }).join('')}
  <circle cx="0" cy="0" r="8" fill="#fff5b0"/>
</g>

<!-- ═══ HANBOK WOMAN ILLUSTRATION ═══ -->
<!-- Aura behind figure -->
<ellipse cx="600" cy="490" rx="270" ry="420" fill="#0a1840" opacity="0.45"/>
<ellipse cx="600" cy="490" rx="200" ry="360" fill="#1a2a6c" opacity="0.2"/>

<!-- ── HAIR (쪽머리) ── -->
<ellipse cx="600" cy="138" rx="82" ry="60" fill="#0f0a06"/>
<ellipse cx="600" cy="102" rx="42" ry="28" fill="#1a1008"/>
<ellipse cx="600" cy="96" rx="35" ry="22" fill="#231510"/>
<!-- Side hair -->
<path d="M518,155 Q510,180 515,210" stroke="#0f0a06" stroke-width="18" fill="none" stroke-linecap="round"/>
<path d="M682,155 Q690,180 685,210" stroke="#0f0a06" stroke-width="18" fill="none" stroke-linecap="round"/>

<!-- Phoenix hairpin (봉황비녀) - gold -->
<rect x="548" y="93" width="104" height="5" rx="2.5" fill="#d4a020"/>
<circle cx="548" cy="96" r="7" fill="#f5d060"/>
<circle cx="652" cy="96" r="7" fill="#f5d060"/>
<!-- Phoenix at tip -->
<path d="M652,88 Q665,78 672,68 Q660,72 658,82" fill="#f5d060"/>
<path d="M652,88 Q668,85 678,75 Q664,76 658,86" fill="#f5e080" opacity="0.7"/>
<!-- Gold flower ornament -->
<g transform="translate(548,85)">
  ${Array.from({length:6},(_,i)=>`<ellipse cx="${Math.cos(i*60*Math.PI/180)*9}" cy="${Math.sin(i*60*Math.PI/180)*9}" rx="7" ry="4" fill="#f5d060" transform="rotate(${i*60},0,0)"/>`).join('')}
  <circle cx="0" cy="0" r="5" fill="#fff5b0"/>
</g>

<!-- ── FACE ── -->
<ellipse cx="600" cy="210" rx="74" ry="86" fill="url(#skinGrad)"/>
<path d="M530,230 Q528,280 600,310 Q672,280 670,230" fill="url(#skinGrad)"/>
<!-- Neck -->
<rect x="573" y="288" width="54" height="60" rx="15" fill="url(#skinGrad)"/>

<!-- Eyebrows -->
<path d="M550,188 Q568,178 584,185" stroke="#2a1808" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M616,185 Q632,178 650,188" stroke="#2a1808" stroke-width="4" fill="none" stroke-linecap="round"/>

<!-- Eyes (bigger, more defined) -->
<path d="M544,205 Q568,192 592,205 Q568,220 544,205 Z" fill="#1a1008"/>
<ellipse cx="572" cy="204" rx="10" ry="10" fill="#2a1810"/>
<circle cx="572" cy="204" r="7" fill="#0a0805"/>
<circle cx="576" cy="200" r="3.5" fill="white" opacity="0.9"/>
<path d="M608,205 Q632,192 656,205 Q632,220 608,205 Z" fill="#1a1008"/>
<ellipse cx="628" cy="204" rx="10" ry="10" fill="#2a1810"/>
<circle cx="628" cy="204" r="7" fill="#0a0805"/>
<circle cx="632" cy="200" r="3.5" fill="white" opacity="0.9"/>
<!-- Eyeliner -->
<path d="M544,203 Q568,195 592,203" stroke="#0a0805" stroke-width="2" fill="none"/>
<path d="M608,203 Q632,195 656,203" stroke="#0a0805" stroke-width="2" fill="none"/>

<!-- Nose -->
<path d="M594,240 Q600,252 606,240" stroke="#c8a090" stroke-width="2.5" fill="none" stroke-linecap="round"/>

<!-- Lips -->
<path d="M572,272 Q586,264 600,267 Q614,264 628,272 Q614,286 600,290 Q586,286 572,272 Z" fill="#c84060"/>
<path d="M572,272 Q600,268 628,272" stroke="#e06080" stroke-width="1.5" fill="none" opacity="0.6"/>
<ellipse cx="600" cy="268" rx="12" ry="4" fill="#f090a8" opacity="0.4"/>

<!-- Cheek blush -->
<ellipse cx="538" cy="232" rx="30" ry="18" fill="#ffaac0" opacity="0.28"/>
<ellipse cx="662" cy="232" rx="30" ry="18" fill="#ffaac0" opacity="0.28"/>

<!-- ── JEOGORI (dark navy) ── -->
<!-- White collar (동정) -->
<path d="M572,340 L600,390 L628,340 L615,328 C605,348 600,358 600,358 C600,358 595,348 585,328 Z" fill="#f0ece8"/>
<path d="M572,340 L585,328 C595,345 600,355 600,355 C600,355 605,345 615,328 L628,340" stroke="#d4c890" stroke-width="2" fill="none"/>

<!-- Jeogori body -->
<path d="M572,328 C555,322 528,338 508,375 L488,480 L578,480 L578,400 L600,415 L622,400 L622,480 L712,480 L692,375 C672,338 645,322 628,328 L615,318 C605,330 600,338 600,338 C600,338 595,330 585,318 Z" fill="url(#jeogoriGrad)"/>
<!-- Shading -->
<path d="M572,328 C555,322 530,340 512,378" stroke="#0a1040" stroke-width="3" fill="none" opacity="0.6"/>
<path d="M628,328 C645,322 670,340 688,378" stroke="#0a1040" stroke-width="3" fill="none" opacity="0.6"/>

<!-- Gold goreum (고름) ribbon -->
<path d="M582,368 C560,375 540,360 528,372 C520,382 530,398 548,393 C562,388 580,400 594,388" fill="#c49018" stroke="#a07010" stroke-width="1.5"/>
<path d="M618,368 C640,375 660,360 672,372 C680,382 670,398 652,393 C638,388 620,400 606,388" fill="#c49018" stroke="#a07010" stroke-width="1.5"/>
<ellipse cx="600" cy="378" rx="10" ry="7" fill="#f5d060"/>

<!-- ── SLEEVES ── -->
<!-- Left sleeve (navy) -->
<path d="M490,375 L400,420 L360,515 L410,535 L458,460 L490,435 Z" fill="url(#jeogoriGrad)"/>
<path d="M360,515 Q380,540 410,535 L425,510 Q395,508 375,490 Z" fill="#f0ece8"/>
<ellipse cx="374" cy="530" rx="22" ry="14" fill="url(#skinGrad)" transform="rotate(-20,374,530)"/>
<!-- Right sleeve -->
<path d="M710,375 L800,420 L840,515 L790,535 L742,460 L710,435 Z" fill="url(#jeogoriGrad)"/>
<path d="M840,515 Q820,540 790,535 L775,510 Q805,508 825,490 Z" fill="#f0ece8"/>
<ellipse cx="826" cy="530" rx="22" ry="14" fill="url(#skinGrad)" transform="rotate(20,826,530)"/>

<!-- ── CHIMA (green) ── -->
<path d="M490,478
         Q440,510 400,620
         Q360,740 355,860
         Q360,900 400,910
         Q480,930 600,935
         Q720,930 800,910
         Q840,900 845,860
         Q840,740 800,620
         Q760,510 710,478 Z"
      fill="url(#chimaGrad)"/>

<!-- Skirt fold lines -->
<path d="M508,490 Q492,620 488,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.55"/>
<path d="M545,484 Q532,614 530,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M572,480 Q562,610 560,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.45"/>
<path d="M600,478 Q600,608 600,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M628,480 Q638,610 640,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.45"/>
<path d="M655,484 Q668,614 670,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M692,490 Q708,620 712,820" stroke="#a0c898" stroke-width="2" fill="none" opacity="0.55"/>

<!-- Gold ribbon at skirt top -->
<path d="M492,480 Q600,468 708,480" stroke="#d4a020" stroke-width="4" fill="none"/>

<!-- Hem gold embroidery -->
<path d="M355,862 Q480,930 600,936 Q720,930 845,862" stroke="#d4a020" stroke-width="5" fill="none" opacity="0.7"/>
<path d="M360,870 Q480,935 600,940 Q720,935 840,870" stroke="#f5d060" stroke-width="2" fill="none" opacity="0.4"/>
${Array.from({length:12},(_,i)=>{
  const t = i/11;
  const x = 370 + t*(840-370);
  const y = 870 + Math.sin(Math.PI*t)*50;
  return `<circle cx="${x}" cy="${y}" r="5" fill="#f5d060" opacity="0.6"/>`;
}).join('')}

<!-- Shoes (navy blue 꽃신) -->
<path d="M488,902 Q480,918 510,928 Q545,936 570,925 Q580,912 568,902 Z" fill="#1a2a6c"/>
<path d="M488,905 Q510,896 540,903" stroke="#d4a020" stroke-width="2.5" fill="none"/>
<ellipse cx="504" cy="912" rx="6" ry="4" fill="#f5d060" opacity="0.7"/>
<path d="M712,902 Q720,918 690,928 Q655,936 630,925 Q620,912 632,902 Z" fill="#1a2a6c"/>
<path d="M712,905 Q690,896 660,903" stroke="#d4a020" stroke-width="2.5" fill="none"/>
<ellipse cx="696" cy="912" rx="6" ry="4" fill="#f5d060" opacity="0.7"/>

<!-- ═══ TEXT OVERLAY ON FIGURE ═══ -->
<!-- Semi-transparent dark band on skirt -->
<rect x="0" y="528" width="${W}" height="344" fill="#000000" opacity="0.58" rx="0"/>
<!-- Band borders -->
<line x1="40" y1="530" x2="${W-40}" y2="530" stroke="url(#goldText)" stroke-width="3" opacity="0.9"/>
<line x1="40" y1="870" x2="${W-40}" y2="870" stroke="url(#goldText)" stroke-width="3" opacity="0.9"/>

<!-- TOP HEADER -->
<text x="600" y="52"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic','Apple SD Gothic Neo',serif"
  font-size="30" fill="url(#goldText)" letter-spacing="10"
  filter="url(#deepShadow)">일 산 명 월 관 요 정</text>

<!-- MAIN TITLE: 일산명월관 -->
<text x="600" y="680"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic','Apple SD Gothic Neo',serif"
  font-size="170" font-weight="900"
  fill="url(#goldText)"
  filter="url(#goldGlow)"
  letter-spacing="4">일산명월관</text>

<!-- SUBTITLE: 신실장 -->
<text x="600" y="840"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic','Apple SD Gothic Neo',serif"
  font-size="130" font-weight="900"
  fill="#ffffff"
  filter="url(#whiteGlow)"
  letter-spacing="24">신 실 장</text>

<!-- BOTTOM FOOTER -->
<text x="600" y="${H-28}"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic',serif"
  font-size="22" fill="url(#goldText)" letter-spacing="6" opacity="0.85">일 산 최 고 의 요 정 문 화</text>

</svg>`;

sharp(Buffer.from(svg))
  .png({ quality: 98 })
  .toFile(path.join(__dirname, '..', 'og-image.png'))
  .then(info => console.log('✅ og-image.png 완성:', info))
  .catch(err => { console.error('❌', err); process.exit(1); });
