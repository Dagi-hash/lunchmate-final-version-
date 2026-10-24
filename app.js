'use strict';
const KEY = 'lunchmate.v1';
const APP_VER = '2.1.0';
const FRESH = (() => { try { return !localStorage.getItem(KEY); } catch (e) { return false; } })();
const CATS = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Drink'];
const DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAYS_AM = ['እሑድ', 'ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'ዓርብ', 'ቅዳሜ'];
const MON_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MON_AM = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];
const WD_ORDER = [1, 2, 3, 4, 5, 6, 0];
const svg = (p, w, extra) => `<svg viewBox="0 0 24 24" width="${w}" height="${w}" fill="none" stroke="currentColor" stroke-width="${extra || 2.2}" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
const CHECK = svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 14, 3.5);
const PILL = svg('<path d="M10.5 20.5l-7-7a4.95 4.95 0 117-7l7 7a4.95 4.95 0 11-7 7zM8.5 8.5l7 7"/>', 12);
const BELL = svg('<path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 004 0"/>', 11);
const TRASH = svg('<path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2M6 6l1 14a2 2 0 002 2h6a2 2 0 002-2l1-14M10 11v6M14 11v6"/>', 18, 2);
const CHEV = svg('<path d="M9 5l7 7-7 7"/>', 18, 2.4);
const BACK = svg('<path d="M15 5l-7 7 7 7"/>', 20, 2.4);
const BKSP = svg('<path d="M21 5H9l-6 7 6 7h12a1 1 0 001-1V6a1 1 0 00-1-1zM17 9.5l-5 5M12 9.5l5 5"/>', 26, 2);
const TICK = svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 28, 3);
const CAT_ICO = {
    Breakfast: svg('<path d="M5 9h11v5a5 5 0 01-5 5h-1a5 5 0 01-5-5V9zM16 10h1.5a2.5 2.5 0 010 5H16M8 3.5v2M12 3.5v2"/>', 14, 1.8),
    Lunch: svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.6"/>', 14, 1.8),
    Snack: svg('<path d="M12 8c-2.2-2-6-1-6 3.6 0 4 2 8.4 4 8.4 1 0 1.5-.5 2-.5s1 .5 2 .5c2 0 4-4.4 4-8.4C18 7 14.2 6 12 8zM12 8c0-2 1-3.2 3-3.6"/>', 14, 1.8),
    Dinner: svg('<path d="M20 14.5A8 8 0 019.5 4 8 8 0 1020 14.5z"/>', 14, 1.8),
    Drink: svg('<path d="M7 4h10l-1.2 16H8.2L7 4zM7.4 10h9.2"/>', 14, 1.8)
};
const REPEAT = svg('<path d="M17 3l3 3-3 3M20 6H9a5 5 0 00-5 5M7 21l-3-3 3-3M4 18h11a5 5 0 005-5"/>', 11, 2);
function ring(done, total, size) {
    size = size || 38;
    const C = 81.68, off = (C * (1 - (total ? done / total : 0))).toFixed(2);
    return `<svg viewBox="0 0 36 36" width="${size}" height="${size}"><circle cx="18" cy="18" r="13" fill="none" stroke="var(--track)" stroke-width="3"/><circle cx="18" cy="18" r="13" fill="none" stroke="var(--fill)" stroke-width="3" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 18 18)"/><text x="18" y="21" text-anchor="middle" font-size="8.5" fill="var(--fg)">${done}/${total}</text></svg>`;
}
const CAT_COL = { Breakfast: '#F2A93B', Lunch: '#4CAF7D', Snack: '#E0709A', Dinner: '#6C7BD9', Drink: '#3AA7D9' };
const COPY = svg('<rect x="9" y="9" width="11" height="11" rx="3"/><path d="M5 15V7a3 3 0 013-3h8"/>', 18, 1.9);
const PLATE_ART = svg('<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="3.4"/><path d="M2.5 6v6M4.6 6v6M3.5 12v6M21 6c-1.2 1-1.8 3-1.8 5h1.8v7"/>', 26, 1.3);
const STAR = Array.from({ length: 10 }, (_, i) => { const a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 1.5 : 3.6; return (12 + r * Math.cos(a)).toFixed(2) + ',' + (12 + r * Math.sin(a)).toFixed(2); }).join(' ');
const FLAG_US = `<svg viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="cu"><circle cx="12" cy="12" r="12"/></clipPath></defs><g clip-path="url(#cu)"><rect width="24" height="24" fill="#fff"/>${[0, 2, 4, 6, 8, 10, 12].map(i => `<rect y="${(i * 24 / 13).toFixed(2)}" width="24" height="${(24 / 13).toFixed(2)}" fill="#B22234"/>`).join('')}<rect width="11" height="${(24 * 7 / 13).toFixed(2)}" fill="#3C3B6E"/>${[0, 1, 2].map(i => [0, 1, 2].map(j => `<circle cx="${(2.2 + i * 3.4).toFixed(1)}" cy="${(2 + j * 3.4).toFixed(1)}" r=".6" fill="#fff"/>`).join('')).join('')}</g></svg>`;
const FLAG_ET = `<svg viewBox="0 0 24 24" width="24" height="24"><defs><clipPath id="ce"><circle cx="12" cy="12" r="12"/></clipPath></defs><g clip-path="url(#ce)"><rect width="24" height="8" fill="#078930"/><rect y="8" width="24" height="8" fill="#FCDD09"/><rect y="16" width="24" height="8" fill="#DA121D"/><circle cx="12" cy="12" r="5.4" fill="#0F47AF"/><polygon points="${STAR}" fill="#FCDD09"/></g></svg>`;
const isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());
const P = isNative ? window.Capacitor.Plugins : {};

/* ---------- name translation (English <-> Amharic script) ---------- */
const NAME_DICT = [
    ['Dagim', 'ዳግም'], ['Mekonnen', 'መኮንን'], ['Tigist', 'ትግስት'], ['Kidist', 'ቅድስት'], ['Selam', 'ሰላም'], ['Abebe', 'አበበ'], ['Bereket', 'በረከት'],
    ['Birhan', 'ብርሃን'], ['Girma', 'ግርማ'], ['Mulugeta', 'ሙሉጌታ'], ['Alemayehu', 'ዓለማየሁ'], ['Tadesse', 'ታደሰ'], ['Haile', 'ኃይሌ'], ['Yohannes', 'ዮሐንስ'],
    ['Meron', 'ሜሮን'], ['Hana', 'ሐና'], ['Rahel', 'ራሄል'], ['Sara', 'ሳራ'], ['Eden', 'ኤደን'], ['Biruk', 'ብሩክ'], ['Fitsum', 'ፍጹም'], ['Mihret', 'ምህረት'],
    ['Hiwot', 'ሕይወት'], ['Marta', 'ማርታ'], ['Selamawit', 'ሰላማዊት'], ['Meseret', 'መሠረት'], ['Tsion', 'ጽዮን'], ['Lidya', 'ሊዲያ'], ['Samuel', 'ሳሙኤል'],
    ['Daniel', 'ዳንኤል'], ['Dawit', 'ዳዊት'], ['Yonas', 'ዮናስ'], ['Elias', 'ኤልያስ'], ['Henok', 'ሄኖክ'], ['Nahom', 'ናሆም'], ['Kaleb', 'ካሌብ'], ['Abel', 'አቤል'],
    ['Yared', 'ያሬድ'], ['Amanuel', 'አማኑኤል'], ['Bethlehem', 'ቤተልሔም'], ['Betelhem', 'ቤተልሔም'], ['Helen', 'ሄለን'], ['Saron', 'ሳሮን'], ['Mekdes', 'መቅደስ'],
    ['Tsehay', 'ፀሐይ'], ['Almaz', 'አልማዝ'], ['Genet', 'ገነት'], ['Zelalem', 'ዘላለም'], ['Eyob', 'ኢዮብ'], ['Mikias', 'ሚክያስ'], ['Natnael', 'ናትናኤል'],
    ['Robel', 'ሮቤል'], ['Ruth', 'ሩት'], ['Hermon', 'ሄርሞን'], ['Yosef', 'ዮሴፍ'], ['Solomon', 'ሰሎሞን'], ['Tewodros', 'ቴዎድሮስ'], ['Tekle', 'ተክሌ'],
    ['Sisay', 'ሲሳይ'], ['Fikir', 'ፍቅር'], ['Senait', 'ሰናይት'], ['Biniam', 'ቢኒያም'], ['Kidan', 'ኪዳን'], ['Efrem', 'ኤፍሬም']
];
function latToEth(str) {
    const C = { b: 0x1260, c: 0x12A8, d: 0x12F0, f: 0x1348, g: 0x1308, h: 0x1200, j: 0x1300, k: 0x12A8, l: 0x1208, m: 0x1218, n: 0x1290, p: 0x1350, q: 0x1240, r: 0x1228, s: 0x1230, t: 0x1270, v: 0x1268, w: 0x12C8, x: 0x12A8, y: 0x12E8, z: 0x12D8 };
    const D = { sh: 0x1238, ch: 0x1278, ts: 0x1338, th: 0x1270, ph: 0x1348, kh: 0x12B8, zh: 0x12E0, ny: 0x1298, gn: 0x1298 };
    const V = { a: 3, e: 0, i: 2, o: 6, u: 1 };
    const G = { a: 0x12A0, e: 0x12A4, i: 0x12A2, o: 0x12A6, u: 0x12A1 };
    return String(str).split(/(\s+|-)/).map(w => {
        if (!w || /^\s+$|^-$/.test(w)) return w;
        w = w.toLowerCase();
        const hit = NAME_DICT.find(e => e[0].toLowerCase() === w);
        if (hit) return hit[1];
        let out = '', i = 0; const n = w.length;
        while (i < n) {
            const ch = w[i]; let cons = null;
            const two = w.substr(i, 2);
            if (D[two] !== undefined) { cons = D[two]; i += 2; }
            else if (C[ch] !== undefined) { cons = C[ch]; i++; while (w[i] === ch) i++; }
            else if (G[ch] !== undefined) { out += String.fromCodePoint(G[ch]); i++; continue; }
            else { out += ch; i++; continue; }
            const v = w[i];
            if (v !== undefined && V[v] !== undefined) {
                const nx = w[i + 1];
                const bare = v === 'i' && nx !== undefined && nx !== 'y' && (C[nx] !== undefined);
                out += String.fromCodePoint(cons + (bare ? 5 : V[v])); i++;
            } else out += String.fromCodePoint(cons + 5);
        }
        return out;
    }).join('');
}
function ethToLat(str) {
    const B = { 0x1200: 'h', 0x1208: 'l', 0x1210: 'h', 0x1218: 'm', 0x1220: 's', 0x1228: 'r', 0x1230: 's', 0x1238: 'sh', 0x1240: 'k', 0x1260: 'b', 0x1268: 'v', 0x1270: 't', 0x1278: 'ch', 0x1280: 'h', 0x1290: 'n', 0x1298: 'ny', 0x12A8: 'k', 0x12B8: 'kh', 0x12C8: 'w', 0x12D8: 'z', 0x12E0: 'zh', 0x12E8: 'y', 0x12F0: 'd', 0x1300: 'j', 0x1308: 'g', 0x1320: 't', 0x1328: 'ch', 0x1330: 'p', 0x1338: 'ts', 0x1340: 'ts', 0x1348: 'f', 0x1350: 'p' };
    const VO = ['e', 'u', 'i', 'a', 'e', '', 'o'], GL = ['a', 'u', 'i', 'a', 'e', 'e', 'o'];
    return String(str).split(/(\s+)/).map(w => {
        if (!w || /^\s+$/.test(w)) return w;
        const hit = NAME_DICT.find(e => e[1] === w);
        if (hit) return hit[0];
        const toks = [];
        Array.from(w).forEach(ch => {
            const c = ch.codePointAt(0);
            if (c < 0x1200 || c > 0x137F) { toks.push({ c: ch, v: '', raw: true }); return; }
            for (const g of [0x12A0, 0x12D0]) if (c >= g && c < g + 7) { toks.push({ c: '', v: GL[c - g] }); return; }
            const base = c - ((c - 0x1200) % 8), row = B[base];
            if (row === undefined) { toks.push({ c: ch, v: '', raw: true }); return; }
            const v = VO[c - base] || '';
            toks.push({ c: row, v, bare: v === '' });
        });
        let out = '';
        toks.forEach((tk, i) => {
            out += tk.c + tk.v;
            if (!tk.bare || !tk.c) return;
            const nx = toks[i + 1], nn = toks[i + 2];
            let add = false;
            if (i === 0 && toks.length > 1) add = true;
            else if (nx && nx.bare && nx.c && nn && nn.bare && nn.c) add = true;
            else if (i > 0 && nx && nx.bare && nx.c && !nn && nx.c !== tk.c && !/[ts]$/.test(nx.c)) add = true;
            if (add) out += 'i';
        });
        return out;
    }).join('');
}
const capWords = x => x.replace(/(^|\s|-)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
function setNamesFrom(raw) {
    raw = String(raw).trim().slice(0, 30);
    const eth = /[\u1200-\u137F]/.test(raw);
    S.names = eth ? { am: raw, en: capWords(ethToLat(raw)) } : { en: raw, am: latToEth(raw) };
    S.name = raw;
}
const dispName = () => (S.names && S.names[lang]) || S.name || '';

/* ---------- helpers ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pad = n => String(n).padStart(2, '0');
const key = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const parse = k => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const monday = d => addDays(d, -((d.getDay() + 6) % 7));
const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };

/* Gregorian -> Ethiopian calendar */
function toEth(d) {
    const a = Math.floor((14 - (d.getMonth() + 1)) / 12), yy = d.getFullYear() + 4800 - a, mm = d.getMonth() + 1 + 12 * a - 3;
    const jdn = d.getDate() + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
    const r = (jdn - 1723856) % 1461, n = (r % 365) + 365 * Math.floor(r / 1460);
    return { y: 4 * Math.floor((jdn - 1723856) / 1461) + Math.floor(r / 365) - Math.floor(r / 1460), m: Math.floor(n / 30) + 1, d: (n % 30) + 1 };
}

/* ---------- state ---------- */
let S = null;
try { S = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
S = Object.assign({ mode: 'weekly', offset: 0, meals: {}, extra: {}, hidden: [], days: {}, ensured: '', theme: 'light', pal: 'classic', lang: 'en', allergies: [], memory: {}, items: {}, nextId: 100, series: {}, favs: [], shop: {}, sum: { on: false, t: '' }, sumFired: '', dk: 'black', welcomed: false, seenVer: '', lock: { on: false, salt: '', p: '', ph: '' }, name: '', names: { en: '', am: '' }, asked: false }, S || {});
function fixState() {
    if (!S.meals || typeof S.meals !== 'object') S.meals = {};
    if (!S.extra || typeof S.extra !== 'object') S.extra = {};
    if (!Array.isArray(S.hidden)) S.hidden = [];
    if (!S.days || typeof S.days !== 'object') S.days = {};
    if (!Array.isArray(S.allergies)) S.allergies = [];
    if (!S.memory || typeof S.memory !== 'object') S.memory = {};
    if (!S.items || typeof S.items !== 'object') S.items = {};
    if (!S.series || typeof S.series !== 'object') S.series = {};
    if (!Array.isArray(S.favs)) S.favs = [];
    if (!S.shop || typeof S.shop !== 'object') S.shop = {};
    if (!S.sum || typeof S.sum !== 'object') S.sum = { on: false, t: '' };
    if (typeof S.nextId !== 'number') S.nextId = 100;
    if (typeof S.name !== 'string') S.name = '';
    if (!S.names || typeof S.names !== 'object') S.names = { en: '', am: '' };
    if (!S.lock || typeof S.lock !== 'object') S.lock = { on: false, salt: '', p: '', ph: '' };
}
fixState();
if (S.satWeeks) { Object.keys(S.satWeeks).forEach(w => { S.extra[w] = Object.assign({}, S.extra[w], { 6: true }); }); delete S.satWeeks; }
if (S.theme !== 'dark') S.theme = 'light';
if (S.lang !== 'am') S.lang = 'en';
if (S.dk !== 'grey') S.dk = 'black';
const PALS = {
    classic: { n: ['Lemon & Blue', 'ሎሚ እና ሰማያዊ'], bg: '#FAF0CA', ink: '#0D3B66', sw: ['#FAF0CA', '#0D3B66'] },
    rose: { n: ['Rose', 'ሮዝ'], bg: '#F7D6DC', ink: '#6D1D32', sw: ['#F7D6DC', '#E07A94', '#CC5671', '#B23C59', '#8E2B44', '#6D1D32'] },
    plum: { n: ['Plum', 'ፕለም'], bg: '#EDE3FC', ink: '#35145C', sw: ['#EDE3FC', '#CDB2F6', '#A87BEC', '#7B3FD6', '#542394', '#35145C'] },
    sand: { n: ['Sand', 'አሸዋ'], bg: '#F5EBE1', ink: '#3A302B', sw: ['#D7BDB0', '#E3D5CA', '#F5EBE1', '#D6CCC2', '#EDEEE9', '#3A302B'] },
    glacier: { n: ['Glacier', 'ግላሲየር'], bg: '#D6EBF3', ink: '#2D5F78', sw: ['#D6EBF3', '#B9D8E1', '#DADEE1', '#629BB5', '#447F98'] },
    lagoon: { n: ['Lagoon', 'ላጉን'], bg: '#EDECDB', ink: '#2F6B68', sw: ['#EDECDB', '#A7BCBD', '#6BB1AD', '#E5A9A9', '#E6748E'] },
    bisque: { n: ['Bisque', 'ቢስክ'], bg: '#FEE3C5', ink: '#82193A', sw: ['#FEE3C5', '#82193A'] },
    slate: { n: ['Slate', 'ስሌት'], bg: '#E3E7EA', ink: '#2F3E46', sw: ['#E3E7EA', '#2F3E46'] }
};
if (!PALS[S.pal]) S.pal = 'classic';
const palBg = () => PALS[S.pal].bg;
const bgFor = th => th === 'light' ? palBg() : (S.dk === 'grey' ? '#1C1C1E' : '#000000');
const cutoff = key(addDays(today(), -60));
Object.keys(S.meals).forEach(k => { if (k < cutoff) delete S.meals[k]; });
let lang = S.lang;
let sel = null, modal = null, pending = null, lpT = null, lpX = 0, lpY = 0, lpFired = false, toastT = null;
const exp = new Set();
let justOpened = '';
let det = null, born = '', popId = 0, dd = null, kp = null, clrT = null, lastDay = key(today());

/* ---------- language ---------- */
const TX = {
    weekly: ['Weekly', 'ሳምንታዊ'], monthly: ['Monthly', 'ወርሃዊ'], today: ['Today', 'ዛሬ'],
    thisWeek: ['This Week', 'ይህ ሳምንት'], week: ['Week', 'ሳምንት'], fourWeeks: ['Four Weeks', 'አራት ሳምንታት'],
    allergies: ['Allergies', 'አለርጂዎች'], addDay: ['+ Add Day', '+ ቀን ጨምር'], addDayT: ['Add a day', 'ቀን ጨምር'],
    sumToday: [(a, b) => `Today ${a}/${b}`, (a, b) => `ዛሬ ${a}/${b}`],
    noMeals: ['No meals planned', 'ምንም ምግብ አልታቀደም'], tapAdd: ['Tap to add a meal', 'ምግብ ለመጨመር ይንኩ'],
    noDays: ['No days on this page yet. Tap “Add Day” to start.', 'በዚህ ገጽ ላይ ገና ቀን የለም። ለመጀመር “ቀን ጨምር” ይንኩ።'],
    edit: ['Edit', 'አርም'], del: ['Delete', 'ሰርዝ'], cancel: ['Cancel', 'ይቅር'], save: ['Save', 'አስቀምጥ'], close: ['Close', 'ዝጋ'], ok: ['OK', 'እሺ'],
    confirm: ['Confirm', 'ማረጋገጫ'], add: ['Add', 'ጨምር'], remove: ['Remove', 'አስወግድ'], saveAll: ['Save All', 'ሁሉንም አስቀምጥ'],
    selected: [n => `${n} selected`, n => `${n} ተመርጧል`],
    mealsN: [n => `${n} meal${n === 1 ? '' : 's'}`, n => `${n} ምግብ`],
    daysN: [n => `${n} day${n === 1 ? '' : 's'}`, n => `${n} ቀን`],
    doneN: [(a, b) => `${a}/${b} done`, (a, b) => `${a}/${b} ተጠናቋል`],
    cat_Breakfast: ['Breakfast', 'ቁርስ'], cat_Lunch: ['Lunch', 'ምሳ'], cat_Snack: ['Snack', 'መክሰስ'], cat_Dinner: ['Dinner', 'እራት'], cat_Drink: ['Drink', 'መጠጥ'],
    rem_off: ['Off', 'ጠፍቷል'], rem_evening: ['Evening before', 'ከቀኑ በፊት ማታ'], rem_morning: ['Morning of', 'በዕለቱ ጠዋት'],
    addMeal: ['Add Meal', 'ምግብ ጨምር'], editMeal: ['Edit Meal', 'ምግብ አርም'], category: ['Category', 'ምድብ'], food: ['Food items', 'የምግብ ዓይነቶች'],
    foodPh: ['e.g. Rice, chicken, apple', 'ለምሳሌ ሩዝ፣ ዶሮ፣ ፖም'], reminder: ['Reminder', 'ማስታወሻ'], remTime: ['Reminder time', 'የማስታወሻ ሰዓት'],
    medLbl: ['Medicine after this meal (optional)', 'ከዚህ ምግብ በኋላ መድኃኒት (አማራጭ)'], medPh: ['Medicine name, leave empty for none', 'የመድኃኒት ስም፣ ካልፈለጉ ባዶ ይተዉ'],
    remindAt: ['Remind me at', 'አስታውሰኝ በ'],
    contains: [a => `Contains ${a} · on your allergy list`, a => `${a} ይዟል · በአለርጂ ዝርዝርዎ ላይ ነው`],
    afterMeal: [c => `after ${c}`, c => `ከ${c} በኋላ`],
    addDayMsg: ['Choose a day to add to this week.', 'ወደዚህ ሳምንት የሚጨመር ቀን ይምረጡ።'],
    allDays: ['All seven days are already on this page.', 'ሁሉም ሰባቱ ቀናት ቀድሞ በዚህ ገጽ ላይ አሉ።'],
    dayAdded: [d => `${d} added`, d => `${d} ተጨምሯል`], dayAddedB: ['It now shows on this page.', 'አሁን በዚህ ገጽ ላይ ይታያል።'],
    delDayT: ['Delete Day', 'ቀን ሰርዝ'], delFull: ['Delete the full box', 'ሙሉውን ሳጥን ሰርዝ'],
    delFullS: ['Removes this day and all its meals from the page.', 'ይህን ቀን እና ምግቦቹን ሁሉ ከገጹ ያስወግዳል።'],
    delMeals: ['Delete meals only', 'ምግቦችን ብቻ ሰርዝ'],
    delMealsS: [n => `Keeps the day and clears its ${n} meal${n === 1 ? '' : 's'}.`, n => `ቀኑን ያቆያል፤ ${n} ምግብ ያጸዳል።`],
    delMealsNone: ['This day has no meals to delete.', 'ይህ ቀን የሚሰረዝ ምግብ የለውም።'],
    dayRemoved: ['Day removed', 'ቀን ተወግዷል'], mealsCleared: ['Meals cleared', 'ምግቦች ጸድተዋል'],
    dayGone: [d => `${d} was removed from this page.`, d => `${d} ከዚህ ገጽ ተወግዷል።`],
    dayEmpty: [d => `${d} is now empty.`, d => `${d} አሁን ባዶ ነው።`],
    alreadyEmpty: ['Already empty', 'ቀድሞ ባዶ ነው'],
    notAllowed: ['Not allowed', 'አይፈቀድም'],
    algBlock: [a => `"${a}" is on your allergy list, so this meal can't be added.`, a => `"${a}" በአለርጂ ዝርዝርዎ ላይ ስላለ ይህ ምግብ መጨመር አይችልም።`],
    algShort: [a => `"${a}" is on your allergy list. This meal can't be added.`, a => `"${a}" በአለርጂ ዝርዝርዎ ላይ ነው። ይህ ምግብ መጨመር አይችልም።`],
    algBulk: [a => `"${a}" is on your allergy list.`, a => `"${a}" በአለርጂ ዝርዝርዎ ላይ ነው።`],
    mealAdded: ['Meal added', 'ምግብ ተጨምሯል'], mealUpdated: ['Meal updated', 'ምግብ ተስተካክሏል'], mealsUpdated: ['Meals updated', 'ምግቦች ተስተካክለዋል'],
    nMealsSaved: [n => `${n} meal${n === 1 ? '' : 's'} saved`, n => `${n} ምግብ ተቀምጧል`],
    nothingEdit: ['Nothing to edit', 'ለማረም ምንም የለም'], daysNoMeals: ['The selected days have no meals.', 'የተመረጡት ቀናት ምግብ የላቸውም።'],
    bulkEdit: [n => `Bulk Edit · ${n} meal${n > 1 ? 's' : ''}`, n => `በጅምላ አርም · ${n} ምግብ`],
    deleted: ['Deleted', 'ተሰርዟል'], nRemoved: [n => `${n} meal${n === 1 ? '' : 's'} removed.`, n => `${n} ምግብ ተወግዷል።`],
    delSel: [n => `Delete ${n} selected meal${n === 1 ? '' : 's'}?`, n => `የተመረጡትን ${n} ምግብ ይሰረዙ?`],
    selEmpty: ['The selected day has no meals to delete.', 'የተመረጠው ቀን የሚሰረዝ ምግብ የለውም።'],
    medTaken: ['Medicine taken', 'መድኃኒት ተወስዷል'], medNot: ['Marked as not taken', 'አልተወሰደም ተብሎ ተመዝግቧል'],
    algSheetMsg: ['Write the foods that trigger your allergy. They can\'t be added to any meal.', 'አለርጂ የሚያስከትሉ ምግቦችን ይጻፉ። ወደ ማንኛውም ምግብ መጨመር አይችሉም።'],
    addFood: ['Add food', 'ምግብ ጨምር'], algPh: ['e.g. peanuts, shrimp', 'ለምሳሌ ኦቾሎኒ፣ ሽሪምፕ'],
    noAlg: ['No allergies saved yet', 'እስካሁን የተቀመጠ አለርጂ የለም'],
    nothingAdd: ['Nothing to add', 'የሚጨመር የለም'], typeFood: ['Type a food name first.', 'መጀመሪያ የምግብ ስም ይጻፉ።'],
    algSaved: ['Allergy saved', 'አለርጂ ተቀምጧል'],
    algMarked: [n => `${n} planned meal${n === 1 ? '' : 's'} already contain it and are marked in red.`, n => `${n} የታቀደ ምግብ ቀድሞ ይዘዋል፤ በቀይ ተመልክተዋል።`],
    algBlocked: [a => `${a} can no longer be added.`, a => `${a} ከዚህ በኋላ መጨመር አይችልም።`],
    removed: ['Removed', 'ተወግዷል'], algAgain: [a => `${a} can be added again.`, a => `${a} እንደገና መጨመር ይችላል።`],
    setTime: ['Set reminder time', 'የማስታወሻ ሰዓት ያስቀምጡ'], am: ['AM', 'ጠዋት'], pm: ['PM', 'ከሰዓት'],
    prepTomorrow: ['Prep for tomorrow', 'ለነገ ዝግጅት'], mealPrep: ['Meal prep today', 'የዛሬ ምግብ ዝግጅት'], medTime: ['Medicine time', 'የመድኃኒት ሰዓት'],
    snooze: ['Snooze', 'አሸልብ'], min: [n => `${n} min`, n => `${n} ደቂቃ`], snoozed: ['Snoozed', 'ተሸልቧል'],
    snoozedB: [n => `I'll remind you again in ${n} minutes.`, n => `ከ${n} ደቂቃ በኋላ እንደገና አስታውሳለሁ።`],
    selectDay: ['Select a day', 'ቀን ይምረጡ'],
    themeT: ['Choose a theme', 'ገጽታ ይምረጡ'], themeMsg: ['Tap a colour theme to use it in the app.', 'በመተግበሪያው ለመጠቀም የቀለም ገጽታ ይንኩ።'],
    more: ['More', 'ተጨማሪ'], moreT: ['More tools', 'ተጨማሪ መሣሪያዎች'],
    streakT: [n => `Medicine streak: ${n} day${n === 1 ? '' : 's'}`, n => `የመድኃኒት ተከታታይ ቀናት፡ ${n}`],
    streakNone: ['Take all medicine in a day to start a streak.', 'ተከታታይ ለመጀመር የቀኑን መድኃኒት ሁሉ ይውሰዱ።'],
    streakToast: [n => `${n}-day medicine streak`, n => `የ${n} ቀን የመድኃኒት ተከታታይ`],
    shopT: ['Shopping list', 'የገበያ ዝርዝር'], shopMsg: ['Food from meals you have not finished yet.', 'ገና ካልተጠናቀቁ ምግቦች የተሰበሰቡ ዕቃዎች።'],
    shopEmpty: ['Nothing to buy yet. Add some meals first.', 'ገና የሚገዛ የለም። መጀመሪያ ምግቦችን ይጨምሩ።'], shopReset: ['Reset ticks', 'ምልክቶችን አጽዳ'],
    favT: ['Favourite meals', 'ተወዳጅ ምግቦች'], favSave: ['★ Save as favourite', '★ ተወዳጅ አድርግ'],
    favNone: ['No favourites yet. Save one from the add-meal screen.', 'ገና ተወዳጅ የለም። ከምግብ መጨመሪያ ገጽ ያስቀምጡ።'],
    favSaved: ['Saved to favourites', 'ወደ ተወዳጆች ተቀምጧል'], favDup: ['Already in favourites', 'ቀድሞ በተወዳጆች ውስጥ አለ'], favNeed: ['Type a meal first', 'መጀመሪያ ምግብ ይጻፉ'],
    favLbl: ['Favourites', 'ተወዳጆች'],
    repeatL: ['Repeat', 'መድገም'], rep_off: ['Never', 'በጭራሽ'], rep_weekly: ['Every week', 'በየሳምንቱ'], rep_daily: ['Every day', 'በየቀኑ'],
    copyDayT: ['Copy this day', 'ይህን ቀን ቅዳ'], copyWeekT: ['Copy this week', 'ይህን ሳምንት ቅዳ'],
    copyThis: ['Other days this week', 'ሌሎች የዚህ ሳምንት ቀናት'], copyNext: ['Same day in later weeks', 'በሚቀጥሉት ሳምንታት ተመሳሳይ ቀን'],
    copyWeeks: ['Copy to later weeks', 'ወደ ሚቀጥሉት ሳምንታት ቅዳ'], copyGo: ['Copy', 'ቅዳ'],
    copyNone: ['Pick at least one place to copy to.', 'የሚገለበጥበትን ቢያንስ አንድ ቦታ ይምረጡ።'], copied: ['Copied', 'ተቀድቷል'],
    copiedB: [n => `${n} meal${n === 1 ? '' : 's'} copied.`, n => `${n} ምግብ ተቀድቷል።`], copyAdds: ['Copied meals are added to the days you pick.', 'የተቀዱ ምግቦች ወደተመረጡት ቀናት ይጨመራሉ።'],
    plusW: [n => `+${n} week${n === 1 ? '' : 's'}`, n => `+${n} ሳምንት`],
    sumT: ['Daily summary', 'የዕለት ማጠቃለያ'], sumMsg: ["Every evening, get a notification listing tomorrow's meals.", 'በየምሽቱ የነገ ምግቦችን የሚዘረዝር ማሳወቂያ ያግኙ።'],
    sumOn: ['On', 'በርቷል'], sumOff: ['Off', 'ጠፍቷል'], sumTime: ['Send at', 'የሚላክበት ሰዓት'], sumNeedTime: ['Set a time first.', 'መጀመሪያ ሰዓት ያስገቡ።'], sumTitle: ["Tomorrow's meals", 'የነገ ምግቦች'],
    backT: ['Backup & restore', 'ምትኬ እና መመለስ'], backMsg: ['Copy your backup and keep it somewhere safe (Notes, email…). Paste it back here to restore.', 'ምትኬዎን ገልብጠው በደህና ቦታ ያስቀምጡ። ለመመለስ እዚህ ይለጥፉት።'],
    backCopy: ['Copy backup', 'ምትኬ ቅዳ'], backCopied: ['Backup copied', 'ምትኬ ተቀድቷል'], backCopiedB: ['Paste it somewhere safe.', 'በደህና ቦታ ይለጥፉት።'],
    restoreL: ['Restore from backup', 'ከምትኬ መልስ'], restorePh: ['Paste your backup here', 'ምትኬዎን እዚህ ይለጥፉ'], restoreGo: ['Restore', 'መልስ'],
    restoreAsk: ['This replaces your current plan with the backup. Continue?', 'ይህ አሁን ያለዎትን እቅድ በምትኬው ይተካል። ይቀጥሉ?'],
    restoreOk: ['Restored', 'ተመልሷል'], restoreOkB: ['Your plan was restored.', 'እቅድዎ ተመልሷል።'],
    restoreBad: ['Invalid backup', 'ልክ ያልሆነ ምትኬ'], restoreBadB: ['That text is not a LunchMate backup.', 'ይህ ጽሑፍ የLunchMate ምትኬ አይደለም።'],
    undo: ['Undo', 'ቀልብስ'], mealRemoved: ['Meal removed', 'ምግብ ተወግዷል'], back: ['Back', 'ተመለስ'],
    nextUp: ['Next up', 'ቀጣይ'], allDone: ['All meals done today', 'የዛሬ ምግቦች ሁሉ ተጠናቀዋል'],
    inT: [x => `in ${x}`, x => `ከ${x} በኋላ`],
    skip: ['Skip', 'ዝለል'], next: ['Next', 'ቀጣይ'], getStarted: ['Get started', 'እንጀምር'],
    w1t: ['Plan every meal', 'እያንዳንዱን ምግብ ያቅዱ'], w1b: ['Add meals to each day, repeat them every week and copy a whole week in one tap.', 'ለእያንዳንዱ ቀን ምግቦችን ይጨምሩ፣ በየሳምንቱ ይድገሙ፣ አንድ ሳምንት በአንድ ንክኪ ይቅዱ።'],
    w2t: ['Never miss a meal', 'ምግብ ወይም መድኃኒት አያምልጥዎ'], w2b: ['Set your own reminder times, hear a gentle sound, and snooze when you need a minute.', 'የራስዎን የማስታወሻ ሰዓት ያስቀምጡ፣ ለስላሳ ድምፅ ይስሙ፣ ሲያስፈልግ ያሸልቡ።'],
    w3t: ['Make it yours', 'የራስዎ ያድርጉት'], w3b: ['Pick a colour theme, switch to dark mode, and use the app in English or Amharic.', 'የቀለም ገጽታ ይምረጡ፣ ወደ ጨለማ ሁነታ ይቀይሩ፣ መተግበሪያውን በእንግሊዝኛ ወይም በአማርኛ ይጠቀሙ።'],
    newT: ["What's new", 'አዲስ ነገር'], newGot: ['Got it', 'ገብቶኛል'],
    n1: ['A calmer header: language, lock and more now live in the menu', 'ይበልጥ የተረጋጋ ራስጌ፦ ቋንቋ፣ መቆለፊያ እና ሌሎች አሁን በምናሌ ውስጥ ናቸው'],
    n2: ['One round + button to add a meal on any day', 'በማንኛውም ቀን ምግብ ለመጨመር አንድ ክብ + አዝራር'],
    n3: ['Today stays big; other days are quick rows you tap to open', 'ዛሬ ትልቅ ሆኖ ይቆያል፤ ሌሎች ቀናት ለመክፈት የሚነኩ ፈጣን ረድፎች ናቸው'],
    n4: ['Long-press a day for copy, clear and delete', 'ለመቅዳት፣ ለማጽዳት እና ለመሰረዝ አንድ ቀን ላይ ረዘም ብለው ይጫኑ'],
    n5: ['Cleaner meal rows with fewer icons', 'ጥቂት አዶዎች ያሏቸው ንጹህ የምግብ ረድፎች'],
    n6: ['Swipe left or right to switch between Weekly and Monthly', 'በሳምንታዊ እና ወርሃዊ መካከል ለመቀያየር ወደ ግራ ወይም ቀኝ ያንሸራትቱ'],
    darkStyle: ['Dark mode style', 'የጨለማ ሁነታ ዘይቤ'], dkBlack: ['Pure black', 'ንጹህ ጥቁር'], dkGrey: ['Soft grey', 'ለስላሳ ግራጫ'],
    dayMenuT: ['Day options', 'የቀን አማራጮች'], dmClear: ['Clear meals', 'ምግቦችን አጽዳ'], dmSelect: ['Select for bulk edit', 'ለጅምላ ማስተካከል ምረጥ'],
    lockT: ['App lock', 'የመተግበሪያ መቆለፊያ'], lockNote: ['A privacy lock for the app screen. Keep a backup too, and remember your recovery phrase.', 'ለመተግበሪያው ማያ ገጽ የግላዊነት መቆለፊያ። ምትኬም ያስቀምጡ፣ የመመለሻ ሐረግዎንም ያስታውሱ።'],
    lockSetup: ['Set up PIN lock', 'የፒን መቆለፊያ አዘጋጅ'], lockNow: ['Lock app now', 'መተግበሪያውን አሁን ቆልፍ'], lockChange: ['Change PIN', 'ፒን ቀይር'],
    lockPhraseChange: ['Change recovery phrase', 'የመመለሻ ሐረግ ቀይር'], lockOff: ['Turn off lock', 'መቆለፊያ አጥፋ'],
    lockEnter: ['Enter your PIN', 'ፒንዎን ያስገቡ'], lockNew: ['Create a 4-digit PIN', '4 አሃዝ ፒን ይፍጠሩ'], lockConfirm: ['Confirm your PIN', 'ፒንዎን ያረጋግጡ'],
    lockMismatch: ['PINs did not match. Try again.', 'ፒኖቹ አይመሳሰሉም። እንደገና ይሞክሩ።'], lockWrong: ['Wrong PIN', 'የተሳሳተ ፒን'],
    lockForgot: ['Forgot PIN?', 'ፒን ረሱ?'], tooMany: [n => `Too many tries. Wait ${n} seconds.`, n => `ብዙ ሙከራዎች። ${n} ሰከንድ ይጠብቁ።`],
    phraseNew: ['Create a recovery phrase', 'የመመለሻ ሐረግ ይፍጠሩ'],
    phraseHint: ['If you forget your PIN, this phrase lets you reset it. Write it down somewhere safe. Use at least 4 characters.', 'ፒንዎን ከረሱ ይህ ሐረግ እንደገና እንዲያስቀምጡ ያስችልዎታል። በደህና ቦታ ይጻፉት። ቢያንስ 4 ፊደላት ይጠቀሙ።'],
    phraseAsk: ['Enter your recovery phrase', 'የመመለሻ ሐረግዎን ያስገቡ'], phrasePh: ['Recovery phrase', 'የመመለሻ ሐረግ'],
    phraseBad: ['That phrase is not correct.', 'ይህ ሐረግ ትክክል አይደለም።'], phraseShort: ['Use at least 4 characters.', 'ቢያንስ 4 ፊደላት ይጠቀሙ።'],
    verifyBtn: ['Verify', 'አረጋግጥ'], lockSet: ['Lock is on', 'መቆለፊያ በርቷል'], lockOffDone: ['Lock turned off', 'መቆለፊያ ጠፍቷል'], lockPinSaved: ['PIN updated', 'ፒን ተቀይሯል'],
    askName: ["What's your name?", 'ስምዎ ማን ነው?'], askNameB: ['We will use it to greet you each day.', 'በየቀኑ ሰላም ለማለት እንጠቀምበታለን።'],
    namePh: ['Your name', 'ስምዎ'], nameNeed: ['Please type your name.', 'እባክዎ ስምዎን ይጻፉ።'],
    hello: [n => `Welcome, ${n}!`, n => `እንኳን ደህና መጡ፣ ${n}!`], helloB: ["Let's get your meals planned.", 'ምግቦችዎን እናቅድ።'],
    gMorning: ['Good morning', 'እንደምን አደሩ'], gAfternoon: ['Good afternoon', 'እንደምን ዋሉ'], gEvening: ['Good evening', 'እንደምን አመሹ'],
    nameT: ['Your name', 'ስምዎ'], nameSaved: ['Name saved', 'ስም ተቀምጧል'],
    nameAuto: ['The name is translated automatically. You can correct either version.', 'ስሙ በራስ-ሰር ይተረጎማል። ሁለቱንም ማስተካከል ይችላሉ።'],
    menuT: ['Menu', 'ምናሌ'], langL: ['Language', 'ቋንቋ'], dayL: ['Day', 'ቀን'], infoL: ['Information', 'መረጃ'],
    aboutT: ['About LunchMate', 'ስለ LunchMate'], themesL: ['Colour themes', 'የቀለም ገጽታዎች'], noReminder: ['No reminder', 'ማስታወሻ የለም'], medL: ['Medicine', 'መድኃኒት'],
    darkL: ['Dark mode', 'ጨለማ ሁነታ'],
    setTimeBtn: ['Set time', 'ሰዓት ያስገቡ'],
    timeNeeded: ['Set a time', 'ሰዓት ያስገቡ'],
    timeNeededMeal: ['Choose the time you want to be reminded about this meal.', 'ስለዚህ ምግብ እንዲታወሱ የሚፈልጉበትን ሰዓት ያስገቡ።'],
    timeNeededMed: ['Choose the time you want to be reminded to take the medicine.', 'መድኃኒቱን እንዲታወሱ የሚፈልጉበትን ሰዓት ያስገቡ።'],
    infoT: ['Information', 'መረጃ'], devBy: ['Developed by', 'የተሠራው በ'], emailL: ['Email', 'ኢሜይል'], phoneL: ['Phone No', 'ስልክ ቁጥር'], companyL: ['Company', 'ኩባንያ'],
};
function t(k, ...a) { const e = TX[k]; if (!e) return k; const v = e[lang === 'am' ? 1 : 0]; return typeof v === 'function' ? v(...a) : v; }
const tc = c => t('cat_' + c);
const WK = [['First Week', 'Second Week', 'Third Week', 'Fourth Week'], ['የመጀመሪያ ሳምንት', 'ሁለተኛ ሳምንት', 'ሦስተኛ ሳምንት', 'አራተኛ ሳምንት']];
const wkName = i => WK[lang === 'am' ? 1 : 0][i];
const dayName = d => lang === 'am' ? DAYS_AM[d.getDay()] : DAYS_EN[d.getDay()];
const dayShort = d => lang === 'am' ? DAYS_AM[d.getDay()] : DAYS_EN[d.getDay()].slice(0, 3);
const fmtDay = d => { if (lang === 'am') { const e = toEth(d); return `${MON_AM[e.m - 1]} ${e.d}`; } return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }); };
const monAbbr = d => lang === 'am' ? MON_AM[toEth(d).m - 1] : MON_EN[d.getMonth()];
const dnum = d => lang === 'am' ? toEth(d).d : d.getDate();
const yr = d => lang === 'am' ? toEth(d).y : d.getFullYear();
const fmtDayY = d => lang === 'am' ? `${fmtDay(d)}, ${yr(d)} ዓ.ም` : `${fmtDay(d)}, ${yr(d)}`;
function fmtRange(a, b) {
    const ya = yr(a), yb = yr(b);
    return ya === yb ? `${fmtDay(a)} – ${fmtDay(b)}, ${yb}` : `${fmtDay(a)}, ${ya} – ${fmtDay(b)}, ${yb}`;
}
function fmtTime(s) { const [h, m] = String(s).split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h >= 12 ? t('pm') : t('am')}`; }
function applyLang() {
    document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    const lb = $('#lang'); if (lb) lb.dataset.l = lang;
}

/* ---------- data ---------- */
function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    syncNative();
    syncWidget();
}
let wT = null;
function syncWidget() {
    if (!P.NavBar) return;
    clearTimeout(wT);
    wT = setTimeout(() => {
        try {
            const days = {}, td = today();
            for (let i = 0; i < 14; i++) {
                const k = key(addDays(td, i)), l = meals(k);
                if (l.length) days[k] = l.map(m => `${m.done ? '✓' : '•'} ${tc(m.cat)}: ${m.text}`).join('\n');
            }
            const r = P.NavBar.widget({ days, empty: t('noMeals'), label: t('today') });
            if (r && r.catch) r.catch(() => {});
        } catch (e) {}
    }, 600);
}
const meals = k => S.meals[k] || [];
function findMeal(id) {
    for (const k in S.meals) { const m = S.meals[k].find(x => x.id === id); if (m) return { k, m }; }
    return null;
}
function ensureDay(d) {
    const ws = monday(d), a = daysOf(ws);
    if (!a.includes(d.getDay())) { a.push(d.getDay()); setDays(ws, a); }
}
function markSkip(k, m) {
    const sr = m && m.sid && S.series[m.sid];
    if (sr && !sr.skip.includes(k)) sr.skip.push(k);
}
function extendRepeats() {
    const td = today(), end = addDays(td, 56); let ch = false;
    for (const sid in S.series) {
        const sr = S.series[sid];
        if (!sr || !sr.start || !Array.isArray(sr.skip)) continue;
        for (let d = parse(sr.start) > td ? parse(sr.start) : td; d <= end; d = addDays(d, 1)) {
            if (sr.rep === 'weekly' && d.getDay() !== sr.wd) continue;
            const k = key(d);
            if (sr.skip.includes(k) || meals(k).some(m => m.sid === sid)) continue;
            (S.meals[k] = S.meals[k] || []).push({ id: S.nextId++, cat: sr.cat, text: sr.text, done: false, remind: sr.remind, rt: sr.rt || '', fired: false, snz: 0, sid,
                med: sr.med ? { name: sr.med.name, t: sr.med.t, taken: false, fired: false, snz: 0 } : null });
            ensureDay(d); ch = true;
        }
    }
    return ch;
}
function applySeries(m, k) {
    const tpl = { cat: m.cat, text: m.text, remind: m.remind, rt: m.rt, med: m.med ? { name: m.med.name, t: m.med.t } : null };
    if (modal.rep === 'off') { if (m.sid) { delete S.series[m.sid]; m.sid = null; } return; }
    const sr = m.sid && S.series[m.sid];
    if (sr) { if (sr.rep !== modal.rep) { sr.rep = modal.rep; sr.wd = parse(k).getDay(); } Object.assign(sr, tpl); }
    else { const sid = 's' + (S.nextId++); S.series[sid] = Object.assign({ rep: modal.rep, wd: parse(k).getDay(), start: k, skip: [] }, tpl); m.sid = sid; }
}
function medStreak() {
    let n = 0; const td = today();
    for (let i = 0; i <= 60; i++) {
        const ms = meals(key(addDays(td, -i))).filter(m => m.med);
        if (!ms.length) continue;
        if (ms.every(m => m.med.taken)) n++; else if (i > 0) break;
    }
    return n;
}
function delIds(ids) {
    for (const k in S.meals) {
        S.meals[k].forEach(m => { if (ids.has(m.id)) markSkip(k, m); });
        S.meals[k] = S.meals[k].filter(m => !ids.has(m.id));
        if (!S.meals[k].length) delete S.meals[k];
    }
}
function selList() {
    const out = new Map();
    sel.forEach(s => {
        const v = s.slice(2);
        if (s[0] === 'd') meals(v).forEach(m => out.set(m.id, { k: v, m }));
        else { const f = findMeal(+v); if (f) out.set(f.m.id, f); }
    });
    return [...out.values()].sort((a, b) => a.k.localeCompare(b.k));
}

/* ---------- which days are on a week page ---------- */
function daysOf(ws) {
    const wk = key(ws);
    if (Array.isArray(S.days[wk])) return S.days[wk].slice();
    const ex = S.extra[wk] || {}, hid = S.hidden || [];
    let a = [1, 2, 3, 4, 5];
    [6, 0].forEach(wd => { if (ex[wd] || meals(key(addDays(ws, (wd + 6) % 7))).length) a.push(wd); });
    return a.filter(wd => !hid.includes(wd));
}
function setDays(ws, arr) { S.days[key(ws)] = arr; }
function orderDates(ws, arr) {
    const tk = key(today()), dates = arr.map(wd => addDays(ws, (wd + 6) % 7));
    const up = dates.filter(d => key(d) >= tk).sort((a, b) => a - b), pa = dates.filter(d => key(d) < tk).sort((a, b) => a - b);
    return up.concat(pa);
}
function ensureToday() {
    const td = today(), tk = key(td);
    if (S.ensured === tk) return;
    S.ensured = tk;
    const ws = monday(td), a = daysOf(ws);
    if (!a.includes(td.getDay())) { a.push(td.getDay()); setDays(ws, a); }
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
}
function curWs() {
    const base = monday(today());
    if (S.mode === 'weekly') return addDays(base, S.offset * 7);
    return addDays(addDays(base, S.offset * 28), (det || 0) * 7);
}
const weekView = () => S.mode === 'weekly' || det !== null;

/* ---------- rendering ---------- */
function entry(m, daySel, j, isNext) {
    const s = daySel || (sel && sel.has('e:' + m.id));
    return `<div class="en${m.done ? ' done' : ''}${s ? ' sel' : ''}${m.id === popId ? ' pop' : ''}${isNext ? ' next' : ''}" style="--j:${j || 0}" data-act="entry" data-id="${m.id}" data-lp="e:${m.id}">
        <div class="ck">${m.done ? CHECK : ''}</div>
        <div class="eb"><div class="cat"><i class="cdot" style="background:${CAT_COL[m.cat] || 'currentColor'}"></i>${esc(tc(m.cat))}${m.sid ? REPEAT : ''}${m.remind !== 'off' ? BELL : ''}</div><div class="tx">${esc(m.text)}</div>${extras(m)}</div>
        ${sel ? '' : `<button class="mini" data-act="edit" data-id="${m.id}">${t('edit')}</button>`}</div>`;
}
function dayCard(d, i, tk, nr) {
    const k = key(d), list = meals(k), done = list.filter(m => m.done).length;
    const isToday = k === tk, open = exp.has(k) && list.length > 0;
    const nxt = isToday ? list.find(m => !m.done) : null;
    const strip = isToday && list.length ? `<div class="fstrip">${nxt ? `<span class="nx">${t('nextUp')}</span><b>${esc(tc(nxt.cat))}: ${esc(nxt.text)}</b>${nr ? `<span class="cd" data-at="${nr}"></span>` : ''}` : `<b>${t('allDone')}</b>`}</div>` : '';
    const isSel = !!(sel && sel.has('d:' + k)), pct = list.length ? Math.round(done / list.length * 100) : 0;
    const dropbar = list.length ? `<button class="dropbar" data-act="toggleday" data-k="${k}" aria-label="${esc(t('mealsN', list.length))}"><span class="dbt">${esc(t('mealsN', list.length))}</span>${isToday ? `<span id="sum">${ring(done, list.length, 30)}</span>` : ''}<span class="cv${open ? ' open' : ''}">${CHEV}</span></button>` : '';
    return `<div class="card day${isSel ? ' sel' : ''}${isToday ? ' today focus' : ''}${k < tk ? ' past' : ''}${k === born ? ' born' : ''}${k === justOpened ? ' opening' : ''}" style="--i:${i}" data-act="day" data-k="${k}" data-day="${k}" data-lp="d:${k}">
        <div class="dh">
            <div class="tile"><span class="tm">${esc(monAbbr(d))}</span><span class="tn mono">${dnum(d)}</span></div>
            <div class="dl"><div class="dn">${esc(dayName(d))}${isToday ? `<span class="tag">${t('today')}</span>` : ''}</div>
                <div class="dm"><span class="mono dd">${esc(fmtDayY(d))}</span>${list.length ? `<span class="mono cnt">${done}/${list.length}</span>` : ''}</div>
                ${list.length ? `<div class="bar"><i style="width:${pct}%"></i></div>` : ''}</div>
            ${sel || !list.length ? '' : `<button class="trash cpy" data-act="copyday" data-k="${k}" aria-label="${esc(t('copyDayT'))}">${COPY}</button>`}
            ${sel ? '' : `<button class="trash" data-act="delday" data-k="${k}" aria-label="${esc(t('delDayT'))}">${TRASH}</button>`}
        </div>
        ${strip}${dropbar}
        ${open ? list.map((m, j) => entry(m, isSel, j, nxt && m.id === nxt.id)).join('') : ''}
        ${list.length ? '' : `<div class="empty"><span class="art">${PLATE_ART}</span><span>${t('noMeals')} · ${t('tapAdd')}</span></div>`}</div>`;
}
const CREDIT = '<div class="credit">© Developed by Dagim Bireda (Lilo Designs)</div>';
function nextReminderTs() {
    const now = Date.now(); let best = 0;
    for (const k in S.meals) S.meals[k].forEach(m => {
        if (m.remind !== 'off' && !m.done && !m.fired) { const tm = mealTime(k, m); if (tm > now && (!best || tm < best)) best = tm; }
        if (m.med && !m.med.taken && !m.med.fired) { const tm = medTime(k, m); if (tm > now && (!best || tm < best)) best = tm; }
    });
    return best;
}
function fmtDur(ms) {
    const m = Math.max(1, Math.round(ms / 60000)), h = Math.floor(m / 60), mm = m % 60;
    if (h >= 24) return lang === 'am' ? `${Math.floor(h / 24)} ቀን ${h % 24} ሰዓት` : `${Math.floor(h / 24)}d ${h % 24}h`;
    if (lang === 'am') return h ? `${h} ሰዓት ${mm} ደቂቃ` : `${mm} ደቂቃ`;
    return h ? `${h}h ${mm}m` : `${mm}m`;
}
function tickCountdown() {
    document.querySelectorAll('.cd[data-at]').forEach(el => { const d = +el.dataset.at - Date.now(); el.textContent = d > 0 ? t('inT', fmtDur(d)) : ''; });
}
function celebrate() {
    buzz([20, 50, 20, 50, 30]);
    let fg = '#ffffff'; try { fg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || fg; } catch (e) {}
    const cols = ['#F2A93B', '#4CAF7D', '#E0709A', '#6C7BD9', '#3AA7D9', fg], root = document.createElement('div');
    root.className = 'conf'; document.body.appendChild(root);
    for (let i = 0; i < 28; i++) {
        const p = document.createElement('i'), sz = 6 + Math.random() * 6;
        p.style.cssText = `left:${innerWidth / 2 + (Math.random() - .5) * 60}px;top:${innerHeight * .38}px;width:${sz}px;height:${sz * (Math.random() < .5 ? 1 : .5)}px;background:${cols[i % cols.length]};border-radius:${Math.random() < .5 ? '50%' : '2px'}`;
        root.appendChild(p);
        const ang = Math.random() * Math.PI * 2, dist = 110 + Math.random() * 170, dx = Math.cos(ang) * dist, dy = Math.sin(ang) * dist - 90;
        try { p.animate([{ transform: 'translate3d(0,0,0) rotate(0deg)', opacity: 1 }, { transform: `translate3d(${dx}px,${dy + 280}px,0) rotate(${Math.round(Math.random() * 720 - 360)}deg)`, opacity: 0 }], { duration: 1100 + Math.random() * 500, easing: 'cubic-bezier(.2,.7,.4,1)', fill: 'forwards' }); } catch (e) {}
    }
    setTimeout(() => root.remove(), 1800);
    const r = document.querySelector('#sum svg');
    if (r) { try { r.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.3)' }, { transform: 'scale(1)' }], { duration: 600, easing: 'cubic-bezier(.3,1.6,.5,1)' }); } catch (e) {} }
}
function checkAllDone(id) {
    const f = findMeal(id);
    if (!f || f.k !== key(today()) || !f.m.done) return;
    const l = meals(f.k);
    if (l.length && l.every(m => m.done)) setTimeout(celebrate, 260);
}
function jumpToday() {
    if (S.offset === 0 && det === null) return;
    const dir = S.offset > 0 ? -1 : 1;
    S.offset = 0; det = null; save(); render(dir);
}
function greeting() {
    if (!dispName() || S.mode !== 'weekly' || S.offset !== 0) return '';
    const h = new Date().getHours();
    return `<div class="greet"><span>${esc(t(h < 12 ? 'gMorning' : h < 17 ? 'gAfternoon' : 'gEvening'))}${lang === 'am' ? '፣' : ','}</span><b>${esc(dispName())}</b></div>`;
}
function weekPage(ws, tk) {
    const dates = orderDates(ws, daysOf(ws)), nr = nextReminderTs();
    return greeting() + (dates.length ? dates.map((d, i) => dayCard(d, i, tk, nr)).join('') : `<div class="nodays">${PLATE_ART}<br>${t('noDays')}</div>`) + CREDIT;
}
function monthPage(m0, tk) {
    let h = '';
    for (let w = 0; w < 4; w++) {
        const ws = addDays(m0, w * 7), ds = orderDates(ws, daysOf(ws));
        let total = 0, done = 0, cur = false;
        ds.forEach(d => { const l = meals(key(d)); total += l.length; done += l.filter(m => m.done).length; });
        for (let i = 0; i < 7; i++) if (key(addDays(ws, i)) === tk) cur = true;
        h += `<div class="card wcard${cur ? ' today' : ''}" style="--i:${w}" data-act="openweek" data-w="${w}">
            <div class="wb"><div class="wn">${esc(wkName(w))}${cur ? `<span class="tag">${t('thisWeek')}</span>` : ''}</div>
            <div class="mono wr">${esc(fmtRange(ws, addDays(ws, 6)))}</div>
            <div class="prog"><i style="width:${total ? Math.round(done / total * 100) : 0}%"></i></div>
            <div class="wsm">${esc(t('daysN', ds.length))} · ${total ? esc(t('doneN', done, total)) : esc(t('noMeals'))}</div></div>
            <div class="chev">${CHEV}</div></div>`;
    }
    return h + CREDIT;
}
function pageHtml(tdy) {
    const tk = key(tdy);
    if (S.mode === 'weekly') return weekPage(addDays(monday(tdy), S.offset * 7), tk);
    const m0 = addDays(monday(tdy), S.offset * 28);
    return det === null ? monthPage(m0, tk) : weekPage(addDays(m0, det * 7), tk);
}
function drawChrome(tdy) {
    $('#nav').dataset.i = S.mode === 'weekly' ? '0' : '1';
    document.querySelectorAll('.tab').forEach(b => b.classList.toggle('on', b.dataset.v === S.mode));
    let bar;
    if (S.mode === 'monthly' && det !== null) {
        const ws = curWs();
        bar = `<button class="ib" data-act="back" aria-label="Back">${BACK}</button><div id="range" class="mono"><small>${esc(wkName(det))}</small>${esc(fmtRange(ws, addDays(ws, 6)))}</div><span class="ib sp"></span>`;
    } else {
        let a, b, lbl;
        if (S.mode === 'weekly') { const ws = addDays(monday(tdy), S.offset * 7); a = ws; b = addDays(ws, 6); lbl = S.offset === 0 ? t('thisWeek') : t('week'); }
        else { const m0 = addDays(monday(tdy), S.offset * 28); a = m0; b = addDays(m0, 27); lbl = t('fourWeeks'); }
        bar = `<button class="ib" data-act="nav" data-v="-1">&#8249;</button><button id="range" class="mono" data-act="nav" data-v="0"><small>${esc(lbl)}</small>${esc(fmtRange(a, b))}</button><button class="ib" data-act="nav" data-v="1">&#8250;</button>`;
    }
    $('#bar').innerHTML = bar;
    $('#nav').classList.toggle('off', !!sel);
    $('#tojump').classList.toggle('on', S.offset !== 0 && !sel);
    $('#fab').classList.toggle('off', !!sel);
    $('#selbar').classList.toggle('off', !sel);
    if (sel) $('#selbar').innerHTML = `<span class="mono">${esc(t('selected', sel.size))}</span><button class="btn ghost sm" data-act="sel-edit">${t('edit')}</button><button class="btn danger sm" data-act="sel-del">${t('del')}</button><button class="btn ghost sm" data-act="sel-cancel">${t('cancel')}</button>`;
}
function newPage(html) {
    const pg = document.createElement('div');
    pg.className = 'page';
    pg.innerHTML = `<div class="inner">${html}</div>`;
    attachBounce(pg);
    return pg;
}
function render(dir) {
    const tdy = today(), stage = $('#stage');
    drawChrome(tdy);
    const html = pageHtml(tdy);
    setTimeout(tickCountdown, 0);
    const last = stage.lastElementChild;
    if (dir === undefined || !last) {
        if (!last) { const pg0 = newPage(html); pg0.classList.add('stag'); stage.appendChild(pg0); setTimeout(() => pg0.classList.remove('stag'), 1000); } else last.firstElementChild.innerHTML = html;
        return;
    }
    while (stage.children.length > 1) stage.firstElementChild.remove();
    const old = stage.firstElementChild, pg = newPage(html);
    pg.classList.add('stag');
    stage.appendChild(pg);
    old.style.pointerEvents = 'none';
    try {
        if (dir === 0) {
            pg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 280, easing: 'ease-out' });
            old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, easing: 'ease-in', fill: 'forwards' });
        } else {
            pg.animate([{ transform: `translate3d(${dir * 34}%,0,0)`, opacity: 0 }, { transform: 'translate3d(0,0,0)', opacity: 1 }], { duration: 520, easing: 'cubic-bezier(.2,.9,.25,1.08)' });
            old.animate([{ transform: 'translate3d(0,0,0)', opacity: 1 }, { transform: `translate3d(${-dir * 24}%,0,0)`, opacity: 0 }], { duration: 360, easing: 'cubic-bezier(.32,.72,0,1)', fill: 'forwards' });
        }
    } catch (e) {}
    setTimeout(() => old.remove(), 700);
    setTimeout(() => pg.classList.remove('stag'), 900);
}

/* ---------- rubber-band bounce scrolling ---------- */
function attachBounce(pg) {
    const inner = pg.firstElementChild;
    let prevY = 0, raw = 0, dirn = 0, active = false, touching = false, lastTop = 0, lastTs = 0, bumpAt = 0;
    const rubber = x => { const d = pg.clientHeight * .5 || 300; return (1 - 1 / (x * .55 / d + 1)) * d; };
    const springBack = from => {
        inner.style.transform = '';
        try { inner.animate([{ transform: `translate3d(0,${from}px,0)` }, { transform: 'translate3d(0,0,0)' }], { duration: 560, easing: 'cubic-bezier(.2,1.25,.4,1)' }); } catch (e) {}
    };
    pg.addEventListener('touchstart', e => {
        if (e.touches.length !== 1) return;
        touching = true; active = false; raw = 0; prevY = e.touches[0].clientY;
        inner.getAnimations && inner.getAnimations().forEach(a => a.cancel());
    }, { passive: true });
    pg.addEventListener('touchmove', e => {
        if (!touching) return;
        const y = e.touches[0].clientY, d = y - prevY; prevY = y;
        const atTop = pg.scrollTop <= 0, atBot = pg.scrollTop + pg.clientHeight >= pg.scrollHeight - 1;
        if (!active) {
            if ((atTop && d > 0) || (atBot && d < 0)) { active = true; dirn = d > 0 ? 1 : -1; raw = 0; } else return;
        }
        raw += d * dirn;
        if (raw <= 0) { active = false; raw = 0; inner.style.transform = ''; $('#tojump').classList.remove('pulse'); return; }
        $('#tojump').classList.toggle('pulse', dirn === 1 && raw > 120 && S.offset !== 0);
        inner.style.transform = `translate3d(0,${(dirn * rubber(raw)).toFixed(1)}px,0)`;
    }, { passive: true });
    const end = () => {
        touching = false;
        if (active) {
            active = false; const cur = dirn * rubber(raw), arm = dirn === 1 && raw > 120 && S.offset !== 0; raw = 0; springBack(cur);
            $('#tojump').classList.remove('pulse');
            if (arm) { buzz(14); jumpToday(); }
        }
    };
    pg.addEventListener('touchend', end, { passive: true });
    pg.addEventListener('touchcancel', end, { passive: true });
    pg.addEventListener('scroll', () => {
        const now = performance.now(), top = pg.scrollTop, dt = now - lastTs;
        if (dt > 0 && dt < 80 && !touching && now - bumpAt > 600) {
            const v = (top - lastTop) / dt;
            const atTop = top <= 0, atBot = top + pg.clientHeight >= pg.scrollHeight - 1;
            if (atTop && v < -.8) { bumpAt = now; springBack(Math.min(Math.abs(v) * 9, 28)); }
            else if (atBot && v > .8) { bumpAt = now; springBack(-Math.min(Math.abs(v) * 9, 28)); }
        }
        lastTop = top; lastTs = now;
    }, { passive: true });
}

/* ---------- sheets ---------- */
let dayView = '';
let openTok = 0, setT = null, setT2 = null, tok2 = 0;
function isOpen() { return $('#sheet').classList.contains('on'); }
function open(html, tall) {
    clearTimeout(clrT); closePop();
    const sh = $('#sheet'), pn = $('#panel');
    pn.innerHTML = '<div class="grab"></div>' + html;
    pn.classList.toggle('tall', !!tall);
    if (sh.classList.contains('on')) return;
    const tk = ++openTok;
    pn.classList.remove('settled');
    void pn.offsetHeight;
    requestAnimationFrame(() => {
        if (tk !== openTok) return;
        sh.classList.add('on');
        clearTimeout(setT); setT = setTimeout(() => { if (sh.classList.contains('on')) pn.classList.add('settled'); }, 620);
    });
}
function close() {
    openTok++; clearTimeout(setT);
    $('#sheet').classList.remove('on'); $('#panel').classList.remove('settled'); modal = null; pending = null; dd = null; dayView = '';
    clearTimeout(clrT);
    clrT = setTimeout(() => { if (!isOpen()) { $('#panel').innerHTML = ''; $('#panel').scrollTop = 0; $('#panel').classList.remove('tall'); } }, 650);
}
function show2() {
    const sh = $('#sheet2'), pn = $('#panel2'), tk = ++tok2;
    pn.classList.remove('settled');
    void pn.offsetHeight;
    requestAnimationFrame(() => {
        if (tk !== tok2) return;
        sh.classList.add('on');
        clearTimeout(setT2); setT2 = setTimeout(() => { if (sh.classList.contains('on')) pn.classList.add('settled'); }, 620);
    });
}
function ask(msg, label, fn) {
    pending = fn;
    open(`<div class="lbl">${t('confirm')}</div><p class="msg">${msg}</p><div class="row"><button class="btn ghost" data-act="close">${t('cancel')}</button><button class="btn danger" data-act="yes">${esc(label)}</button></div>`);
}
const remDefault = r => r === 'morning' ? '07:00' : '20:00';
function openMeal(o) {
    const f = o.id ? findMeal(o.id) : null, m = f && f.m;
    modal = { id: o.id || 0, k: f ? f.k : o.k, cat: m ? m.cat : 'Lunch', text: m ? m.text : '', remind: m ? m.remind : 'off',
              rt: m && m.rt ? m.rt : (m && m.remind !== 'off' ? remDefault(m.remind) : ''),
              medn: m && m.med ? m.med.name : '', medt: m && m.med ? m.med.t : '',
              rep: m && m.sid && S.series[m.sid] ? S.series[m.sid].rep : 'off', dayList: [], from: dayView };
    if (!o.id) {
        let dl = [];
        if (weekView()) { const ws = curWs(); dl = orderDates(ws, daysOf(ws)).map(key); }
        if (!dl.includes(modal.k)) dl.unshift(modal.k);
        modal.dayList = dl;
    }
    drawMeal();
}
function readForm() {
    const a = $('#f-text'); if (!a || !modal) return;
    modal.text = a.value; modal.medn = $('#f-medn').value;
}
function drawMeal() {
    const d = parse(modal.k);
    open(`<div class="lbl">${t(modal.id ? 'editMeal' : 'addMeal')} · ${esc(dayName(d))} ${esc(fmtDayY(d))}</div>
        ${!modal.id && modal.dayList.length > 1 ? `<div class="fl">${t('dayL')}</div><div class="chips">${modal.dayList.map(k2 => { const d2 = parse(k2); return `<button class="chip${modal.k === k2 ? ' on' : ''}" data-act="pickday" data-v="${k2}">${esc(dayShort(d2))} ${dnum(d2)}</button>`; }).join('')}</div>` : ''}
        <div class="fl">${t('category')}</div><div class="chips">${CATS.map(c => `<button class="chip${modal.cat === c ? ' on' : ''}" data-act="pickcat" data-v="${c}">${CAT_ICO[c]}${esc(tc(c))}</button>`).join('')}</div>
        <div class="fl">${t('food')}</div><input id="f-text" maxlength="140" autocomplete="off" placeholder="${esc(t('foodPh'))}" value="${esc(modal.text)}">
        <div id="f-err" class="err"></div><div id="sug" class="chips sug"></div>
        <div class="fl">${t('favLbl')}</div><div class="chips">${S.favs.slice(0, 12).map((f, i) => `<button class="chip sg" data-act="favuse" data-i="${i}">${esc(f.text)}</button>`).join('')}<button class="chip sg" data-act="favsave">${t('favSave')}</button></div>
        <div class="fl">${t('reminder')}</div><div class="chips">${['off', 'evening', 'morning'].map(v => `<button class="chip${modal.remind === v ? ' on' : ''}" data-act="pickrem" data-v="${v}">${esc(t('rem_' + v))}</button>`).join('')}</div>
        ${modal.remind !== 'off' ? `<div class="medrow"><span class="dd">${t('remTime')}</span><button class="timebtn" data-act="time" data-w="rem">${modal.rt ? esc(fmtTime(modal.rt)) : esc(t('setTimeBtn'))}</button></div>` : ''}
        <div class="fl">${t('medLbl')}</div>
        <input id="f-medn" maxlength="60" placeholder="${esc(t('medPh'))}" value="${esc(modal.medn)}">
        <div class="medrow"><span class="dd">${t('remindAt')}</span><button class="timebtn" data-act="time" data-w="med">${modal.medt ? esc(fmtTime(modal.medt)) : esc(t('setTimeBtn'))}</button></div>
        <div class="fl">${t('repeatL')}</div><div class="chips">${['off', 'weekly', 'daily'].map(v => `<button class="chip${modal.rep === v ? ' on' : ''}" data-act="pickrep" data-v="${v}">${esc(t('rep_' + v))}</button>`).join('')}</div>
        <div class="row"><button class="btn ghost" data-act="close">${t('cancel')}</button><button class="btn" data-act="save">${t('save')}</button></div>`);
    refreshSug();
}
function saveMeal() {
    readForm();
    const text = modal.text.trim();
    if (!text) { $('#f-text').focus(); return; }
    const bad = allergenIn(text);
    if (bad) { toast(t('notAllowed'), t('algBlock', bad), 4500); $('#f-text').focus(); return; }
    const medn = modal.medn.trim();
    if (modal.remind !== 'off' && !modal.rt) { toast(t('timeNeeded'), t('timeNeededMeal'), 3500); return; }
    if (medn && !modal.medt) { toast(t('timeNeeded'), t('timeNeededMed'), 3500); return; }
    let med = null;
    if (medn) {
        const old = modal.id ? findMeal(modal.id).m.med : null;
        med = old && old.name === medn && old.t === modal.medt ? old : { name: medn, t: modal.medt, taken: false, fired: false, snz: 0 };
    }
    learn(text, modal.cat);
    const rt = modal.remind === 'off' ? '' : modal.rt;
    ensureDay(parse(modal.k));
    let saved;
    if (modal.id) {
        const m = findMeal(modal.id).m;
        if (m.remind !== modal.remind || (m.rt || '') !== rt) { m.fired = false; m.snz = 0; }
        Object.assign(m, { cat: modal.cat, text, remind: modal.remind, rt, med });
        saved = m;
    } else {
        saved = { id: S.nextId++, cat: modal.cat, text, done: false, remind: modal.remind, rt, fired: false, snz: 0, med };
        (S.meals[modal.k] = S.meals[modal.k] || []).push(saved);
    }
    applySeries(saved, modal.k);
    extendRepeats();
    const wasEdit = !!modal.id, dk = modal.k, backTo = modal.from ? dk : '';
    exp.add(dk); justOpened = dk; setTimeout(() => { justOpened = ''; }, 700);
    close(); save(); render();
    toast(t(wasEdit ? 'mealUpdated' : 'mealAdded'), `${dayName(parse(dk))} ${fmtDayY(parse(dk))}`, 2200);
    checkReminders();
    if (backTo) setTimeout(() => openDay(backTo), 380);
}
function openBulk() {
    const list = selList();
    if (!list.length) { toast(t('nothingEdit'), t('daysNoMeals')); return; }
    open(`<div class="lbl">${esc(t('bulkEdit', list.length))}</div>` + list.map(({ k, m }) =>
        `<div class="brow"><div class="mono dd">${esc(dayShort(parse(k)))} ${esc(fmtDayY(parse(k)))}</div>
        <select data-bc="${m.id}">${CATS.map(c => `<option value="${c}"${c === m.cat ? ' selected' : ''}>${esc(tc(c))}</option>`).join('')}</select>
        <input data-bt="${m.id}" value="${esc(m.text)}" maxlength="140"></div>`).join('') +
        `<div class="row"><button class="btn ghost" data-act="close">${t('cancel')}</button><button class="btn" data-act="bulksave">${t('saveAll')}</button></div>`);
}
function saveBulk() {
    const bad = selList().map(({ m }) => { const x = document.querySelector(`[data-bt="${m.id}"]`); return x ? allergenIn(x.value) : null; }).find(Boolean);
    if (bad) { toast(t('notAllowed'), t('algBulk', bad), 4500); return; }
    selList().forEach(({ m }) => {
        const c = document.querySelector(`[data-bc="${m.id}"]`), x = document.querySelector(`[data-bt="${m.id}"]`);
        if (c) m.cat = c.value;
        if (x && x.value.trim()) { m.text = x.value.trim(); learn(m.text, m.cat); }
    });
    const n = selList().length;
    close(); sel = null; save(); render();
    toast(t('mealsUpdated'), t('nMealsSaved', n), 2200);
}

/* ---------- add day / delete day ---------- */
function openAddDay() {
    const ws = curWs(), have = daysOf(ws), miss = WD_ORDER.filter(wd => !have.includes(wd));
    if (!miss.length) { toast(t('addDayT'), t('allDays'), 3000); return; }
    open(`<div class="lbl">${t('addDayT')}</div><p class="msg">${t('addDayMsg')}</p>` + miss.map(wd => {
        const d = addDays(ws, (wd + 6) % 7);
        return `<button class="pick" data-act="addday-pick" data-wd="${wd}"><span>${esc(dayName(d))}</span><span class="mono dd">${esc(fmtDayY(d))}</span></button>`;
    }).join('') + `<div class="row"><button class="btn ghost" data-act="close">${t('close')}</button></div>`);
}
function drawDel() {
    const d = parse(dd.k), n = meals(dd.k).length;
    open(`<div class="lbl">${t('delDayT')}</div><p class="msg">${esc(dayName(d))} · ${esc(fmtDayY(d))}</p>
        <div class="opt${dd.mode === 'box' ? ' on' : ''}" data-act="delopt" data-v="box"><span class="cb">${CHECK}</span><div><b>${t('delFull')}</b><small>${t('delFullS')}</small></div></div>
        <div class="opt${dd.mode === 'meals' ? ' on' : ''}${n ? '' : ' dis'}" data-act="delopt" data-v="meals"><span class="cb">${CHECK}</span><div><b>${t('delMeals')}</b><small>${n ? t('delMealsS', n) : t('delMealsNone')}</small></div></div>
        <div class="row"><button class="btn ghost" data-act="close">${t('cancel')}</button><button class="btn danger" data-act="delgo">${t('del')}</button></div>`);
}
function doDelete() {
    const k = dd.k, mode = dd.mode, d = parse(k), nm = `${dayName(d)} ${fmtDayY(d)}`;
    close();
    const el = document.querySelector(`.card[data-day="${k}"]`);
    const apply = () => {
        meals(k).forEach(m => markSkip(k, m));
        if (mode === 'box') {
            delete S.meals[k];
            const ws = monday(d); setDays(ws, daysOf(ws).filter(x => x !== d.getDay()));
        } else delete S.meals[k];
        save(); render();
        toast(t(mode === 'box' ? 'dayRemoved' : 'mealsCleared'), t(mode === 'box' ? 'dayGone' : 'dayEmpty', nm), 2800);
    };
    if (el && mode === 'box' && el.animate) {
        try { el.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.9) translateX(-36px)' }], { duration: 300, easing: 'ease-in', fill: 'forwards' }).finished.then(apply, apply); }
        catch (e) { apply(); }
    } else apply();
}

/* ---------- number keypad ---------- */
function kpParse(b) {
    const d = b.split('').map(Number);
    if (!d.length) return { H: '––', M: '––', ok: false, max: 4 };
    const big = d[0] >= 2, hn = big ? 1 : Math.min(2, d.length);
    const H = big ? '0' + d[0] : (d.slice(0, hn).join('') + '–').slice(0, 2);
    const mm = d.slice(hn).join('');
    return { H, M: (mm + '––').slice(0, 2), ok: (big || d.length >= 2) && mm.length === 2, max: big ? 3 : 4, hn, mm };
}
function kpAdd(n) {
    const b = kp.buf, d = b.split('').map(Number), info = kpParse(b);
    if (d.length && b.length >= info.max) return false;
    if (!d.length) { kp.buf = String(n); return true; }
    if (d[0] < 2 && d.length === 1) {
        if ((d[0] === 0 && n === 0) || (d[0] === 1 && n > 2)) return false;
        kp.buf += n; return true;
    }
    if (info.mm.length === 0 && n > 5) return false;
    kp.buf += n; return true;
}
function drawKp() {
    $('#panel2').innerHTML = `<div class="grab"></div><div class="lbl">${t('setTime')}</div>
        <div class="tdisp"><div class="tdig" id="kp-d"></div><div class="ampm"><button class="chip" id="kp-am" data-act="kp-ap" data-v="0">${t('am')}</button><button class="chip" id="kp-pm" data-act="kp-ap" data-v="1">${t('pm')}</button></div></div>
        <div class="kp">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-act="kp-n" data-n="${n}">${n}</button>`).join('')}<button class="key" data-act="kp-bk" aria-label="Backspace">${BKSP}</button><button class="key" data-act="kp-n" data-n="0">0</button><button class="key go" id="kp-ok" data-act="kp-ok" aria-label="OK">${TICK}</button></div>
        <div class="row"><button class="btn ghost" data-act="kp-x">${t('cancel')}</button></div>`;
    updKp();
}
function updKp() {
    const p = kpParse(kp.buf);
    $('#kp-d').innerHTML = `<span>${p.H}</span><i>:</i><span>${p.M}</span>`;
    $('#kp-am').classList.toggle('on', !kp.pm); $('#kp-pm').classList.toggle('on', kp.pm);
    $('#kp-ok').classList.toggle('dis', !p.ok);
}
function openKeypad(w) {
    readForm();
    const cur = w === 'sum' ? S.sum.t : (w === 'rem' ? modal.rt : modal.medt);
    if (cur) { const [h24, mi] = cur.split(':').map(Number), h12 = h24 % 12 || 12; kp = { w, pm: h24 >= 12, buf: (h12 >= 2 && h12 <= 9 ? String(h12) : pad(h12)) + pad(mi) }; }
    else kp = { w, pm: false, buf: '' };
    drawKp();
    show2();
}
function closeKp() { tok2++; clearTimeout(setT2); $('#sheet2').classList.remove('on'); $('#panel2').classList.remove('settled'); kp = null; }
function kpDone() {
    const p = kpParse(kp.buf); if (!p.ok) return;
    const h12 = +p.H, mi = +p.M, h24 = (h12 % 12) + (kp.pm ? 12 : 0), val = pad(h24) + ':' + pad(mi);
    if (kp.w === 'sum') { S.sum.t = val; armSummary(); closeKp(); save(); drawSummary(); return; }
    if (kp.w === 'rem') modal.rt = val; else modal.medt = val;
    closeKp(); drawMeal();
}
function buzz(n) { try { if (navigator.vibrate) navigator.vibrate(n); } catch (e) {} }

/* ---------- sound ---------- */
let AC = null, ringT = null, ringN = 0;
function ac() {
    if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
    if (AC && AC.state === 'suspended') { try { AC.resume(); } catch (e) {} }
    return AC;
}
function chime() {
    const c = ac(); if (!c) return;
    const t0 = c.currentTime + .03;
    [[659.25, 0], [783.99, .22], [1046.5, .44], [1318.5, .95]].forEach(([f, dl]) => {
        [[1, .5], [2, .16], [3, .06]].forEach(([mul, vol]) => {
            const o = c.createOscillator(), g = c.createGain(), s = t0 + dl;
            o.type = 'sine'; o.frequency.value = f * mul;
            g.gain.setValueAtTime(0.0001, s); g.gain.linearRampToValueAtTime(vol * .6, s + .012); g.gain.exponentialRampToValueAtTime(0.0001, s + 1.5);
            o.connect(g); g.connect(c.destination); o.start(s); o.stop(s + 1.6);
        });
    });
}
function startRing() {
    stopRing(); ringN = 0;
    const go = () => { try { chime(); } catch (e) {} buzz([180, 90, 180]); if (++ringN >= 5) { clearInterval(ringT); ringT = null; } };
    go(); ringT = setInterval(go, 3300);
}
function stopRing() { if (ringT) { clearInterval(ringT); ringT = null; } }
document.addEventListener('pointerdown', () => ac(), { once: true });

/* ---------- toast & reminder alerts (swipe to dismiss) ---------- */
function snap(el, fn) { el.style.transition = 'none'; fn(); void el.offsetHeight; el.style.transition = ''; }
function toast(title, body, ms = 4000, act) {
    const el = $('#toast');
    el.innerHTML = `<div><b>${esc(title)}</b>${esc(body)}</div><button data-act="${act ? act.act : 'toast-x'}">${esc(act ? act.label : t('ok'))}</button>`;
    el.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('on'), ms);
}
function swipe(el, gone) {
    let sx = 0, sy = 0, dx = 0, on = false, drag = false, pid = 0, t0 = 0;
    el.addEventListener('pointerdown', e => { if (!el.classList.contains('on')) return; sx = e.clientX; sy = e.clientY; dx = 0; on = true; drag = false; pid = e.pointerId; t0 = performance.now(); });
    el.addEventListener('pointermove', e => {
        if (!on) return;
        const mx = e.clientX - sx, my = e.clientY - sy;
        if (!drag) {
            if (Math.abs(mx) > 10 && Math.abs(mx) > Math.abs(my)) { drag = true; try { el.setPointerCapture(pid); } catch (x) {} el.style.transition = 'none'; }
            else if (Math.abs(my) > 14) { on = false; return; }
        }
        if (drag) { dx = mx; el.style.transform = `translate3d(${dx}px,0,0)`; el.style.opacity = String(1 - Math.min(.7, Math.abs(dx) / (el.offsetWidth || 300))); }
    });
    const end = () => {
        if (!on) return; on = false;
        if (!drag) return; drag = false;
        el.style.transition = '';
        const v = Math.abs(dx) / Math.max(1, performance.now() - t0);
        if (Math.abs(dx) > (el.offsetWidth || 300) * .3 || (v > .6 && Math.abs(dx) > 40)) {
            el.style.transform = `translate3d(${dx > 0 ? 130 : -130}%,0,0)`; el.style.opacity = '0';
            setTimeout(() => { snap(el, () => { el.classList.remove('on'); el.style.transform = ''; el.style.opacity = ''; }); gone(); }, 280);
        } else { el.style.transform = ''; el.style.opacity = ''; }
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}
let alerts = [], curAlert = null;
function pushAlert(a) { alerts.push(a); if (!curAlert) nextAlert(); }
function nextAlert() {
    curAlert = alerts.shift() || null;
    const el = $('#alert');
    if (!curAlert) { el.classList.remove('on'); stopRing(); return; }
    el.innerHTML = `<div class="at"><b>${esc(curAlert.title)}</b>${esc(curAlert.body)}</div>
        <div class="as">${curAlert.kind === 'sum' ? '' : `<span class="sl">${t('snooze')}</span>${[5, 10, 15].map(n => `<button class="zc" data-act="a-snz" data-n="${n}">${esc(t('min', n))}</button>`).join('')}`}<button class="zo" data-act="a-ok">${t('ok')}</button></div>`;
    el.classList.add('on');
    startRing();
}
function endAlert() {
    stopRing(); curAlert = null;
    $('#alert').classList.remove('on');
    if (alerts.length) setTimeout(() => { if (!curAlert) nextAlert(); }, 420);
}
swipe($('#toast'), () => clearTimeout(toastT));
swipe($('#alert'), () => { stopRing(); curAlert = null; if (alerts.length) setTimeout(() => { if (!curAlert) nextAlert(); }, 200); });

/* ---------- reminders ---------- */
function remindAt(k, r, rt) {
    const d = parse(k), [h, mi] = String(rt || remDefault(r)).split(':').map(Number);
    if (r === 'evening') d.setDate(d.getDate() - 1);
    d.setHours(h, mi, 0, 0);
    return d;
}
function medAt(k, tm) { const d = parse(k), [h, mi] = tm.split(':').map(Number); d.setHours(h, mi, 0, 0); return d; }
const mealTime = (k, m) => m.snz || remindAt(k, m.remind, m.rt).getTime();
const medTime = (k, m) => m.med.snz || medAt(k, m.med.t).getTime();
const mealTitle = m => t(m.remind === 'evening' ? 'prepTomorrow' : 'mealPrep');
function checkReminders() {
    const now = Date.now(); let changed = false;
    for (const k in S.meals) S.meals[k].forEach(m => {
        if (m.remind !== 'off' && !m.done && !m.fired) {
            const tm = mealTime(k, m);
            if (tm <= now) {
                m.fired = true; m.snz = 0; changed = true;
                if (now - tm < 6 * 3600e3) pushAlert({ kind: 'meal', id: m.id, title: mealTitle(m), body: `${tc(m.cat)}: ${m.text}` });
            }
        }
        if (m.med && !m.med.taken && !m.med.fired) {
            const tm = medTime(k, m);
            if (tm <= now) {
                m.med.fired = true; m.med.snz = 0; changed = true;
                if (now - tm < 6 * 3600e3) pushAlert({ kind: 'med', id: m.id, title: t('medTime'), body: `${m.med.name} · ${t('afterMeal', tc(m.cat))}` });
            }
        }
    });
    if (S.sum.on && S.sum.t && S.sumFired !== key(today())) {
        const [h, mi] = S.sum.t.split(':').map(Number), at = new Date(); at.setHours(h, mi, 0, 0);
        if (at.getTime() <= now) {
            S.sumFired = key(today()); changed = true;
            const tm = meals(key(addDays(today(), 1)));
            if (tm.length && now - at.getTime() < 6 * 3600e3) pushAlert({ kind: 'sum', id: 0, title: t('sumTitle'), body: summaryText(tm) });
        }
    }
    if (changed) { save(); render(); }
}
const summaryText = list => list.map(m => `${tc(m.cat)}: ${m.text}`).join(' · ');
function snoozeItem(kind, id, n) {
    const f = findMeal(id); if (!f) return;
    const at = Date.now() + n * 60000;
    if (kind === 'med' && f.m.med) { f.m.med.snz = at; f.m.med.fired = false; }
    else { f.m.snz = at; f.m.fired = false; }
    alerts = alerts.filter(a => !(a.id === id && a.kind === kind));
    if (curAlert && curAlert.id === id && curAlert.kind === kind) endAlert();
    save();
}

/* ---------- native background reminders (Android) ---------- */
let nReady = false, nT = null;
function syncNative() { if (!P.LocalNotifications) return; clearTimeout(nT); nT = setTimeout(doSync, 400); }
async function doSync() {
    const LN = P.LocalNotifications;
    try {
        const list = [], now = Date.now();
        for (const k in S.meals) S.meals[k].forEach(m => {
            if (m.remind !== 'off' && !m.done && !m.fired) {
                const at = new Date(mealTime(k, m));
                if (at.getTime() > now) list.push({ id: m.id, title: mealTitle(m), body: `${tc(m.cat)}: ${m.text}`, channelId: 'reminders2', sound: 'reminder.wav', actionTypeId: 'REMINDER', extra: { kind: 'meal', id: m.id }, schedule: { at, allowWhileIdle: true } });
            }
            if (m.med && !m.med.taken && !m.med.fired) {
                const at = new Date(medTime(k, m));
                if (at.getTime() > now) list.push({ id: m.id + 1000000, title: t('medTime'), body: `${m.med.name} · ${t('afterMeal', tc(m.cat))}`, channelId: 'reminders2', sound: 'reminder.wav', actionTypeId: 'REMINDER', extra: { kind: 'med', id: m.id }, schedule: { at, allowWhileIdle: true } });
            }
        });
        if (S.sum.on && S.sum.t) {
            const [sh, sm] = S.sum.t.split(':').map(Number);
            for (let i = 0; i < 14; i++) {
                const at = addDays(today(), i); at.setHours(sh, sm, 0, 0);
                if (at.getTime() <= now) continue;
                const tm = meals(key(addDays(today(), i + 1)));
                if (tm.length) list.push({ id: 2000000 + i, title: t('sumTitle'), body: summaryText(tm), channelId: 'reminders2', sound: 'reminder.wav', extra: { kind: 'sum', id: 0 }, schedule: { at, allowWhileIdle: true } });
            }
        }
        list.sort((a, b) => a.schedule.at - b.schedule.at);
        if (list.length > 400) list.length = 400;
        let p = await LN.checkPermissions();
        if (p.display !== 'granted') { if (!list.length) return; p = await LN.requestPermissions(); if (p.display !== 'granted') return; }
        if (!nReady) { await LN.createChannel({ id: 'reminders2', name: 'Meal & medicine reminders', importance: 5, visibility: 1, vibration: true, sound: 'reminder.wav' }); nReady = true; }
        try { await LN.registerActionTypes({ types: [{ id: 'REMINDER', actions: [{ id: 'snooze', title: `${t('snooze')} · ${t('min', 10)}` }] }] }); } catch (e) {}
        const pend = await LN.getPending();
        if (pend.notifications.length) await LN.cancel({ notifications: pend.notifications.map(n => ({ id: n.id })) });
        if (list.length) await LN.schedule({ notifications: list });
    } catch (e) { console.error(e); }
}
try {
    if (P.LocalNotifications && P.LocalNotifications.addListener) {
        P.LocalNotifications.addListener('localNotificationActionPerformed', ev => {
            try { const x = (ev.notification && ev.notification.extra) || {}; if (ev.actionId === 'snooze' && x.id) snoozeItem(x.kind, +x.id, 10); } catch (e) {}
        });
    }
} catch (e) {}
function setStatusBar() {
    try {
        if (!P.NavBar) return;
        const light = S.theme === 'light';
        const r = P.NavBar.set({ color: bgFor(S.theme), light });
        if (r && r.catch) r.catch(() => {});
    } catch (e) {}
}

/* ---------- theme (circular reveal) ---------- */
function applyTheme(th) {
    document.documentElement.setAttribute('data-theme', th);
    const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', bgFor(th));
    S.theme = th;
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    setStatusBar();
}
let themeBusy = false;
function switchTheme(btn) {
    if (themeBusy) return;
    themeBusy = true;
    const next = S.theme === 'light' ? 'dark' : 'light';
    const r = btn.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 8;
    const ov = document.createElement('div');
    ov.className = 'tov';
    ov.style.cssText = `left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px;background:${bgFor(next)}`;
    document.body.appendChild(ov);
    const end = () => { ov.remove(); themeBusy = false; };
    const reveal = () => {
        applyTheme(next);
        requestAnimationFrame(() => requestAnimationFrame(() => {
            try { ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' }).finished.then(end, end); } catch (e) { end(); }
        }));
    };
    try {
        ov.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 520, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.then(reveal, () => { applyTheme(next); end(); });
    } catch (e) { applyTheme(next); end(); }
}

/* ---------- allergies, learning, suggestions ---------- */
const rxCache = {};
function allergenIn(text) {
    const tt = String(text).toLowerCase();
    return S.allergies.find(a => {
        try {
            const base = a.length > 3 ? a.replace(/(es|s)$/, '') : a;
            const rx = rxCache[base] || (rxCache[base] = new RegExp('(?<![\\p{L}\\p{N}])' + base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '(?:s|es)?(?![\\p{L}\\p{N}])', 'u'));
            return rx.test(tt);
        } catch (e) { return tt.includes(a); }
    }) || null;
}
function learn(text, cat) {
    const bump = (map, x) => {
        const k = x.toLowerCase(), e = map[k] || { t: x, c: 0 };
        e.t = x; e.c++; e.ts = Date.now(); e.cat = cat; map[k] = e;
        const keys = Object.keys(map);
        if (keys.length > 300) keys.sort((a, b) => map[a].c - map[b].c || map[a].ts - map[b].ts).slice(0, 50).forEach(y => delete map[y]);
    };
    bump(S.memory, text);
    text.split(',').map(x => x.trim()).filter(x => x.length > 1).forEach(x => bump(S.items, x));
}
function suggestions(val) {
    const parts = val.split(','), seg = parts[parts.length - 1].trim().toLowerCase();
    if (seg.length < 2) return [];
    const typed = parts.slice(0, -1).map(x => x.trim().toLowerCase());
    const out = [];
    const add = (map, kind) => Object.keys(map).forEach(k => {
        const e = map[k];
        if (k !== seg && k.startsWith(seg) && !typed.includes(k) && !allergenIn(e.t)) out.push({ kind, e });
    });
    if (parts.length === 1) add(S.memory, 'm');
    add(S.items, 'i');
    out.sort((a, b) => b.e.c - a.e.c || b.e.ts - a.e.ts);
    const seen = new Set();
    return out.filter(x => { const k = x.e.t.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 5);
}
function refreshSug() {
    const inp = $('#f-text'); if (!inp) return;
    const a = allergenIn(inp.value);
    $('#f-err').textContent = a ? t('algShort', a) : '';
    inp.classList.toggle('bad', !!a);
    $('#sug').innerHTML = suggestions(inp.value).map(({ kind, e }) =>
        `<button class="chip sg" data-act="sug" data-kind="${kind}" data-t="${esc(e.t)}" data-c="${esc(e.cat || '')}">${esc(e.t)}</button>`).join('');
}
function extras(m) {
    const a = allergenIn(m.text);
    let h = a ? `<div class="alg">${esc(t('contains', a))}</div>` : '';
    if (m.med) {
        const lbl = `${PILL}${esc(m.med.name)} · ${esc(fmtTime(m.med.t))}${m.med.taken ? ' ✓' : ''}`;
        h += sel ? `<span class="medb${m.med.taken ? ' ok' : ''}">${lbl}</span>`
                 : `<button class="medb${m.med.taken ? ' ok' : ''}" data-act="med" data-id="${m.id}">${lbl}</button>`;
    }
    return h;
}
/* ---------- more tools: shopping, favourites, copy, summary, backup ---------- */
function persist() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} }
const backRow = () => `<div class="row"><button class="btn ghost" data-act="more">${t('back')}</button><button class="btn ghost" data-act="close">${t('close')}</button></div>`;
const pickRow = (act, label, sub) => `<button class="pick" data-act="${act}"><span class="pl"><span>${esc(label)}</span>${sub ? `<small>${esc(sub)}</small>` : ''}</span><span class="chv">${CHEV}</span></button>`;
function openMore() {
    const st = medStreak();
    open(`<div class="lbl">${t('moreT')}</div><div class="streak">${st ? `<b>${esc(t('streakT', st))}</b>` : esc(t('streakNone'))}</div>`
        + (S.lock.on ? pickRow('lk-now', t('lockNow')) : '')
        + pickRow('name-open', t('nameT'), dispName())
        + pickRow('lock-open', t('lockT'), S.lock.on ? t('sumOn') : t('sumOff'))
        + (weekView() ? pickRow('copyweek-open', t('copyWeekT')) : '')
        + pickRow('shop-open', t('shopT')) + pickRow('favs-open', t('favT'), S.favs.length ? String(S.favs.length) : '')
        + pickRow('sum-open', t('sumT'), S.sum.on ? t('sumOn') + (S.sum.t ? ' · ' + fmtTime(S.sum.t) : '') : t('sumOff')) + pickRow('backup-open', t('backT'))
        + `<div class="row"><button class="btn ghost" data-act="close">${t('close')}</button></div>`);
}
let shopItems = [], shopKey = '';
function shopScope() {
    if (weekView()) { const ws = curWs(); return { key: key(ws), dates: daysOf(ws).map(wd => addDays(ws, (wd + 6) % 7)) }; }
    const m0 = addDays(monday(today()), S.offset * 28), dates = [];
    for (let w = 0; w < 4; w++) { const ws = addDays(m0, w * 7); daysOf(ws).forEach(wd => dates.push(addDays(ws, (wd + 6) % 7))); }
    return { key: 'm' + key(m0), dates };
}
function drawShop() {
    const sc = shopScope(), map = new Map(); shopKey = sc.key;
    sc.dates.forEach(d => meals(key(d)).forEach(m => {
        if (m.done) return;
        m.text.split(/[,،፣\n]/).map(x => x.trim()).filter(x => x.length > 1).forEach(x => { const k = x.toLowerCase(), e = map.get(k) || { k, t: x, c: 0 }; e.c++; map.set(k, e); });
    }));
    shopItems = [...map.values()].sort((a, b) => a.t.localeCompare(b.t));
    const ticks = S.shop[shopKey] || {};
    open(`<div class="lbl">${t('shopT')}</div><p class="msg">${t('shopMsg')}</p>` + (shopItems.length
        ? shopItems.map((it, i) => `<div class="opt shp${ticks[it.k] ? ' on' : ''}" data-act="shop-t" data-i="${i}"><span class="cb">${CHECK}</span><div><b>${esc(it.t)}${it.c > 1 ? ' ×' + it.c : ''}</b></div></div>`).join('')
        : `<div class="nodays">${t('shopEmpty')}</div>`)
        + `<div class="row">${shopItems.length ? `<button class="btn ghost" data-act="shop-reset">${t('shopReset')}</button>` : ''}<button class="btn ghost" data-act="more">${t('back')}</button></div>`);
}
function drawFavs() {
    open(`<div class="lbl">${t('favT')}</div>` + (S.favs.length
        ? S.favs.map((f, i) => `<div class="hrow"><span>${esc(f.text)}<br><span class="dd">${esc(tc(f.cat))}</span></span><button class="btn danger sm" data-act="fav-del" data-i="${i}">${t('remove')}</button></div>`).join('')
        : `<div class="nodays">${t('favNone')}</div>`) + backRow());
}
function armSummary() {
    if (!S.sum.t) return;
    const [h, mi] = S.sum.t.split(':').map(Number), at = new Date(); at.setHours(h, mi, 0, 0);
    S.sumFired = at.getTime() <= Date.now() ? key(today()) : '';
}
function drawSummary() {
    open(`<div class="lbl">${t('sumT')}</div><p class="msg">${t('sumMsg')}</p>
        <div class="tog"><button class="chip${S.sum.on ? ' on' : ''}" data-act="sum-on">${t('sumOn')}</button><button class="chip${S.sum.on ? '' : ' on'}" data-act="sum-off">${t('sumOff')}</button></div>
        <div class="medrow"><span class="dd">${t('sumTime')}</span><button class="timebtn" data-act="time" data-w="sum">${S.sum.t ? esc(fmtTime(S.sum.t)) : esc(t('setTimeBtn'))}</button></div>` + backRow());
}
let cp = null;
const chipCp = (v, l) => `<button class="chip${cp.sel.has(v) ? ' on' : ''}" data-act="cp-t" data-v="${v}">${esc(l)}</button>`;
function openCopyDay(k) { cp = { mode: 'day', k, sel: new Set() }; drawCopy(); }
function openCopyWeek() { cp = { mode: 'week', k: key(curWs()), sel: new Set() }; drawCopy(); }
function drawCopy() {
    let body;
    if (cp.mode === 'day') {
        const src = parse(cp.k), ws = monday(src), others = [];
        for (let i = 0; i < 7; i++) { const d = addDays(ws, i); if (key(d) !== cp.k) others.push(d); }
        body = `<div class="lbl">${t('copyDayT')} · ${esc(dayName(src))}</div><p class="msg">${t('copyAdds')}</p>
            <div class="fl">${t('copyThis')}</div><div class="chips">${others.map(d => chipCp(key(d), `${dayShort(d)} ${dnum(d)}`)).join('')}</div>
            <div class="fl">${t('copyNext')}</div><div class="chips">${[1, 2, 3].map(n => { const d = addDays(src, 7 * n); return chipCp(key(d), `${t('plusW', n)} · ${fmtDay(d)}`); }).join('')}</div>`;
    } else {
        body = `<div class="lbl">${t('copyWeekT')}</div><p class="msg">${t('copyAdds')}</p><div class="fl">${t('copyWeeks')}</div><div class="chips">${[1, 2, 3, 4].map(n => chipCp('w' + n, t('plusW', n))).join('')}</div>`;
    }
    open(body + `<div class="row"><button class="btn ghost" data-act="${cp.mode === 'day' ? 'close' : 'more'}">${cp.mode === 'day' ? t('cancel') : t('back')}</button><button class="btn" data-act="cp-go">${t('copyGo')}</button></div>`);
}
const cloneMeal = m => ({ id: S.nextId++, cat: m.cat, text: m.text, done: false, remind: m.remind, rt: m.rt || '', fired: false, snz: 0,
    med: m.med ? { name: m.med.name, t: m.med.t, taken: false, fired: false, snz: 0 } : null });
function doCopy() {
    if (!cp.sel.size) { toast(t('copyNone'), '', 2500); return; }
    let n = 0;
    const put = (d, m) => { (S.meals[key(d)] = S.meals[key(d)] || []).push(cloneMeal(m)); n++; };
    if (cp.mode === 'day') {
        const src = meals(cp.k).slice();
        cp.sel.forEach(tk => { const d = parse(tk); src.forEach(m => put(d, m)); ensureDay(d); });
    } else {
        const ws = parse(cp.k);
        daysOf(ws).forEach(wd => {
            const d = addDays(ws, (wd + 6) % 7), src = meals(key(d)).slice();
            if (!src.length) return;
            cp.sel.forEach(v => { const td = addDays(d, 7 * +v.slice(1)); src.forEach(m => put(td, m)); ensureDay(td); });
        });
    }
    cp = null; close(); save(); render(); buzz(15);
    toast(t('copied'), t('copiedB', n), 2800);
    checkReminders();
}
function openBackup() {
    const safe = Object.assign({}, S); delete safe.lock;
    const txt = JSON.stringify({ app: 'lunchmate', v: 2, data: safe });
    open(`<div class="lbl">${t('backT')}</div><p class="msg">${t('backMsg')}</p><textarea id="bk-out" readonly>${esc(txt)}</textarea>
        <div class="row"><button class="btn" data-act="bk-copy">${t('backCopy')}</button></div>
        <div class="fl">${t('restoreL')}</div><textarea id="bk-in" placeholder="${esc(t('restorePh'))}"></textarea>
        <div class="row"><button class="btn ghost" data-act="more">${t('back')}</button><button class="btn danger" data-act="bk-go">${t('restoreGo')}</button></div>`);
}
function copyText(txt, ta) {
    const ok = () => { buzz(12); toast(t('backCopied'), t('backCopiedB'), 2500); };
    const fb = () => { try { ta.focus(); ta.select(); ta.setSelectionRange(0, txt.length); document.execCommand('copy'); ok(); } catch (e) {} };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(ok, fb); return; } } catch (e) {}
    fb();
}
function applyRestore(d) {
    const keep = { theme: S.theme, lang: S.lang, pal: S.pal, dk: S.dk, lock: S.lock };
    S = Object.assign({ mode: 'weekly', offset: 0, meals: {}, extra: {}, hidden: [], days: {}, ensured: '', allergies: [], memory: {}, items: {}, nextId: 100, series: {}, favs: [], shop: {}, sum: { on: false, t: '' }, sumFired: '' }, d, keep);
    fixState(); S.mode = 'weekly'; S.offset = 0; det = null; sel = null;
    extendRepeats();
}
function tryRestore() {
    let d = null;
    try { const o = JSON.parse($('#bk-in').value.trim()); d = o && o.app === 'lunchmate' && o.data ? o.data : null; } catch (e) {}
    if (!d || typeof d !== 'object' || !d.meals || typeof d.meals !== 'object') { toast(t('restoreBad'), t('restoreBadB'), 3500); return; }
    ask(esc(t('restoreAsk')), t('restoreGo'), () => { applyRestore(d); close(); save(); render(); toast(t('restoreOk'), t('restoreOkB'), 3000); });
}
function openDayMenu(k) {
    const d = parse(k), n = meals(k).length;
    open(`<div class="lbl">${t('dayMenuT')} · ${esc(dayName(d))} ${esc(fmtDayY(d))}</div>`
        + (n ? pickRow('dm-copy', t('copyDayT')) + pickRow('dm-clear', t('dmClear'), t('mealsN', n)) : '')
        + pickRow('dm-del', t('delDayT')) + pickRow('dm-sel', t('dmSelect'))
        + `<div class="row"><button class="btn ghost" data-act="close">${t('close')}</button></div>`);
    dd = { k, mode: 'box' };
}
const PI = p => svg(p, 18, 1.6);
const MI = {
    allergy: PI('<path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3zM12 8.5v4M12 15.5h.01"/>'),
    palette: PI('<path d="M12 3a9 9 0 100 18c1.3 0 2-.8 2-1.8 0-.5-.2-.9-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1 .8-1.8 1.8-1.8H17a4 4 0 004-4c0-4-4-8-9-8z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7.5" r="1"/><circle cx="14.5" cy="7.5" r="1"/>'),
    sun: PI('<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.3M12 19.2v2.3M2.5 12h2.3M19.2 12h2.3M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"/>'),
    moon: PI('<path d="M20.5 14.2A8.6 8.6 0 019.8 3.5 8.6 8.6 0 1020.5 14.2z"/>'),
    globe: PI('<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18"/>'),
    calplus: PI('<rect x="3.5" y="5" width="17" height="15" rx="3.5"/><path d="M3.5 10h17M8 3v3.5M16 3v3.5M12 13v5M9.5 15.5h5"/>'),
    spark: PI('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3zM18.5 16l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8z"/>'),
    lock: PI('<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/>'),
    info: PI('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>')
};
function closePop() { const p = $('#pop'); if (p) p.classList.remove('on'); const c = $('#popscrim'); if (c) c.classList.remove('on'); }
function openMenu() {
    const el = $('#pop');
    if (el.classList.contains('on')) { closePop(); return; }
    const rows = [
        ['allergy-open', MI.allergy, t('allergies'), S.allergies.length ? String(S.allergies.length) : ''],
        ['themes', MI.palette, t('themesL'), ''],
        ['theme', S.theme === 'dark' ? MI.sun : MI.moon, t('darkL'), S.theme === 'dark' ? t('sumOn') : t('sumOff')]
    ];
    if (weekView()) rows.push(['addday-open', MI.calplus, t('addDayT'), '']);
    rows.push(['more', MI.spark, t('moreT'), ''], ['lock-open', MI.lock, t('lockT'), S.lock.on ? t('sumOn') : ''], ['info', MI.info, t('infoL'), '']);
    el.innerHTML = rows.map((r, i) => `<button class="pr" style="--k:${i}" data-act="${r[0]}"><span class="pi">${r[1]}</span><span class="pt">${esc(r[2])}</span>${r[3] ? `<span class="px">${r[3]}</span>` : ''}</button>`).join('');
    el.classList.add('on'); $('#popscrim').classList.add('on');
}
function openDay(k) {
    dayView = k;
    const d = parse(k), list = meals(k), done = list.filter(m => m.done).length;
    const rows = list.map(m => {
        const rem = m.remind !== 'off' ? `${t('rem_' + m.remind)}${m.rt ? ' · ' + fmtTime(m.rt) : ''}` : t('noReminder');
        const med = m.med ? `<div class="dpm"><span>${PILL}${esc(m.med.name)} · ${esc(fmtTime(m.med.t))}</span><button class="mini" data-act="dp-med" data-id="${m.id}">${m.med.taken ? '✓ ' + esc(t('medTaken')) : esc(t('medL'))}</button></div>` : '';
        return `<div class="dpr${m.done ? ' done' : ''}"><button class="ck" data-act="dp-done" data-id="${m.id}" aria-label="done">${m.done ? CHECK : ''}</button>
            <div class="eb"><div class="cat"><i class="cdot" style="background:${CAT_COL[m.cat] || 'currentColor'}"></i>${esc(tc(m.cat))}${m.sid ? REPEAT : ''}</div><div class="tx">${esc(m.text)}</div>
            <div class="dpb">${BELL}<span>${esc(rem)}</span></div>${med}</div><button class="mini" data-act="edit" data-id="${m.id}">${t('edit')}</button></div>`;
    }).join('');
    open(`<div class="dpt"><div><div class="lbl">${esc(dayName(d))}</div><div class="dpd">${esc(fmtDayY(d))}</div></div>${list.length ? ring(done, list.length, 46) : ''}</div>`
        + (list.length ? rows : `<div class="nodays" style="padding:26px 0">${PLATE_ART}<br>${t('noMeals')}</div>`)
        + `<div class="row"><button class="btn ghost" data-act="close">${t('close')}</button><button class="btn" data-act="dp-add" data-k="${k}">${t('addMeal')}</button></div>`, true);
    dayView = k;
}
function fabDay() {
    const tk = key(today());
    if (weekView()) { const ws = curWs(), ds = orderDates(ws, daysOf(ws)).map(key); if (ds.includes(tk)) return tk; if (ds.length) return ds[0]; return key(ws); }
    return tk;
}
const mini = (bg, ink) => `<span class="mp" style="background:${bg};color:${ink}"><i class="mh"></i><i class="mc"></i><i class="mc s"></i><i class="mn"></i></span>`;
function drawThemes() {
    open(`<div class="lbl">${t('themeT')}</div><p class="msg">${t('themeMsg')}</p>` + Object.keys(PALS).map(k =>
        `<div class="opt${S.pal === k ? ' on' : ''}" data-act="pal" data-v="${k}"><span class="cb">${CHECK}</span><div><b>${esc(PALS[k].n[lang === 'am' ? 1 : 0])}</b><span class="sw">${PALS[k].sw.map(c => `<i style="background:${c}"></i>`).join('')}</span></div>${mini(PALS[k].bg, PALS[k].ink)}</div>`).join('') +
        `<div class="fl">${t('darkStyle')}</div>` +
        [['black', '#000000', 'dkBlack'], ['grey', '#1C1C1E', 'dkGrey']].map(([v, bg, nm]) =>
            `<div class="opt${S.dk === v ? ' on' : ''}" data-act="dk" data-v="${v}"><span class="cb">${CHECK}</span><div><b>${t(nm)}</b></div>${mini(bg, '#ffffff')}</div>`).join('') +
        `<div class="row"><button class="btn ghost" data-act="close">${t('close')}</button></div>`);
}
function setDk(v) {
    if (v === 'grey' || v === 'black') {
        if (v !== S.dk) {
            S.dk = v;
            const root = document.documentElement;
            if (v === 'grey') root.setAttribute('data-dk', 'grey'); else root.removeAttribute('data-dk');
            persist(); buzz(12);
            if (S.theme === 'dark') {
                root.classList.add('acc'); setTimeout(() => root.classList.remove('acc'), 480);
                const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', bgFor('dark'));
                setStatusBar();
            }
        }
        drawThemes();
    }
}
function setPal(v, el) {
    if (!PALS[v] || themeBusy) return;
    if (v === S.pal) { close(); return; }
    const root = document.documentElement, wasDark = S.theme === 'dark';
    buzz(14);
    const commit = () => {
        S.pal = v;
        if (v === 'classic') root.removeAttribute('data-pal'); else root.setAttribute('data-pal', v);
        try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {}
    };
    if (wasDark) { commit(); close(); switchTheme($('#menu')); return; }
    themeBusy = true;
    close();
    const r = el.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2;
    const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y)) + 8;
    const ov = document.createElement('div');
    ov.className = 'tov';
    ov.style.cssText = `left:${x - R}px;top:${y - R}px;width:${2 * R}px;height:${2 * R}px;background:${PALS[v].bg}`;
    document.body.appendChild(ov);
    const end = () => { ov.remove(); themeBusy = false; };
    const reveal = () => {
        commit();
        const m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', palBg());
        setStatusBar();
        requestAnimationFrame(() => requestAnimationFrame(() => {
            try { ov.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: 'ease-out', fill: 'forwards' }).finished.then(end, end); } catch (e) { end(); }
        }));
    };
    try {
        ov.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' }).finished.then(reveal, () => { commit(); end(); });
    } catch (e) { commit(); end(); }
}
function openInfo() {
    open(`<div class="lbl">${t('infoT')}</div>
        <div class="irow"><span class="dd">${t('devBy')}</span><b>Dagim Bireda</b></div>
        <div class="irow"><span class="dd">${t('emailL')}</span><b class="sel-t">dagim22bireda@gmail.com</b></div>
        <div class="irow"><span class="dd">${t('phoneL')}</span><b class="sel-t">+251 929040636</b></div>
        <div class="irow"><span class="dd">${t('companyL')}</span><b>© Lilo Designs</b></div>
        <div class="row"><button class="btn ghost" data-act="close">${t('close')}</button></div>`);
}
function openAllergy() {
    open(`<div class="lbl">${t('allergies')}</div><p class="msg">${t('algSheetMsg')}</p>
        <div class="fl">${t('addFood')}</div><div class="addrow"><input id="f-alg" maxlength="40" placeholder="${esc(t('algPh'))}"><button class="btn sm" data-act="alg-add">${t('add')}</button></div>` +
        (S.allergies.length ? S.allergies.map(a => `<div class="hrow"><span>${esc(a)}</span><button class="btn danger sm" data-act="alg-del" data-t="${esc(a)}">${t('remove')}</button></div>`).join('') : `<div class="nodays" style="padding:18px 0 0">${t('noAlg')}</div>`) +
        `<div class="row"><button class="btn ghost" data-act="close">${t('close')}</button></div>`);
}

/* ---------- interaction ---------- */
function toggleSel(id) {
    sel = sel || new Set();
    sel.has(id) ? sel.delete(id) : sel.add(id);
    if (!sel.size) sel = null;
}
function setMode(v) {
    if (v === S.mode && det === null) return;
    const dir = v === S.mode ? -1 : (v === 'monthly' ? 1 : -1);
    S.mode = v; S.offset = 0; det = null; sel = null; save(); render(dir);
}
document.addEventListener('click', e => {
    if (Date.now() - swipedAt < 400) return;
    if (lpFired) { lpFired = false; return; }
    if (e.target.id === 'popscrim') { closePop(); return; }
    if (e.target.id === 'sheet') { close(); return; }
    if (e.target.id === 'sheet2') { closeKp(); return; }
    const el = e.target.closest('[data-act]'); if (!el) return;
    const a = el.dataset.act, k = el.dataset.k, id = +el.dataset.id, v = el.dataset.v;
    if (el.closest && el.closest('#pop')) closePop();
    switch (a) {
        case 'mode': setMode(v); break;
        case 'nav': { const nv = v === '0' ? 0 : S.offset + +v; if (nv === S.offset) break; const dr = v === '0' ? (S.offset > 0 ? -1 : 1) : +v; S.offset = nv; save(); render(dr); break; }
        case 'lang': buzz(10); lang = lang === 'en' ? 'am' : 'en'; S.lang = lang; applyLang(); save(); render(0); break;
        case 'theme': buzz(14); switchTheme(el); break;
        case 'info': openInfo(); break;
        case 'more': openMore(); break;
        case 'shop-open': drawShop(); break;
        case 'shop-t': { const it = shopItems[+el.dataset.i]; if (it) { const tk = S.shop[shopKey] = S.shop[shopKey] || {}; if (tk[it.k]) delete tk[it.k]; else tk[it.k] = true; persist(); buzz(8); drawShop(); } break; }
        case 'shop-reset': delete S.shop[shopKey]; persist(); drawShop(); break;
        case 'favs-open': drawFavs(); break;
        case 'fav-del': S.favs.splice(+el.dataset.i, 1); persist(); drawFavs(); break;
        case 'sum-open': drawSummary(); break;
        case 'sum-on': if (!S.sum.t) { toast(t('sumT'), t('sumNeedTime'), 2800); break; } S.sum.on = true; armSummary(); save(); drawSummary(); break;
        case 'sum-off': S.sum.on = false; save(); drawSummary(); break;
        case 'backup-open': openBackup(); break;
        case 'bk-copy': copyText($('#bk-out').value, $('#bk-out')); break;
        case 'bk-go': tryRestore(); break;
        case 'copyday': openCopyDay(k); break;
        case 'copyweek-open': openCopyWeek(); break;
        case 'cp-t': if (cp) { if (cp.sel.has(v)) cp.sel.delete(v); else cp.sel.add(v); drawCopy(); } break;
        case 'cp-go': if (cp) doCopy(); break;
        case 'undo': {
            if (undoBuf) {
                const { k: uk, m: um } = undoBuf;
                (S.meals[uk] = S.meals[uk] || []).push(um);
                if (um.sid && S.series[um.sid]) S.series[um.sid].skip = S.series[um.sid].skip.filter(x => x !== uk);
                ensureDay(parse(uk)); undoBuf = null; save(); render(); buzz(12);
            }
            clearTimeout(toastT); $('#toast').classList.remove('on');
            break;
        }
        case 'dm-copy': { const kk = dd && dd.k; if (kk) openCopyDay(kk); break; }
        case 'dm-clear': if (dd) { dd.mode = 'meals'; drawDel(); } break;
        case 'dm-del': if (dd) { dd.mode = 'box'; drawDel(); } break;
        case 'dm-sel': { const kk = dd && dd.k; close(); if (kk) { toggleSel('d:' + kk); render(); } break; }
        case 'jump': buzz(10); jumpToday(); break;
        case 'dk': setDk(v); break;
        case 'wl-lang': lang = v; S.lang = v; applyLang(); persist(); drawWelcome(false); render(0); break;
        case 'wl-next': wlNext(); break;
        case 'wl-skip': endWelcome(); break;
        case 'new-ok': close(); break;
        case 'name-open': openName(); break;
        case 'name-save': {
            const en = ($('#nm-en').value || '').trim().slice(0, 30), am = ($('#nm-am').value || '').trim().slice(0, 30), oen = (S.names && S.names.en) || '', oam = (S.names && S.names.am) || '';
            if (en !== oen || am !== oam) {
                if (en !== oen && am === oam) setNamesFrom(en || am);
                else if (am !== oam && en === oen) setNamesFrom(am || en);
                else { S.names = { en, am }; S.name = en || am; }
                persist(); render(); toast(t('nameSaved'), dispName(), 2200);
            }
            close(); break;
        }
        case 'lock-open': drawLockSheet(); break;
        case 'lk-setup': close(); openLock('new', { flow: 'setup', cancel: true, salt: newSalt() }); break;
        case 'lk-now': close(); openLock('enter', { cancel: false }); break;
        case 'lk-chg': close(); requireLock(() => openLock('new', { flow: 'change', cancel: true })); break;
        case 'lk-phr': close(); requireLock(() => openLock('phrase-set', { flow: 'phrase', cancel: true })); break;
        case 'lk-off': close(); requireLock(() => { S.lock = { on: false, salt: '', p: '', ph: '' }; persist(); toast(t('lockOffDone'), '', 2500); }); break;
        case 'lk-n': lkDigit(el.dataset.n); break;
        case 'lk-bk': if (lk && lk.buf.length && !lk.busy) { lk.buf = lk.buf.slice(0, -1); buzz(6); updLock(); } break;
        case 'lk-forgot': if (lk) openLock('phrase-ask', { cancel: true, prev: { cancel: lk.cancel, after: lk.after } }); break;
        case 'lk-cancel': lkBack(); break;
        case 'lk-ok': lkPhrase(); break;
        case 'menu': buzz(8); openMenu(); break;
        case 'fab': buzz(10); openMeal({ k: fabDay() }); break;
        case 'setlang': if (v !== lang) { buzz(10); lang = v; S.lang = v; applyLang(); save(); render(0); openMenu(); } break;
        case 'toggleday': {
            if (sel) { toggleSel('d:' + k); render(); break; }
            if (!meals(k).length) { openMeal({ k }); break; }
            if (exp.has(k)) exp.delete(k); else { exp.add(k); justOpened = k; setTimeout(() => { justOpened = ''; }, 700); }
            buzz(6); render(); break;
        }
        case 'themes': drawThemes(); break;
        case 'pal': setPal(v, el); break;
        case 'openweek': det = +el.dataset.w; render(1); break;
        case 'back': det = null; render(-1); break;
        case 'day': if (sel) { toggleSel('d:' + k); render(); } else { buzz(8); openDay(k); } break;
        case 'dp-add': openMeal({ k }); break;
        case 'dp-done': { const f = findMeal(id); if (f) { f.m.done = !f.m.done; buzz(f.m.done ? 14 : 8); save(); render(); if (dayView) openDay(dayView); checkAllDone(id); } break; }
        case 'dp-med': { const f = findMeal(id); if (f && f.m.med) { f.m.med.taken = !f.m.med.taken; buzz(14); save(); render(); if (dayView) openDay(dayView); } break; }
        case 'edit': openMeal({ id }); break;
        case 'entry': if (sel) toggleSel('e:' + id); else { const m = findMeal(id).m; m.done = !m.done; popId = m.done ? id : 0; buzz(m.done ? 14 : 8); save(); checkAllDone(id); setTimeout(() => { popId = 0; }, 700); } render(); break;
        case 'delday': dd = { k, mode: 'box' }; drawDel(); break;
        case 'delopt': if (dd) { dd.mode = v; drawDel(); } break;
        case 'delgo': if (dd) { if (dd.mode === 'meals' && !meals(dd.k).length) { toast(t('alreadyEmpty'), t('delMealsNone'), 3000); break; } doDelete(); } break;
        case 'addday-open': openAddDay(); break;
        case 'addday-pick': {
            const ws = curWs(), wd = +el.dataset.wd, have = daysOf(ws);
            if (!have.includes(wd)) have.push(wd);
            setDays(ws, have); const d = addDays(ws, (wd + 6) % 7); born = key(d); exp.add(born);
            close(); save(); render();
            setTimeout(() => { born = ''; }, 900);
            toast(t('dayAdded', dayName(d)), t('dayAddedB'), 2500);
            break;
        }
        case 'pickcat': readForm(); modal.cat = v; drawMeal(); break;
        case 'pickrem': readForm(); modal.remind = v; drawMeal(); break;
        case 'time': openKeypad(el.dataset.w); break;
        case 'pickrep': readForm(); modal.rep = v; drawMeal(); break;
        case 'pickday': readForm(); modal.k = v; drawMeal(); break;
        case 'favuse': { readForm(); const f = S.favs[+el.dataset.i]; if (f) { modal.text = f.text; if (CATS.includes(f.cat)) modal.cat = f.cat; drawMeal(); } break; }
        case 'favsave': {
            readForm();
            const tx = modal.text.trim();
            if (!tx) { toast(t('favNeed'), '', 2200); break; }
            if (S.favs.some(f => f.text.toLowerCase() === tx.toLowerCase() && f.cat === modal.cat)) { toast(t('favDup'), tx, 2200); break; }
            S.favs.unshift({ cat: modal.cat, text: tx }); S.favs = S.favs.slice(0, 40); save(); drawMeal(); buzz(15);
            toast(t('favSaved'), tx, 2200);
            break;
        }
        case 'kp-n': if (kp) { if (kpAdd(+el.dataset.n)) { buzz(8); updKp(); } else { const dg = $('#kp-d'); dg.classList.remove('shake'); void dg.offsetWidth; dg.classList.add('shake'); buzz(25); } } break;
        case 'kp-bk': if (kp) { kp.buf = kp.buf.slice(0, -1); buzz(8); updKp(); } break;
        case 'kp-ap': if (kp) { kp.pm = v === '1'; updKp(); } break;
        case 'kp-ok': kpDone(); break;
        case 'kp-x': closeKp(); break;
        case 'save': saveMeal(); break;
        case 'bulksave': saveBulk(); break;
        case 'close': close(); break;
        case 'yes': { const f = pending; if (f) f(); break; }
        case 'sel-cancel': sel = null; render(); break;
        case 'sel-edit': openBulk(); break;
        case 'sel-del': {
            const list = selList();
            if (!list.length) { toast(t('alreadyEmpty'), t('selEmpty'), 3500); break; }
            ask(esc(t('delSel', list.length)), t('del'), () => { delIds(new Set(list.map(x => x.m.id))); sel = null; close(); save(); render(); toast(t('deleted'), t('nRemoved', list.length), 2500); });
            break;
        }
        case 'sug': {
            readForm();
            if (el.dataset.kind === 'm') { modal.text = el.dataset.t; if (CATS.includes(el.dataset.c)) modal.cat = el.dataset.c; }
            else { const parts = modal.text.split(',').map(x => x.trim()); parts[parts.length - 1] = el.dataset.t; modal.text = parts.join(', '); }
            drawMeal();
            const inp = $('#f-text'); inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length);
            break;
        }
        case 'med': {
            const m = findMeal(id).m; m.med.taken = !m.med.taken; buzz(14); save(); render();
            const st = m.med.taken ? medStreak() : 0;
            toast(t(m.med.taken ? 'medTaken' : 'medNot'), st > 1 ? `${m.med.name} · ${t('streakToast', st)}` : m.med.name, 2600);
            break;
        }
        case 'allergy-open': openAllergy(); break;
        case 'alg-add': {
            const added = $('#f-alg').value.split(/[,\n]/).map(x => x.trim().toLowerCase()).filter(x => x.length > 1 && !S.allergies.includes(x));
            if (!added.length) { toast(t('nothingAdd'), t('typeFood'), 2500); break; }
            S.allergies.push(...added); save(); render(); openAllergy();
            let n = 0; for (const kk in S.meals) S.meals[kk].forEach(m => { if (allergenIn(m.text)) n++; });
            toast(t('algSaved'), n ? t('algMarked', n) : t('algBlocked', added.join(', ')), 4000);
            break;
        }
        case 'alg-del': S.allergies = S.allergies.filter(x => x !== el.dataset.t); save(); render(); openAllergy(); toast(t('removed'), t('algAgain', el.dataset.t), 2500); break;
        case 'a-snz': { if (curAlert) { const n = +el.dataset.n; snoozeItem(curAlert.kind, curAlert.id, n); toast(t('snoozed'), t('snoozedB', n), 2600); } break; }
        case 'a-ok': endAlert(); break;
        case 'toast-x': clearTimeout(toastT); $('#toast').classList.remove('on'); break;
    }
});
/* press-and-hold on a meal or a day starts bulk selection */
document.addEventListener('pointerdown', e => {
    lpFired = false;
    const el = e.target.closest('[data-lp]');
    if (!el || e.target.closest('button') || isOpen()) return;
    lpX = e.clientX; lpY = e.clientY;
    lpT = setTimeout(() => {
        lpFired = true; buzz(30);
        const v = el.dataset.lp;
        if (v[0] === 'd' && !sel) openDayMenu(v.slice(2)); else { toggleSel(v); render(); }
    }, 520);
});
['pointerup', 'pointercancel'].forEach(tp => document.addEventListener(tp, () => clearTimeout(lpT)));
document.addEventListener('pointermove', e => { if (lpT && Math.hypot(e.clientX - lpX, e.clientY - lpY) > 10) clearTimeout(lpT); });
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('input', e => { if (e.target.id === 'f-text') refreshSug(); });
function rollover() {
    const dk = key(today());
    if (dk !== lastDay) { lastDay = dk; ensureToday(); extendRepeats(); save(); render(); }
}
document.addEventListener('visibilitychange', () => { if (!document.hidden) { rollover(); checkReminders(); render(); } });
if (P.App && P.App.addListener) {
    P.App.addListener('backButton', () => {
        if ($('#pop').classList.contains('on')) closePop();
        else if (lkOn()) lkBack();
        else if ($('#welcome').classList.contains('on')) endWelcome();
        else if ($('#sheet2').classList.contains('on')) closeKp();
        else if (isOpen()) close();
        else if (sel) { sel = null; render(); }
        else if (S.mode === 'monthly' && det !== null) { det = null; render(-1); }
        else P.App.exitApp();
    });
}

/* ---------- swipe a meal: right = done, left = delete (with undo) ---------- */
let swr = null, swipedAt = 0, undoBuf = null;
document.addEventListener('pointerdown', e => {
    const el = e.target.closest && e.target.closest('.en');
    if (!el || sel || isOpen() || e.target.closest('button')) return;
    swr = { el, id: +el.dataset.id, sx: e.clientX, sy: e.clientY, dx: 0, drag: false, pid: e.pointerId, buzzed: false };
});
document.addEventListener('pointermove', e => {
    if (!swr) return;
    const dx = e.clientX - swr.sx, dy = e.clientY - swr.sy;
    if (!swr.drag) {
        if (Math.abs(dx) > 12 && Math.abs(dx) > Math.abs(dy) * 1.4) {
            swr.drag = true; clearTimeout(lpT);
            try { swr.el.setPointerCapture(swr.pid); } catch (x) {}
            swr.el.style.transition = 'none';
        } else { if (Math.abs(dy) > 12) swr = null; return; }
    }
    swr.dx = dx;
    swr.el.style.transform = `translate3d(${dx}px,0,0)`;
    swr.el.classList.toggle('swr', dx > 90); swr.el.classList.toggle('swl', dx < -90);
    if (Math.abs(dx) > 90 && !swr.buzzed) { swr.buzzed = true; buzz(10); } else if (Math.abs(dx) <= 90) swr.buzzed = false;
});
function swipeEnd() {
    if (!swr) return;
    const o = swr; swr = null;
    if (!o.drag) return;
    swipedAt = Date.now();
    const el = o.el;
    el.style.transition = ''; el.classList.remove('swr', 'swl');
    const back = () => {
        try { el.animate([{ transform: `translate3d(${o.dx}px,0,0)` }, { transform: 'translate3d(0,0,0)' }], { duration: 480, easing: 'cubic-bezier(.2,1.3,.4,1)' }); } catch (x) {}
        el.style.transform = '';
    };
    if (o.dx > 90) {
        back();
        const f = findMeal(o.id);
        if (f) { f.m.done = !f.m.done; popId = f.m.done ? o.id : 0; buzz(14); save(); setTimeout(() => { render(); popId = 0; checkAllDone(o.id); }, 220); }
    } else if (o.dx < -90) {
        const f = findMeal(o.id);
        if (!f) { back(); return; }
        const del = () => {
            markSkip(f.k, f.m);
            S.meals[f.k] = S.meals[f.k].filter(x => x.id !== o.id);
            if (!S.meals[f.k].length) delete S.meals[f.k];
            undoBuf = { k: f.k, m: f.m };
            buzz(20); save(); render();
            toast(t('mealRemoved'), f.m.text, 5000, { label: t('undo'), act: 'undo' });
        };
        try { el.animate([{ transform: `translate3d(${o.dx}px,0,0)`, opacity: 1 }, { transform: 'translate3d(-110%,0,0)', opacity: 0 }], { duration: 240, easing: 'ease-in', fill: 'forwards' }).finished.then(del, del); } catch (x) { del(); }
    } else back();
}
['pointerup', 'pointercancel'].forEach(tp => document.addEventListener(tp, swipeEnd));

/* ---------- drag a sheet down by its handle to close ---------- */
let sd = null;
document.addEventListener('pointerdown', e => {
    const g = e.target.closest && e.target.closest('.grab');
    if (!g) return;
    const pn = g.closest('.panel');
    if (!pn) return;
    sd = { pn, two: pn.id === 'panel2', sy: e.clientY, dy: 0, t0: performance.now() };
    try { g.setPointerCapture(e.pointerId); } catch (x) {}
    pn.style.transition = 'none';
});
document.addEventListener('pointermove', e => {
    if (!sd) return;
    sd.dy = Math.max(0, e.clientY - sd.sy);
    sd.pn.style.transform = `translate3d(0,${sd.dy}px,0)`;
});
function sdEnd() {
    if (!sd) return;
    const o = sd; sd = null;
    const v = o.dy / Math.max(1, performance.now() - o.t0), closing = o.dy > 120 || (v > .6 && o.dy > 40);
    o.pn.style.transition = ''; o.pn.style.transform = '';
    if (closing) { buzz(8); if (o.two) closeKp(); else close(); }
}
['pointerup', 'pointercancel'].forEach(tp => document.addEventListener(tp, sdEnd));

/* ---------- swipe the page left/right: Weekly <-> Monthly ---------- */
let pg0 = null;
$('#stage').addEventListener('touchstart', e => {
    if (e.touches.length !== 1 || sel || isOpen() || (e.target.closest && e.target.closest('.en'))) { pg0 = null; return; }
    pg0 = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
}, { passive: true });
$('#stage').addEventListener('touchend', e => {
    if (!pg0) return;
    const c = e.changedTouches[0], dx = c.clientX - pg0.x, dy = c.clientY - pg0.y, dt = Date.now() - pg0.t;
    pg0 = null;
    if (Math.abs(dx) < 80 || Math.abs(dy) > Math.abs(dx) * .6 || dt > 700 || Date.now() - swipedAt < 400) return;
    if (dx < 0 && S.mode === 'weekly') { buzz(10); setMode('monthly'); }
    else if (dx > 0 && S.mode === 'monthly') { buzz(10); if (det !== null) { det = null; render(-1); } else setMode('weekly'); }
}, { passive: true });

/* ---------- welcome cards + what's new ---------- */
let wStep = 0, wSteps = [], wlName = '';
const PERSON_ART = svg('<circle cx="12" cy="8.5" r="4"/><path d="M4.5 20.5c.8-4 3.8-6 7.5-6s6.7 2 7.5 6"/>', 84, 1);
const SPARK_ART = svg('<path d="M12 3l1.9 5.6L19.5 10.5l-5.6 1.9L12 18l-1.9-5.6L4.5 10.5l5.6-1.9L12 3zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16z"/>', 84, 1);
const INFO_ART = svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6h.01"/>', 84, 1);
const WL_ART = [
    svg('<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.6"/><path d="M2.2 5.5v6M4.4 5.5v6M3.3 11.5v7M21.2 5.5c-1.3 1-1.9 3.2-1.9 5.5h1.9v7.5"/>', 84, 1),
    svg('<path d="M6 8a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8M10 21a2 2 0 004 0"/>', 84, 1),
    svg('<circle cx="8.5" cy="9" r="4.5"/><circle cx="15.5" cy="9" r="4.5"/><circle cx="12" cy="15" r="4.5"/>', 84, 1)
];
function startWelcome() {
    wSteps = S.name ? ['w1', 'w2', 'w3', 'about'] : ['name', 'hello', 'w1', 'w2', 'w3', 'about'];
    wStep = 0; drawWelcome(true);
}
const wId = () => wSteps[wStep];
function wlBody() {
    const id = wId();
    if (id === 'name') return `<div class="wl-art">${PERSON_ART}</div><h2 class="wl-t">${t('askName')}</h2><p class="wl-b">${t('askNameB')}</p><input id="wl-name" maxlength="30" autocomplete="off" placeholder="${esc(t('namePh'))}" value="${esc(wlName)}"><div id="wl-err" class="err"></div>`;
    if (id === 'hello') return `<div class="wl-art spark">${SPARK_ART}</div><h2 class="wl-t">${esc(t('hello', dispName()))}</h2><p class="wl-b">${t('helloB')}</p>`;
    if (id === 'about') return `<div class="wl-art">${INFO_ART}</div><h2 class="wl-t">${t('aboutT')}</h2><p class="wl-b">${t('devBy')}<br><b>Dagim Bireda</b></p><div class="wl-ab"><div>${t('emailL')}: dagim22bireda@gmail.com</div><div>${t('phoneL')}: +251 929040636</div><div>${t('companyL')}: © Lilo Designs</div></div>`;
    const i = +id[1] - 1;
    return `<div class="wl-art">${WL_ART[i]}</div><h2 class="wl-t">${t('w' + (i + 1) + 't')}</h2><p class="wl-b">${t('w' + (i + 1) + 'b')}</p>`;
}
function wlBtn() { return t(wStep >= wSteps.length - 1 ? 'getStarted' : 'next'); }
function drawWelcome(anim) {
    const el = $('#welcome');
    el.innerHTML = `<div class="wl-top"><div class="chips"><button class="chip${lang === 'en' ? ' on' : ''}" data-act="wl-lang" data-v="en">English</button><button class="chip${lang === 'am' ? ' on' : ''}" data-act="wl-lang" data-v="am">አማርኛ</button></div><button class="wl-skip" data-act="wl-skip">${t('skip')}</button></div>
        <div class="wl-body" id="wl-body">${wlBody()}</div>
        <div class="wl-dots">${wSteps.map((_, i) => `<i class="${i === wStep ? 'on' : ''}"></i>`).join('')}</div>
        <button class="btn wl-next" data-act="wl-next">${wlBtn()}</button>`;
    el.classList.add('on');
    if (anim) { try { $('#wl-body').animate([{ opacity: 0, transform: 'translate3d(0,22px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { duration: 520, easing: 'cubic-bezier(.2,.9,.25,1.08)' }); } catch (e) {} }
    if (wId() === 'name') setTimeout(() => { const i = $('#wl-name'); if (i && !lkOn()) i.focus(); }, 650);
}
function wlNext() {
    if (wId() === 'name') {
        const nm = wlName.trim();
        if (!nm) {
            const e = $('#wl-err'); if (e) e.textContent = t('nameNeed');
            const inp = $('#wl-name'); if (inp) { inp.classList.add('bad'); try { inp.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-8px)' }, { transform: 'translateX(7px)' }, { transform: 'translateX(-4px)' }, { transform: 'translateX(0)' }], { duration: 320 }); } catch (x) {} }
            buzz(30); return;
        }
        setNamesFrom(nm); persist();
        try { document.activeElement && document.activeElement.blur && document.activeElement.blur(); } catch (x) {}
    }
    if (wStep >= wSteps.length - 1) { endWelcome(); return; }
    wStep++;
    $('#wl-body').innerHTML = wlBody();
    document.querySelectorAll('.wl-dots i').forEach((d, i) => d.classList.toggle('on', i === wStep));
    $('.wl-next').textContent = wlBtn();
    try { $('#wl-body').animate([{ opacity: 0, transform: 'translate3d(36px,0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { duration: 520, easing: 'cubic-bezier(.2,.9,.25,1.08)' }); } catch (e) {}
    buzz(8);
    if (wId() === 'hello') setTimeout(celebrate, 350);
    render();
}
function endWelcome() {
    $('#welcome').classList.remove('on');
    S.welcomed = true; S.asked = true;
    persist(); render();
}
document.addEventListener('input', e => { if (e.target && e.target.id === 'wl-name') { wlName = e.target.value; e.target.classList.remove('bad'); const er = $('#wl-err'); if (er) er.textContent = ''; } });
function openName() {
    open(`<div class="lbl">${t('nameT')}</div><p class="msg">${t('nameAuto')}</p>
        <div class="fl">English</div><input id="nm-en" maxlength="30" autocomplete="off" value="${esc((S.names && S.names.en) || '')}">
        <div class="fl">አማርኛ</div><input id="nm-am" maxlength="30" autocomplete="off" value="${esc((S.names && S.names.am) || '')}">
        <div class="row"><button class="btn ghost" data-act="more">${t('back')}</button><button class="btn" data-act="name-save">${t('save')}</button></div>`);
}

/* ---------- app lock (PIN + recovery phrase) ---------- */
let lk = null, lkFail = 0, lkUntil = 0, hideAt = 0;
const LOCK_ICO = svg('<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 018 0v2.5"/><circle cx="12" cy="15.5" r="1" fill="currentColor"/>', 44, 1.4);
const lkOn = () => $('#lock').classList.contains('on');
async function hashStr(str) {
    try {
        const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
        return Array.from(new Uint8Array(b)).map(x => x.toString(16).padStart(2, '0')).join('');
    } catch (e) {
        let h = 5381; for (let i = 0; i < str.length; i++) h = ((h << 5) + h + str.charCodeAt(i)) | 0;
        return 'f' + (h >>> 0).toString(16) + str.length;
    }
}
const normPhrase = x => String(x).trim().toLowerCase().replace(/\s+/g, ' ');
const newSalt = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
function openLock(mode, o) {
    lk = Object.assign({ mode, buf: '', first: '', cancel: false, after: null, auto: false, pinHash: '', salt: '', flow: '', prev: null, busy: false }, o || {});
    drawLock();
    $('#lock').classList.add('on');
    if (mode === 'phrase-set' || mode === 'phrase-ask') setTimeout(() => { const i = $('#lk-ph'); if (i) i.focus(); }, 350);
}
function closeLock() { $('#lock').classList.remove('on'); lk = null; }
function requireLock(fn) { openLock('enter', { cancel: true, after: fn }); }
function lkBack() {
    if (!lk) return;
    if (lk.mode === 'phrase-ask') openLock('enter', lk.prev || { cancel: false });
    else if (lk.cancel) closeLock();
}
function drawLock() {
    const m = lk.mode, titles = { enter: 'lockEnter', new: 'lockNew', confirm: 'lockConfirm', 'phrase-set': 'phraseNew', 'phrase-ask': 'phraseAsk' };
    let body;
    if (m === 'phrase-set' || m === 'phrase-ask') {
        body = `<p class="lk-s">${m === 'phrase-set' ? esc(t('phraseHint')) : ''}</p><input id="lk-ph" maxlength="60" autocomplete="off" placeholder="${esc(t('phrasePh'))}"><div id="lk-err" class="err"></div>
            <div class="row"><button class="btn ghost" data-act="lk-cancel">${t('cancel')}</button><button class="btn" data-act="lk-ok">${t(m === 'phrase-set' ? 'save' : 'verifyBtn')}</button></div>`;
    } else {
        body = `<div class="lk-dots" id="lk-dots"><i></i><i></i><i></i><i></i></div><div id="lk-err" class="err"></div>
            <div class="kp lk-kp">${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="key" data-act="lk-n" data-n="${n}">${n}</button>`).join('')}<span></span><button class="key" data-act="lk-n" data-n="0">0</button><button class="key" data-act="lk-bk" aria-label="Backspace">${BKSP}</button></div>
            <div class="lk-links">${m === 'enter' ? `<button class="lk-link" data-act="lk-forgot">${t('lockForgot')}</button>` : ''}${lk.cancel ? `<button class="lk-link" data-act="lk-cancel">${t('cancel')}</button>` : ''}</div>`;
    }
    $('#lock').innerHTML = `<div class="lk-in"><div class="lk-ico">${LOCK_ICO}</div><h2 class="lk-t">${t(titles[m])}</h2>${body}</div>`;
    updLock();
}
function updLock() { document.querySelectorAll('#lock .lk-dots i').forEach((d, i) => d.classList.toggle('on', lk && i < lk.buf.length)); }
function lkErr(msg) { const e = $('#lk-err'); if (e) e.textContent = msg; }
function lkWrong(msg) {
    buzz(40); lkErr(msg);
    const d = $('#lk-dots'); if (d) { d.classList.remove('shake'); void d.offsetWidth; d.classList.add('shake'); }
    if (lk) { lk.buf = ''; updLock(); }
}
async function lkDigit(n) {
    if (!lk || lk.busy || lk.mode === 'phrase-set' || lk.mode === 'phrase-ask') return;
    if (Date.now() < lkUntil) { lkErr(t('tooMany', Math.ceil((lkUntil - Date.now()) / 1000))); return; }
    if (lk.buf.length >= 4) return;
    lk.buf += n; buzz(8); updLock(); lkErr('');
    if (lk.buf.length === 4) { lk.busy = true; await lkSubmit(); if (lk) lk.busy = false; }
}
async function lkSubmit() {
    const m = lk.mode, b = lk.buf;
    if (m === 'enter') {
        const h = await hashStr(S.lock.salt + ':' + b);
        if (h === S.lock.p) { lkFail = 0; const f = lk.after; closeLock(); buzz(10); if (f) f(); }
        else { lkFail++; if (lkFail >= 5) { lkFail = 0; lkUntil = Date.now() + 30000; } lkWrong(t('lockWrong')); }
    } else if (m === 'new') {
        lk.first = b; lk.buf = ''; lk.mode = 'confirm'; drawLock();
    } else if (m === 'confirm') {
        if (b !== lk.first) { lkWrong(t('lockMismatch')); setTimeout(() => { if (lk && lk.mode === 'confirm') { lk.mode = 'new'; lk.first = ''; lk.buf = ''; drawLock(); lkErr(t('lockMismatch')); } }, 700); return; }
        const salt = lk.salt || S.lock.salt || newSalt(), h = await hashStr(salt + ':' + b);
        if (lk.flow === 'setup') { lk.salt = salt; lk.pinHash = h; lk.mode = 'phrase-set'; lk.buf = ''; drawLock(); setTimeout(() => { const i = $('#lk-ph'); if (i) i.focus(); }, 350); }
        else { S.lock.p = h; persist(); closeLock(); toast(t('lockPinSaved'), '', 2500); }
    }
}
async function lkPhrase() {
    const inp = $('#lk-ph'); if (!inp || !lk) return;
    const v = normPhrase(inp.value);
    if (lk.mode === 'phrase-set') {
        if (v.length < 4) { lkErr(t('phraseShort')); return; }
        const salt = lk.salt || S.lock.salt, ph = await hashStr(salt + ':ph:' + v);
        if (lk.flow === 'setup') S.lock = { on: true, salt, p: lk.pinHash, ph }; else S.lock.ph = ph;
        persist(); closeLock(); buzz(14); toast(t('lockSet'), '', 2500);
    } else {
        const h = await hashStr(S.lock.salt + ':ph:' + v);
        if (h === S.lock.ph) { lkFail = 0; lkUntil = 0; openLock('new', { flow: 'reset', cancel: false }); }
        else lkErr(t('phraseBad'));
    }
}
function drawLockSheet() {
    open(`<div class="lbl">${t('lockT')}</div><p class="msg">${t('lockNote')}</p>` + (S.lock.on
        ? pickRow('lk-now', t('lockNow')) + pickRow('lk-chg', t('lockChange')) + pickRow('lk-phr', t('lockPhraseChange')) + pickRow('lk-off', t('lockOff'))
        : pickRow('lk-setup', t('lockSetup'))) + backRow());
}
document.addEventListener('visibilitychange', () => {
    if (!S.lock.on) return;
    if (document.hidden) { hideAt = Date.now(); if (!lkOn()) openLock('enter', { cancel: false, auto: true }); }
    else if (lk && lk.auto && lk.mode === 'enter' && Date.now() - hideAt < 8000) closeLock();
});

/* ---------- header height + start ---------- */
function syncHH() { const h = $('#hdr').offsetHeight; if (h) document.documentElement.style.setProperty('--hh', h + 'px'); }

$('#fl-en').innerHTML = FLAG_US; $('#fl-am').innerHTML = FLAG_ET;
applyLang();
if (S.name && !S.names.en && !S.names.am) setNamesFrom(S.name);
if (S.lock.on) openLock('enter', { cancel: false });
ensureToday();
extendRepeats();
setStatusBar();
render();
if (!S.welcomed) startWelcome();
syncHH();
if (window.ResizeObserver) new ResizeObserver(syncHH).observe($('#hdr'));
window.addEventListener('resize', syncHH);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(syncHH);
checkReminders();
syncNative();
syncWidget();
setInterval(() => { rollover(); checkReminders(); tickCountdown(); }, 30000);
