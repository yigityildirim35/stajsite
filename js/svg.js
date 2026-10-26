/* Parça ve simge çizimleri. Hepsi elle çizilmiş SVG'dir:
   internet gerektirmez ve telif sorunu yoktur. */
const INK = '#3d3a6b';
const S = 'stroke="' + INK + '" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"';
const LABEL = 'text-anchor="middle" font-weight="800" font-family="Verdana, sans-serif"';

function svgWrap(inner, viewBox) {
  return '<svg viewBox="' + (viewBox || '0 0 100 100') + '" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + inner + '</svg>';
}

const PART_ART = {
  cpu() {
    let pins = '';
    for (let i = 0; i < 5; i++) {
      const p = 28 + i * 11;
      pins += `<line x1="${p}" y1="10" x2="${p}" y2="18"/><line x1="${p}" y1="82" x2="${p}" y2="90"/>` +
              `<line x1="10" y1="${p}" x2="18" y2="${p}"/><line x1="82" y1="${p}" x2="90" y2="${p}"/>`;
    }
    return svgWrap(`<g stroke="#e0a930" stroke-width="3" stroke-linecap="round">${pins}</g>
      <rect x="18" y="18" width="64" height="64" rx="8" fill="#d6dcef" ${S}/>
      <rect x="31" y="31" width="38" height="38" rx="5" fill="#8c97c4" ${S}/>
      <text x="50" y="55" font-size="13" fill="#fff" ${LABEL}>CPU</text>`);
  },

  ram() {
    let chips = '', pins = '';
    for (let i = 0; i < 4; i++) chips += `<rect x="${13 + i * 20}" y="38" width="14" height="14" rx="2" fill="#4b4f6b"/>`;
    for (let i = 0; i < 14; i++) pins += `<rect x="${11 + i * 6}" y="58" width="3.5" height="6" fill="#f2c14e"/>`;
    return svgWrap(`<rect x="6" y="32" width="88" height="34" rx="4" fill="#7fd1a8" ${S}/>${chips}${pins}`);
  },

  ssd() {
    return svgWrap(`<rect x="12" y="24" width="76" height="52" rx="9" fill="#9fb6e8" ${S}/>
      <rect x="22" y="35" width="44" height="22" rx="4" fill="#fff" ${S}/>
      <text x="44" y="51" font-size="12" fill="${INK}" ${LABEL}>SSD</text>
      <rect x="74" y="40" width="8" height="20" rx="2" fill="#f2c14e" ${S}/>
      <circle cx="24" cy="67" r="3" fill="${INK}"/>`);
  },

  gpu() {
    const fan = (cx) => `<circle cx="${cx}" cy="47" r="14" fill="#c9cfe0" ${S}/>
      <g stroke="${INK}" stroke-width="2.5" stroke-linecap="round"><line x1="${cx}" y1="37" x2="${cx}" y2="57"/><line x1="${cx - 10}" y1="47" x2="${cx + 10}" y2="47"/></g>
      <circle cx="${cx}" cy="47" r="4" fill="${INK}"/>`;
    return svgWrap(`<rect x="2" y="22" width="7" height="54" rx="2" fill="#c9cfe0" ${S}/>
      <rect x="20" y="68" width="48" height="8" rx="1" fill="#f2c14e" ${S}/>
      <rect x="8" y="26" width="88" height="44" rx="7" fill="#6474a3" ${S}/>${fan(32)}${fan(70)}`);
  },

  psu() {
    return svgWrap(`<path d="M80 62 C 92 70, 92 84, 78 90" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <rect x="10" y="20" width="76" height="58" rx="7" fill="#a3acc4" ${S}/>
      <circle cx="44" cy="49" r="20" fill="#6b7390" ${S}/>
      <g stroke="#c9cfe0" stroke-width="2"><line x1="30" y1="42" x2="58" y2="42"/><line x1="26" y1="49" x2="62" y2="49"/><line x1="30" y1="56" x2="58" y2="56"/></g>
      <path d="M74 28 L67 41 L73 41 L69 52 L79 37 L73 37 Z" fill="#ffd166" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`);
  },

  fan() {
    let blades = '';
    for (let a = 0; a < 360; a += 90) {
      blades += `<ellipse cx="50" cy="33" rx="9" ry="15" fill="#8fa2e6" ${S} transform="rotate(${a} 50 50)"/>`;
    }
    const screws = [[20, 20], [80, 20], [20, 80], [80, 80]]
      .map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3" fill="${INK}"/>`).join('');
    return svgWrap(`<rect x="10" y="10" width="80" height="80" rx="16" fill="#b9c6f0" ${S}/>
      <circle cx="50" cy="50" r="33" fill="#eef2ff" ${S}/>
      <g class="blades">${blades}<circle cx="50" cy="50" r="8" fill="${INK}"/></g>${screws}`);
  },

  motherboard() {
    return svgWrap(`<rect x="8" y="8" width="84" height="84" rx="6" fill="#6cc49a" ${S}/>
      <g stroke="#4fa57d" stroke-width="2" fill="none"><path d="M16 30 H26 V58"/><path d="M70 16 V38 H84"/><path d="M20 84 V78 H44"/></g>
      <rect x="32" y="18" width="28" height="28" rx="3" fill="#d6dcef" ${S}/>
      <rect x="66" y="46" width="20" height="4" fill="${INK}"/><rect x="66" y="55" width="20" height="4" fill="${INK}"/>
      <rect x="18" y="66" width="58" height="5" fill="${INK}"/>
      <rect x="62" y="76" width="14" height="10" rx="2" fill="#4b4f6b"/>`);
  },

  case() {
    return svgWrap(`<rect x="26" y="6" width="48" height="88" rx="8" fill="#a7b4d9" ${S}/>
      <rect x="33" y="14" width="34" height="8" rx="3" fill="#7d89b3" ${S}/>
      <rect x="33" y="27" width="34" height="8" rx="3" fill="#7d89b3" ${S}/>
      <g stroke="${INK}" stroke-width="2.5" stroke-linecap="round"><line x1="36" y1="50" x2="64" y2="50"/><line x1="36" y1="57" x2="64" y2="57"/><line x1="36" y1="64" x2="64" y2="64"/><line x1="36" y1="71" x2="64" y2="71"/></g>
      <circle cx="50" cy="83" r="5" fill="#5ccfa4" ${S}/>`);
  },

  keyboard() {
    let keys = '';
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 8; c++) keys += `<rect x="${12 + c * 10}" y="${36 + r * 9}" width="7" height="6" rx="1.5" fill="#fff"/>`;
    }
    return svgWrap(`<rect x="4" y="28" width="92" height="48" rx="7" fill="#9aa5cc" ${S}/>${keys}
      <rect x="28" y="64" width="44" height="6" rx="2" fill="#fff"/>`);
  },

  mouse() {
    return svgWrap(`<path d="M50 18 C 50 8, 62 6, 66 2" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <rect x="30" y="18" width="40" height="70" rx="20" fill="#e3e7f5" ${S}/>
      <line x1="50" y1="18" x2="50" y2="44" stroke="${INK}" stroke-width="3"/>
      <line x1="30" y1="44" x2="70" y2="44" stroke="${INK}" stroke-width="3"/>
      <rect x="46" y="26" width="8" height="12" rx="4" fill="#ff9f43" ${S}/>`);
  },

  microphone() {
    return svgWrap(`<path d="M28 42 Q28 68 50 68 Q72 68 72 42" fill="none" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
      <line x1="50" y1="68" x2="50" y2="84" stroke="${INK}" stroke-width="4"/>
      <rect x="32" y="82" width="36" height="8" rx="4" fill="#a7b4d9" ${S}/>
      <rect x="36" y="8" width="28" height="48" rx="14" fill="#b0b8d6" ${S}/>
      <g stroke="${INK}" stroke-width="2" opacity=".5"><line x1="40" y1="22" x2="60" y2="22"/><line x1="38" y1="30" x2="62" y2="30"/><line x1="38" y1="38" x2="62" y2="38"/></g>`);
  },

  webcam() {
    return svgWrap(`<path d="M34 86 L42 66 L58 66 L66 86 Z" fill="#a7b4d9" ${S}/>
      <circle cx="50" cy="40" r="28" fill="#4e5578" ${S}/>
      <circle cx="50" cy="40" r="13" fill="#9fd3ff" ${S}/>
      <circle cx="50" cy="40" r="5" fill="${INK}"/>
      <circle cx="54" cy="36" r="2" fill="#fff"/>
      <circle cx="68" cy="24" r="3" fill="#5ccfa4"/>`);
  },

  scanner() {
    return svgWrap(`<path d="M10 46 L20 22 L90 22 L90 46 Z" fill="#b9c3e3" ${S}/>
      <rect x="8" y="46" width="84" height="32" rx="6" fill="#d2d8ea" ${S}/>
      <rect x="16" y="52" width="68" height="6" rx="3" fill="#7fd6ff"/>
      <circle cx="80" cy="69" r="4" fill="#5ccfa4" ${S}/>`);
  },

  monitor() {
    return svgWrap(`<rect x="44" y="68" width="12" height="14" fill="#a7b4d9" ${S}/>
      <rect x="28" y="80" width="44" height="8" rx="4" fill="#a7b4d9" ${S}/>
      <rect x="6" y="12" width="88" height="58" rx="7" fill="#5b6aa0" ${S}/>
      <rect x="13" y="18" width="74" height="45" rx="3" fill="#bfe6ff"/>
      <path d="M13 63 L40 38 L55 52 L64 44 L87 63 Z" fill="#7fd1a8"/>
      <circle cx="72" cy="29" r="6" fill="#ffd166"/>`);
  },

  speaker() {
    return svgWrap(`<rect x="26" y="8" width="48" height="84" rx="10" fill="#8a93b8" ${S}/>
      <circle cx="50" cy="28" r="9" fill="#4e5578" ${S}/><circle cx="50" cy="28" r="3" fill="#c9cfe0"/>
      <circle cx="50" cy="62" r="18" fill="#4e5578" ${S}/><circle cx="50" cy="62" r="7" fill="#c9cfe0"/>`);
  },

  printer() {
    return svgWrap(`<rect x="26" y="10" width="48" height="30" fill="#fff" ${S}/>
      <rect x="8" y="36" width="84" height="36" rx="7" fill="#d2d8ea" ${S}/>
      <circle cx="80" cy="46" r="4" fill="#5ccfa4" ${S}/>
      <rect x="22" y="56" width="56" height="6" rx="2" fill="${INK}"/>
      <rect x="26" y="60" width="48" height="30" fill="#fff" ${S}/>
      <g stroke="#9aa5cc" stroke-width="2.5" stroke-linecap="round"><line x1="33" y1="70" x2="67" y2="70"/><line x1="33" y1="77" x2="60" y2="77"/></g>`);
  },

  headphones() {
    const band = 'M20 58 Q20 14 50 14 Q80 14 80 58';
    return svgWrap(`<path d="${band}" fill="none" stroke="${INK}" stroke-width="11" stroke-linecap="round"/>
      <path d="${band}" fill="none" stroke="#9b8cff" stroke-width="5" stroke-linecap="round"/>
      <rect x="10" y="50" width="20" height="34" rx="9" fill="#ff9f8a" ${S}/>
      <rect x="70" y="50" width="20" height="34" rx="9" fill="#ff9f8a" ${S}/>`);
  },

  projector() {
    return svgWrap(`<rect x="16" y="70" width="10" height="8" rx="2" fill="${INK}"/><rect x="74" y="70" width="10" height="8" rx="2" fill="${INK}"/>
      <rect x="8" y="34" width="84" height="38" rx="10" fill="#e3e7f5" ${S}/>
      <circle cx="32" cy="53" r="13" fill="#9fd3ff" ${S}/><circle cx="32" cy="53" r="5" fill="${INK}"/>
      <g stroke="${INK}" stroke-width="2.5" stroke-linecap="round"><line x1="56" y1="46" x2="82" y2="46"/><line x1="56" y1="53" x2="82" y2="53"/><line x1="56" y1="60" x2="82" y2="60"/></g>`);
  }
};

/* Arayüz simgeleri. Renkleri "currentColor" ile yazının renginden alır. */
const ICONS = {
  home: svgWrap(`<path d="M12 48 L50 14 L88 48" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M24 46 V86 H76 V46" fill="none" stroke="currentColor" stroke-width="11" stroke-linejoin="round"/>`),

  soundOn: svgWrap(`<path d="M14 38 H32 L54 18 V82 L32 62 H14 Z" fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
    <path d="M66 36 Q76 50 66 64 M77 25 Q94 50 77 75" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`),

  soundOff: svgWrap(`<path d="M14 38 H32 L54 18 V82 L32 62 H14 Z" fill="currentColor" stroke="currentColor" stroke-width="6" stroke-linejoin="round"/>
    <path d="M66 38 L88 62 M88 38 L66 62" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>`),

  full: svgWrap(`<path d="M14 38 V14 H38 M62 14 H86 V38 M86 62 V86 H62 M38 86 H14 V62" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`),

  replay: svgWrap(`<path d="M78 50 A28 28 0 1 1 64 26" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>
    <path d="M56 10 L72 26 L52 36" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`),

  power: svgWrap(`<path d="M32 28 A30 30 0 1 0 68 28" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>
    <line x1="50" y1="12" x2="50" y2="48" stroke="currentColor" stroke-width="11" stroke-linecap="round"/>`),

  check: svgWrap(`<path d="M16 52 L40 76 L86 26" fill="none" stroke="currentColor" stroke-width="14" stroke-linecap="round" stroke-linejoin="round"/>`),

  star: svgWrap(`<path d="M50 6 L62 36 L94 38 L69 59 L77 92 L50 74 L23 92 L31 59 L6 38 L38 36 Z" fill="currentColor" stroke="${INK}" stroke-width="5" stroke-linejoin="round"/>`),

  build: svgWrap(`<rect x="8" y="10" width="62" height="80" rx="8" fill="#a7b4d9" ${S}/>
    <rect x="16" y="18" width="46" height="46" rx="4" fill="#6cc49a" ${S}/>
    <rect x="28" y="28" width="20" height="20" rx="3" fill="#d6dcef" ${S}/>
    <circle cx="39" cy="78" r="5" fill="#5ccfa4" ${S}/>
    <rect x="52" y="48" width="40" height="40" rx="6" fill="#d6dcef" ${S} transform="rotate(12 72 68)"/>
    <text x="72" y="73" font-size="11" fill="${INK}" ${LABEL} transform="rotate(12 72 68)">CPU</text>`),

  match: svgWrap(`<rect x="8" y="18" width="46" height="64" rx="9" fill="#fff" ${S} transform="rotate(-10 31 50)"/>
    <rect x="46" y="18" width="46" height="64" rx="9" fill="#9b8cff" ${S} transform="rotate(10 69 50)"/>
    <text x="69" y="62" font-size="30" fill="#fff" ${LABEL} transform="rotate(10 69 50)">?</text>
    <g transform="rotate(-10 31 50) translate(14 34) scale(.34)"><rect x="18" y="18" width="64" height="64" rx="8" fill="#d6dcef" stroke="${INK}" stroke-width="6"/><rect x="31" y="31" width="38" height="38" rx="5" fill="#8c97c4"/></g>`),

  quiz: svgWrap(`<path d="M14 16 H86 Q92 16 92 22 V64 Q92 70 86 70 H44 L26 86 L28 70 H14 Q8 70 8 64 V22 Q8 16 14 16 Z" fill="#fff" ${S}/>
    <text x="50" y="59" font-size="44" fill="#5aa9f0" ${LABEL}>?</text>`),

  sort: svgWrap(`<rect x="34" y="26" width="32" height="48" rx="6" fill="#a7b4d9" ${S}/>
    <path d="M4 36 H24 M16 28 L26 36 L16 44" fill="none" stroke="#2fae7d" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M74 64 H94 M86 56 L96 64 L86 72" fill="none" stroke="#e07f22" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="50" cy="64" r="4" fill="#5ccfa4" ${S}/>`),

  ioIn: svgWrap(`<rect x="56" y="18" width="36" height="64" rx="7" fill="#a7b4d9" ${S}/>
    <circle cx="74" cy="70" r="4" fill="#5ccfa4" ${S}/>
    <path d="M6 50 H44 M32 36 L46 50 L32 64" fill="none" stroke="#2fae7d" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`),

  ioOut: svgWrap(`<rect x="8" y="18" width="36" height="64" rx="7" fill="#a7b4d9" ${S}/>
    <circle cx="26" cy="70" r="4" fill="#5ccfa4" ${S}/>
    <path d="M54 50 H92 M80 36 L94 50 L80 64" fill="none" stroke="#e07f22" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`)
};

function partArt(id) {
  return PART_ART[id]();
}
