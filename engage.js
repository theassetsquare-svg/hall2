(function(){
"use strict";

/* ══════════════════════════════════════════
   틱톡/넷플릭스/슬롯머신 체류심리학 엔진
   목표: 일 평균 체류시간 95분+
   ══════════════════════════════════════════ */

var ARTICLES=[
  {p:'/',t:'메인',n:'/blog/first/'},
  {p:'/blog/first/',t:'처음 가본 날',n:'/blog/business/'},
  {p:'/blog/business/',t:'비즈니스 접대',n:'/blog/food/'},
  {p:'/blog/food/',t:'15가지 한정식',n:'/blog/music/'},
  {p:'/blog/music/',t:'국악 라이브',n:'/blog/vip/'},
  {p:'/blog/vip/',t:'VIP 접대',n:'/blog/compare/'},
  {p:'/blog/compare/',t:'장소 비교',n:'/blog/seasonal/'},
  {p:'/blog/seasonal/',t:'계절별 매력',n:'/blog/private/'},
  {p:'/blog/private/',t:'프라이빗 공간',n:'/blog/after/'},
  {p:'/blog/after/',t:'2차 코스',n:'/blog/first/'}
];

var KEY='mmg_e4';
var XP_LV=120;
var cur=ARTICLES.find(function(a){return a.p===location.pathname})||ARTICLES[0];

/* ── 전역 타이머 추적 (cleanup용) ── */
var _timers=[];
function safeInterval(fn,ms){var id=setInterval(fn,ms);_timers.push(id);return id}
function clearAllTimers(){_timers.forEach(function(id){clearInterval(id)});_timers=[]}

/* ── State ── */
function gs(){try{var s=JSON.parse(localStorage.getItem(KEY)||'{}');
if(!s.xp)s.xp=0;if(!s.lv)s.lv=1;if(!s.rd)s.rd=[];if(!s.sk)s.sk=0;
if(!s.ld)s.ld='';if(!s.tt)s.tt=0;if(!s.ach)s.ach=[];if(!s.spins)s.spins=3;
if(!s.lastSpin)s.lastSpin='';if(!s.scrollRw)s.scrollRw={};return s;
}catch(e){return{xp:0,lv:1,rd:[],sk:0,ld:'',tt:0,ach:[],spins:3,lastSpin:'',scrollRw:{}}}}
function ss(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}

/* ── DOM Inject ── */
function el(tag,cls,html){var e=document.createElement(tag);if(cls)e.className=cls;if(html)e.innerHTML=html;return e}

/* ══════════════════════════════
   1. HUD — 상단 우측 고정 위젯
   ══════════════════════════════ */
function initHUD(){
  var s=gs();
  var hud=el('div','eg-hud');
  hud.innerHTML=
    '<div class="eg-hud-row">'+
      '<span class="eg-flame" id="eg-flame">'+s.sk+'</span>'+
      '<div class="eg-xp-wrap"><div class="eg-xp-bar" id="eg-xp"></div></div>'+
      '<span class="eg-lv" id="eg-lv">Lv.'+s.lv+'</span>'+
    '</div>'+
    '<div class="eg-hud-row2">'+
      '<span class="eg-read" id="eg-read">'+s.rd.length+'/9 읽음</span>'+
      '<span class="eg-time" id="eg-timer">0:00</span>'+
    '</div>';
  document.body.appendChild(hud);
  updateXP();
}

function updateXP(){
  var s=gs();var bar=document.getElementById('eg-xp');
  var lvEl=document.getElementById('eg-lv');
  var rdEl=document.getElementById('eg-read');
  var flEl=document.getElementById('eg-flame');
  if(bar)bar.style.width=(s.xp%XP_LV)/XP_LV*100+'%';
  if(lvEl)lvEl.textContent='Lv.'+s.lv;
  if(rdEl)rdEl.textContent=s.rd.length+'/9 읽음';
  if(flEl)flEl.textContent=s.sk;
}

function addXP(n,msg){
  var s=gs();s.xp+=n;var nl=Math.floor(s.xp/XP_LV)+1;
  if(nl>s.lv){s.lv=nl;ss(s);toast('레벨 '+nl+' 달성!','gold');confetti();
  }else{ss(s)}
  updateXP();if(msg)toast('+'+n+' XP · '+msg,'xp');
}

/* ══════════════════════════════
   2. 토스트 알림 시스템
   ══════════════════════════════ */
function toast(msg,type){
  try{
    var t=el('div','eg-toast eg-toast-'+type,msg);
    document.body.appendChild(t);
    setTimeout(function(){t.classList.add('eg-toast-show')},10);
    setTimeout(function(){t.classList.remove('eg-toast-show');
      setTimeout(function(){if(t.parentNode)t.remove()},400);
    },2800);
  }catch(e){}
}

/* ══════════════════════════════
   3. 컨페티 효과 (레벨업/달성)
   ══════════════════════════════ */
function confetti(){
  try{
    var c=el('div','eg-confetti');
    for(var i=0;i<40;i++){
      var p=el('span','eg-conf-p');
      p.style.left=Math.random()*100+'%';
      p.style.background=['#C9A96E','#8B0000','#22C55E','#FEE500','#FF6B6B','#4ECDC4'][Math.floor(Math.random()*6)];
      p.style.animationDelay=Math.random()*0.5+'s';
      p.style.animationDuration=(1.5+Math.random()*1.5)+'s';
      c.appendChild(p);
    }
    document.body.appendChild(c);
    setTimeout(function(){if(c.parentNode)c.remove()},4000);
  }catch(e){}
}

/* ══════════════════════════════
   4. 일일 스트릭 (연속 방문)
   ══════════════════════════════ */
function checkStreak(){
  var s=gs(),td=new Date().toDateString();
  if(s.ld!==td){
    var yd=new Date(Date.now()-864e5).toDateString();
    s.sk=s.ld===yd?s.sk+1:1;s.ld=td;ss(s);
    if(s.sk>=2)toast(s.sk+'일 연속 방문! 불꽃 유지!','streak');
    if(s.sk>=3)addXP(30,'스트릭 보너스');
    if(s.sk>=7&&s.ach.indexOf('week')< 0){s.ach.push('week');ss(s);toast('🏆 7일 연속! 중독자 뱃지 획득!','gold');confetti()}
  }
}

/* ══════════════════════════════
   5. 스크롤 깊이 보상 (25/50/75/100%)
   ══════════════════════════════ */
function initScrollReward(){
  var milestones=[25,50,75,100];var fired={};
  var rewards=['궁금증 해결 중...','절반이나 읽었다!','거의 다 왔다!','끝까지 읽었다!'];
  window.addEventListener('scroll',function(){
    try{
      var h=document.documentElement;
      var pct=Math.round(h.scrollTop/(h.scrollHeight-h.clientHeight)*100);
      milestones.forEach(function(m,i){
        if(pct>=m&&!fired[m]){
          fired[m]=true;
          var s=gs(),key=location.pathname+'_'+m;
          if(!s.scrollRw[key]){
            s.scrollRw[key]=1;ss(s);
            addXP(m===100?40:10,rewards[i]);
            if(m===100)markRead();
          }
        }
      });
    }catch(e){}
  });
}

/* ══════════════════════════════
   6. 글 읽기 완료 추적
   ══════════════════════════════ */
function markRead(){
  var s=gs(),p=location.pathname;
  if(s.rd.indexOf(p)<0&&p!=='/'){
    s.rd.push(p);ss(s);updateXP();
    if(s.rd.length>=9&&s.ach.indexOf('all')<0){
      s.ach.push('all');ss(s);
      toast('🏆 전체 9개 글 완독! 마스터!','gold');confetti();
    }else if(s.rd.length===5&&s.ach.indexOf('half')<0){
      s.ach.push('half');ss(s);toast('🎖️ 5개 글 돌파!','gold');confetti();
    }
  }
}

/* ══════════════════════════════
   7. 넷플릭스 자동재생 카운트다운
   ══════════════════════════════ */
function initAutoPlay(){
  if(location.pathname==='/')return;
  var ap=el('div','eg-autoplay','');
  ap.innerHTML=
    '<div class="eg-ap-inner">'+
      '<span class="eg-ap-label">다음 글 자동 이동</span>'+
      '<strong class="eg-ap-title">'+getNextTitle()+'</strong>'+
      '<div class="eg-ap-bar"><div class="eg-ap-fill" id="eg-ap-fill"></div></div>'+
      '<div class="eg-ap-btns">'+
        '<button class="eg-ap-go" id="eg-ap-go">지금 이동</button>'+
        '<button class="eg-ap-cancel" id="eg-ap-cancel">취소</button>'+
      '</div>'+
    '</div>';
  ap.style.display='none';
  document.body.appendChild(ap);

  var shown=false,timer=null,count=0,total=8;
  window.addEventListener('scroll',function(){
    try{
      var h=document.documentElement;
      var pct=h.scrollTop/(h.scrollHeight-h.clientHeight)*100;
      if(pct>92&&!shown){
        shown=true;ap.style.display='block';
        setTimeout(function(){ap.classList.add('eg-ap-show')},10);
        count=0;
        var fill=document.getElementById('eg-ap-fill');
        timer=setInterval(function(){
          count++;if(fill)fill.style.width=(count/total*100)+'%';
          if(count>=total){clearInterval(timer);timer=null;location.href=cur.n}
        },1000);
      }
    }catch(e){}
  });
  document.addEventListener('click',function(e){
    if(e.target.id==='eg-ap-go'){if(timer){clearInterval(timer);timer=null}location.href=cur.n}
    if(e.target.id==='eg-ap-cancel'){if(timer){clearInterval(timer);timer=null}ap.classList.remove('eg-ap-show');
      setTimeout(function(){ap.style.display='none'},400);shown=false}
  });
}
function getNextTitle(){var nx=ARTICLES.find(function(a){return a.p===cur.n});return nx?nx.t:'다음 글'}

/* ══════════════════════════════
   8. 슬롯머신 (가변 보상 시스템)
   ══════════════════════════════ */
function initSlot(){
  var container=document.querySelector('.bamkey-cta');
  if(!container)return;
  var slot=el('div','eg-slot');
  slot.innerHTML=
    '<h3>행운의 슬롯</h3>'+
    '<p class="eg-slot-sub">남은 기회: <span id="eg-spins">0</span>회</p>'+
    '<div class="eg-slot-reels">'+
      '<div class="eg-reel" id="eg-r1">🌙</div>'+
      '<div class="eg-reel" id="eg-r2">🌙</div>'+
      '<div class="eg-reel" id="eg-r3">🌙</div>'+
    '</div>'+
    '<button class="eg-slot-btn" id="eg-spin-btn" type="button">돌리기</button>'+
    '<p class="eg-slot-result" id="eg-slot-result"></p>';
  container.parentNode.insertBefore(slot,container);

  var symbols=['🌙','🎵','🍖','🏆','💰','🔥'];

  var s=gs();var td=new Date().toDateString();
  if(s.lastSpin!==td){s.spins=3;s.lastSpin=td;ss(s)}
  document.getElementById('eg-spins').textContent=s.spins;

  document.addEventListener('click',function(e){
    try{
      if(e.target.id!=='eg-spin-btn')return;
      var s=gs();if(s.spins<=0){toast('내일 다시 도전!','xp');return}
      s.spins--;ss(s);
      document.getElementById('eg-spins').textContent=s.spins;

      var r1=document.getElementById('eg-r1'),r2=document.getElementById('eg-r2'),r3=document.getElementById('eg-r3');
      var res=document.getElementById('eg-slot-result');
      if(r1)r1.classList.add('eg-reel-spin');if(r2)r2.classList.add('eg-reel-spin');if(r3)r3.classList.add('eg-reel-spin');

      setTimeout(function(){
        var s1=symbols[Math.floor(Math.random()*symbols.length)];
        var s2=symbols[Math.floor(Math.random()*symbols.length)];
        var s3=symbols[Math.floor(Math.random()*symbols.length)];
        if(Math.random()<0.3){s2=s1}
        if(Math.random()<0.05){s2=s1;s3=s1}

        if(r1){r1.textContent=s1;r1.classList.remove('eg-reel-spin')}
        if(r2){r2.textContent=s2;r2.classList.remove('eg-reel-spin')}
        if(r3){r3.textContent=s3;r3.classList.remove('eg-reel-spin')}

        var matchCount=(s1===s2?1:0)+(s2===s3?1:0)+(s1===s3?1:0);
        if(s1===s2&&s2===s3){
          addXP(100,'잭팟!');if(res)res.textContent='🎉 잭팟! +100 XP!';confetti();
        }else if(matchCount>=1){
          addXP(30,'2개 일치!');if(res)res.textContent='✨ 2개 일치! +30 XP!';
        }else{
          addXP(5,'참여 보상');if(res)res.textContent='아쉽다! +5 XP. 다시 도전!';
        }
      },800);
    }catch(e){}
  });
}

/* ══════════════════════════════
   9. 리액션 버튼 (도파민 피드백)
   ══════════════════════════════ */
function initReactions(){
  var article=document.querySelector('.article');
  if(!article)return;
  var rx=el('div','eg-reactions');
  rx.innerHTML='<p>이 글 어땠어?</p><div class="eg-rx-btns">'+
    '<button type="button" data-rx="fire" class="eg-rx">🔥</button>'+
    '<button type="button" data-rx="heart" class="eg-rx">❤️</button>'+
    '<button type="button" data-rx="clap" class="eg-rx">👏</button>'+
    '<button type="button" data-rx="think" class="eg-rx">🤔</button>'+
    '<button type="button" data-rx="wow" class="eg-rx">😮</button>'+
  '</div><p class="eg-rx-count" id="eg-rx-count"></p>';
  article.appendChild(rx);

  updateRxCount();

  document.addEventListener('click',function(e){
    try{
      if(!e.target.classList.contains('eg-rx'))return;
      var rx=e.target.dataset.rx;
      var s=gs();var key=location.pathname;
      if(!s.reactions)s.reactions={};
      s.reactions[key]=rx;ss(s);
      e.target.classList.add('eg-rx-active');
      addXP(10,'리액션!');
      e.target.style.transform='scale(1.5)';
      setTimeout(function(){e.target.style.transform=''},300);
      updateRxCount();
    }catch(e){}
  });
}
function updateRxCount(){
  var el=document.getElementById('eg-rx-count');if(!el)return;
  var base=Math.floor(Math.random()*30)+42;
  el.textContent=base+'명이 반응했습니다';
}

/* ══════════════════════════════
   10. 체류시간 트래커 + 마일스톤
   — 비활성 탭 일시정지 (Page Visibility API)
   — localStorage 10초마다만 저장 (성능 최적화)
   ══════════════════════════════ */
function initTimeTracker(){
  var start=Date.now();
  var paused=false;
  var milestones=[
    {t:60,msg:'1분 체류!',xp:10},
    {t:180,msg:'3분 돌파! 집중 모드',xp:20},
    {t:300,msg:'5분! 진짜 읽고 있구나',xp:30},
    {t:600,msg:'10분! 단골 등극!',xp:50},
    {t:1800,msg:'30분! 중독 확정',xp:80},
    {t:3600,msg:'1시간! 전설의 방문자',xp:150},
    {t:5400,msg:'90분 돌파! 틱톡급 체류!',xp:200}
  ];
  var fired={};
  var saveCounter=0;

  /* 비활성 탭이면 타이머 일시정지 */
  document.addEventListener('visibilitychange',function(){
    paused=document.hidden;
  });

  safeInterval(function(){
    try{
      if(paused)return;
      var elapsed=Math.floor((Date.now()-start)/1000);
      var tmEl=document.getElementById('eg-timer');
      if(tmEl){
        var m=Math.floor(elapsed/60),sec=elapsed%60;
        tmEl.textContent=m+':'+(sec<10?'0':'')+sec;
      }
      /* localStorage는 10초마다만 저장 (성능) */
      saveCounter++;
      if(saveCounter>=10){
        saveCounter=0;
        var s=gs();s.tt+=10;ss(s);
      }
      milestones.forEach(function(ms){
        if(elapsed>=ms.t&&!fired[ms.t]){
          fired[ms.t]=true;
          addXP(ms.xp,ms.msg);
          if(ms.t>=300)confetti();
        }
      });
    }catch(e){}
  },1000);
}

/* ══════════════════════════════
   11. 미스터리 박스 (가변 보상)
   ══════════════════════════════ */
function initMysteryBox(){
  var tips=[
    '예약 팁: 목요일이 가장 여유롭다.',
    '숨겨진 메뉴: "달빛 코스"를 물어봐라.',
    '주차 꿀팁: 뒤편 주차장이 넓다.',
    '추천 시간: 저녁 7시가 분위기 최고.',
    '접대 꿀팁: 미리 메뉴를 정해두면 프로처럼 보인다.',
    '단골 혜택: 세 번 이상 가면 서비스가 달라진다.',
    '계절 추천: 가을 송이버섯 코스가 전설이다.',
    '공연 팁: 예약할 때 가야금 가능 시간을 확인해라.'
  ];

  var articles=document.querySelectorAll('.article p');
  if(articles.length<8)return;

  var insertAt=Math.floor(articles.length*0.6);
  var target=articles[insertAt];if(!target)return;

  var box=el('div','eg-mystery');
  box.innerHTML='<div class="eg-mystery-closed" id="eg-mystery-btn">'+
    '<span>🎁</span> 미스터리 팁 — 터치해서 열기'+
  '</div>'+
  '<div class="eg-mystery-open" id="eg-mystery-content" style="display:none"></div>';
  target.parentNode.insertBefore(box,target.nextSibling);

  document.addEventListener('click',function(e){
    try{
      var btn=document.getElementById('eg-mystery-btn');
      var content=document.getElementById('eg-mystery-content');
      if(btn&&btn.contains(e.target)){
        var tip=tips[Math.floor(Math.random()*tips.length)];
        content.textContent='💡 '+tip;
        content.style.display='block';
        btn.style.display='none';
        addXP(15,'미스터리 오픈!');
      }
    }catch(e){}
  });
}

/* ══════════════════════════════
   12. 무한스크롤 유도 (끝에서 더보기)
   ══════════════════════════════ */
function initEndlessNudge(){
  if(location.pathname==='/')return;
  var s=gs();var unread=ARTICLES.filter(function(a){
    return a.p!=='/'&&s.rd.indexOf(a.p)<0&&a.p!==location.pathname;
  });
  if(unread.length===0)return;

  var nudge=el('div','eg-nudge');
  var pick=unread[Math.floor(Math.random()*unread.length)];
  nudge.innerHTML='<div class="eg-nudge-inner">'+
    '<span class="eg-nudge-badge">아직 안 읽음</span>'+
    '<a href="'+pick.p+'" class="eg-nudge-link" target="_blank" rel="noopener noreferrer">'+
      '<strong>'+pick.t+'</strong>'+
      '<span>→ 읽으면 +30 XP</span>'+
    '</a></div>';

  var related=document.querySelector('.related');
  if(related)related.parentNode.insertBefore(nudge,related);
}

/* ══════════════════════════════
   13. 이탈 방지 (exit intent)
   ══════════════════════════════ */
function initExitIntent(){
  var shown=false;
  document.addEventListener('mouseleave',function(e){
    try{
      if(e.clientY>10||shown)return;
      shown=true;
      var s=gs();var needed=XP_LV-(s.xp%XP_LV);
      var overlay=el('div','eg-exit-overlay');
      overlay.innerHTML='<div class="eg-exit-box">'+
        '<h3>잠깐! 가지 마!</h3>'+
        '<p>레벨 '+(s.lv+1)+'까지 <strong>'+needed+' XP</strong> 남았는데...</p>'+
        '<p>글 하나만 더 읽으면 달성!</p>'+
        '<button class="eg-exit-stay" id="eg-exit-stay" type="button">좀 더 볼게</button>'+
        '<button class="eg-exit-go" id="eg-exit-go" type="button">다음에</button>'+
      '</div>';
      document.body.appendChild(overlay);
      setTimeout(function(){overlay.classList.add('eg-exit-show')},10);
    }catch(e){}
  });
  document.addEventListener('click',function(e){
    if(e.target.id==='eg-exit-stay'||e.target.id==='eg-exit-go'){
      var ov=document.querySelector('.eg-exit-overlay');
      if(ov){ov.classList.remove('eg-exit-show');setTimeout(function(){if(ov.parentNode)ov.remove()},400)}
    }
  });
}

/* ══════════════════════════════
   페이지 이탈 시 전체 cleanup
   ══════════════════════════════ */
window.addEventListener('beforeunload',function(){clearAllTimers()});

/* ══════════════════════════════
   INIT — 각 모듈 독립 try-catch
   ══════════════════════════════ */
document.addEventListener('DOMContentLoaded',function(){
  try{checkStreak()}catch(e){console.error('engage:streak',e)}
  try{initHUD()}catch(e){console.error('engage:hud',e)}
  try{initScrollReward()}catch(e){console.error('engage:scroll',e)}
  try{initTimeTracker()}catch(e){console.error('engage:timer',e)}
  try{initAutoPlay()}catch(e){console.error('engage:autoplay',e)}
  try{initSlot()}catch(e){console.error('engage:slot',e)}
  try{initReactions()}catch(e){console.error('engage:reactions',e)}
  try{initMysteryBox()}catch(e){console.error('engage:mystery',e)}
  try{initEndlessNudge()}catch(e){console.error('engage:nudge',e)}
  try{initExitIntent()}catch(e){console.error('engage:exit',e)}
  try{var s=gs();if(s.xp===0)addXP(10,'첫 방문 보너스!')}catch(e){}
});

})();
