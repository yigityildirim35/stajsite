/* Mod 3: Bilgi Yarışması
   10 soru, üç çeşit: resimden adı bul, görevden parçayı bul, giriş mi çıkış mı. */
const Quiz = {
  COUNT: 10,

  start() {
    this.index = 0;
    this.score = 0;
    this.results = [];
    this.questions = this.makeQuestions();
    this.render();
    Mascot.say('Soruları dikkatle oku ve cevabına dokun. Bilemezsen sorun değil, birlikte öğreniriz!', 'happy');
  },

  makeQuestions() {
    const kinds = shuffle(['name', 'name', 'name', 'name', 'role', 'role', 'role', 'io', 'io', 'io']);
    const used = {};
    return kinds.map((kind) => {
      const candidates = PARTS.filter((p) => !used[p.id] && (kind !== 'io' || p.type !== 'ic'));
      const part = pick(candidates);
      used[part.id] = true;

      let options;
      if (kind === 'io') {
        options = ['giris', 'cikis'];
      } else {
        const others = shuffle(PARTS.filter((p) => p.id !== part.id)).slice(0, 3).map((p) => p.id);
        options = shuffle(others.concat(part.id));
      }
      return { kind: kind, part: part, options: options };
    });
  },

  render() {
    const q = this.questions[this.index];
    const box = document.getElementById('quiz-box');

    let dots = '';
    for (let i = 0; i < this.COUNT; i++) {
      const cls = i === this.index ? 'current' : (this.results[i] === true ? 'got' : this.results[i] === false ? 'tried' : '');
      dots += `<span class="dot ${cls}"></span>`;
    }

    let question, pic = '', help = '';
    if (q.kind === 'name') {
      question = 'Bu parçanın adı ne?';
      pic = partArt(q.part.id);
    } else if (q.kind === 'role') {
      question = '"' + q.part.role + '"';
      help = 'Bu cümle hangi parçayı anlatıyor?';
    } else {
      question = q.part.name + ' bir giriş birimi mi, çıkış birimi mi?';
      pic = partArt(q.part.id);
      help = 'Giriş birimi bilgisayara bilgi gönderir. Çıkış birimi bilgiyi bize gösterir ya da duyurur.';
    }

    const options = q.options.map((opt) => {
      let label;
      if (q.kind === 'io') {
        label = opt === 'giris' ? 'Giriş Birimi' : 'Çıkış Birimi';
      } else if (q.kind === 'role') {
        label = `<span class="opt-pic">${partArt(opt)}</span>${PART[opt].name}`;
      } else {
        label = PART[opt].name;
      }
      return `<button class="btn opt" data-opt="${opt}">${label}</button>`;
    }).join('');

    box.innerHTML = `
      <div class="quiz-progress">${dots}</div>
      <div class="quiz-q">
        ${pic ? `<div class="q-pic">${pic}</div>` : ''}
        <div>
          <p class="q-text">${question}</p>
          ${help ? `<p class="q-help">${help}</p>` : ''}
        </div>
      </div>
      <div class="quiz-options">${options}</div>`;

    box.querySelectorAll('.opt').forEach((b) => {
      b.addEventListener('click', () => this.answer(b));
    });

    App.setStat('Soru: ' + (this.index + 1) + ' / ' + this.COUNT + '  •  Doğru: ' + this.score);
  },

  answer(button) {
    const q = this.questions[this.index];
    const correct = q.kind === 'io' ? q.part.type : q.part.id;
    const ok = button.getAttribute('data-opt') === correct;
    const box = document.getElementById('quiz-box');

    box.querySelectorAll('.opt').forEach((b) => {
      b.disabled = true;
      if (b.getAttribute('data-opt') === correct) {
        b.classList.add('right');
        b.insertAdjacentHTML('beforeend', ICONS.check.replace('<svg ', '<svg class="opt-mark" '));
      } else if (b === button) {
        b.classList.add('tried');
      }
    });

    const answerText = q.kind === 'io'
      ? q.part.name + ' bir ' + TYPE_NAMES[q.part.type] + 'dir. '
      : q.part.name + ': ';
    if (ok) {
      this.score++;
      Sound.good();
      Mascot.say(pick(PRAISE) + ' ' + answerText + q.part.role + ' ' + q.part.fact, 'cheer');
    } else {
      Sound.oops();
      Mascot.say(pick(ENCOURAGE) + ' Doğru cevap işaretli olan. ' + answerText + q.part.role, 'think');
    }
    this.results[this.index] = ok;

    const last = this.index === this.COUNT - 1;
    const next = html(`<button class="btn btn-orange btn-big quiz-next">${last ? 'Sonucu Gör' : 'Sonraki Soru'}</button>`);
    next.addEventListener('click', () => this.next());
    box.appendChild(next);
    App.setStat('Soru: ' + (this.index + 1) + ' / ' + this.COUNT + '  •  Doğru: ' + this.score);
  },

  next() {
    this.index++;
    if (this.index < this.COUNT) {
      this.render();
      return;
    }
    const stars = this.score >= 9 ? 3 : this.score >= 6 ? 2 : 1;
    App.finish(stars, this.COUNT + ' sorudan ' + this.score + ' tanesini doğru bildin!');
  }
};

App.modes.quiz = Quiz;
