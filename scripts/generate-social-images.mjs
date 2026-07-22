// Generates the branded social-preview and PWA icon assets from hand-built SVG
// source (sharp/libvips rasterizes the SVG — no external design tool needed).
// Re-run with `node scripts/generate-social-images.mjs` any time brand colors
// change or you want to regenerate these as placeholders.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.resolve(__dirname, '../public');

const ROCKET_PATH =
    'M128 320L24.5 320c-24.9 0-40.2-27.1-27.4-48.5L50 183.3C58.7 168.8 74.3 160 91.2 160l95 0c76.1-128.9 189.6-135.4 265.5-124.3 12.8 1.9 22.8 11.9 24.6 24.6 11.1 75.9 4.6 189.4-124.3 265.5l0 95c0 16.9-8.8 32.5-23.3 41.2l-88.2 52.9c-21.3 12.8-48.5-2.6-48.5-27.4L192 384c0-35.3-28.7-64-64-64l-.1 0zM400 160a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z';

const ACCENT = '#ff6a5b';
const ACCENT_2 = '#2db4a4';
const ACCENT_3 = '#f8c24e';
const DARK_BG = '#0c0d0f';
const DARK_SURFACE = '#16181d';
const TEXT = '#f6f6f6';
const MUTED = '#b4b8bd';

function gridLines(width, height, step) {
    let lines = '';
    for (let x = 0; x <= width; x += step) {
        lines += `<line x1="${x}" y1="0" x2="${x}" y2="${height}" />`;
    }
    for (let y = 0; y <= height; y += step) {
        lines += `<line x1="0" y1="${y}" x2="${width}" y2="${y}" />`;
    }
    return lines;
}

// Per-locale copy for the OG image. Tech-stack names and the domain stay in
// Latin script in both — matches how resources/js/i18n/ka.json itself treats
// proper nouns (e.g. hero.stack keeps "Laravel", "Vue 3", "TypeScript" as-is).
const OG_CONTENT = {
    en: {
        eyebrow: 'CUSTOM WEB DEVELOPMENT',
        eyebrowWidth: 286,
        taglineLine1: 'Custom websites &amp; web applications',
        taglineLine2: 'built to grow with your business.',
        techStack: ['Laravel', 'Vue.js', 'TypeScript', 'Inertia.js'],
        cardLabel: 'WS / STACK',
        metrics: [
            { value: '120+', label: 'PROJECTS' },
            { value: '99%', label: 'PERF SCORE' },
            { value: '5★', label: 'RATED' },
        ],
        statusText: 'Available for new projects',
        footerTag: 'NO TEMPLATES · BUILT TO SCALE',
    },
    ka: {
        eyebrow: 'მორგებული ვებ დეველოპმენტი',
        eyebrowWidth: 340,
        taglineLine1: 'მორგებული ვებსაიტები და ვებ',
        taglineLine2: 'აპლიკაციები თქვენი ბიზნესისთვის.',
        techStack: ['Laravel', 'Vue.js', 'TypeScript', 'Inertia.js'],
        cardLabel: 'WS / სტეკი',
        metrics: [
            { value: '120+', label: 'პროექტები' },
            { value: '99%', label: 'წარმადობა' },
            { value: '5★', label: 'რეიტინგი' },
        ],
        statusText: 'ვიღებთ ახალ პროექტებს',
        footerTag: 'შაბლონების გარეშე · მასშტაბირებადი',
    },
};

// Mirrors the real hero "dashboard card" visual on the site (grid bg, corner
// coords, status badge, metric row) so the shared preview is instantly
// recognizable as the same brand, not just a text-on-gradient placeholder.
function ogSvg(locale = 'en') {
    const c = OG_CONTENT[locale];
    const W = 1200;
    const H = 630;
    const FONT = 'Arial, Helvetica, sans-serif';

    // Right-side dashboard card
    const cardX = 700;
    const cardY = 150;
    const cardW = 420;
    const cardH = 330;
    const pad = 32;
    const innerX0 = cardX + pad;
    const innerX1 = cardX + cardW - pad;
    const colW = (innerX1 - innerX0) / 3;
    const metricCols = c.metrics
        .map((m, i) => {
            const cx = innerX0 + colW * i + colW / 2;
            return `
      <text x="${cx}" y="${cardY + 118}" text-anchor="middle" font-family="${FONT}" font-size="40" font-weight="800" fill="url(#accentText)">${m.value}</text>
      <text x="${cx}" y="${cardY + 144}" text-anchor="middle" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="1.5" fill="${MUTED}">${m.label}</text>`;
        })
        .join('');
    const dividers = [1, 2]
        .map((i) => {
            const x = innerX0 + colW * i;
            return `<line x1="${x}" y1="${cardY + 85}" x2="${x}" y2="${cardY + 150}" stroke="#ffffff" stroke-opacity="0.1" />`;
        })
        .join('');

    return `
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${DARK_BG}" />
      <stop offset="1" stop-color="${DARK_SURFACE}" />
    </linearGradient>
    <linearGradient id="accentText" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}" />
      <stop offset="1" stop-color="${ACCENT_3}" />
    </linearGradient>
    <linearGradient id="cardTopLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0" />
      <stop offset="0.5" stop-color="${ACCENT}" stop-opacity="0.9" />
      <stop offset="1" stop-color="${ACCENT_3}" stop-opacity="0" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="55%">
      <stop offset="0" stop-color="${ACCENT}" stop-opacity="0.25" />
      <stop offset="1" stop-color="${ACCENT}" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="glow2" cx="50%" cy="50%" r="55%">
      <stop offset="0" stop-color="${ACCENT_2}" stop-opacity="0.16" />
      <stop offset="1" stop-color="${ACCENT_2}" stop-opacity="0" />
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)" />
  <g stroke="#ffffff" stroke-opacity="0.04" stroke-width="1">${gridLines(W, H, 48)}</g>
  <circle cx="960" cy="140" r="360" fill="url(#glow)" />
  <circle cx="120" cy="560" r="320" fill="url(#glow2)" />

  <!-- Eyebrow pill -->
  <rect x="80" y="72" width="${c.eyebrowWidth}" height="38" rx="19" fill="${ACCENT}" fill-opacity="0.1" stroke="${ACCENT}" stroke-opacity="0.35" />
  <text x="102" y="97" font-family="${FONT}" font-size="14" font-weight="700" letter-spacing="1.5" fill="${ACCENT}">${c.eyebrow}</text>

  <!-- Wordmark -->
  <g transform="translate(80,138) scale(0.19)">
    <path fill="url(#accentText)" d="${ROCKET_PATH}" />
  </g>
  <text x="196" y="220" font-family="${FONT}" font-size="72" font-weight="800">
    <tspan fill="url(#accentText)">Web</tspan><tspan fill="${TEXT}">Savvys</tspan>
  </text>

  <text x="82" y="278" font-family="${FONT}" font-size="29" font-weight="500" fill="${MUTED}">${c.taglineLine1}</text>
  <text x="82" y="314" font-family="${FONT}" font-size="29" font-weight="500" fill="${MUTED}">${c.taglineLine2}</text>

  <text x="82" y="366" font-family="${FONT}" font-size="19" font-weight="700" letter-spacing="0.5" fill="${ACCENT_2}">${c.techStack[0]}</text>
  <circle cx="168" cy="361" r="2.5" fill="${MUTED}" />
  <text x="182" y="366" font-family="${FONT}" font-size="19" font-weight="700" letter-spacing="0.5" fill="${ACCENT_2}">${c.techStack[1]}</text>
  <circle cx="256" cy="361" r="2.5" fill="${MUTED}" />
  <text x="270" y="366" font-family="${FONT}" font-size="19" font-weight="700" letter-spacing="0.5" fill="${ACCENT_2}">${c.techStack[2]}</text>
  <circle cx="392" cy="361" r="2.5" fill="${MUTED}" />
  <text x="406" y="366" font-family="${FONT}" font-size="19" font-weight="700" letter-spacing="0.5" fill="${ACCENT_2}">${c.techStack[3]}</text>

  <line x1="82" y1="412" x2="82" y2="452" stroke="${ACCENT}" stroke-width="3" />
  <text x="100" y="437" font-family="${FONT}" font-size="27" font-weight="700" fill="${TEXT}">websavvys.com</text>

  <!-- Dashboard card -->
  <rect x="${cardX}" y="${cardY}" width="${cardW}" height="${cardH}" rx="18" fill="#ffffff" fill-opacity="0.025" stroke="#ffffff" stroke-opacity="0.14" />
  <rect x="${cardX + 24}" y="${cardY - 1}" width="${cardW - 48}" height="2" fill="url(#cardTopLine)" />

  <text x="${cardX + pad}" y="${cardY + 40}" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="1.5" fill="${MUTED}" fill-opacity="0.7">${c.cardLabel}</text>
  <text x="${cardX + cardW - pad}" y="${cardY + 40}" text-anchor="end" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="1.5" fill="${MUTED}" fill-opacity="0.7">2026</text>

  <line x1="${innerX0}" y1="${cardY + 60}" x2="${innerX1}" y2="${cardY + 60}" stroke="#ffffff" stroke-opacity="0.1" />
  ${metricCols}
  ${dividers}

  <line x1="${innerX0}" y1="${cardY + 178}" x2="${innerX1}" y2="${cardY + 178}" stroke="#ffffff" stroke-opacity="0.1" />

  <rect x="${innerX0}" y="${cardY + 202}" width="${innerX1 - innerX0}" height="52" rx="10" fill="${ACCENT_2}" fill-opacity="0.08" stroke="${ACCENT_2}" stroke-opacity="0.25" />
  <circle cx="${innerX0 + 22}" cy="${cardY + 228}" r="6" fill="${ACCENT_2}" />
  <text x="${innerX0 + 42}" y="${cardY + 233}" font-family="${FONT}" font-size="15" font-weight="700" letter-spacing="0.5" fill="${ACCENT_2}">${c.statusText}</text>

  <text x="${innerX0}" y="${cardY + 300}" font-family="${FONT}" font-size="12" font-weight="700" letter-spacing="1.5" fill="${MUTED}" fill-opacity="0.7">${c.footerTag}</text>
</svg>
`;
}

const ROCKET_VIEWBOX = 512; // ROCKET_PATH is authored in a 512x512 coordinate space

function iconSvg(size, { circular = false } = {}) {
    const rocketFraction = 0.43; // rocket occupies ~43% of the canvas, regardless of size
    const rocketSize = size * rocketFraction;
    const scale = rocketSize / ROCKET_VIEWBOX;
    const offset = (size - rocketSize) / 2;
    const clip = circular ? ` clip-path="url(#circle)"` : '';
    return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="${size}" y2="${size}" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="${ACCENT}" />
      <stop offset="1" stop-color="${ACCENT_3}" />
    </linearGradient>
    <clipPath id="circle">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" />
    </clipPath>
  </defs>
  <g${clip}>
    <rect width="${size}" height="${size}" fill="url(#bg)" />
    <g transform="translate(${offset},${offset}) scale(${scale})">
      <path fill="${DARK_BG}" d="${ROCKET_PATH}" />
    </g>
  </g>
</svg>
`;
}

await sharp(Buffer.from(ogSvg('en'))).jpeg({ quality: 90 }).toFile(path.join(publicDir, 'og-image.jpg'));
console.log('Generated public/og-image.jpg (1200x630, en)');

await sharp(Buffer.from(ogSvg('ka'))).jpeg({ quality: 90 }).toFile(path.join(publicDir, 'og-image-ka.jpg'));
console.log('Generated public/og-image-ka.jpg (1200x630, ka)');

await sharp(Buffer.from(iconSvg(512))).png().toFile(path.join(publicDir, 'android-chrome-512x512.png'));
console.log('Generated public/android-chrome-512x512.png (512x512)');

await sharp(Buffer.from(iconSvg(192))).png().toFile(path.join(publicDir, 'android-chrome-192x192.png'));
console.log('Generated public/android-chrome-192x192.png (192x192)');

await sharp(Buffer.from(iconSvg(192, { circular: true }))).png().toFile(path.join(publicDir, 'favicon.png'));
console.log('Generated public/favicon.png (192x192, circular)');
