/* Mod 1: Bilgisayarı Topla
   Açık bir kasanın içine parçalar doğru yuvalara sürüklenir. */
const Build = {
  W: 600,
  H: 480,
  // Yuvaların kasa çizimi üzerindeki yeri (600x480 birimlik çizime göre)
  slots: [
    { part: 'fan', x: 42, y: 52, w: 110, h: 110 },
    { part: 'cpu', x: 236, y: 64, w: 120, h: 120 },
    { part: 'ram', x: 376, y: 64, w: 156, h: 120 },
    { part: 'gpu', x: 206, y: 200, w: 320, h: 120 },
    { part: 'psu', x: 52, y: 352, w: 230, h: 104 },
    { part: 'ssd', x: 352, y: 358, w: 178, h: 96 }
  ],

  // Kasanın içi: boş yuvaların şekilleri parçaların şekline benzer, böylece çocuk ipucu yakalar
  caseArt() {
    return svgWrap(`
      <rect x="8" y="8" width="584" height="464" rx="28" fill="#e8edfb" stroke="${INK}" stroke-width="6"/>
      <rect x="26" y="26" width="548" height="428" rx="18" fill="#f6f8ff" stroke="#c5cde8" stroke-width="3"/>
      <line x1="30" y1="340" x2="570" y2="340" stroke="#c5cde8" stroke-width="5" stroke-linecap="round"/>

      <circle cx="97" cy="107" r="46" fill="#dfe5f7" stroke="#aab4d4" stroke-width="3"/>
      <g stroke="#aab4d4" stroke-width="3"><line x1="61" y1="92" x2="133" y2="92"/><line x1="55" y1="107" x2="139" y2="107"/><line x1="61" y1="122" x2="133" y2="122"/></g>

      <rect x="190" y="40" width="360" height="292" rx="12" fill="#6cc49a" stroke="${INK}" stroke-width="4"/>
      <g stroke="#4fa57d" stroke-width="4" fill="none" stroke-linecap="round">
        <path d="M206 60 H224 V180"/><path d="M206 300 H236 V322"/><path d="M540 196 V310 H500"/>
      </g>
      <rect x="254" y="82" width="84" height="84" rx="8" fill="#d6dcef" stroke="${INK}" stroke-width="3"/>
      <rect x="270" y="98" width="52" height="52" rx="4" fill="none" stroke="#aab4d4" stroke-width="3" stroke-dasharray="6 5"/>
      <rect x="386" y="96" width="136" height="12" rx="3" fill="${INK}"/>
      <rect x="386" y="138" width="136" height="12" rx="3" fill="${INK}"/>
      <rect x="250" y="292" width="200" height="14" rx="3" fill="${INK}"/>

      <rect x="60" y="360" width="214" height="88" rx="12" fill="#dfe5f7" stroke="#aab4d4" stroke-width="3"/>
      <rect x="362" y="368" width="158" height="76" rx="12" fill="#dfe5f7" stroke="#aab4d4" stroke-width="3"/>
      <g stroke="#aab4d4" stroke-width="3" stroke-linecap="round"><line x1="374" y1="406" x2="508" y2="406"/></g>

      <circle class="power-led" cx="552" cy="26" r="9" fill="#c5cde8" stroke="${INK}" stroke-width="3"/>
    `, '0 0 600 480').replace('<svg ', '<svg class="case-art" ');
  },

  start() {
    this.placed = 0;
    this.errors = 0;
    this.misses = {};

    const stage = document.getElementById('build-stage');
    stage.classList.remove('on');
    stage.innerHTML = this.caseArt();
    this.slots.forEach((s) => {
      const slot = html('<div class="slot" data-drop></div>');
      slot.setAttribute('data-part', s.part);
      slot.style.left = (s.x / this.W * 100) + '%';
      slot.style.top = (s.y / this.H * 100) + '%';
      slot.style.width = (s.w / this.W * 100) + '%';
      slot.style.height = (s.h / this.H * 100) + '%';
      stage.appendChild(slot);
    });

    const tray = document.getElementById('build-tray');
    tray.innerHTML = '<p class="tray-title">Parçaları kasaya sürükle</p>';
    shuffle(this.slots).forEach((s) => {
      const part = PART[s.part];
      const card = html(`<div class="part-card">${partArt(part.id)}<span class="part-name">${part.name}</span></div>`);
      card.setAttribute('data-part', part.id);
      Drag.make(card, {
        onDrop: (zone, el) => this.drop(zone, el),
        onTap: () => Mascot.say(part.name + ': ' + part.hint, 'think')
      });
      tray.appendChild(card);
    });

    this.updateStat();
    Mascot.say('Bu kasa boş! Parçaları sağdan alıp doğru yuvaya sürükle. Bir parçaya dokunursan sana ipucu veririm.', 'happy');
  },

  drop(zone, card) {
    const partId = card.getAttribute('data-part');
    const part = PART[partId];
    if (!zone.classList.contains('slot') || zone.classList.contains('filled')) return false;

    if (zone.getAttribute('data-part') !== partId) {
      this.errors++;
      this.misses[partId] = (this.misses[partId] || 0) + 1;
      Sound.oops();
      Mascot.say(pick(ENCOURAGE) + ' ' + part.hint, 'think');
      // İki kez zorlanırsa doğru yuva hafifçe parlar
      if (this.misses[partId] >= 2) {
        document.querySelector('.slot[data-part="' + partId + '"]').classList.add('pulse-hint');
      }
      return false;
    }

    zone.classList.remove('pulse-hint', 'drop-hover');
    zone.removeAttribute('data-drop');
    zone.classList.add('filled');
    zone.innerHTML = partArt(partId);
    card.remove();
    this.placed++;
    this.updateStat();
    Sound.good();

    if (this.placed === this.slots.length) {
      this.ready();
    } else {
      Mascot.say(pick(PRAISE) + ' ' + part.name + ' yerine oturdu. ' + part.role, 'cheer');
    }
    return true;
  },

  updateStat() {
    App.setStat('Takılan: ' + this.placed + ' / ' + this.slots.length);
  },

  ready() {
    const tray = document.getElementById('build-tray');
    tray.innerHTML = '';
    const done = html(`<div class="tray-done">
      <p class="tray-title">Bütün parçalar takıldı!</p>
      <button class="btn btn-mint btn-big">${ICONS.power}Bilgisayarı Aç</button>
    </div>`);
    done.querySelector('button').addEventListener('click', () => this.powerOn(done), { once: true });
    tray.appendChild(done);
    Mascot.say('Harika! Bütün parçalar yerinde. Şimdi düğmeye basıp bilgisayarı açalım!', 'cheer');
  },

  powerOn(done) {
    document.getElementById('build-stage').classList.add('on');
    Sound.good();
    // Monitörde selam yazısı belirir
    done.innerHTML = '<p class="tray-title">Bilgisayar çalışıyor!</p>' + svgWrap(`
      <rect x="44" y="68" width="12" height="14" fill="#a7b4d9" ${S}/>
      <rect x="28" y="80" width="44" height="8" rx="4" fill="#a7b4d9" ${S}/>
      <rect x="6" y="12" width="88" height="58" rx="7" fill="#5b6aa0" ${S}/>
      <rect x="13" y="18" width="74" height="45" rx="3" fill="#bfe6ff"/>
      <g class="screen-on">
        <text x="50" y="36" font-size="11" fill="${INK}" ${LABEL}>Merhaba!</text>
        <circle cx="42" cy="44" r="2.5" fill="${INK}"/><circle cx="58" cy="44" r="2.5" fill="${INK}"/>
        <path d="M42 51 Q50 58 58 51" fill="none" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
      </g>`);

    const stars = this.errors === 0 ? 3 : this.errors <= 3 ? 2 : 1;
    App.later(() => {
      App.finish(stars, 'Bilgisayarı kendin topladın ve çalıştırdın!');
    }, 1800);
  }
};

App.modes.build = Build;
