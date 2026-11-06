/* Silva's Little Wonderland — one-file friendly state + views */
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const main = $('#main');
const topbar = $('#topbar');
const modal = $('#modal');
const modalCard = $('#modalCard');
const toast = $('#toast');

const COLORS = ['red','blue','yellow','purple','green'];
const colorHex = { red:'#f9788e', blue:'#64bff1', yellow:'#ffd45e', purple:'#b39af0', green:'#6bd3b1' };
const defaultData = {
  name:'Silva',
  intro:'Selamat datang di dunia kecil yang dibuat khusus untukmu ♡\nGanti tulisan ini dengan ucapan pembuka versimu sendiri ya!',
  surprises:[
    'Kejutan kecil pertama menunggumu di sini ♡',
    'Semoga hari ini terasa hangat dan penuh warna!',
    'Tulis pesan spesialmu di kotak ini.',
    'Satu hal kecil yang ingin kusampaikan padamu.',
    'Terima kasih sudah sampai di sini ✦'
  ],
  letters:[
    'Tulis pesan pendekmu di sini. Ini hanya contoh yang bisa kamu ganti.',
    'Halo Silva! Tulis surat kecil yang ingin kamu simpan di cottage ini.',
    'Isi dengan hal-hal yang ingin kamu ceritakan ke Silva.',
    'Satu pesan kecil lagi, dari hati ♡'
  ],
  gallery:Array.from({length:10},()=>({image:'',caption:'Tambah foto & caption'})),
  giftImages:['','',''],
  gifts:[
    'Tulis ucapan birthday untuk hadiah pertama di sini.',
    'Tulis pesan atau deskripsi hadiah spesialmu di sini.',
    'Tulis isi surat rahasia untuk Silva di sini.'
  ],
  secret:'Rahasia kecil ini hanya untuk Silva. Tulis kejutanmu di sini ♡',
  final:'Tulis ucapan paling panjang dan paling tulusmu untuk Silva di sini. Setelah siap, tekan Save ya!',
};
const defaultState = {
  view:'welcome', history:[], games:{bubble:false,memory:false,maze:false},
  unlocked:{garden:false,letters:false,gallery:false,gifts:false,secret:false,celebration:false},
  opened:{surprises:[],letters:[],gifts:[],secret:false},
  data:defaultData, introSaved:false, celebrationWished:false,
  music:{name:'',src:'',on:true,volume:.7}
};
let state = loadState();
let audio = new Audio(); audio.loop = true;
let bubbleGame = null, memoryGame = null, mazeGame = null;
let toastTimer;

function clone(x){ return JSON.parse(JSON.stringify(x)); }
function loadState(){
  try{
    const saved = JSON.parse(localStorage.getItem('silvaWonderlandState') || 'null');
    const result = {...clone(defaultState), ...(saved||{})};
    result.games = {...defaultState.games,...(saved?.games||{})};
    result.unlocked = {...defaultState.unlocked,...(saved?.unlocked||{})};
    result.opened = {...defaultState.opened,...(saved?.opened||{})};
    result.data = {...clone(defaultData),...(saved?.data||{})};
    result.data.gallery = Array.from({length:10},(_,i)=>({...defaultData.gallery[i],...(saved?.data?.gallery?.[i]||{})}));
    result.data.giftImages = [...defaultData.giftImages,...(saved?.data?.giftImages||[])].slice(0,3);
    result.music = {...defaultState.music,...(saved?.music||{})};
    return result;
  } catch(e){ return clone(defaultState); }
}
function saveState(){
  try { localStorage.setItem('silvaWonderlandState',JSON.stringify(state)); } catch(e){ showToast('Penyimpanan perangkat penuh — cuba gambar yang lebih kecil ya.'); }
}
function updateUnlocks(){
  const allGames = Object.values(state.games).every(Boolean);
  state.unlocked.garden = allGames;
  state.unlocked.letters = allGames;
  state.unlocked.gallery = allGames;
  state.unlocked.gifts = allGames;
  const allGifts = state.opened.gifts.length >= 3;
  state.unlocked.secret = allGifts;
  state.unlocked.celebration = allGifts && state.opened.secret;
  saveState(); updateProgress();
}
function progressCount(){
  return Object.values(state.games).filter(Boolean).length + (state.unlocked.garden?1:0) + (state.opened.gifts.length===3?1:0) + (state.opened.secret?1:0) + (state.celebrationWished?1:0);
}
function updateProgress(){ $('#progressCount').textContent = Math.min(7,progressCount()); }
function showToast(msg){ toast.textContent=msg; toast.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove('show'),2700); }
function setView(view, push=true){
  if(push && state.view !== view) state.history.push(state.view);
  state.view=view; saveState(); render(); window.scrollTo({top:0,behavior:'smooth'});
}
function goBack(){ if(state.history.length){ state.view=state.history.pop(); saveState(); render(); } else setView('map',false); }
function home(){ state.history=[]; setView('map',false); }
function gate(key, label){ updateUnlocks(); if(state.unlocked[key]) return true; showToast(`${label} akan terbuka selepas syaratnya selesai ✦`); return false; }

function character(extra=''){
  return `<div class="character ${extra}" role="img" aria-label="Karakter chibi Silva">
    <svg viewBox="0 0 230 300" role="img" aria-label="Penguin chibi dengan topi kuning dan goggles oren">
      <defs><linearGradient id="capG" x1="0" x2="0" y2="1"><stop stop-color="#ffe76b"/><stop offset="1" stop-color="#d9a83b"/></linearGradient><linearGradient id="bodyG" x1="0" x2="1"><stop stop-color="#2a74c3"/><stop offset="1" stop-color="#0c3f88"/></linearGradient><linearGradient id="whiteG" x1="0" x2="0" y2="1"><stop stop-color="#fff"/><stop offset="1" stop-color="#dceeff"/></linearGradient></defs>
      <ellipse cx="115" cy="282" rx="78" ry="10" fill="#6eafd0" opacity=".25"/>
      <path d="M64 155C29 169 27 228 57 262C79 287 151 291 178 262C207 230 200 173 168 155Z" fill="url(#bodyG)" stroke="#173c7d" stroke-width="4"/>
      <ellipse cx="116" cy="226" rx="47" ry="61" fill="url(#whiteG)"/>
      <path d="M87 273c-17 11-36 10-45 1-4-5 0-11 8-11l24-1Z" fill="#f5a62d" stroke="#ca7a1e" stroke-width="3"/><path d="M143 273c17 11 36 10 45 1 4-5 0-11-8-11l-24-1Z" fill="#f5a62d" stroke="#ca7a1e" stroke-width="3"/>
      <path d="M64 164c-18 21-18 44-4 49 10 4 18-4 21-16l10-23Z" fill="#2368b5" stroke="#173c7d" stroke-width="4"/><g class="wave-hand"><path d="M169 164c18 21 18 44 4 49-10 4-18-4-21-16l-10-23Z" fill="#2368b5" stroke="#173c7d" stroke-width="4"/></g>
      <ellipse cx="115" cy="103" rx="78" ry="74" fill="url(#whiteG)" stroke="#173c7d" stroke-width="4"/><path d="M39 104C32 55 66 25 113 23c48-2 83 28 77 82-9-24-29-35-47-35-29 0-31 23-59 23-18 0-29-9-45 11Z" fill="url(#capG)" stroke="#bd8f35" stroke-width="4"/>
      <path d="M48 52c9-12 20-19 33-22M86 34c13-8 26-10 39-9M127 26c13 0 27 4 37 11M164 39c9 7 15 15 20 26" fill="none" stroke="#c1943b" stroke-width="8" stroke-linecap="round" opacity=".75"/>
      <path d="M44 83c-9 6-13 20-8 31 5 10 15 15 24 9M186 83c9 6 13 20 8 31-5 10-15 15-24 9" fill="#e4b94c" stroke="#bd8f35" stroke-width="4"/>
      <circle cx="82" cy="91" r="31" fill="#ff8a28" stroke="#e36e1a" stroke-width="5"/><circle cx="151" cy="91" r="31" fill="#ff8a28" stroke="#e36e1a" stroke-width="5"/><path d="M108 89h17" stroke="#e36e1a" stroke-width="7" stroke-linecap="round"/><ellipse cx="83" cy="91" rx="18" ry="21" fill="#fff"/><ellipse cx="150" cy="91" rx="18" ry="21" fill="#fff"/><ellipse cx="85" cy="95" rx="8" ry="12" fill="#101828"/><ellipse cx="148" cy="95" rx="8" ry="12" fill="#101828"/><circle cx="87" cy="89" r="3" fill="#fff"/><circle cx="150" cy="89" r="3" fill="#fff"/>
      <path d="M102 126c8-10 21-10 29 0l-14 16Z" fill="#ffb52d" stroke="#d9861d" stroke-width="3"/><path d="M104 144c8 5 16 5 25 0" fill="none" stroke="#b55e28" stroke-width="3" stroke-linecap="round"/><path d="M54 136c8 5 12 5 18 0M158 136c8 5 12 5 18 0" stroke="#ff9a9a" stroke-width="4" stroke-linecap="round" opacity=".7"/>
    </svg></div>`;
}
function snowFooter(){ return `<div class="footer-note">✦ dibuat dari salju, bintang kecil, dan banyak rasa sayang · Silva's Little Wonderland ✦</div>`; }
function screen(content, cls=''){ return `<section class="screen ${cls}">${content}</section>`; }
function pageTitle(kicker,title,sub){return `<div class="stage-title"><span class="eyebrow">${kicker}</span><h2>${title}</h2><p>${sub}</p></div>`;}

function stopGames(){
  document.onkeydown = null;
  bubbleGame = null;
  memoryGame = null;
  mazeGame = null;
}
function render(){
  stopGames();
  topbar.classList.toggle('hidden',state.view==='welcome');
  updateProgress();
  const views={welcome:renderWelcome,intro:renderIntro,map:renderMap,park:renderPark,bubble:renderBubble,memory:renderMemory,maze:renderMaze,garden:renderGarden,letters:renderLetters,gallery:renderGallery,gifts:renderGifts,secret:renderSecret,celebration:renderCelebration};
  main.innerHTML=(views[state.view]||renderWelcome)();
  bindCommon();
  if(state.view==='bubble') initBubble();
  if(state.view==='memory') initMemory();
  if(state.view==='maze') initMaze();
  if(state.view==='celebration' && state.celebrationWished) $('#finalLetterText')?.addEventListener('input',()=>{});
  maybeAutoplay();
}
function renderWelcome(){ return `<section class="center-screen screen">
  <div class="hero-grid"><div class="hero-copy"><span class="eyebrow">❄ a tiny birthday universe ❄</span><h1>Silva's<br><span style="color:#3186bd">Little</span><br>Wonderland</h1><p class="subtitle">A little world, just for you.<br>Dunia kecil penuh salju, hadiah, game, surat dan kejutan yang menunggumu.</p><button class="primary-btn" data-action="intro">Let's Explore! <span>→</span></button><p class="hint" style="margin-top:25px">Boleh mulai pelan-pelan. Setiap bintang adalah satu kejutan ♡</p></div>
  <div class="hero-art"><div class="scene"><div class="mountain"></div><div class="tree">▲<br>▲<br>▲</div><div class="cottage"><div class="window"></div><div class="door"></div></div><div class="lamp"></div><div style="position:absolute;left:50%;bottom:65px;transform:translateX(-50%);z-index:5">${character('')}</div></div></div></div>${snowFooter()}</section>`; }
function renderIntro(){ return screen(`<div class="section-head"><div><span class="eyebrow">01 · hello, birthday star</span><h2>A little birthday introduction</h2><p>Selamat datang, ${escapeHtml(state.data.name || 'Silva')}! Sebelum masuk, tinggalkan sapaan kecilmu.</p></div></div><div class="intro-grid"><div class="intro-character">${character('')}</div><div class="paper-card intro-copy"><h3 style="font-size:32px">Untuk <span style="color:#3c8fc5">${escapeHtml(state.data.name)}</span> ♡</h3><label for="nameInput">Nama penerima</label><input class="content-input" id="nameInput" value="${escapeHtml(state.data.name)}" maxlength="40" /><label for="introInput" style="margin-top:14px">Birthday introduction</label><textarea class="content-textarea" id="introInput">${escapeHtml(state.data.intro)}</textarea><p class="hint">Nama dan teks ini boleh kamu ubah kapan saja. Simpan agar tetap ada setelah refresh.</p><div class="save-row"><button class="pill-btn" data-save-intro>Save</button><button class="pill-btn ghost" data-edit-intro>Edit</button><button class="text-btn" data-cancel-intro>Cancel</button><button class="text-btn" data-action="map">Continue to the map →</button><span class="save-state" id="introSavedState">${state.introSaved?'Tersimpan ✦':''}</span></div></div></div>`); }
function renderMap(){
  updateUnlocks();
  const locations=[
    ['park','🎮','Game Park',true,'Mulai dari sini'],['garden','🌷','Mystery Garden',state.unlocked.garden,'Selesaikan 3 game'],['letters','✉️','Letter Cottage',state.unlocked.letters,'Buka setelah game'],['gallery','🖼️','Memory Gallery',state.unlocked.gallery,'Buka setelah game'],['gifts','🎁','Gift Castle',state.unlocked.gifts,'Buka setelah game'],['secret','🌙','Secret Room',state.unlocked.secret,'Buka semua gift'],['celebration','🎂','Birthday Celebration',state.unlocked.celebration,'Temukan rahasia']
  ];
  return screen(`<div class="section-head"><div><span class="eyebrow">02 · choose your path</span><h2>The Wonderland Map</h2><p>Tekan lokasi yang sudah menyala. Yang terkunci akan terbuka satu per satu.</p></div><button class="pill-btn ghost" data-action="intro">Edit intro</button></div><div class="map-board"><div class="map-path"></div><div class="map-locations">${locations.map(([view,icon,title,open,req])=>`<button class="map-location ${open?'':'locked'}" ${open?`data-action="${view}"`:'data-locked="true"'}><span class="lock-badge">${open?'✦':'🔒'}</span><span class="loc-icon">${icon}</span><strong>${title}</strong><small>${open?'Explore now →':req}</small></button>`).join('')}</div><div class="map-tree left">▲<br>▲<br>▲</div><div class="map-tree right">▲<br>▲<br>▲</div></div>${snowFooter()}`); }
function renderPark(){ return screen(`${pageTitle('03 · games first','Game Park','Tiga game kecil untuk mengumpulkan bintang. Setelah semuanya selesai, jalan kejutan akan terbuka.') }<div class="game-list"><article class="game-card"><div class="game-emoji">🫧</div><h3>Bubble Shooter</h3><p>Aim, bounce, match 3 atau lebih. Gerakkan jari untuk mengarahkan tembakan.</p><button class="pill-btn" data-action="bubble">Play Bubble Shooter →</button>${state.games.bubble?'<span class="game-complete">✓ Selesai · bintang terkumpul</span>':''}</article><article class="game-card"><div class="game-emoji">🃏</div><h3>Memory Match</h3><p>Cari semua pasangan kartu lucu dengan langkah sesedikit mungkin.</p><button class="pill-btn" data-action="memory">Play Memory Match →</button>${state.games.memory?'<span class="game-complete">✓ Selesai · bintang terkumpul</span>':''}</article><article class="game-card"><div class="game-emoji">🗝️</div><h3>Maze Escape</h3><p>Bantu Silva cari kunci, kumpulkan bintang, lalu temukan pintu keluar.</p><button class="pill-btn" data-action="maze">Play Maze Escape →</button>${state.games.maze?'<span class="game-complete">✓ Selesai · bintang terkumpul</span>':''}</article></div><div class="paper-card" style="margin-top:22px;text-align:center"><p style="margin:0;color:#5d7698;font-weight:800">Progress game: <b>${Object.values(state.games).filter(Boolean).length}/3</b> ✦ ${Object.values(state.games).every(Boolean)?'Semua jalan ke wonderland sudah terbuka!':'Selesaikan ketiga game untuk membuka Mystery Garden, surat, galeri dan Gift Castle.'}</p><button class="pill-btn ghost" data-action="map" style="margin-top:12px">← Back to Map</button></div>`); }

function renderBubble(){return screen(`<div class="game-shell"><div class="game-toolbar"><div><span class="eyebrow">Game Park · 1/3</span><h2 style="font-size:34px;margin:7px 0 0">Bubble Shooter</h2></div><div class="game-toolbar right"><div class="game-stats"><span class="stat">Level <b id="bubbleLevel">1</b></span><span class="stat">Score <b id="bubbleScore">0</b></span><span class="stat">Bubbles <b id="bubbleRemaining">0</b></span></div><button class="pill-btn ghost" data-bubble-pause>Ⅱ Pause</button><button class="pill-btn ghost" data-action="park">Menu</button></div></div><div class="canvas-wrap" id="bubbleCanvasWrap"><canvas id="bubbleCanvas" width="760" height="570"></canvas><div class="pause-overlay hidden" id="bubblePause"><div class="pause-card"><h3>Game paused ✦</h3><p>Tarik napas dulu, little explorer.</p><button class="pill-btn" data-bubble-resume>Resume</button><button class="pill-btn ghost" data-bubble-restart>Restart</button></div></div></div><p class="game-help">Sentuh/tarik untuk aim · lepaskan untuk menembak · bola akan memantul di dinding</p><div class="bubble-bottom"><div class="ammo"><span class="bubble-dot big" id="currentBubble"></span><span>current</span></div><div class="ammo"><span class="bubble-dot" id="nextBubble"></span><span>next</span></div><button class="pill-btn ghost" data-bubble-swap>⇄ Swap</button></div><div class="helper-row" style="margin-top:13px"><button class="helper" data-helper="bomb"><span>💣</span> Bomb <b id="bombCount">2</b></button><button class="helper" data-helper="color"><span>🌈</span> Color Changer <b id="colorCount">2</b></button><button class="helper" data-helper="special"><span>⭐</span> Special Bubble <b id="specialCount">1</b></button></div></div>`);}
function renderMemory(){return screen(`<div class="game-shell"><div class="section-head"><div><span class="eyebrow">Game Park · 2/3</span><h2 style="font-size:34px">Memory Match</h2><p>Balikkan dua kartu dan cari pasangan yang sama.</p></div><button class="pill-btn ghost" data-action="park">← Menu</button></div><div class="memory-controls"><label>Mode<select class="select-input" id="memoryDifficulty"><option value="easy">Easy · 4 pairs</option><option value="normal">Normal · 6 pairs</option><option value="hard">Hard · 8 pairs</option></select></label><button class="pill-btn" data-memory-restart>↻ Restart</button><span class="stat">Moves <b id="memoryMoves">0</b></span><span class="stat">Score <b id="memoryScore">0</b></span></div><div class="memory-grid" id="memoryGrid"></div><p class="memory-info" id="memoryInfo">Cari semua pasangan untuk membuka bintang berikutnya ✦</p></div>`);}
function renderMaze(){return screen(`<div class="game-shell"><div class="section-head"><div><span class="eyebrow">Game Park · 3/3</span><h2 style="font-size:34px">Maze Escape</h2><p>Cari kunci 🗝️, ambil bintang ✦, lalu masuk pintu 🏠. Gunakan arrow keys atau D-pad.</p></div><div><button class="pill-btn ghost" data-maze-restart>↻ Restart</button> <button class="pill-btn ghost" data-action="park">Menu</button></div></div><div class="maze-layout"><div class="maze-grid" id="mazeGrid"></div><div class="maze-side"><div class="character tiny" style="margin:auto">${character('tiny')}</div><h3>Explorer Silva</h3><p id="mazeStatus">Kunci masih tersembunyi di dalam maze.</p><div class="dpad"><button class="up" data-move="up">↑</button><button class="left" data-move="left">←</button><button class="down" data-move="down">↓</button><button class="right" data-move="right">→</button></div><button class="pill-btn ghost" data-maze-pause>Ⅱ Pause</button></div></div></div>`);}
function renderGarden(){if(!gate('garden','Mystery Garden')) return renderMap(); return screen(`<div class="location-stage garden"><div class="stage-content">${pageTitle('04 · unlocked','Mystery Garden','Ikuti jalan bersalju dan buka lima kotak kecil. Setiap kotak punya ruang pesan yang boleh kamu isi sendiri.') }<div class="collection-grid">${state.data.surprises.map((text,i)=>{const open=state.opened.surprises.includes(i);return `<button class="surprise-box ${open?'opened':''}" data-surprise="${i}"><span class="box-icon">${open?'🎀':'🎁'}</span><strong>Surprise ${i+1}</strong><small>${open?'Buka & edit pesan':'Tap untuk membuka'}</small></button>`}).join('')}</div><div class="paper-card" style="margin-top:25px;text-align:center"><p style="margin:0;color:#587494">${state.opened.surprises.length}/5 kotak sudah ditemukan · ✦</p><button class="pill-btn ghost" data-action="map" style="margin-top:12px">← Back to Map</button></div></div></div>`);}
function renderLetters(){if(!gate('letters','Letter Cottage')) return renderMap(); const selected=state.opened.letters[0]??null; return screen(`<div class="location-stage"><div class="stage-content">${pageTitle('05 · cozy corner','Letter Cottage','Buka sampulnya pelan-pelan. Semua surat di sini bisa kamu edit, simpan dan baca lagi kapan saja.') }<div class="letter-grid">${['Open When You Miss Me','A Letter for You','Things I Want to Tell You','One More Little Message'].map((t,i)=>`<button class="envelope ${state.opened.letters.includes(i)?'opened':''}" data-letter="${i}"><strong>${t}</strong><small>${state.opened.letters.includes(i)?'Open again ↗':'Tap to open'}</small></button>`).join('')}</div><div id="letterPreview"></div><div style="text-align:center;margin-top:24px"><button class="pill-btn ghost" data-action="map">← Back to Map</button></div></div></div>`);}
function renderGallery(){if(!gate('gallery','Memory Gallery')) return renderMap(); return screen(`<div class="location-stage"><div class="stage-content">${pageTitle('06 · scrapbook corner','Memory Gallery','Tambah sampai 10 foto dari device-mu. Caption juga bisa diedit, lalu tekan foto untuk melihat lebih besar.') }<div class="gallery-top"><p class="hint">Foto disimpan di perangkat ini via localStorage. Untuk link publik, tambahkan aset gambar ke hosting proyek.</p><button class="pill-btn ghost" data-clear-gallery>Clear all</button></div><div class="gallery-grid">${state.data.gallery.map((item,i)=>`<figure class="gallery-card" style="--r:${i%2?'1.4deg':'-1deg'}"><div class="gallery-image" data-gallery-view="${i}">${item.image?`<img src="${item.image}" alt="${escapeHtml(item.caption)}" style="width:100%;height:100%;object-fit:cover;border-radius:14px">`:'＋'}</div><figcaption>${escapeHtml(item.caption||'Tambah caption')}</figcaption><div class="slot-actions"><button title="Upload foto" data-gallery-upload="${i}">↥</button><button title="Edit caption" data-gallery-caption="${i}">✎</button><button title="Hapus foto" data-gallery-delete="${i}">×</button></div><input id="galleryFile${i}" type="file" accept="image/*" data-gallery-file="${i}"></figure>`).join('')}</div><div style="text-align:center;margin-top:25px"><button class="pill-btn ghost" data-action="map">← Back to Map</button></div></div></div>`);}
function renderGifts(){if(!gate('gifts','Gift Castle')) return renderMap(); const titles=['Birthday Gift','Special Gift','Secret Gift'];return screen(`<div class="location-stage"><div class="stage-content">${pageTitle('07 · three little rooms','Gift Castle','Masuk ke tiga kamar hadiah. Tekan kotak di tengah untuk membukanya; isi pesanmu bisa diubah kapan saja.') }<div class="gift-rooms">${titles.map((t,i)=>{const open=state.opened.gifts.includes(i);return `<article class="gift-room ${open?'explored':''}"><span class="eyebrow">Room ${i+1}</span><h3>${t}</h3><p>${open?'Hadiah sudah dibuka ✦':'Sebuah hadiah kecil menunggu...'}</p><button class="gift-box" data-gift-open="${i}" aria-label="Buka ${t}"><span class="ribbon"></span><span class="box-icon">${open?'✨':'🎁'}</span></button><div class="edit-area"><label class="field-label">${i===0?'Birthday message':i===1?'Special message / image note':'Secret letter'}</label><textarea class="content-textarea gift-editor" data-gift-editor="${i}" ${open?'':'disabled'}>${escapeHtml(state.data.gifts[i])}</textarea>${i===1?`<div class="gift-image-slot">${state.data.giftImages[1]?`<img src="${state.data.giftImages[1]}" alt="Special gift" style="width:100%;height:110px;object-fit:cover;border-radius:14px;margin-top:9px">`:''}<label class="pill-btn ghost upload-btn" style="margin-top:9px">↥ ${state.data.giftImages[1]?'Replace':'Upload'} image<input type="file" accept="image/*" data-gift-file="1" ${open?'':'disabled'}></label></div>`:''}<div class="save-row"><button class="pill-btn ghost" data-edit-gift="${i}" ${open?'':'disabled'}>Edit</button><button class="pill-btn ghost" data-save-gift="${i}" ${open?'':'disabled'}>Save</button><button class="text-btn" data-cancel-gift="${i}" ${open?'':'disabled'}>Cancel</button><span class="save-state">${open?'Edit anytime':'Unlock first'}</span></div></div></article>`}).join('')}</div><div style="text-align:center;margin-top:25px"><button class="pill-btn ghost" data-action="map">← Back to Map</button></div></div></div>`);}
function renderSecret(){if(!gate('secret','Secret Room')) return renderMap(); const open=state.opened.secret;return screen(`<div class="location-stage night"><div class="stage-content">${pageTitle('08 · shhh...','Secret Room','Ada satu kotak yang belum boleh dilihat sebelum kamu siap.')}<div class="secret-lock">${open?`${character('small')}<h3 style="color:white;font-size:30px">The secret is open ✦</h3><div class="paper-card" style="text-align:left;color:var(--ink)"><label class="field-label">Secret Room message</label><textarea class="content-textarea" id="secretEditor">${escapeHtml(state.data.secret)}</textarea><div class="save-row"><button class="pill-btn" data-save-secret>Save</button><button class="pill-btn ghost" data-edit-secret>Edit</button><button class="text-btn" data-cancel-secret>Cancel</button><span class="save-state">Teks rahasiamu tersimpan di device ini</span></div><p id="secretPreview" style="white-space:pre-wrap;line-height:1.6;margin:18px 0 0">${escapeHtml(state.data.secret)}</p></div><button class="primary-btn" data-action="celebration">Continue to Birthday Celebration →</button>`:`<div class="lock-art">📦</div><h3 style="color:white">A mystery box for Silva</h3><p style="color:#d7e6ff">Isi kotak ini belum terlihat. Tekan saat kamu benar-benar siap ya ♡</p><button class="primary-btn" data-open-secret>Open the secret box</button>`}</div><div style="text-align:center;margin-top:30px"><button class="pill-btn" data-action="map">← Back to Map</button></div></div></div>`);}
function renderCelebration(){if(!gate('celebration','Birthday Celebration')) return renderMap(); const wished=state.celebrationWished;return screen(`<div class="party-stage"><div class="party-content"><span class="eyebrow">09 · the final chapter</span><h2>Birthday Celebration</h2><p>Salju turun, lampu menyala, dan semua teman kecil berkumpul di sini.</p><div class="party-art"><div class="cake ${wished?'wished':''}">${wished?'🎂':'🧁'}</div>${character('')}</div>${!wished?`<button class="primary-btn wish-btn" data-make-wish>Make a Wish! ✨</button><p class="hint" style="color:#d5e9ff;margin-top:16px">Tekan untuk menyalakan lilin dan membuka surat terakhir.</p>`:`<div class="final-letter"><h3>Untuk Silva ♡</h3><label class="field-label" for="finalLetterEditor">Final birthday letter</label><textarea class="content-textarea" id="finalLetterEditor">${escapeHtml(state.data.final)}</textarea><div class="save-row"><button class="pill-btn" data-save-final>Save</button><button class="pill-btn ghost" data-edit-final>✎ Edit</button><button class="text-btn" data-cancel-final>Cancel</button><span class="save-state">Surat terakhir siap dibaca</span></div><div style="margin-top:18px;border-top:2px dashed #eed999;padding-top:17px"><p id="finalLetterText">${escapeHtml(state.data.final)}</p></div></div><h3 style="color:#fff;font-size:36px;margin:23px 0 0">Happy Birthday, ${escapeHtml(state.data.name)}! ♡</h3><div class="party-actions"><button class="pill-btn wish-btn" data-action="celebration">Read the Letter Again</button><button class="pill-btn ghost" data-action="map">Explore Again</button><button class="pill-btn ghost" data-action="welcome">Back to Home</button></div>`}</div></div>`);}

function escapeHtml(value){return String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function bindCommon(){
  $$('[data-action]').forEach(btn=>btn.addEventListener('click',()=>{
    const v=btn.dataset.action; if(v==='map'||v==='welcome') setView(v); else if(v==='intro') setView('intro'); else if(v==='park') setView('park'); else if(v==='garden'||v==='letters'||v==='gallery'||v==='gifts'||v==='secret'||v==='celebration') { if(gate(v==='garden'?'garden':v,btn.textContent.trim())) setView(v); } else setView(v);
  }));
  $$('[data-locked]').forEach(b=>b.addEventListener('click',()=>showToast('Lokasi ini masih terkunci. Selesaikan syarat sebelumnya dulu ya ✦')));
  $('#backBtn').onclick=goBack; $('#homeBtn').onclick=home; $('#menuBtn').onclick=()=>setView('map'); $('#musicBtn').onclick=()=>$('#musicPanel').classList.toggle('open');
  $$('[data-close-panel]').forEach(b=>b.onclick=()=>$('#musicPanel').classList.remove('open'));
  $('[data-save-intro]')?.addEventListener('click',()=>{state.data.name = $('#nameInput').value.trim() || 'Silva'; state.data.intro=$('#introInput').value.trim()||defaultData.intro; state.introSaved=true; saveState(); render(); showToast('Nama dan birthday introduction tersimpan ♡');});
  $('[data-edit-intro]')?.addEventListener('click',()=>$('#nameInput')?.focus());
  $('[data-cancel-intro]')?.addEventListener('click',()=>render());
  $$('[data-surprise]').forEach(b=>b.addEventListener('click',()=>openSurprise(+b.dataset.surprise)));
  $$('[data-letter]').forEach(b=>b.addEventListener('click',()=>openLetter(+b.dataset.letter)));
  $$('[data-gallery-upload]').forEach(b=>b.addEventListener('click',()=>$('#galleryFile'+b.dataset.galleryUpload).click()));
  $$('[data-gallery-file]').forEach(input=>input.addEventListener('change',e=>handleGalleryFile(+input.dataset.galleryFile,e.target.files[0])));
  $$('[data-gallery-caption]').forEach(b=>b.addEventListener('click',()=>editCaption(+b.dataset.galleryCaption)));
  $$('[data-gallery-delete]').forEach(b=>b.addEventListener('click',()=>deleteGalleryImage(+b.dataset.galleryDelete)));
  $$('[data-gift-file]').forEach(input=>input.addEventListener('change',e=>handleGiftFile(+input.dataset.giftFile,e.target.files[0])));
  $$('[data-gallery-view]').forEach(b=>b.addEventListener('click',()=>{const item=state.data.gallery[+b.dataset.galleryView]; if(item.image) openModal(`<button class="modal-close" data-modal-close>×</button><h3>${escapeHtml(item.caption)}</h3><img class="modal-img" src="${item.image}" alt="${escapeHtml(item.caption)}"/>`); else showToast('Slot ini masih kosong — upload foto dulu ya ♡');}));
  $('[data-clear-gallery]')?.addEventListener('click',()=>{if(confirm('Hapus semua foto dan caption dari gallery ini?')){state.data.gallery=clone(defaultData.gallery);saveState();render();}});
  $$('[data-gift-open]').forEach(b=>b.addEventListener('click',()=>openGift(+b.dataset.giftOpen)));
  $$('[data-save-gift]').forEach(b=>b.addEventListener('click',()=>{const i=+b.dataset.saveGift;state.data.gifts[i]=$(`[data-gift-editor="${i}"]`).value;saveState();showToast('Isi hadiah tersimpan ✦');}));
  $$('[data-edit-gift]').forEach(b=>b.addEventListener('click',()=>document.querySelector(`[data-gift-editor="${b.dataset.editGift}"]`)?.focus()));
  $$('[data-cancel-gift]').forEach(b=>b.addEventListener('click',()=>render()));
  $('[data-open-secret]')?.addEventListener('click',()=>{state.opened.secret=true;updateUnlocks();showToast('Kotak rahasia terbuka ✦');render();});
  $('[data-save-secret]')?.addEventListener('click',()=>{state.data.secret=$('#secretEditor').value;saveState();$('#secretPreview').textContent=state.data.secret;showToast('Pesan rahasia tersimpan ♡');});
  $('[data-edit-secret]')?.addEventListener('click',()=>$('#secretEditor')?.focus());
  $('[data-cancel-secret]')?.addEventListener('click',()=>render());
  $('[data-make-wish]')?.addEventListener('click',()=>{state.celebrationWished=true;saveState();showToast('Lilin menyala! Make a wish, Silva ✨');render();});
  $('[data-save-final]')?.addEventListener('click',()=>{state.data.final=$('#finalLetterEditor').value;saveState();$('#finalLetterText').textContent=state.data.final;showToast('Surat terakhir tersimpan ♡');});
  $('[data-edit-final]')?.addEventListener('click',()=>$('#finalLetterEditor')?.focus());
  $('[data-cancel-final]')?.addEventListener('click',()=>render());
}
function openModal(html){modalCard.innerHTML=html;modal.classList.remove('hidden');$$('[data-modal-close]',modalCard).forEach(button=>button.addEventListener('click',closeModal));modal.onclick=e=>{if(e.target===modal)closeModal();};}
function closeModal(){modal.classList.add('hidden');modalCard.innerHTML='';}
function openSurprise(i){
  if(!state.opened.surprises.includes(i)) state.opened.surprises.push(i); saveState();
  openModal(`<button class="modal-close" data-modal-close>×</button><span class="eyebrow">Mystery Garden · Surprise ${i+1}</span><h3>Little surprise box 🎁</h3><label class="field-label">Isi kejutan (teks atau link gambar)</label><textarea class="content-textarea" id="surpriseEditor">${escapeHtml(state.data.surprises[i])}</textarea><div class="save-row"><button class="pill-btn" data-save-surprise>Save</button><button class="pill-btn ghost" data-edit-surprise>Edit</button><button class="text-btn" data-modal-close>Cancel</button></div><p class="hint" style="margin-top:16px">Preview:</p><p id="surprisePreview" style="white-space:pre-wrap;line-height:1.6">${escapeHtml(state.data.surprises[i])}</p>`);
  $('[data-save-surprise]')?.addEventListener('click',()=>{state.data.surprises[i]=$('#surpriseEditor').value;saveState();$('#surprisePreview').textContent=state.data.surprises[i];showToast('Surprise tersimpan ✦');});
  $('[data-edit-surprise]')?.addEventListener('click',()=>$('#surpriseEditor')?.focus());
}
function openLetter(i){
  if(!state.opened.letters.includes(i)) state.opened.letters.push(i);saveState();
  const names=['Open When You Miss Me','A Letter for You','Things I Want to Tell You','One More Little Message'];
  openModal(`<button class="modal-close" data-modal-close>×</button><span class="eyebrow">Letter Cottage · envelope ${i+1}</span><h3>${names[i]} ✉️</h3><div class="letter-paper"><label class="field-label">Isi suratmu</label><textarea class="content-textarea" id="letterEditor">${escapeHtml(state.data.letters[i])}</textarea><div class="save-row"><button class="pill-btn" data-save-letter>Save</button><button class="pill-btn ghost" data-edit-letter>Edit</button><button class="text-btn" data-modal-close>Cancel</button></div><p class="hint" style="margin-top:17px">Preview surat:</p><p id="letterPreviewText" style="white-space:pre-wrap;line-height:1.7">${escapeHtml(state.data.letters[i])}</p></div>`);
  $('[data-save-letter]')?.addEventListener('click',()=>{state.data.letters[i]=$('#letterEditor').value;saveState();$('#letterPreviewText').textContent=state.data.letters[i];showToast('Surat tersimpan ♡');});
  $('[data-edit-letter]')?.addEventListener('click',()=>$('#letterEditor')?.focus());
}
function openGift(i){if(!state.opened.gifts.includes(i)) state.opened.gifts.push(i);updateUnlocks();saveState();render();showToast(`Room ${i+1} terbuka ✨`);}
function editCaption(i){openModal(`<button class="modal-close" data-modal-close>×</button><h3>Edit caption ✎</h3><label class="field-label">Caption foto ${i+1}</label><textarea class="content-textarea" id="captionEditor">${escapeHtml(state.data.gallery[i].caption)}</textarea><div class="save-row"><button class="pill-btn" data-save-caption>Save</button><button class="pill-btn ghost" data-edit-caption>Edit</button><button class="text-btn" data-modal-close>Cancel</button></div>`);$('[data-save-caption]')?.addEventListener('click',()=>{state.data.gallery[i].caption=$('#captionEditor').value||'Memory kecil';saveState();closeModal();render();showToast('Caption tersimpan ✦');});$('[data-edit-caption]')?.addEventListener('click',()=>$('#captionEditor')?.focus());}
function handleGalleryFile(i,file){if(!file)return;const reader=new FileReader();reader.onload=()=>{state.data.gallery[i].image=reader.result;saveState();render();showToast('Foto ditambahkan ke scrapbook ♡');};reader.readAsDataURL(file);}
function deleteGalleryImage(i){state.data.gallery[i].image='';state.data.gallery[i].caption='Tambah foto & caption';saveState();render();showToast('Foto dihapus dari slot ini.');}
function handleGiftFile(i,file){if(!file)return;const reader=new FileReader();reader.onload=()=>{state.data.giftImages[i]=reader.result;saveState();render();showToast('Gambar special gift ditambahkan ♡');};reader.readAsDataURL(file);}

/* ---------- Music player ---------- */
function configureAudio(){audio.volume=Number(state.music.volume||.7);if(state.music.src && audio.src!==state.music.src) audio.src=state.music.src;$('#musicName').textContent=state.music.name||'Belum ada lagu. Upload MP3 pilihanmu ya ♡';$('#volumeControl').value=state.music.volume||.7;$('#musicToggleBtn').textContent=state.music.on?'Music ON':'Music OFF';}
function maybeAutoplay(){configureAudio();if(!state.music.src)return; if(state.music.on){audio.play().then(()=>{$('#autoplayPrompt')?.classList.add('hidden');}).catch(()=>{$('#autoplayPrompt')?.classList.remove('hidden');});}}
$('#playMusicBtn').onclick=()=>{if(!state.music.src){showToast('Upload lagu MP3 pilihanmu dulu ya ♡');return;}state.music.on=true;audio.play().then(()=>{$('#autoplayPrompt').classList.add('hidden');saveState();}).catch(()=>{$('#autoplayPrompt').classList.remove('hidden');});configureAudio();};
$('#pauseMusicBtn').onclick=()=>{audio.pause();};
$('#musicToggleBtn').onclick=()=>{state.music.on=!state.music.on;if(state.music.on) audio.play().catch(()=>{});else audio.pause();saveState();configureAudio();};
$('#volumeControl').oninput=e=>{state.music.volume=+e.target.value;audio.volume=state.music.volume;saveState();};
$('#tapPlayBtn').onclick=()=>{$('#playMusicBtn').click();};
$('#musicInput').onchange=e=>{const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=()=>{state.music.src=reader.result;state.music.name=file.name;state.music.on=true;saveState();configureAudio();audio.play().catch(()=>$('#autoplayPrompt').classList.remove('hidden'));showToast('Lagu kamu siap dimainkan ♫');};reader.readAsDataURL(file);};
$('#removeMusicBtn').onclick=()=>{audio.pause();audio.removeAttribute('src');state.music={...defaultState.music};saveState();configureAudio();showToast('Lagu dihapus dari perangkat ini.');};

/* ---------- Bubble Shooter ---------- */
function initBubble(){
  const canvas=$('#bubbleCanvas'),ctx=canvas.getContext('2d');
  const cols=16, radius=18, dx=38, dy=34, originX=26, originY=31;
  bubbleGame={canvas,ctx,cols,radius,dx,dy,grid:[],angle:-Math.PI/2,current:randomColor(),next:randomColor(),score:0,level:1,shots:0,helpers:{bomb:2,color:2,special:1},paused:false,anim:null};
  resetBubbleGrid(); bindBubbleEvents(); drawBubble();
}
function bubblePos(r,c){return {x:26+c*38+(r%2?19:0),y:31+r*34};}
function resetBubbleGrid(){const b=bubbleGame;b.grid=[];for(let r=0;r<5;r++){b.grid[r]=[];for(let c=0;c<b.cols;c++){b.grid[r][c]=(c+r*2)%6===0?'':COLORS[(c+r)%COLORS.length]; if((r+c)%7===0)b.grid[r][c]=COLORS[(c+2*r)%COLORS.length];}} updateBubbleStats();}
function randomColor(){return COLORS[Math.floor(Math.random()*COLORS.length)];}
function bubbleDrawCircle(ctx,x,y,r,color,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.fillStyle=colorHex[color]||color;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.8)';ctx.lineWidth=2;ctx.stroke();ctx.fillStyle='rgba(255,255,255,.62)';ctx.beginPath();ctx.arc(x-r*.32,y-r*.3,r*.25,0,Math.PI*2);ctx.fill();ctx.restore();}
function drawBubble(){const b=bubbleGame;if(!b)return;const {ctx,canvas}=b;ctx.clearRect(0,0,canvas.width,canvas.height);ctx.fillStyle='rgba(255,255,255,.45)';ctx.fillRect(0,0,canvas.width,canvas.height);for(let r=0;r<b.grid.length;r++)for(let c=0;c<b.cols;c++){const color=b.grid[r]?.[c];if(color){const p=bubblePos(r,c);bubbleDrawCircle(ctx,p.x,p.y,b.radius,color);}}
  const shooter={x:canvas.width/2,y:canvas.height-37}; drawAim(ctx,shooter.x,shooter.y,b.angle); bubbleDrawCircle(ctx,shooter.x,shooter.y,b.radius+2,b.current); drawBubbleText(ctx,'AIM & SHOOT',canvas.width/2,canvas.height-8);
}
function drawBubbleText(ctx,text,x,y){ctx.save();ctx.fillStyle='rgba(36,87,141,.66)';ctx.font='800 11px Nunito';ctx.textAlign='center';ctx.fillText(text,x,y);ctx.restore();}
function trajectory(angle){const b=bubbleGame, w=b.canvas.width,h=b.canvas.height-45;let x=w/2,y=h,dx=Math.cos(angle),dy=Math.sin(angle),points=[];for(let i=0;i<42;i++){x+=dx*17;y+=dy*17;if(x<18||x>w-18){dx*=-1;x=Math.max(18,Math.min(w-18,x));}points.push({x,y});if(y<20)break;for(const row of b.grid)for(let c=0;c<b.cols;c++){if(!row[c])continue;const p=bubblePos(b.grid.indexOf(row),c);if(Math.hypot(x-p.x,y-p.y)<b.radius*1.85)return points;}}return points;}
function drawAim(ctx,x,y,angle){const pts=trajectory(angle);ctx.save();ctx.fillStyle='rgba(29,74,127,.5)';pts.forEach((p,i)=>{if(i%2===0){ctx.beginPath();ctx.arc(p.x,p.y,2.5,0,Math.PI*2);ctx.fill();}});ctx.restore();}
function bindBubbleEvents(){const b=bubbleGame,canvas=b.canvas;let active=false;const pointAngle=e=>{const rect=canvas.getBoundingClientRect(),x=(e.clientX-rect.left)*canvas.width/rect.width,y=(e.clientY-rect.top)*canvas.height/rect.height;let angle=Math.atan2(y-(canvas.height-37),x-canvas.width/2);b.angle=Math.max(-Math.PI+0.18,Math.min(-0.18,angle));drawBubble();};canvas.addEventListener('pointerdown',e=>{active=true;canvas.setPointerCapture(e.pointerId);pointAngle(e);});canvas.addEventListener('pointermove',e=>{if(active||e.pointerType==='mouse')pointAngle(e);});canvas.addEventListener('pointerup',e=>{if(active){active=false;shootBubble();}});$('[data-bubble-pause]').onclick=()=>toggleBubblePause();$('[data-bubble-resume]')?.addEventListener('click',()=>toggleBubblePause(false));$('[data-bubble-restart]')?.addEventListener('click',()=>{resetBubbleGrid();b.current=randomColor();b.next=randomColor();b.score=0;b.shots=0;b.paused=false;$('#bubblePause').classList.add('hidden');drawBubble();updateBubbleStats();});$('[data-bubble-swap]')?.addEventListener('click',()=>{[b.current,b.next]=[b.next,b.current];drawBubble();});$$('[data-helper]').forEach(btn=>btn.addEventListener('click',()=>useHelper(btn.dataset.helper)));}
function toggleBubblePause(force){const b=bubbleGame;if(!b)return;b.paused=force===undefined?!b.paused:force;$('#bubblePause').classList.toggle('hidden',!b.paused);}
function nearestSlot(x,y){const b=bubbleGame;let best=null,dist=Infinity;for(let r=0;r<13;r++){for(let c=0;c<b.cols;c++){if(b.grid[r]?.[c])continue;const p=bubblePos(r,c);if(p.y>y+80)continue;const d=Math.hypot(p.x-x,p.y-y);if(d<dist){dist=d;best={r,c};}}}return best||{r:0,c:Math.floor(b.cols/2)};}
function neighbors(r,c){const parity=r%2;return parity?[[r,c-1],[r,c+1],[r-1,c],[r-1,c+1],[r+1,c],[r+1,c+1]]:[[r,c-1],[r,c+1],[r-1,c-1],[r-1,c],[r+1,c-1],[r+1,c]];}
function inGrid(r,c){return r>=0&&r<13&&c>=0&&c<bubbleGame.cols;}
function connectedFrom(r,c){const b=bubbleGame,color=b.grid[r]?.[c];if(!color)return[];const out=[],q=[[r,c]],seen=new Set([r+','+c]);while(q.length){const [rr,cc]=q.shift();out.push([rr,cc]);neighbors(rr,cc).forEach(([nr,nc])=>{const key=nr+','+nc;if(inGrid(nr,nc)&&b.grid[nr]?.[nc]===color&&!seen.has(key)){seen.add(key);q.push([nr,nc]);}});}return out;}
function floating(){const b=bubbleGame,seen=new Set(),q=[];for(let c=0;c<b.cols;c++)if(b.grid[0]?.[c]){q.push([0,c]);seen.add('0,'+c);}while(q.length){const [r,c]=q.shift();neighbors(r,c).forEach(([nr,nc])=>{const key=nr+','+nc;if(inGrid(nr,nc)&&b.grid[nr]?.[nc]&&!seen.has(key)){seen.add(key);q.push([nr,nc]);}});}const drop=[];for(let r=0;r<13;r++)for(let c=0;c<b.cols;c++)if(b.grid[r]?.[c]&&!seen.has(r+','+c))drop.push([r,c]);return drop;}
function shootBubble(){const b=bubbleGame;if(!b||b.paused)return;const pts=trajectory(b.angle),p=pts[pts.length-1],slot=nearestSlot(p.x,p.y);b.grid[slot.r]??=[];if(b.grid[slot.r][slot.c]){const other=nearestSlot(p.x,p.y+30);slot.r=other.r;slot.c=other.c;}b.grid[slot.r][slot.c]=b.current;b.current=b.next;b.next=randomColor();b.shots++;const group=connectedFrom(slot.r,slot.c);if(group.length>=3){group.forEach(([r,c])=>b.grid[r][c]='');b.score+=group.length*30;const drop=floating();drop.forEach(([r,c])=>{b.grid[r][c]='';b.score+=20;});showToast(`Pop! ${group.length} bubbles + bonus ✦`);}else if(b.shots%6===0)addBubbleRow();if(b.score>0&&b.score%500===0)b.level++;updateBubbleStats();drawBubble();if(b.grid.flat().filter(Boolean).length===0){state.games.bubble=true;updateUnlocks();showToast('Bubble Shooter selesai! Bintang pertama didapat ✨');setTimeout(()=>setView('park'),900);} else if(b.grid.some((row,r)=>row?.some(Boolean)&&r>10)){showToast('Oops, bubble terlalu rendah. Tekan Restart untuk coba lagi.');}}
function addBubbleRow(){const b=bubbleGame;b.grid.unshift(Array.from({length:b.cols},(_,c)=>COLORS[(c+b.shots)%COLORS.length]));b.grid.length=13;}
function updateBubbleStats(){const b=bubbleGame;if(!b)return;$('#bubbleRemaining').textContent=b.grid?.flat().filter(Boolean).length||0;$('#bubbleScore').textContent=b.score;$('#bubbleLevel').textContent=b.level;$('#currentBubble').className='bubble-dot big bubble-'+b.current;$('#nextBubble').className='bubble-dot bubble-'+b.next;for(const [key,id] of [['bomb','bombCount'],['color','colorCount'],['special','specialCount']]){$('#'+id).textContent=b.helpers[key];$(`[data-helper="${key}"]`).disabled=b.helpers[key]<=0;}}
function useHelper(type){const b=bubbleGame;if(!b||b.helpers[type]<=0)return;b.helpers[type]--;if(type==='color'){b.current=randomColor();showToast('Warna bubble semasa ditukar 🌈');}if(type==='bomb'){let cells=[];for(let r=0;r<13;r++)for(let c=0;c<b.cols;c++)if(b.grid[r]?.[c])cells.push([r,c]);cells.sort(()=>Math.random()-.5).slice(0,5).forEach(([r,c])=>b.grid[r][c]='');b.score+=100;showToast('Bomb meletupkan bubble berdekatan 💣');}if(type==='special'){for(let r=0;r<3;r++)for(let c=0;c<b.cols;c++)b.grid[r][c]='';b.score+=180;showToast('Special bubble membersihkan bahagian atas ⭐');}updateBubbleStats();drawBubble();}

/* ---------- Memory Match ---------- */
function initMemory(){const select=$('#memoryDifficulty');select.onchange=()=>setupMemory(select.value);$('[data-memory-restart]').onclick=()=>setupMemory(select.value);setupMemory('easy');}
function setupMemory(mode){const counts={easy:4,normal:6,hard:8},icons=['🧁','🎁','❄️','🌙','⭐','🌷','🎀','☁️'];const pairs=counts[mode];memoryGame={mode,deck:[...icons.slice(0,pairs),...icons.slice(0,pairs)].sort(()=>Math.random()-.5),flipped:[],matched:[],moves:0,score:0,lock:false};const grid=$('#memoryGrid');grid.style.gridTemplateColumns=pairs>=8?'repeat(4,1fr)':pairs>=6?'repeat(4,1fr)':'repeat(4,1fr)';grid.innerHTML=memoryGame.deck.map((icon,i)=>`<button class="memory-card" data-memory-index="${i}"><span class="memory-card-inner"><span class="memory-front">?</span><span class="memory-back">${icon}</span></span></button>`).join('');$$('[data-memory-index]').forEach(c=>c.addEventListener('click',()=>flipMemory(+c.dataset.memoryIndex)));updateMemoryStats();}
function flipMemory(i){const m=memoryGame;if(!m||m.lock||m.flipped.includes(i)||m.matched.includes(i))return;const card=$(`[data-memory-index="${i}"]`);card.classList.add('flipped');m.flipped.push(i);if(m.flipped.length===2){m.moves++;m.lock=true;const [a,b]=m.flipped;if(m.deck[a]===m.deck[b]){m.matched.push(a,b);$(`[data-memory-index="${a}"]`).classList.add('matched');$(`[data-memory-index="${b}"]`).classList.add('matched');m.score+=100; m.flipped=[];m.lock=false;updateMemoryStats();if(m.matched.length===m.deck.length){state.games.memory=true;updateUnlocks();showToast('Memory Match selesai! Bintang kedua didapat ✨');setTimeout(()=>setView('park'),950);}}else{m.score=Math.max(0,m.score-5);setTimeout(()=>{card.classList.remove('flipped');$(`[data-memory-index="${b}"]`).classList.remove('flipped');m.flipped=[];m.lock=false;updateMemoryStats();},720);}}updateMemoryStats();}
function updateMemoryStats(){if(!memoryGame)return;$('#memoryMoves').textContent=memoryGame.moves;$('#memoryScore').textContent=memoryGame.score;$('#memoryInfo').textContent=memoryGame.matched.length===memoryGame.deck.length?'Semua pasangan ditemukan! ✦':'Cari semua pasangan untuk membuka bintang berikutnya ✦';}

/* ---------- Maze ---------- */
const mazeMap=[
'###############','#S.*..#.......#','#.###.#.#####.#','#...#.#.....#.#','###.#.#####.#.#','#...#.*...#...#','#.#.#####.###.#','#.#.....#...#.#','#.#####.#.#.#.#','#.......#K.E..#','###############'];
function initMaze(){mazeGame={map:mazeMap.map(r=>r.split('')),row:1,col:1,key:false,stars:0,paused:false};renderMazeGrid();document.onkeydown=e=>{const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};if(map[e.key]){e.preventDefault();moveMaze(map[e.key]);}};$$('[data-move]').forEach(b=>b.addEventListener('click',()=>moveMaze(b.dataset.move)));$('[data-maze-restart]').onclick=()=>initMaze();$('[data-maze-pause]').onclick=()=>{mazeGame.paused=!mazeGame.paused;showToast(mazeGame.paused?'Maze paused':'Maze resumed');};}
function renderMazeGrid(){const g=$('#mazeGrid');if(!g||!mazeGame)return;g.innerHTML='';for(let r=0;r<mazeGame.map.length;r++)for(let c=0;c<mazeGame.map[r].length;c++){const ch=mazeGame.map[r][c],cell=document.createElement('div');cell.className='maze-cell '+(ch==='#'?'wall':ch==='S'?'start':ch==='E'?'exit':ch==='*'?'star':'');cell.innerHTML=ch==='#'?'':(r===mazeGame.row&&c===mazeGame.col?character('tiny'):ch==='K'?'🗝️':ch==='E'?'🏠':ch==='*'?'✦':'');g.appendChild(cell);}}
function moveMaze(dir){const m=mazeGame;if(!m||m.paused)return;const d={up:[-1,0],down:[1,0],left:[0,-1],right:[0,1]}[dir],nr=m.row+d[0],nc=m.col+d[1];if(m.map[nr]?.[nc]==='#'){showToast('Dinding salju! Coba jalan lain.');return;}m.row=nr;m.col=nc;if(m.map[nr][nc]==='K'){m.key=true;m.map[nr][nc]='.';$('#mazeStatus').textContent='Kunci sudah dapat! Cari pintu keluar 🏠';showToast('Kunci ditemukan! ✦');}if(m.map[nr][nc]==='*'){m.stars++;m.map[nr][nc]='.';showToast('Bonus star +1 ✨');}if(m.map[nr][nc]==='E'){if(m.key){state.games.maze=true;updateUnlocks();showToast('Maze Escape selesai! Semua game tamat ✨');setTimeout(()=>setView('park'),900);}else{$('#mazeStatus').textContent='Pintunya ketemu, tapi kunci belum ada!';showToast('Cari kunci dulu ya 🗝️');}}renderMazeGrid();}

render();
