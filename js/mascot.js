/* Bitbit: oyun boyunca ipucu ve tebrik veren sevimli robot */
const Mascot = {
  el: null,
  bubble: null,
  text: null,

  art: svgWrap(`
    <line x1="60" y1="22" x2="60" y2="9" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <circle class="bulb" cx="60" cy="8" r="7" fill="#ffd166" stroke="${INK}" stroke-width="4"/>
    <rect x="7" y="44" width="14" height="24" rx="6" fill="#ff9f43" stroke="${INK}" stroke-width="4"/>
    <rect x="99" y="44" width="14" height="24" rx="6" fill="#ff9f43" stroke="${INK}" stroke-width="4"/>
    <path d="M36 98 Q20 100 15 86" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path class="arm-r" d="M84 98 Q100 96 105 82" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <rect x="34" y="86" width="52" height="42" rx="15" fill="#ff9f43" stroke="${INK}" stroke-width="4"/>
    <circle cx="60" cy="107" r="8" fill="#ffd166" stroke="${INK}" stroke-width="3"/>
    <rect x="18" y="22" width="84" height="66" rx="24" fill="#8fd3ff" stroke="${INK}" stroke-width="4"/>
    <rect x="29" y="34" width="62" height="42" rx="15" fill="${INK}"/>
    <ellipse class="eye" cx="47" cy="51" rx="6" ry="7" fill="#7ff0c4"/>
    <ellipse class="eye" cx="73" cy="51" rx="6" ry="7" fill="#7ff0c4"/>
    <circle cx="37" cy="66" r="4" fill="#ff8fab"/>
    <circle cx="83" cy="66" r="4" fill="#ff8fab"/>
    <path class="mouth m-happy" d="M50 63 Q60 71 70 63" fill="none" stroke="#7ff0c4" stroke-width="4" stroke-linecap="round"/>
    <path class="mouth m-think" d="M53 66 Q60 63 67 66" fill="none" stroke="#7ff0c4" stroke-width="4" stroke-linecap="round"/>
    <path class="mouth m-cheer" d="M48 61 Q60 76 72 61 Z" fill="#7ff0c4" stroke="#7ff0c4" stroke-width="3" stroke-linejoin="round"/>
  `, '0 0 120 134'),

  init() {
    this.el = document.getElementById('mascot');
    this.bubble = document.getElementById('bubble');
    this.text = document.getElementById('bubble-text');
    this.el.innerHTML = this.art;
  },

  /* mood: 'happy' (normal), 'think' (ipucu verirken), 'cheer' (tebrik ederken) */
  say(message, mood) {
    this.text.textContent = message;
    this.el.className = '';
    this.bubble.classList.remove('pop');
    // Animasyonların yeniden başlaması için tarayıcının bir kare çizmesini bekle
    void this.el.offsetWidth;
    this.el.className = mood || 'happy';
    this.bubble.classList.add('pop');
  }
};
