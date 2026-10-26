/* Ortak altyapı: ekranlar, puanlar, ses, oyun sonu penceresi */

/* ----- Yardımcılar ----- */
function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function html(markup) {
  const box = document.createElement('div');
  box.innerHTML = markup.trim();
  return box.firstElementChild;
}

function starsHtml(count) {
  let out = '';
  for (let i = 0; i < 3; i++) out += ICONS.star.replace('<svg ', '<svg class="' + (i < count ? 'lit' : '') + '" ');
  return out;
}

const PRAISE = ['Harika!', 'Süpersin!', 'Aferin!', 'Çok iyi!', 'Bravo!', 'Müthiş!'];
const ENCOURAGE = ['Az kaldı!', 'Sorun değil, birlikte öğreniyoruz!', 'Hadi bir daha düşünelim!', 'Bir dahakine olacak!'];

/* ----- Tarayıcıda saklanan en iyi skorlar (sadece bu bilgisayarda) ----- */
const Store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem('bd_' + key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) {
      return fallback;
    }
  },
  set(key, value) {
    try { localStorage.setItem('bd_' + key, JSON.stringify(value)); } catch (e) { /* gizli pencere vb. */ }
  }
};

/* ----- Sesler: dosya gerekmez, tarayıcı küçük melodiler üretir ----- */
const Sound = {
  on: Store.get('sound', true),
  ctx: null,

  play(notes, type, volume) {
    if (!this.on) return;
    try {
      if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      notes.forEach((n) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const t = now + n[1];
        osc.type = type || 'sine';
        osc.frequency.value = n[0];
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(volume || 0.12, t + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + n[2]);
        osc.connect(gain).connect(this.ctx.destination);
        osc.start(t);
        osc.stop(t + n[2] + 0.05);
      });
    } catch (e) { /* ses desteklenmiyorsa sessiz devam et */ }
  },

  good() { this.play([[660, 0, 0.14], [880, 0.1, 0.22]]); },
  oops() { this.play([[392, 0, 0.18], [330, 0.14, 0.24]], 'triangle', 0.08); },
  pop() { this.play([[540, 0, 0.08]], 'sine', 0.06); },
  win() { this.play([[523, 0, 0.18], [659, 0.14, 0.18], [784, 0.28, 0.18], [1047, 0.42, 0.4]]); }
};

/* ----- Uygulama ----- */
const App = {
  modes: {},
  current: null,
  titles: {
    menu: 'Bilgisayar Dünyası',
    build: 'Bilgisayarı Topla',
    match: 'Eşleştir',
    quiz: 'Bilgi Yarışması',
    sort: 'Giriş mi Çıkış mı?'
  },

  init() {
    Mascot.init();

    document.querySelectorAll('[data-icon]').forEach((el) => {
      el.innerHTML = ICONS[el.getAttribute('data-icon')];
    });

    document.querySelectorAll('.mode-card').forEach((card) => {
      card.addEventListener('click', () => App.start(card.getAttribute('data-mode')));
    });

    document.getElementById('btn-home').addEventListener('click', () => App.menu());
    document.getElementById('btn-sound').addEventListener('click', () => App.toggleSound());
    document.getElementById('btn-full').addEventListener('click', () => App.toggleFullscreen());
    document.getElementById('modal-replay').addEventListener('click', () => {
      App.closeModal();
      App.start(App.current);
    });
    document.getElementById('modal-menu').addEventListener('click', () => {
      App.closeModal();
      App.menu();
    });

    this.renderSoundButton();
    this.menu();
  },

  /* Ekran değişince iptal edilen zamanlayıcı (oyundan çıkınca eski oyun devam etmesin) */
  timers: [],
  later(fn, ms) {
    this.timers.push(setTimeout(fn, ms));
  },

  show(name) {
    this.timers.forEach(clearTimeout);
    this.timers = [];
    document.querySelectorAll('.screen').forEach((s) => s.classList.remove('active'));
    document.getElementById('screen-' + name).classList.add('active');
    document.getElementById('title').textContent = this.titles[name];
    document.getElementById('btn-home').hidden = name === 'menu';
    this.setStat('');
  },

  menu() {
    this.current = null;
    this.show('menu');
    document.querySelectorAll('[data-best]').forEach((el) => {
      el.innerHTML = starsHtml(Store.get('best_' + el.getAttribute('data-best'), 0));
    });
    Mascot.say('Merhaba, ben Bitbit! Hadi bilgisayarın parçalarını birlikte öğrenelim. Bir oyun seç!', 'happy');
  },

  start(mode) {
    this.current = mode;
    this.show(mode);
    this.modes[mode].start();
  },

  setStat(text) {
    document.getElementById('stat').textContent = text;
  },

  /* Oyun bitince yıldızları gösterir. En az 1 yıldız verilir: her deneme değerlidir. */
  finish(stars, text) {
    const mode = this.current;
    if (stars > Store.get('best_' + mode, 0)) Store.set('best_' + mode, stars);

    const titles = ['', 'Aferin, güzel deneme!', 'Çok güzel!', 'Muhteşem!'];
    document.getElementById('modal-stars').innerHTML = starsHtml(stars);
    document.getElementById('modal-title').textContent = titles[stars];
    document.getElementById('modal-text').textContent = text +
      (stars < 3 ? ' Tekrar oynayarak daha çok yıldız toplayabilirsin.' : '');
    document.getElementById('modal').hidden = false;

    Sound.win();
    this.confetti();
    Mascot.say(stars === 3 ? 'Tebrikler! Sen gerçek bir bilgisayar uzmanısın!' : 'Çok iyi çalıştın! Ben seninle gurur duyuyorum.', 'cheer');
  },

  closeModal() {
    document.getElementById('modal').hidden = true;
  },

  confetti() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const box = document.getElementById('confetti');
    const colors = ['#ff9f43', '#ffd166', '#5ccfa4', '#9b8cff', '#5aa9f0', '#ff8fab'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('span');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + 'vw';
      piece.style.background = pick(colors);
      piece.style.animationDelay = (Math.random() * 0.8) + 's';
      piece.style.animationDuration = (2.2 + Math.random() * 1.4) + 's';
      box.appendChild(piece);
    }
    setTimeout(() => { box.innerHTML = ''; }, 4500);
  },

  toggleSound() {
    Sound.on = !Sound.on;
    Store.set('sound', Sound.on);
    this.renderSoundButton();
    Sound.pop();
  },

  renderSoundButton() {
    document.getElementById('btn-sound').innerHTML = Sound.on ? ICONS.soundOn : ICONS.soundOff;
  },

  toggleFullscreen() {
    const doc = document;
    const root = doc.documentElement;
    try {
      if (doc.fullscreenElement || doc.webkitFullscreenElement) {
        (doc.exitFullscreen || doc.webkitExitFullscreen).call(doc);
      } else {
        (root.requestFullscreen || root.webkitRequestFullscreen).call(root);
      }
    } catch (e) { /* tam ekran desteklenmiyor */ }
  }
};

document.addEventListener('DOMContentLoaded', () => App.init());
