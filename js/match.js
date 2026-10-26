/* Mod 2: Eşleştir
   Hafıza kartları: parçanın resmi ile adını eşleştir. */
const Match = {
  PAIRS: 6,

  start() {
    this.first = null;
    this.locked = false;
    this.moves = 0;
    this.found = 0;

    const cards = [];
    shuffle(PARTS).slice(0, this.PAIRS).forEach((p) => {
      cards.push({ id: p.id, face: partArt(p.id) });
      cards.push({ id: p.id, face: `<span class="mcard-name">${p.name}</span>` });
    });

    const grid = document.getElementById('match-grid');
    grid.innerHTML = '';
    shuffle(cards).forEach((c) => {
      const card = html(`<button class="mcard" aria-label="Kart">
        <div class="mcard-inner">
          <div class="mcard-face mcard-front">?</div>
          <div class="mcard-face mcard-back">${c.face}${ICONS.check.replace('<svg ', '<svg class="mcard-check" ')}</div>
        </div>
      </button>`);
      card.setAttribute('data-part', c.id);
      card.addEventListener('click', () => this.flip(card));
      grid.appendChild(card);
    });

    this.updateStat();
    Mascot.say('Kartları çevir! Bir parçanın resmini ve adını bulursan eşleşir. Yerlerini aklında tut!', 'happy');
  },

  flip(card) {
    if (this.locked || card.classList.contains('flipped')) return;
    card.classList.add('flipped');
    Sound.pop();

    if (!this.first) {
      this.first = card;
      return;
    }

    const a = this.first;
    const b = card;
    this.first = null;
    this.moves++;
    this.updateStat();

    if (a.getAttribute('data-part') === b.getAttribute('data-part')) {
      a.classList.add('matched');
      b.classList.add('matched');
      this.found++;
      this.updateStat();
      const part = PART[a.getAttribute('data-part')];
      Sound.good();
      Mascot.say(pick(PRAISE) + ' ' + part.name + ': ' + part.role, 'cheer');
      if (this.found === this.PAIRS) {
        const stars = this.moves <= 10 ? 3 : this.moves <= 15 ? 2 : 1;
        App.later(() => App.finish(stars, 'Bütün kartları ' + this.moves + ' hamlede eşleştirdin!'), 1200);
      }
    } else {
      this.locked = true;
      App.later(() => {
        a.classList.remove('flipped');
        b.classList.remove('flipped');
        this.locked = false;
      }, 1100);
    }
  },

  updateStat() {
    App.setStat('Hamle: ' + this.moves + '  •  Eşleşen: ' + this.found + ' / ' + this.PAIRS);
  }
};

App.modes.match = Match;
