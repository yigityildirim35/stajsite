/* Mod 4: Giriş mi Çıkış mı?
   Ortadaki birim doğru kutuya sürüklenir (ya da kutuya dokunulur). */
const Sort = {
  started: false,

  start() {
    this.items = shuffle(PARTS.filter((p) => p.type !== 'ic'));
    this.index = 0;
    this.errors = 0;

    document.querySelectorAll('#screen-sort .bin-items').forEach((b) => { b.innerHTML = ''; });

    // Kutulara dokunmak da çalışsın (sürüklemekte zorlanan çocuklar için)
    if (!this.started) {
      document.querySelectorAll('#screen-sort .bin').forEach((bin) => {
        bin.addEventListener('click', () => {
          if (this.index < this.items.length) this.choose(bin);
        });
      });
      this.started = true;
    }

    this.showItem();
    Mascot.say('Ortadaki birimi doğru kutuya sürükle ya da kutuya dokun. Bilgi bilgisayara mı gidiyor, bilgisayardan mı geliyor?', 'happy');
  },

  showItem() {
    const part = this.items[this.index];
    const center = document.getElementById('sort-center');
    center.innerHTML = `<p class="sort-tip">Bu hangi kutuya gider?</p>
      <div class="part-card">${partArt(part.id)}<span class="part-name">${part.name}</span></div>
      <p class="sort-tip">Kalan: ${this.items.length - this.index}</p>`;
    const card = center.querySelector('.part-card');
    card.style.animation = 'pop .35s ease';
    Drag.make(card, {
      onDrop: (zone) => this.choose(zone),
      onTap: () => Mascot.say(part.name + ': ' + part.role + ' Sence hangi kutu?', 'think')
    });
    App.setStat('Yerleşen: ' + this.index + ' / ' + this.items.length);
  },

  choose(bin) {
    const part = this.items[this.index];
    if (bin.getAttribute('data-type') !== part.type) {
      this.errors++;
      Sound.oops();
      Mascot.say(pick(ENCOURAGE) + ' ' + part.name + ': ' + part.role + ' Bilgi hangi yöne gidiyor?', 'think');
      return false;
    }

    Sound.good();
    bin.querySelector('.bin-items').insertAdjacentHTML('beforeend', partArt(part.id));
    Mascot.say(pick(PRAISE) + ' ' + part.name + ' bir ' + TYPE_NAMES[part.type] + 'dir. ' + part.fact, 'cheer');
    this.index++;

    if (this.index < this.items.length) {
      this.showItem();
    } else {
      document.getElementById('sort-center').innerHTML = '<p class="sort-tip">Hepsi yerleşti!</p>';
      App.setStat('Yerleşen: ' + this.index + ' / ' + this.items.length);
      const stars = this.errors === 0 ? 3 : this.errors <= 2 ? 2 : 1;
      App.later(() => App.finish(stars, 'Bütün birimleri doğru kutulara yerleştirdin!'), 1000);
    }
    return true;
  }
};

App.modes.sort = Sort;
