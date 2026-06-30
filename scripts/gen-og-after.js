const sharp = require('sharp');
const path = require('path');

const W = 1200;
const H = 1200;

const svg = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
  <!-- Background gradient: deep burgundy -->
  <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox">
    <stop offset="0%" stop-color="#0e0005"/>
    <stop offset="60%" stop-color="#1c0410"/>
    <stop offset="100%" stop-color="#0a0003"/>
  </linearGradient>

  <!-- Gold gradient for text -->
  <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fff0a0"/>
    <stop offset="30%" stop-color="#f5d060"/>
    <stop offset="60%" stop-color="#c88c1a"/>
    <stop offset="100%" stop-color="#f5d060"/>
  </linearGradient>

  <!-- Jeogori (upper garment) gradient -->
  <linearGradient id="jeogoriGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#9b1a2a"/>
    <stop offset="100%" stop-color="#5c0012"/>
  </linearGradient>

  <!-- Chima (skirt) gradient: light pink/blush -->
  <linearGradient id="chimaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#f0d8e2"/>
    <stop offset="100%" stop-color="#d4a8be"/>
  </linearGradient>

  <!-- Skin tone gradient -->
  <linearGradient id="skinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#fce8d5"/>
    <stop offset="100%" stop-color="#f0d0b8"/>
  </linearGradient>

  <!-- Text background overlay -->
  <linearGradient id="textBg" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
    <stop offset="30%" stop-color="#000000" stop-opacity="0.75"/>
    <stop offset="100%" stop-color="#000000" stop-opacity="0.9"/>
  </linearGradient>

  <!-- Glow filter for text -->
  <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur stdDeviation="6" result="blur"/>
    <feFlood flood-color="#c88c1a" flood-opacity="0.6" result="color"/>
    <feComposite in="color" in2="blur" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>

  <!-- White glow filter -->
  <filter id="whiteGlow" x="-10%" y="-10%" width="120%" height="120%">
    <feGaussianBlur stdDeviation="5" result="blur"/>
    <feFlood flood-color="#ffffff" flood-opacity="0.5" result="color"/>
    <feComposite in="color" in2="blur" operator="in" result="shadow"/>
    <feMerge><feMergeNode in="shadow"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>

  <!-- Drop shadow -->
  <filter id="deepShadow">
    <feDropShadow dx="0" dy="4" stdDeviation="8" flood-color="#000" flood-opacity="0.9"/>
  </filter>

  <!-- Soft figure glow -->
  <filter id="figureAura" x="-15%" y="-5%" width="130%" height="115%">
    <feGaussianBlur stdDeviation="20" result="blur"/>
    <feFlood flood-color="#9b1a2a" flood-opacity="0.4" result="color"/>
    <feComposite in="color" in2="blur" operator="in" result="aura"/>
    <feMerge><feMergeNode in="aura"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
</defs>

<!-- ═══════════════════════════════════ -->
<!--         BACKGROUND                -->
<!-- ═══════════════════════════════════ -->
<rect width="${W}" height="${H}" fill="url(#bgGrad)"/>

<!-- Subtle radial light behind figure -->
<radialGradient id="figLight" cx="50%" cy="45%" r="45%">
  <stop offset="0%" stop-color="#3a0818" stop-opacity="1"/>
  <stop offset="100%" stop-color="#0e0005" stop-opacity="0"/>
</radialGradient>
<rect width="${W}" height="${H}" fill="url(#figLight)"/>

<!-- ═══════════════════════════════════ -->
<!--    DECORATIVE KOREAN PATTERNS     -->
<!-- ═══════════════════════════════════ -->

<!-- Top border band -->
<rect x="0" y="0" width="${W}" height="72" fill="#7a1020" opacity="0.85"/>
<rect x="0" y="69" width="${W}" height="4" fill="url(#goldText)"/>

<!-- Bottom border band -->
<rect x="0" y="${H-72}" width="${W}" height="72" fill="#7a1020" opacity="0.85"/>
<rect x="0" y="${H-75}" width="${W}" height="4" fill="url(#goldText)"/>

<!-- Top band diamond pattern -->
${Array.from({length:25},(_, i)=>{
  const x = i*50+25;
  return `<polygon points="${x},2 ${x+18},36 ${x},70 ${x-18},36" fill="none" stroke="#f5d060" stroke-width="1" opacity="0.4"/>`;
}).join('')}

<!-- Gold corner frames -->
<!-- Top-left -->
<path d="M0,0 L100,0 L100,8 L8,8 L8,100 L0,100 Z" fill="url(#goldText)" opacity="0.7"/>
<path d="M0,0 L70,0 L70,4 L4,4 L4,70 L0,70 Z" fill="url(#goldText)" opacity="0.4"/>
<!-- Top-right -->
<path d="M${W},0 L${W-100},0 L${W-100},8 L${W-8},8 L${W-8},100 L${W},100 Z" fill="url(#goldText)" opacity="0.7"/>
<path d="M${W},0 L${W-70},0 L${W-70},4 L${W-4},4 L${W-4},70 L${W},70 Z" fill="url(#goldText)" opacity="0.4"/>
<!-- Bottom-left -->
<path d="M0,${H} L100,${H} L100,${H-8} L8,${H-8} L8,${H-100} L0,${H-100} Z" fill="url(#goldText)" opacity="0.7"/>
<!-- Bottom-right -->
<path d="M${W},${H} L${W-100},${H} L${W-100},${H-8} L${W-8},${H-8} L${W-8},${H-100} L${W},${H-100} Z" fill="url(#goldText)" opacity="0.7"/>

<!-- Decorative side lines -->
<line x1="30" y1="120" x2="30" y2="${H-120}" stroke="#f5d060" stroke-width="1" opacity="0.25"/>
<line x1="${W-30}" y1="120" x2="${W-30}" y2="${H-120}" stroke="#f5d060" stroke-width="1" opacity="0.25"/>

<!-- Plum blossom top-left -->
<g transform="translate(90,115)" opacity="0.6">
  <circle cx="0" cy="-18" r="11" fill="#f0a0b8"/>
  <circle cx="17" cy="-6" r="11" fill="#f0a0b8"/>
  <circle cx="11" cy="14" r="11" fill="#f0a0b8"/>
  <circle cx="-11" cy="14" r="11" fill="#f0a0b8"/>
  <circle cx="-17" cy="-6" r="11" fill="#f0a0b8"/>
  <circle cx="0" cy="0" r="7" fill="#f5d060"/>
</g>
<!-- Plum blossom top-right -->
<g transform="translate(${W-90},115)" opacity="0.6">
  <circle cx="0" cy="-18" r="11" fill="#f0a0b8"/>
  <circle cx="17" cy="-6" r="11" fill="#f0a0b8"/>
  <circle cx="11" cy="14" r="11" fill="#f0a0b8"/>
  <circle cx="-11" cy="14" r="11" fill="#f0a0b8"/>
  <circle cx="-17" cy="-6" r="11" fill="#f0a0b8"/>
  <circle cx="0" cy="0" r="7" fill="#f5d060"/>
</g>


<!-- ═══════════════════════════════════ -->
<!--    HANBOK WOMAN ILLUSTRATION      -->
<!-- Full-height, centered, detailed   -->
<!-- ═══════════════════════════════════ -->

<!-- Aura glow behind figure -->
<ellipse cx="600" cy="500" rx="280" ry="430" fill="#3a0818" opacity="0.5"/>
<ellipse cx="600" cy="500" rx="220" ry="380" fill="#5a1a28" opacity="0.3"/>

<!-- ── HAIR (쪽머리 traditional updo) ── -->
<!-- Main hair volume -->
<ellipse cx="600" cy="138" rx="82" ry="60" fill="#0f0a06"/>
<!-- Bun (쪽) -->
<ellipse cx="600" cy="102" rx="42" ry="28" fill="#1a1008"/>
<ellipse cx="600" cy="96" rx="35" ry="22" fill="#231510"/>
<!-- Hairline sides -->
<path d="M518,155 Q510,180 515,210" stroke="#0f0a06" stroke-width="18" fill="none" stroke-linecap="round"/>
<path d="M682,155 Q690,180 685,210" stroke="#0f0a06" stroke-width="18" fill="none" stroke-linecap="round"/>
<!-- Side hair strands -->
<path d="M520,160 Q508,200 512,230" stroke="#1a1208" stroke-width="10" fill="none" stroke-linecap="round"/>
<path d="M680,160 Q692,200 688,230" stroke="#1a1208" stroke-width="10" fill="none" stroke-linecap="round"/>

<!-- Hairpin (비녀) -->
<rect x="545" y="94" width="110" height="5" rx="2.5" fill="#c9932a"/>
<circle cx="545" cy="96" r="8" fill="#f5d060"/>
<circle cx="655" cy="96" r="8" fill="#f5d060"/>
<!-- Flower hair ornament (꽃비녀) -->
<g transform="translate(655,84)">
  <circle cx="0" cy="-10" r="6" fill="#ff88aa"/>
  <circle cx="9.5" cy="-3" r="6" fill="#ff88aa"/>
  <circle cx="5.9" cy="8" r="6" fill="#ff88aa"/>
  <circle cx="-5.9" cy="8" r="6" fill="#ff88aa"/>
  <circle cx="-9.5" cy="-3" r="6" fill="#ff88aa"/>
  <circle cx="0" cy="0" r="5" fill="#f5d060"/>
</g>
<!-- Small gold bead ornaments -->
<circle cx="545" cy="96" r="5" fill="#f5d060"/>

<!-- ── FACE (얼굴) ── -->
<ellipse cx="600" cy="210" rx="74" ry="86" fill="url(#skinGrad)"/>
<!-- Jawline refinement -->
<path d="M530,230 Q528,280 600,310 Q672,280 670,230" fill="url(#skinGrad)"/>

<!-- Neck -->
<rect x="573" y="288" width="54" height="60" rx="15" fill="url(#skinGrad)"/>

<!-- Eyebrows (눈썹) - delicate arched -->
<path d="M550,188 Q568,178 584,185" stroke="#2a1808" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M616,185 Q632,178 650,188" stroke="#2a1808" stroke-width="4" fill="none" stroke-linecap="round"/>

<!-- Eyes (눈) - almond shaped -->
<!-- Left eye -->
<path d="M545,205 Q568,194 590,205 Q568,218 545,205 Z" fill="#1a1008"/>
<path d="M548,205 Q568,197 588,205" stroke="#0a0805" stroke-width="2" fill="none"/>
<ellipse cx="572" cy="205" rx="9" ry="9" fill="#2a1810"/>
<circle cx="572" cy="205" r="6" fill="#0a0805"/>
<circle cx="575" cy="202" r="3" fill="white" opacity="0.85"/>
<!-- Right eye -->
<path d="M610,205 Q632,194 655,205 Q632,218 610,205 Z" fill="#1a1008"/>
<path d="M612,205 Q632,197 652,205" stroke="#0a0805" stroke-width="2" fill="none"/>
<ellipse cx="628" cy="205" rx="9" ry="9" fill="#2a1810"/>
<circle cx="628" cy="205" r="6" fill="#0a0805"/>
<circle cx="631" cy="202" r="3" fill="white" opacity="0.85"/>
<!-- Lower eyelid line -->
<path d="M548,208 Q568,215 588,208" stroke="#8a6050" stroke-width="1.5" fill="none" opacity="0.6"/>
<path d="M612,208 Q632,215 652,208" stroke="#8a6050" stroke-width="1.5" fill="none" opacity="0.6"/>

<!-- Eyelashes -->
<path d="M545,203 Q542,198 544,194" stroke="#0a0805" stroke-width="2" fill="none"/>
<path d="M588,201 Q592,196 590,192" stroke="#0a0805" stroke-width="2" fill="none"/>
<path d="M610,201 Q607,196 610,192" stroke="#0a0805" stroke-width="2" fill="none"/>
<path d="M655,203 Q658,198 656,194" stroke="#0a0805" stroke-width="2" fill="none"/>

<!-- Nose (코) - subtle -->
<path d="M594,240 Q600,252 606,240" stroke="#c8a090" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M588,252 Q594,258 600,255 Q606,258 612,252" stroke="#c8a090" stroke-width="1.5" fill="none"/>

<!-- Lips (입술) - full and defined -->
<path d="M572,272 Q586,264 600,267 Q614,264 628,272 Q614,286 600,290 Q586,286 572,272 Z" fill="#d85070"/>
<path d="M572,272 Q586,264 600,267 Q614,264 628,272" stroke="#c03858" stroke-width="2" fill="none"/>
<path d="M572,272 Q600,270 628,272" stroke="#e07090" stroke-width="1" fill="none" opacity="0.5"/>
<!-- Lip highlight -->
<ellipse cx="600" cy="268" rx="12" ry="4" fill="#f090a8" opacity="0.4"/>

<!-- Cheeks blush (볼 홍조) -->
<ellipse cx="540" cy="232" rx="30" ry="18" fill="#ffaac0" opacity="0.3"/>
<ellipse cx="660" cy="232" rx="30" ry="18" fill="#ffaac0" opacity="0.3"/>

<!-- Subtle facial contour shading -->
<path d="M530,190 Q525,230 530,270" stroke="#d8b898" stroke-width="3" fill="none" opacity="0.2"/>
<path d="M670,190 Q675,230 670,270" stroke="#d8b898" stroke-width="3" fill="none" opacity="0.2"/>

<!-- ── JEOGORI (저고리 — upper garment) ── -->
<!-- Collar inner (white 동정) -->
<path d="M572,340 L600,390 L628,340 L615,328 C605,348 600,358 600,358 C600,358 595,348 585,328 Z" fill="#f5f0e0"/>
<path d="M572,340 L585,328 C595,345 600,355 600,355 C600,355 605,345 615,328 L628,340" stroke="#d8c890" stroke-width="2" fill="none"/>

<!-- Jeogori body -->
<path d="M 572,328 C 555,322 528,338 508,375 L 488,480 L 578,480 L 578,400 L 600,415 L 622,400 L 622,480 L 712,480 L 692,375 C 672,338 645,322 628,328 L 615,318 C 605,330 600,338 600,338 C 600,338 595,330 585,318 Z" fill="url(#jeogoriGrad)"/>

<!-- Jeogori shading -->
<path d="M 572,328 C 555,322 530,340 512,378" stroke="#7a0a1a" stroke-width="3" fill="none" opacity="0.5"/>
<path d="M 628,328 C 645,322 670,340 688,378" stroke="#7a0a1a" stroke-width="3" fill="none" opacity="0.5"/>

<!-- Goreum (고름 — silk ribbon tie) - gold -->
<path d="M582,368 C560,375 540,360 528,372 C520,382 530,398 548,393 C562,388 580,400 594,388" fill="#d4a020" stroke="#a87810" stroke-width="1.5"/>
<path d="M618,368 C640,375 660,360 672,372 C680,382 670,398 652,393 C638,388 620,400 606,388" fill="#d4a020" stroke="#a87810" stroke-width="1.5"/>
<!-- Goreum knot center -->
<ellipse cx="600" cy="378" rx="10" ry="7" fill="#f5d060"/>

<!-- ── SLEEVES (소매) — wide traditional ── -->
<!-- Left sleeve -->
<path d="M 490,375 L 400,420 L 360,515 L 410,535 L 458,460 L 490,435 Z" fill="url(#jeogoriGrad)"/>
<path d="M 490,375 L 402,422 L 362,516" stroke="#7a0a1a" stroke-width="2" fill="none" opacity="0.4"/>
<!-- Left cuff (배래 — white end) -->
<path d="M 360,515 Q 380,540 410,535 L 425,510 Q 395,508 375,490 Z" fill="#f5f0e0"/>
<!-- Left hand -->
<ellipse cx="374" cy="530" rx="22" ry="14" fill="url(#skinGrad)" transform="rotate(-20,374,530)"/>
<path d="M 355,525 Q 362,542 375,545 Q 388,542 395,530" fill="url(#skinGrad)"/>

<!-- Right sleeve -->
<path d="M 710,375 L 800,420 L 840,515 L 790,535 L 742,460 L 710,435 Z" fill="url(#jeogoriGrad)"/>
<path d="M 710,375 L 798,422 L 838,516" stroke="#7a0a1a" stroke-width="2" fill="none" opacity="0.4"/>
<!-- Right cuff -->
<path d="M 840,515 Q 820,540 790,535 L 775,510 Q 805,508 825,490 Z" fill="#f5f0e0"/>
<!-- Right hand -->
<ellipse cx="826" cy="530" rx="22" ry="14" fill="url(#skinGrad)" transform="rotate(20,826,530)"/>
<path d="M 845,525 Q 838,542 825,545 Q 812,542 805,530" fill="url(#skinGrad)"/>

<!-- ── CHIMA (치마 — full floor-length skirt) ── -->
<!-- Main skirt body - wide and full -->
<path d="M 490,478
         Q 440,510 400,620
         Q 360,740 355,860
         Q 360,900 400,910
         Q 480,930 600,935
         Q 720,930 800,910
         Q 840,900 845,860
         Q 840,740 800,620
         Q 760,510 710,478 Z"
      fill="url(#chimaGrad)"/>

<!-- Skirt fabric fold lines -->
<path d="M 508,490 Q 492,620 488,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.55"/>
<path d="M 545,484 Q 532,614 530,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M 572,480 Q 562,610 560,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.45"/>
<path d="M 600,478 Q 600,608 600,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M 628,480 Q 638,610 640,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.45"/>
<path d="M 655,484 Q 668,614 670,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.5"/>
<path d="M 692,490 Q 708,620 712,820" stroke="#c0a0b5" stroke-width="2" fill="none" opacity="0.55"/>

<!-- Skirt gold ribbon at top -->
<path d="M 492,480 Q 600,468 708,480" stroke="#d4a020" stroke-width="4" fill="none"/>
<!-- Subtle shading left of skirt -->
<path d="M 400,620 Q 365,740 358,860" stroke="#b090a5" stroke-width="12" fill="none" opacity="0.2"/>

<!-- Skirt hem gold embroidery -->
<path d="M 355,862 Q 480,930 600,936 Q 720,930 845,862" stroke="#d4a020" stroke-width="5" fill="none" opacity="0.7"/>
<path d="M 360,870 Q 480,935 600,940 Q 720,935 840,870" stroke="#f5d060" stroke-width="2" fill="none" opacity="0.4"/>

<!-- Embroidery pattern on hem (lotus motif dots) -->
${Array.from({length:12},(_, i)=>{
  const t = i/11;
  const x = 370 + t*(840-370);
  const y = 870 + Math.sin(Math.PI*t)*50;
  return `<circle cx="${x}" cy="${y}" r="5" fill="#f5d060" opacity="0.6"/>`;
}).join('')}

<!-- ── SHOES (꽃신 — embroidered shoes) ── -->
<!-- Left shoe -->
<path d="M 488,902 Q 480,918 510,928 Q 545,936 570,925 Q 580,912 568,902 Z" fill="#8b1020"/>
<path d="M 488,905 Q 510,896 540,903" stroke="#d4a020" stroke-width="2.5" fill="none"/>
<ellipse cx="504" cy="912" rx="6" ry="4" fill="#f5d060" opacity="0.7"/>
<!-- Right shoe -->
<path d="M 712,902 Q 720,918 690,928 Q 655,936 630,925 Q 620,912 632,902 Z" fill="#8b1020"/>
<path d="M 712,905 Q 690,896 660,903" stroke="#d4a020" stroke-width="2.5" fill="none"/>
<ellipse cx="696" cy="912" rx="6" ry="4" fill="#f5d060" opacity="0.7"/>

<!-- ═══════════════════════════════════ -->
<!--   TEXT OVERLAID ON FIGURE        -->
<!-- ═══════════════════════════════════ -->

<!-- TOP HEADER TEXT -->
<text x="600" y="52"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic','Apple SD Gothic Neo',serif"
  font-size="30"
  fill="url(#goldText)"
  letter-spacing="10"
  filter="url(#deepShadow)">일 산 명 월 관 요 정</text>

<!-- Dark semi-transparent band ON the skirt area for text readability -->
<rect x="0" y="530" width="${W}" height="340" fill="#000000" opacity="0.55" rx="0"/>

<!-- Gold top border of text band -->
<line x1="40" y1="532" x2="${W-40}" y2="532" stroke="url(#goldText)" stroke-width="3" opacity="0.9"/>
<!-- Gold bottom border of text band -->
<line x1="40" y1="868" x2="${W-40}" y2="868" stroke="url(#goldText)" stroke-width="3" opacity="0.9"/>

<!-- ── MAIN TITLE: 일산명월관 ── overlaid on figure, gold -->
<text x="600" y="680"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic','Apple SD Gothic Neo',serif"
  font-size="170"
  font-weight="900"
  fill="url(#goldText)"
  filter="url(#goldGlow)"
  letter-spacing="4">일산명월관</text>

<!-- ── SUBTITLE: 신실장 ── overlaid on figure, white bold -->
<text x="600" y="840"
  text-anchor="middle"
  font-family="'Noto Serif KR','Malgun Gothic','Apple SD Gothic Neo',serif"
  font-size="130"
  font-weight="900"
  fill="#ffffff"
  filter="url(#whiteGlow)"
  letter-spacing="24">신 실 장</text>

</svg>`;

sharp(Buffer.from(svg))
  .png({ quality: 98 })
  .toFile(path.join(__dirname, '..', 'og-after.png'))
  .then(info => console.log('✅ og-after.png 완성:', info))
  .catch(err => { console.error('❌', err); process.exit(1); });
