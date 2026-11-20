'use strict';
/* =====================================================================
   LunchMate Notebook (v2.1.0)
   Recipes, food photos, cooking-video links, cook mode, share-to-app.
   Loaded after app.js (uses its globals: S, t, open, close, toast ...).
   Photos live in IndexedDB; note text lives in S.notes.
   ===================================================================== */
const NB_MAX_IMG = 12;
const NB_KINDS = ['recipe', 'video', 'idea'];
const NB_FILTERS = ['all', 'recipe', 'video', 'idea', 'fav', 'todo'];
const NB_KCOL = { recipe: '#F2A93B', video: '#E0709A', idea: '#3AA7D9' };

Object.assign(TX, {
    notes: ['Notebook', 'ደብተር'],
    nbSearch: ['Search recipes, tags…', 'አዘገጃጀት፣ መለያ ፈልግ…'],
    nf_all: ['All', 'ሁሉም'], nf_recipe: ['Recipes', 'አዘገጃጀቶች'], nf_video: ['Videos', 'ቪዲዮዎች'], nf_idea: ['Ideas', 'ሃሳቦች'], nf_fav: ['Favourites', 'ተወዳጆች'], nf_todo: ['To cook', 'የሚበሰሉ'],
    k_recipe: ['Recipe', 'አዘገጃጀት'], k_video: ['Video', 'ቪዲዮ'], k_idea: ['Idea', 'ሃሳብ'],
    nbNew: ['New note', 'አዲስ ማስታወሻ'], nbEdit: ['Edit note', 'ማስታወሻ አርም'],
    nbEmpty: ['Your notebook is empty', 'ደብተርዎ ባዶ ነው'],
    nbEmptyB: ['Save recipes, food photos and cooking videos here so you always remember what to cook.', 'የሚያበስሉትን ለማስታወስ አዘገጃጀቶችን፣ የምግብ ፎቶዎችን እና የማብሰያ ቪዲዮዎችን እዚህ ያስቀምጡ።'],
    nbNoMatch: ['Nothing matches your search.', 'ከፍለጋዎ ጋር የሚመሳሰል የለም።'],
    nbAddFirst: ['Add a note', 'ማስታወሻ ጨምር'],
    fTitle: ['Title', 'ርዕስ'], fTitlePh: ['e.g. Doro wat, Pasta carbonara', 'ለምሳሌ ዶሮ ወጥ'],
    fPhotos: ['Photos', 'ፎቶዎች'], fGallery: ['Gallery', 'ጋለሪ'], fCamera: ['Camera', 'ካሜራ'],
    fVideos: ['Cooking videos (YouTube, TikTok…)', 'የማብሰያ ቪዲዮዎች (ዩቲዩብ፣ ቲክቶክ…)'],
    fUrlPh: ['Paste a video link', 'የቪዲዮ ሊንክ ይለጥፉ'], fPaste: ['Paste', 'ለጥፍ'],
    fIng: ['Ingredients', 'ንጥረ ነገሮች'], fSteps: ['Steps', 'የአሰራር ደረጃዎች'],
    rowIng: ['Ingredient', 'ንጥረ ነገር'], rowStep: ['Describe this step', 'ይህን ደረጃ ይግለጹ'],
    addIng: ['Add ingredient', 'ንጥረ ነገር ጨምር'], addStep: ['Add step', 'ደረጃ ጨምር'],
    bkMsg: ['Saves everything (meals, notebook and photos) in one .json file on your phone. Keep that file safe, then choose the same file here to restore.', 'ሁሉንም (ምግቦች፣ ደብተር እና ፎቶዎች) በስልክዎ ላይ በአንድ .json ፋይል ያስቀምጣል። ፋይሉን በደህና ያስቀምጡት፤ ለመመለስ ያንኑ ፋይል እዚህ ይምረጡ።'],
    bkSave: ['Save backup file', 'የምትኬ ፋይል አስቀምጥ'], bkSaveSub: ['Downloads › LunchMate', 'ማውረዶች › LunchMate'],
    bkPick: ['Restore from backup file', 'ከምትኬ ፋይል መልስ'], bkPickSub: ['Choose your .json file', 'የ.json ፋይልዎን ይምረጡ'],
    bkLast: [d => `Last backup: ${d}`, d => `መጨረሻ ምትኬ፡ ${d}`], bkNever: ['No backup saved yet', 'እስካሁን ምትኬ አልተቀመጠም'],
    bkWorking: ['Saving backup…', 'ምትኬ በማስቀመጥ ላይ…'], bkReading: ['Reading backup…', 'ምትኬ በማንበብ ላይ…'], bkRestoring: ['Restoring…', 'በመመለስ ላይ…'],
    bkSaved: ['Backup saved', 'ምትኬ ተቀምጧል'], bkSavedB: [(n, w) => `${n} photo${n === 1 ? '' : 's'} · ${w}`, (n, w) => `${n} ፎቶ · ${w}`],
    bkFail: ['Could not complete the backup file action.', 'የምትኬ ፋይል እርምጃውን ማጠናቀቅ አልተቻለም።'],
    bkBadB: ['That file is not a LunchMate backup.', 'ይህ ፋይል የLunchMate ምትኬ አይደለም።'],
    bkAsk: [(d, n) => `Replace everything in the app with this backup (${d}${n ? ', ' + n + ' photos' : ''})? Your current meals, notebook and photos will be overwritten.`, (d, n) => `በመተግበሪያው ያለውን ሁሉ በዚህ ምትኬ (${d}${n ? '፣ ' + n + ' ፎቶ' : ''}) ይተካ? አሁን ያሉ ምግቦች፣ ደብተር እና ፎቶዎች ይፃፋሉ።`],
    fNotes: ['Notes', 'ማስታወሻ'], fTags: ['Tags (comma separated)', 'መለያዎች (በኮማ ይለዩ)'], fTagsPh: ['e.g. spicy, fasting, quick', 'ለምሳሌ ቅመም፣ ጾም፣ ፈጣን'],
    badLink: ['That does not look like a link.', 'ይህ ሊንክ አይመስልም።'],
    noClip: ['Clipboard is empty or blocked. Paste into the box.', 'ክሊፕቦርዱ ባዶ ነው ወይም ተከልክሏል። በሳጥኑ ውስጥ ይለጥፉ።'],
    imgBusy: ['Adding photos…', 'ፎቶዎች እየተጨመሩ ነው…'], imgFail: ['Could not add that photo.', 'ፎቶውን መጨመር አልተቻለም።'],
    imgMax: [n => `Up to ${n} photos per note.`, n => `በአንድ ማስታወሻ እስከ ${n} ፎቶ።`],
    titleNeed: ['Give it a title first.', 'መጀመሪያ ርዕስ ይስጡት።'],
    nbSaved: ['Note saved', 'ማስታወሻ ተቀምጧል'], nbDeleted: ['Note deleted', 'ማስታወሻ ተሰርዟል'],
    nbDelAsk: [n => `Delete "${n}" and its photos?`, n => `"${n}" እና ፎቶዎቹ ይሰረዙ?`],
    cookMode: ['Cook mode', 'የማብሰል ሁነታ'], cookedIt: ['Cooked it', 'አብስያለሁ'],
    cookedN: [n => `Cooked ${n}×`, n => `${n} ጊዜ ተበስሏል`], notCooked: ['Not cooked yet', 'ገና አልተበሰለም'],
    lastCooked: [d => `last ${d}`, d => `መጨረሻ ${d}`],
    planIt: ['Plan it', 'አቅድ'], toShop: ['To shopping', 'ወደ ገበያ'], shareIt: ['Share', 'አጋራ'],
    planT: ['Plan this meal', 'ይህን ምግብ አቅድ'], planMsg: ['Pick a category and a day. It is added to your weekly plan.', 'ምድብ እና ቀን ይምረጡ። ወደ ሳምንታዊ እቅድዎ ይጨመራል።'],
    viewPlan: ['View plan', 'እቅዱን እይ'],
    shopAdded: [n => `${n} item${n === 1 ? '' : 's'} added to your shopping list`, n => `${n} ዕቃ ወደ የገበያ ዝርዝር ተጨምሯል`],
    shopNoIng: ['Add ingredients to this note first.', 'መጀመሪያ ንጥረ ነገሮችን ይጨምሩ።'], shopNoNew: ['Already on your shopping list.', 'ቀድሞ በገበያ ዝርዝርዎ ላይ አለ።'],
    shopClear: ['Clear bought', 'የተገዙትን አጽዳ'],
    ingH: ['Ingredients', 'ንጥረ ነገሮች'], stepsH: ['Steps', 'ደረጃዎች'], followH: ['Follow along', 'አብረው ይከተሉ'], openLink: ['Open', 'ክፈት'], photosH: ['Photos', 'ፎቶዎች'],
    stepOf: [(a, b) => `Step ${a} of ${b}`, (a, b) => `ደረጃ ${a} ከ ${b}`], finish: ['Finish · Cooked it', 'ጨርስ · አብስያለሁ'], prev: ['Previous', 'ቀዳሚ'],
    cookNoSteps: ['No steps written. Showing your notes.', 'ደረጃዎች አልተጻፉም። ማስታወሻዎን በማሳየት ላይ።'],
    dice: ['Pick for me', 'ለእኔ ምረጥ'], diceNone: ['Add a few notes first.', 'መጀመሪያ ጥቂት ማስታወሻዎችን ይጨምሩ።'], diceT: ['Why not cook…', 'ለምን አያበስሉም…'], again: ['Another', 'ሌላ'],
    sharedT: ['Link received', 'ሊንክ ደርሷል'], sharedMsg: ['A link was shared to LunchMate. What should we do with it?', 'ሊንክ ወደ LunchMate ተጋርቷል። ምን እናድርገው?'],
    sharedNew: ['Save as a new note', 'እንደ አዲስ ማስታወሻ አስቀምጥ'], sharedAdd: ['Or add it to an existing note', 'ወይም ወደ ነባር ማስታወሻ ጨምር'], linkAdded: ['Link added', 'ሊንክ ተጨምሯል'],
    timerStart: [x => `Start timer · ${x}`, x => `ሰዓት ቆጣሪ ጀምር · ${x}`], timerStop: ['Stop', 'አቁም'], timerDone: ['Timer done', 'ሰዓት ቆጣሪ ጨርሷል'],
    fav: ['Favourite', 'ተወዳጅ'], copiedTxt: ['Recipe copied', 'አዘገጃጀቱ ተቀድቷል'],
    backMsg: ['Copy your backup and keep it somewhere safe (Notes, email…). Paste it back here to restore. Notebook photos stay on this phone and are not part of the text backup.', 'ምትኬዎን ገልብጠው በደህና ቦታ ያስቀምጡ። ለመመለስ እዚህ ይለጥፉት። የደብተር ፎቶዎች በዚህ ስልክ ላይ ይቆያሉ፤ በጽሑፍ ምትኬ ውስጥ አይካተቱም።'],
    n1: ['New Notebook tab: save recipes, food photos and notes', 'አዲስ የደብተር ገጽ፡ አዘገጃጀቶችን፣ የምግብ ፎቶዎችን እና ማስታወሻዎችን ያስቀምጡ'],
    n2: ['Notebook ingredients and steps are now written line by line, one row for each', 'የደብተር ንጥረ ነገሮች እና ደረጃዎች አሁን መስመር በመስመር ይጻፋሉ፤ ለእያንዳንዱ አንድ ረድፍ'],
    n3: ['Save YouTube and TikTok cooking videos and open them in one tap', 'የዩቲዩብ እና ቲክቶክ የማብሰያ ቪዲዮዎችን ያስቀምጡ፤ በአንድ ንክኪ ይክፈቱ'],
    n4: ['Share a video from YouTube or TikTok straight into LunchMate', 'ከዩቲዩብ ወይም ቲክቶክ ቪዲዮ በቀጥታ ወደ LunchMate ያጋሩ'],
    n5: ['Cook mode: big steps, screen stays on, videos one tap away', 'የማብሰል ሁነታ፡ ትልልቅ ደረጃዎች፣ ማያ ገጹ አይጠፋም፣ ቪዲዮዎች በአንድ ንክኪ'],
    n6: ['Add a recipe to your plan or its ingredients to the shopping list', 'አዘገጃጀትን ወደ እቅድ ወይም ንጥረ ነገሮቹን ወደ የገበያ ዝርዝር ይጨምሩ']
});

/* ---------- icons ---------- */
const I_SEARCH = svg('<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>', 18, 2);
const I_PLUS = svg('<path d="M12 5v14M5 12h14"/>', 20, 2.2);
const I_DICE = svg('<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8.5 8.5h.01M15.5 8.5h.01M12 12h.01M8.5 15.5h.01M15.5 15.5h.01" stroke-width="2.6"/>', 18, 1.8);
const I_PLAY = '<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
const I_PLAYL = '<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor"><path d="M7 4.5v15l13-7.5z"/></svg>';
const I_IMG = svg('<rect x="3.5" y="4.5" width="17" height="15" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M4 17l5-4.5 3.5 3 3-2.5 4.5 4"/>', 15, 1.8);
const I_CAM = svg('<path d="M4 8h3l1.6-2.5h6.8L17 8h3a1 1 0 011 1v9a1 1 0 01-1 1H4a1 1 0 01-1-1V9a1 1 0 011-1z"/><circle cx="12" cy="13" r="3.6"/>', 15, 1.8);
const I_PASTE = svg('<rect x="6" y="5" width="12" height="16" rx="2.5"/><path d="M9.5 5V4a1 1 0 011-1h3a1 1 0 011 1v1M9.5 11h5M9.5 15h5"/>', 15, 1.8);
const I_X = svg('<path d="M6 6l12 12M18 6L6 18"/>', 14, 2.4);
const I_LIST = svg('<path d="M9 6h11M9 12h11M9 18h11M4.5 6h.01M4.5 12h.01M4.5 18h.01"/>', 20, 2.4);
const I_STAR = on => `<svg viewBox="0 0 24 24" width="18" height="18" fill="${on ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 16.9 6.8 19.7l1-5.9L3.5 9.7l5.9-.8L12 3.5z"/></svg>`;
const KIND_ICO = {
    recipe: svg('<circle cx="12" cy="12" r="7.5"/><circle cx="12" cy="12" r="3.6"/><path d="M2.2 5.5v6M4.4 5.5v6M3.3 11.5v7M21.2 5.5c-1.3 1-1.9 3.2-1.9 5.5h1.9v7.5"/>', 34, 1.2),
    video: svg('<rect x="3" y="5.5" width="18" height="13" rx="4"/><path d="M10 9.5v5l4.5-2.5z"/>', 34, 1.2),
    idea: svg('<path d="M9 18h6M10 21h4M12 3a6 6 0 00-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0012 3z"/>', 34, 1.2)
};

/* ---------- state ---------- */
let nm = null, nv = null, pl = null, ck = null, lb = null, shr = null, nbQT = null, nbPT = null, nbWL = null;

function nbFix(n) {
    n.kind = NB_KINDS.includes(n.kind) ? n.kind : 'recipe';
    ['title', 'ing', 'steps', 'notes', 'last'].forEach(f => { if (typeof n[f] !== 'string') n[f] = ''; });
    ['imgs', 'links', 'tags'].forEach(f => { if (!Array.isArray(n[f])) n[f] = []; });
    n.links = n.links.filter(l => l && typeof l.url === 'string');
    n.cooked = +n.cooked || 0; n.fav = !!n.fav; n.ts = +n.ts || Date.now();
    return n;
}
function nbFixAll() {
    if (!Array.isArray(S.notes)) S.notes = [];
    S.notes = S.notes.filter(n => n && n.id).map(nbFix);
    if (!Array.isArray(S.nbShop)) S.nbShop = [];
    if (!NB_FILTERS.includes(S.nbF)) S.nbF = 'all';
    S.nbQ = '';
}
const nbGet = id => S.notes.find(n => n.id === id) || null;
const nbLines = s => String(s || '').split(/\r?\n/).map(x => x.replace(/^\s*(?:[-•*·]|\d+[.)])\s+/, '').trim()).filter(Boolean);
const nbKeep = fn => { const p = $('#panel'), y = p.scrollTop; fn(); p.scrollTop = y; };

/* ---------- photo storage (IndexedDB) ---------- */
let _db = null;
function nbDb() {
    return _db || (_db = new Promise((res, rej) => {
        const r = indexedDB.open('lunchmate-nb', 1);
        r.onupgradeneeded = () => r.result.createObjectStore('img');
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
    }));
}
const nbTx = (mode, fn) => nbDb().then(db => new Promise((res, rej) => {
    const tx = db.transaction('img', mode), rq = fn(tx.objectStore('img'));
    tx.oncomplete = () => res(rq && rq.result); tx.onerror = () => rej(tx.error); tx.onabort = () => rej(tx.error);
}));
const idbPut = (k, b) => nbTx('readwrite', s => s.put(b, k));
const idbGet = k => nbTx('readonly', s => s.get(k));
const nbCache = new Map();
function nbDelImg(k) {
    nbTx('readwrite', s => { s.delete(k); s.delete(k + 't'); }).catch(() => {});
    [k, k + 't'].forEach(x => { if (nbCache.has(x)) { try { URL.revokeObjectURL(nbCache.get(x)); } catch (e) {} nbCache.delete(x); } });
}
const nbAttr = k => nbCache.has(k) ? `src="${nbCache.get(k)}" data-ok="1" data-img="${k}"` : `data-img="${k}"`;
const nbImg = (k, cls) => `<img class="${cls || ''}" ${nbAttr(k)} alt="" draggable="false">`;
function nbHydrate() {
    document.querySelectorAll('img[data-img]:not([data-ok])').forEach(async el => {
        el.dataset.ok = '1';
        const k = el.dataset.img;
        try {
            if (!nbCache.has(k)) { const b = await idbGet(k); if (b) nbCache.set(k, URL.createObjectURL(b)); }
            if (nbCache.has(k)) el.src = nbCache.get(k); else el.style.visibility = 'hidden';
        } catch (e) { el.style.visibility = 'hidden'; }
    });
}
let nbHyT = 0;
new MutationObserver(() => { if (nbHyT) return; nbHyT = requestAnimationFrame(() => { nbHyT = 0; nbHydrate(); }); }).observe(document.body, { childList: true, subtree: true });
try { if (navigator.storage && navigator.storage.persist) navigator.storage.persist(); } catch (e) {}

function nbShrink(file, max, q) {
    return new Promise((res, rej) => {
        const u = URL.createObjectURL(file), im = new Image();
        im.onload = () => {
            const sc = Math.min(1, max / Math.max(im.naturalWidth, im.naturalHeight)), c = document.createElement('canvas');
            c.width = Math.max(1, Math.round(im.naturalWidth * sc)); c.height = Math.max(1, Math.round(im.naturalHeight * sc));
            c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
            URL.revokeObjectURL(u);
            c.toBlob(b => b ? res(b) : rej(new Error('blob')), 'image/jpeg', q);
        };
        im.onerror = () => { URL.revokeObjectURL(u); rej(new Error('img')); };
        im.src = u;
    });
}
async function nbAddImgs(files) {
    if (!nm) return;
    const room = NB_MAX_IMG - nm.imgs.length;
    if (room <= 0) { toast(t('imgMax', NB_MAX_IMG), '', 2500); return; }
    files = files.slice(0, room);
    toast(t('imgBusy'), '', 30000);
    let bad = 0;
    for (const f of files) {
        try {
            const id = 'i' + (S.nextId++).toString(36) + Date.now().toString(36);
            const full = await nbShrink(f, 1400, .82), th = await nbShrink(full, 420, .78);
            await idbPut(id, full); await idbPut(id + 't', th);
            nbCache.set(id, URL.createObjectURL(full)); nbCache.set(id + 't', URL.createObjectURL(th));
            if (!nm) { nbDelImg(id); break; }
            nm.imgs.push(id); nm.newImgs.push(id);
        } catch (e) { bad++; }
    }
    persist();
    clearTimeout(toastT); $('#toast').classList.remove('on');
    if (bad) toast(t('imgFail'), '', 3000);
    if (nm) { nbRead(); nbKeep(drawNote); }
}

/* ---------- links ---------- */
const NB_PLAT = { youtube: 'YouTube', tiktok: 'TikTok', instagram: 'Instagram', facebook: 'Facebook', web: '' };
function nbPlat(u) {
    let h = ''; try { h = new URL(u).hostname.toLowerCase(); } catch (e) {}
    if (/(^|\.)youtube\.com$|(^|\.)youtu\.be$|youtube-nocookie\.com$/.test(h)) return 'youtube';
    if (/tiktok\.com$/.test(h)) return 'tiktok';
    if (/instagram\.com$/.test(h)) return 'instagram';
    if (/facebook\.com$|fb\.watch$/.test(h)) return 'facebook';
    return 'web';
}
function nbYt(u) {
    try {
        const x = new URL(u), h = x.hostname.replace(/^www\.|^m\./, '');
        if (h === 'youtu.be') return x.pathname.slice(1).split('/')[0];
        if (x.searchParams.get('v')) return x.searchParams.get('v');
        const m = x.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{6,})/); if (m) return m[1];
    } catch (e) {}
    return '';
}
const nbHost = u => { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return u; } };
function nbMkLink(u) { const plat = nbPlat(u); return { url: u, plat, vid: plat === 'youtube' ? nbYt(u) : '', title: NB_PLAT[plat] || nbHost(u) }; }
async function nbFetchTitle(l) {
    const ep = l.plat === 'youtube' ? 'https://www.youtube.com/oembed?format=json&url=' : l.plat === 'tiktok' ? 'https://www.tiktok.com/oembed?url=' : '';
    if (!ep) return '';
    const ac = new AbortController(), to = setTimeout(() => ac.abort(), 5000);
    try { const r = await fetch(ep + encodeURIComponent(l.url), { signal: ac.signal }); if (!r.ok) return ''; const j = await r.json(); return String(j.title || '').slice(0, 100); }
    catch (e) { return ''; } finally { clearTimeout(to); }
}
const nbLinkThumb = l => `<div class="lth">${I_PLAYL}${l.vid ? `<img src="https://i.ytimg.com/vi/${esc(l.vid)}/mqdefault.jpg" loading="lazy" onerror="this.remove()" alt="">` : ''}</div>`;
function nbExternal(ms) { window.nbPicking = true; clearTimeout(nbPT); nbPT = setTimeout(() => { window.nbPicking = false; }, ms); }
document.addEventListener('visibilitychange', () => { if (!document.hidden && window.nbPicking) setTimeout(() => { window.nbPicking = false; }, 1200); });
function nbOpenUrl(url) {
    try {
        if (P.NavBar && P.NavBar.openUrl) { const r = P.NavBar.openUrl({ url }); if (r && r.catch) r.catch(() => nbAnchor(url)); return; }
    } catch (e) {}
    nbAnchor(url);
}
function nbAnchor(url) { const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener'; document.body.appendChild(a); a.click(); a.remove(); }

/* ---------- list page + header ---------- */
function nbList() {
    const q = (S.nbQ || '').trim().toLowerCase(), f = S.nbF || 'all';
    return S.notes.filter(n => {
        if (f === 'recipe' || f === 'idea') { if (n.kind !== f) return false; }
        else if (f === 'video') { if (n.kind !== 'video' && !n.links.length) return false; }
        else if (f === 'fav') { if (!n.fav) return false; }
        else if (f === 'todo') { if (n.cooked) return false; }
        if (!q) return true;
        return (n.title + ' ' + n.ing + ' ' + n.steps + ' ' + n.notes + ' ' + n.tags.join(' ') + ' ' + n.links.map(l => l.title).join(' ')).toLowerCase().includes(q);
    }).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0) || b.ts - a.ts);
}
function nbCard(n, i) {
    let cover = '';
    if (n.imgs.length) cover = nbImg(n.imgs[0] + 't', 'ci');
    else { const y = n.links.find(l => l.vid); if (y) cover = `<img class="ci" src="https://i.ytimg.com/vi/${esc(y.vid)}/mqdefault.jpg" loading="lazy" onerror="this.remove()" alt="">`; }
    return `<div class="nc" style="--i:${i}" data-act="nb-open" data-nid="${n.id}">
        <div class="cv"><span class="art2">${KIND_ICO[n.kind]}</span>${cover}${n.fav ? `<span class="fv">${I_STAR(true)}</span>` : ''}${n.links.length ? `<span class="pb">${I_PLAY}${n.links.length}</span>` : ''}${n.imgs.length > 1 ? `<span class="ph">${I_IMG}${n.imgs.length}</span>` : ''}</div>
        <div class="cb2"><div class="ct">${esc(n.title)}</div><div class="cm"><i class="cdot" style="background:${NB_KCOL[n.kind]}"></i>${esc(t('k_' + n.kind))}${n.cooked ? ` · ✓ ${n.cooked}` : ''}</div>
        ${n.tags.length ? `<div class="tg">${n.tags.slice(0, 3).map(x => `<span>${esc(x)}</span>`).join('')}</div>` : ''}</div></div>`;
}
function notesPage() {
    if (!S.notes.length) return `<div class="nbempty"><div class="wl-art">${KIND_ICO.recipe}</div><h3 class="wl-t">${esc(t('nbEmpty'))}</h3><p>${esc(t('nbEmptyB'))}</p><button class="btn" data-act="nb-new">${esc(t('nbAddFirst'))}</button></div>` + CREDIT;
    const list = nbList();
    if (!list.length) return `<div class="nodays">${PLATE_ART}<br>${esc(t('nbNoMatch'))}</div>` + CREDIT;
    return `<div class="ngrid">${list.map((n, i) => nbCard(n, i)).join('')}</div>` + CREDIT;
}
function nbChrome() {
    const bar = $('#bar');
    if (bar.dataset.m !== 'notes') {
        bar.dataset.m = 'notes';
        bar.innerHTML = `<div class="nbs">${I_SEARCH}<input id="nb-q" type="text" enterkeyhint="search" autocomplete="off" placeholder="${esc(t('nbSearch'))}" value="${esc(S.nbQ || '')}"></div><button class="ib" data-act="nb-new" aria-label="${esc(t('nbNew'))}">${I_PLUS}</button>`;
    } else { const q = $('#nb-q'); if (q) q.placeholder = t('nbSearch'); }
    const old = $('#tools .nbf'), sl = old ? old.scrollLeft : 0;
    $('#tools').innerHTML = `<div class="nbf">${NB_FILTERS.map(f => `<button class="chip sm${S.nbF === f ? ' on' : ''}" data-act="nb-f" data-v="${f}">${esc(t('nf_' + f))}</button>`).join('')}</div><button class="mini" data-act="nb-dice" aria-label="${esc(t('dice'))}">${I_DICE}</button><button class="mini" data-act="more">${esc(t('more'))}</button>`;
    const nw = $('#tools .nbf'); if (nw) nw.scrollLeft = sl;
}
function nbRefresh() { const last = $('#stage').lastElementChild; if (last) last.firstElementChild.innerHTML = notesPage(); }
document.addEventListener('input', e => {
    if (e.target.id === 'nb-q') { S.nbQ = e.target.value; clearTimeout(nbQT); nbQT = setTimeout(nbRefresh, 120); }
});

/* ---------- note view ---------- */
function nbText(n) {
    const out = [n.title];
    const ing = nbLines(n.ing), st = nbLines(n.steps);
    if (ing.length) out.push('', t('ingH') + ':', ...ing.map(x => '- ' + x));
    if (st.length) out.push('', t('stepsH') + ':', ...st.map((x, i) => `${i + 1}. ${x}`));
    if (n.notes) out.push('', n.notes);
    if (n.links.length) out.push('', ...n.links.map(l => l.url));
    return out.join('\n');
}
function nbView(id) {
    const n = nbGet(id); if (!n) { close(); return; }
    nv = id;
    const ings = nbLines(n.ing), steps = nbLines(n.steps), bad = allergenIn(n.title + ' ' + n.ing);
    const last = n.last ? t('lastCooked', fmtDayY(parse(n.last))) : '';
    open(`<div class="lbl">${esc(n.title)}</div>
        <div class="vm"><span class="kb"><i class="cdot" style="background:${NB_KCOL[n.kind]}"></i>${esc(t('k_' + n.kind))}</span><span>${n.cooked ? esc(t('cookedN', n.cooked)) + (last ? ' · ' + esc(last) : '') : esc(t('notCooked'))}</span>${n.cooked ? `<button class="mini" data-act="nb-uncook" data-nid="${n.id}">−1</button>` : ''}<button class="favb${n.fav ? ' on' : ''}" data-act="nb-fav" data-nid="${n.id}" aria-label="${esc(t('fav'))}">${I_STAR(n.fav)}</button></div>`
        + (bad ? `<div class="alg">${esc(t('contains', bad))}</div>` : '')
        + (n.imgs.length ? `<div class="nstrip">${n.imgs.map((k, i) => `<button class="nth" data-act="nb-img" data-nid="${n.id}" data-i="${i}">${nbImg(k + 't')}</button>`).join('')}</div>` : '')
        + (n.links.length ? `<div class="fl">${esc(t('followH'))}</div>` + n.links.map((l, i) => `<div class="lnk">${nbLinkThumb(l)}<div class="lb"><b>${esc(l.title)}</b><small>${esc(NB_PLAT[l.plat] || nbHost(l.url))}</small></div><button class="btn sm" data-act="nb-link" data-nid="${n.id}" data-i="${i}">${esc(t('openLink'))}</button></div>`).join('') : '')
        + (ings.length ? `<div class="fl">${esc(t('ingH'))}</div><ul class="ingl">${ings.map(x => `<li data-act="nb-tick"><span class="tk">${CHECK}</span><span class="tt">${esc(x)}</span></li>`).join('')}</ul>` : '')
        + (steps.length ? `<div class="fl">${esc(t('stepsH'))}</div><ol class="stl">${steps.map(x => `<li><span>${esc(x)}</span></li>`).join('')}</ol>` : '')
        + (n.notes ? `<div class="fl">${esc(t('fNotes'))}</div><div class="nbnote">${esc(n.notes)}</div>` : '')
        + (n.tags.length ? `<div class="tg vt">${n.tags.map(x => `<span>${esc(x)}</span>`).join('')}</div>` : '')
        + `<div class="row"><button class="btn" data-act="nb-cook" data-nid="${n.id}">${esc(t('cookMode'))}</button></div>
        <div class="nbact">
            <button class="btn ghost" data-act="nb-cooked" data-nid="${n.id}">✓ ${esc(t('cookedIt'))}</button>
            <button class="btn ghost" data-act="nb-plan" data-nid="${n.id}">${esc(t('planIt'))}</button>
            <button class="btn ghost" data-act="nb-shop" data-nid="${n.id}">${esc(t('toShop'))}</button>
            <button class="btn ghost" data-act="nb-share" data-nid="${n.id}">${esc(t('shareIt'))}</button>
            <button class="btn ghost" data-act="nb-edit" data-nid="${n.id}">${esc(t('edit'))}</button>
            <button class="btn danger" data-act="nb-del" data-nid="${n.id}">${esc(t('del'))}</button>
        </div>
        <div class="row"><button class="btn ghost" data-act="close">${esc(t('close'))}</button></div>`);
}
function nbCooked(id, dec) {
    const n = nbGet(id); if (!n) return;
    n.cooked = Math.max(0, (n.cooked || 0) + (dec ? -1 : 1));
    n.last = n.cooked ? key(today()) : '';
    save(); buzz(14);
}
function nbShopAdd(id) {
    const n = nbGet(id); if (!n) return;
    const lines = nbLines(n.ing);
    if (!lines.length) { toast(t('shopNoIng'), '', 3000); return; }
    const have = new Set(S.nbShop.map(x => x.toLowerCase()));
    let c = 0;
    lines.forEach(x => { if (!have.has(x.toLowerCase()) && S.nbShop.length < 200) { S.nbShop.push(x); have.add(x.toLowerCase()); c++; } });
    persist(); buzz(12);
    if (c) toast(t('shopAdded', c), n.title, 2800); else toast(t('shopNoNew'), '', 2500);
}
function nbShare(id) {
    const n = nbGet(id); if (!n) return;
    const txt = nbText(n);
    nbExternal(120000);
    try { if (navigator.share) { navigator.share({ title: n.title, text: txt }).catch(() => {}); return; } } catch (e) {}
    const ok = () => { buzz(12); toast(t('copiedTxt'), n.title, 2200); };
    const fb = () => {
        const ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;left:-999px;opacity:0'; document.body.appendChild(ta);
        try { ta.focus(); ta.select(); document.execCommand('copy'); ok(); } catch (e) {}
        ta.remove();
    };
    try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(ok, fb); return; } } catch (e) {}
    fb();
}
function nbDelNote(id) {
    const n = nbGet(id); if (!n) return;
    n.imgs.forEach(nbDelImg);
    S.notes = S.notes.filter(x => x.id !== id);
    close(); save(); render(); buzz(20);
    toast(t('nbDeleted'), n.title, 2500);
}

/* ---------- plan a note as a meal ---------- */
function drawPlan() {
    const n = nbGet(pl.id), td = today(), tk = key(td), days = [];
    for (let i = 0; i < 14; i++) days.push(addDays(td, i));
    open(`<div class="lbl">${esc(t('planT'))}</div><p class="msg">${esc(n.title)}</p><p class="dd">${esc(t('planMsg'))}</p>
        <div class="fl">${esc(t('category'))}</div><div class="chips">${CATS.map(c => `<button class="chip${pl.cat === c ? ' on' : ''}" data-act="nb-plan-cat" data-v="${c}">${CAT_ICO[c]}${esc(tc(c))}</button>`).join('')}</div>
        <div class="fl">${esc(t('selectDay'))}</div>` + days.map(d => `<button class="pick" data-act="nb-plan-day" data-k="${key(d)}"><span>${esc(dayName(d))}${key(d) === tk ? ' · ' + esc(t('today')) : ''}</span><span class="mono dd">${esc(fmtDayY(d))}</span></button>`).join('')
        + `<div class="row"><button class="btn ghost" data-act="nb-view" data-nid="${n.id}">${esc(t('back'))}</button></div>`);
}
function nbPlanDay(k) {
    const n = nbGet(pl.id); if (!n) return;
    const bad = allergenIn(n.title + ' ' + n.ing);
    if (bad) { toast(t('notAllowed'), t('algBlock', bad), 4500); return; }
    const d = parse(k);
    (S.meals[k] = S.meals[k] || []).push({ id: S.nextId++, cat: pl.cat, text: n.title, done: false, remind: 'off', rt: '', fired: false, snz: 0, med: null });
    ensureDay(d); learn(n.title, pl.cat);
    close(); save(); render(); buzz(14);
    toast(t('mealAdded'), `${dayName(d)} ${fmtDayY(d)}`, 4500, { label: t('viewPlan'), act: 'nb-goweek' });
    checkReminders();
}

/* ---------- editor ---------- */
function nbEditOpen(id, preset) {
    const n = id ? nbGet(id) : null;
    nm = n ? { id: n.id, kind: n.kind, title: n.title, ing: n.ing, steps: n.steps, notes: n.notes, tags: n.tags.join(', '), imgs: n.imgs.slice(), links: n.links.map(l => Object.assign({}, l)), newImgs: [], removed: [], url: '' }
           : Object.assign({ id: '', kind: 'recipe', title: '', ing: '', steps: '', notes: '', tags: '', imgs: [], links: [], newImgs: [], removed: [], url: '' }, preset || {});
    drawNote();
}
function nbRead() {
    if (!nm) return;
    const g = id => { const e = document.getElementById(id); return e ? e.value : null; };
    [['nb-title', 'title'], ['nb-notes', 'notes'], ['nb-tags', 'tags'], ['nb-url', 'url']].forEach(([i, f]) => { const v = g(i); if (v !== null) nm[f] = v; });
    ['ing', 'steps'].forEach(l => { const box = document.getElementById('nb-' + l + '-list'); if (box) nm[l] = Array.from(box.querySelectorAll('.li')).map(e => e.value.trim()).filter(Boolean).join('\n'); });
}
function drawNote() {
    nbKeep(() => open(`<div class="lbl">${esc(t(nm.id ? 'nbEdit' : 'nbNew'))}</div>
        <div class="fl">${esc(t('category'))}</div><div class="chips">${NB_KINDS.map(k => `<button class="chip${nm.kind === k ? ' on' : ''}" data-act="nb-kind" data-v="${k}"><i class="cdot" style="background:${NB_KCOL[k]};margin-right:7px"></i>${esc(t('k_' + k))}</button>`).join('')}</div>
        <div class="fl">${esc(t('fTitle'))}</div><input id="nb-title" maxlength="80" autocomplete="off" placeholder="${esc(t('fTitlePh'))}" value="${esc(nm.title)}">
        <div class="fl">${esc(t('fPhotos'))}</div>
        <div class="nstrip ed">${nm.imgs.map((k, i) => `<div class="nth">${nbImg(k + 't')}<button class="rm" data-act="nb-rmimg" data-i="${i}" aria-label="${esc(t('remove'))}">${I_X}</button></div>`).join('')}</div>
        <div class="chips" style="margin-top:10px"><button class="chip" data-act="nb-photo">${I_IMG}${esc(t('fGallery'))}</button><button class="chip" data-act="nb-cam">${I_CAM}${esc(t('fCamera'))}</button></div>
        <div class="fl">${esc(t('fVideos'))}</div>`
        + nm.links.map((l, i) => `<div class="lnk">${nbLinkThumb(l)}<div class="lb"><b id="nl-${i}">${esc(l.title)}</b><small>${esc(NB_PLAT[l.plat] || nbHost(l.url))}</small></div><button class="trash" data-act="nb-rmlink" data-i="${i}" aria-label="${esc(t('remove'))}">${I_X}</button></div>`).join('')
        + `<div class="addrow" style="margin-top:10px"><input id="nb-url" inputmode="url" autocomplete="off" autocapitalize="off" placeholder="${esc(t('fUrlPh'))}" value="${esc(nm.url)}"><button class="btn ghost sm" data-act="nb-paste" aria-label="${esc(t('fPaste'))}">${I_PASTE}</button><button class="btn sm" data-act="nb-addlink">${esc(t('add'))}</button></div>
        <div class="fl">${esc(t('fIng'))}</div><div class="lrows" id="nb-ing-list">${nbRowsHtml('ing')}</div><button class="addrowbtn" data-act="nb-ladd" data-l="ing">+ ${esc(t('addIng'))}</button>
        <div class="fl">${esc(t('fSteps'))}</div><div class="lrows" id="nb-steps-list">${nbRowsHtml('steps')}</div><button class="addrowbtn" data-act="nb-ladd" data-l="steps">+ ${esc(t('addStep'))}</button>
        <div class="fl">${esc(t('fNotes'))}</div><textarea id="nb-notes" rows="3">${esc(nm.notes)}</textarea>
        <div class="fl">${esc(t('fTags'))}</div><input id="nb-tags" maxlength="80" autocomplete="off" placeholder="${esc(t('fTagsPh'))}" value="${esc(nm.tags)}">
        <div class="row"><button class="btn ghost" data-act="nb-cancel">${esc(t('cancel'))}</button><button class="btn" data-act="nb-save">${esc(t('save'))}</button></div>`));
    nbGrowAll();
}
function nbAddLink() {
    if (!nm) return;
    nbRead();
    const raw = nm.url.trim(); if (!raw) return;
    const m = raw.match(/https?:\/\/[^\s]+/i);
    let u = (m ? m[0] : raw).replace(/[)\]>.,;!]+$/, '');
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    let ok = false; try { ok = /\./.test(new URL(u).hostname) && !/\s/.test(u); } catch (e) {}
    if (!ok) { toast(t('badLink'), '', 2500); return; }
    if (nm.links.some(x => x.url === u)) { nm.url = ''; drawNote(); return; }
    const l = nbMkLink(u); nm.links.push(l); nm.url = ''; buzz(10);
    drawNote();
    nbFetchTitle(l).then(ti => {
        if (!ti) return;
        l.title = ti;
        if (!nm) return;
        const i = nm.links.indexOf(l), e = document.getElementById('nl-' + i); if (e) e.textContent = ti;
        const inp = $('#nb-title'); if (inp && !inp.value.trim()) { inp.value = ti; nm.title = ti; }
    });
}
async function nbPaste() {
    nbRead();
    try { const x = await navigator.clipboard.readText(); if (x && x.trim()) { nm.url = x.trim(); nbAddLink(); return; } } catch (e) {}
    toast(t('noClip'), '', 3000);
    const u = $('#nb-url'); if (u) u.focus();
}
function nbSave() {
    nbRead();
    let title = nm.title.trim();
    if (!title && nm.links.length) title = nm.links[0].title;
    if (!title) { toast(t('titleNeed'), '', 2500); const i = $('#nb-title'); if (i) i.focus(); return; }
    const tags = nm.tags.split(',').map(x => x.trim().replace(/^#/, '')).filter(Boolean).slice(0, 8);
    const data = { kind: nm.kind, title, ing: nm.ing.trim(), steps: nm.steps.trim(), notes: nm.notes.trim(), tags, imgs: nm.imgs.slice(), links: nm.links.slice() };
    let rec = nm.id ? nbGet(nm.id) : null;
    if (rec) Object.assign(rec, data);
    else { rec = nbFix(Object.assign({ id: 'n' + (S.nextId++), fav: false, cooked: 0, last: '', ts: Date.now() }, data)); S.notes.push(rec); }
    nm.removed.forEach(nbDelImg);
    const nid = rec.id; nm = null;
    save(); render(); buzz(14);
    nbView(nid);
    toast(t('nbSaved'), title, 2200);
}
function nbCancel() {
    const id = nm && nm.id;
    if (nm) nm.newImgs.forEach(nbDelImg);
    nm = null;
    if (id && nbGet(id)) nbView(id); else close();
}
function nbOnClose() {
    if (nm) { nm.newImgs.forEach(nbDelImg); nm = null; }
    nv = null; pl = null; shr = null;
}
function nbPick(sel) { nbExternal(120000); const e = $(sel); if (e) e.click(); }
document.addEventListener('change', async e => {
    const el = e.target;
    if (el.id === 'nb-file' || el.id === 'nb-cam') { const files = Array.from(el.files || []); el.value = ''; if (files.length && nm) await nbAddImgs(files); }
});
document.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.id === 'nb-url') { e.preventDefault(); nbAddLink(); } });

/* ---------- line-by-line list rows (ingredients / steps) ---------- */
function nbRowHtml(l, v) {
    return `<div class="lrow ${l}"><span class="ln"></span><textarea class="li" rows="1" data-l="${l}" maxlength="300" autocomplete="off" autocapitalize="sentences" enterkeyhint="next" placeholder="${esc(t(l === 'ing' ? 'rowIng' : 'rowStep'))}">${esc(v)}</textarea><button class="rm2" data-act="nb-lrm" aria-label="${esc(t('remove'))}">${I_X}</button></div>`;
}
function nbRowsHtml(l) { const a = nbLines(nm[l]); return (a.length ? a : ['']).map(v => nbRowHtml(l, v)).join(''); }
function nbGrow(el) { el.style.height = 'auto'; el.style.height = Math.max(46, el.scrollHeight + 2) + 'px'; }
function nbGrowAll() { document.querySelectorAll('#panel textarea.li').forEach(nbGrow); }
function nbAddRowAfter(prev, v) {
    const l = prev.classList.contains('ing') ? 'ing' : 'steps', tmp = document.createElement('div');
    tmp.innerHTML = nbRowHtml(l, v);
    const row = tmp.firstElementChild; prev.after(row); nbGrow(row.querySelector('textarea'));
    try { row.animate([{ opacity: 0, transform: 'translate3d(0,8px,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { duration: 260, easing: 'cubic-bezier(.2,.9,.25,1.08)' }); } catch (e) {}
    return row;
}
function nbRmRow(row, focusPrev, ev) {
    const box = row.parentElement, ta = row.querySelector('textarea');
    if (box.children.length === 1) { ta.value = ''; nbGrow(ta); if (!focusPrev) ta.focus(); return; }
    const prev = row.previousElementSibling, next = row.nextElementSibling;
    if (ev) ev.preventDefault();
    row.remove(); buzz(6);
    const f = (prev || next); if (f && focusPrev) { const p = f.querySelector('textarea'); p.focus(); p.setSelectionRange(p.value.length, p.value.length); }
}
function nbSplitRow(el, type) {
    const parts = el.value.split(/\r?\n/), paste = type === 'insertFromPaste';
    const cl = x => x.replace(/^\s*(?:[-•*·]|\d+[.)])\s+/, '');
    el.value = paste ? cl(parts[0]) : parts[0]; nbGrow(el);
    let prev = el.closest('.lrow'), last = null;
    parts.slice(1).forEach(p => {
        if (paste && !p.trim()) return;
        prev = nbAddRowAfter(prev, paste ? cl(p).trim() : p.replace(/^\s+/, '')); last = prev;
    });
    if (!last) return;
    const ta = last.querySelector('textarea'); ta.focus();
    const c = paste ? ta.value.length : 0; ta.setSelectionRange(c, c);
    buzz(6);
}
document.addEventListener('input', e => {
    const el = e.target; if (!el.classList || !el.classList.contains('li')) return;
    if (el.value.indexOf('\n') >= 0) nbSplitRow(el, e.inputType); else nbGrow(el);
});
document.addEventListener('keydown', e => {
    const el = e.target; if (!el.classList || !el.classList.contains('li')) return;
    if (e.key === 'Backspace' && el.value === '') nbRmRow(el.closest('.lrow'), true, e);
});
document.addEventListener('beforeinput', e => {
    const el = e.target; if (!el.classList || !el.classList.contains('li')) return;
    if (e.inputType === 'deleteContentBackward' && el.value === '') nbRmRow(el.closest('.lrow'), true, e);
});

/* ---------- dice ---------- */
function nbDice() {
    if (!S.notes.length) { toast(t('dice'), t('diceNone'), 3000); return; }
    let pool = S.notes.filter(n => !n.cooked); if (!pool.length) pool = S.notes;
    const n = pool[Math.floor(Math.random() * pool.length)]; buzz(16);
    open(`<div class="lbl">${esc(t('diceT'))}</div><p class="msg big">${esc(n.title)}</p>
        <div class="row"><button class="btn ghost" data-act="nb-dice">${esc(t('again'))}</button><button class="btn" data-act="nb-open" data-nid="${n.id}">${esc(t('openLink'))}</button></div>
        <div class="row"><button class="btn ghost" data-act="close">${esc(t('close'))}</button></div>`);
}

/* ---------- lightbox ---------- */
function drawLb() {
    const n = lb && nbGet(lb.id); if (!n || !n.imgs.length) { nbLbClose(); return; }
    const k = n.imgs[lb.i], el = $('#lightbox');
    el.innerHTML = `<div class="lb-top"><button class="ib" data-act="nb-lb-close" aria-label="${esc(t('close'))}">${I_X}</button><span class="lb-c mono">${lb.i + 1} / ${n.imgs.length}</span><span class="ib sp"></span></div>
        <div class="lb-img">${nbImg(k)}</div>
        ${n.imgs.length > 1 ? `<div class="lb-nav"><button class="ib" data-act="nb-lb-prev">&#8249;</button><button class="ib" data-act="nb-lb-next">&#8250;</button></div>` : ''}`;
    el.classList.add('on');
}
function nbLbClose() { lb = null; $('#lightbox').classList.remove('on'); }
function nbLbGo(d) { const n = lb && nbGet(lb.id); if (!n) return; lb.i = (lb.i + d + n.imgs.length) % n.imgs.length; drawLb(); buzz(6); }

/* ---------- kitchen timer (rings via the app's alert + native notification) ---------- */
let nbTI = null;
function nbStepSecs(s) {
    const m = String(s).match(/(\d+(?:\.\d+)?)(?:\s*[-–]\s*(\d+(?:\.\d+)?))?\s*(hours?|hrs?|hr|minutes?|mins?|ሰዓት|ደቂቃ)/i);
    if (!m) return 0;
    const v = parseFloat(m[2] || m[1]), hr = /^(h|ሰዓት)/i.test(m[3]);
    return Math.min(6 * 3600, Math.round(v * (hr ? 3600 : 60)));
}
const nbClock = s => `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
function nbTimerHtml() {
    const tm = window.nbTimer;
    if (tm) return `<div class="ck-tm"><span class="ck-tv" id="ck-tv">${nbClock(Math.max(0, Math.ceil((tm.end - Date.now()) / 1000)))}</span><button class="mini" data-act="nb-timer-x">${esc(t('timerStop'))}</button></div>`;
    const secs = ck && !ck.ing ? nbStepSecs(ck.steps[ck.i] || '') : 0;
    return secs ? `<div class="ck-tm"><button class="btn ghost sm" data-act="nb-timer" data-s="${secs}">⏱ ${esc(t('timerStart', fmtDur(secs * 1000)))}</button></div>` : '';
}
function nbTimerStart(sec, label) {
    if (!sec) return;
    window.nbTimer = { end: Date.now() + sec * 1000, label: label || '' };
    clearInterval(nbTI); nbTI = setInterval(nbTimerTick, 500);
    buzz(12); syncNative(); if (ck) drawCook(0);
}
function nbTimerStop() {
    window.nbTimer = null; clearInterval(nbTI); nbTI = null;
    syncNative(); if (ck) drawCook(0);
}
function nbTimerTick() {
    const tm = window.nbTimer; if (!tm) { clearInterval(nbTI); nbTI = null; return; }
    const left = Math.ceil((tm.end - Date.now()) / 1000);
    if (left <= 0) {
        window.nbTimer = null; clearInterval(nbTI); nbTI = null;
        pushAlert({ kind: 'sum', id: 0, title: t('timerDone'), body: tm.label || '' });
        if (ck) drawCook(0);
        return;
    }
    const el = $('#ck-tv'); if (el) el.textContent = nbClock(left);
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && window.nbTimer) nbTimerTick(); });

/* ---------- cook mode ---------- */
function nbWake(on) {
    try { if (P.NavBar && P.NavBar.keepAwake) { const r = P.NavBar.keepAwake({ on }); if (r && r.catch) r.catch(() => {}); } } catch (e) {}
    try {
        if (on && navigator.wakeLock && !nbWL) navigator.wakeLock.request('screen').then(w => { nbWL = w; w.addEventListener('release', () => { nbWL = null; }); }).catch(() => {});
        else if (!on && nbWL) { nbWL.release().catch(() => {}); nbWL = null; }
    } catch (e) {}
}
document.addEventListener('visibilitychange', () => { if (!document.hidden && ck) nbWake(true); });
function nbCookOpen(id) {
    const n = nbGet(id); if (!n) return;
    close();
    ck = { id, i: 0, ing: false, steps: nbLines(n.steps), tk: new Set() };
    drawCook(false); $('#cook').classList.add('on'); nbWake(true); buzz(12);
}
function drawCook(anim) {
    const n = nbGet(ck.id); if (!n) { nbCookClose(false); return; }
    const st = ck.steps, tot = st.length, last = !tot || ck.i >= tot - 1, pct = tot ? Math.round((ck.i + 1) / tot * 100) : 100;
    let main, cls = '';
    if (ck.ing) { cls = ' top'; main = `<div class="ck-n">${esc(t('ingH'))}</div><ul class="ingl">${nbLines(n.ing).map((x, j) => `<li class="${ck.tk.has(j) ? 'on' : ''}" data-act="nb-tick" data-i="${j}"><span class="tk">${CHECK}</span><span class="tt">${esc(x)}</span></li>`).join('')}</ul>`; }
    else if (tot) main = `<div class="ck-n">${esc(t('stepOf', ck.i + 1, tot))}</div><div class="ck-s">${esc(st[ck.i])}</div>`;
    else main = `<div class="ck-n">${esc(t('cookNoSteps'))}</div><div class="ck-s">${esc(n.notes || n.title)}</div>`;
    $('#cook').innerHTML = `<div class="ck-top"><button class="ib" data-act="nb-ck-close" aria-label="${esc(t('close'))}">${I_X}</button><div class="ck-t">${esc(n.title)}</div><button class="ib${ck.ing ? ' on' : ''}" data-act="nb-ck-ing" aria-label="${esc(t('ingH'))}">${I_LIST}</button></div>
        <div class="ck-bar"><i style="width:${pct}%"></i></div>
        <div class="ck-body${cls}" id="ck-body">${main}</div>
        ${nbTimerHtml()}
        ${n.links.length ? `<div class="ck-links">${n.links.map((l, i) => `<button class="mini" data-act="nb-link" data-nid="${n.id}" data-i="${i}">${I_PLAY} ${esc((l.title || '').slice(0, 24))}</button>`).join('')}</div>` : ''}
        <div class="ck-nav"><button class="btn ghost${ck.i === 0 || ck.ing ? ' dis' : ''}" data-act="nb-ck-prev">${esc(t('prev'))}</button><button class="btn" data-act="${last ? 'nb-ck-fin' : 'nb-ck-next'}">${esc(last ? t('finish') : t('next'))}</button></div>`;
    if (anim) { try { $('#ck-body').animate([{ opacity: 0, transform: `translate3d(${anim * 28}px,0,0)` }, { opacity: 1, transform: 'translate3d(0,0,0)' }], { duration: 380, easing: 'cubic-bezier(.2,.9,.25,1.08)' }); } catch (e) {} }
}
function nbCkGo(d) {
    if (!ck) return;
    if (ck.ing) { ck.ing = false; drawCook(d); return; }
    const ni = ck.i + d;
    if (ni < 0) return;
    if (ni >= ck.steps.length) { if (d > 0) nbCkFinish(); return; }
    ck.i = ni; buzz(8); drawCook(d);
}
function nbCkFinish() {
    const id = ck.id; nbCookClose(false);
    nbCooked(id); celebrate(); render();
    const n = nbGet(id); if (n) toast(t('cookedIt'), `${n.title} · ${t('cookedN', n.cooked)}`, 3500);
}
function nbCookClose(reopen) {
    const id = ck && ck.id; ck = null;
    $('#cook').classList.remove('on'); nbWake(false);
    if (reopen && id && nbGet(id)) nbView(id);
}
function nbSwipe(el, fn) {
    let x = 0, y = 0, on = false;
    el.addEventListener('touchstart', e => { if (e.touches.length !== 1) { on = false; return; } x = e.touches[0].clientX; y = e.touches[0].clientY; on = true; }, { passive: true });
    el.addEventListener('touchend', e => { if (!on) return; on = false; const c = e.changedTouches[0], dx = c.clientX - x, dy = c.clientY - y; if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) fn(dx < 0 ? 1 : -1); }, { passive: true });
}
nbSwipe($('#cook'), d => nbCkGo(d));
nbSwipe($('#lightbox'), d => nbLbGo(d));
function nbBackBtn() {
    if (lb) { nbLbClose(); return true; }
    if (ck) { nbCookClose(true); return true; }
    return false;
}

/* ---------- links shared from YouTube / TikTok ---------- */
function nbSharedCheck() {
    try { if (!P.NavBar || !P.NavBar.takeShared) return; P.NavBar.takeShared().then(r => { if (r && r.text) nbShared(r.text); }).catch(() => {}); } catch (e) {}
}
function nbShared(txt) {
    const m = String(txt).match(/https?:\/\/[^\s]+/i);
    if (!m) { toast(t('badLink'), '', 3000); return; }
    const url = m[0].replace(/[)\]>.,;!]+$/, ''), rest = String(txt).replace(m[0], '').replace(/\s+/g, ' ').trim().slice(0, 90);
    shr = { url, title: rest };
    const recent = S.notes.slice().sort((a, b) => b.ts - a.ts).slice(0, 8);
    buzz(14);
    open(`<div class="lbl">${esc(t('sharedT'))}</div><p class="msg">${esc(t('sharedMsg'))}</p><p class="dd">${esc(nbHost(url))}</p>`
        + pickRow('nb-sh-new', t('sharedNew'))
        + (recent.length ? `<div class="fl">${esc(t('sharedAdd'))}</div>` + recent.map(n => `<button class="pick" data-act="nb-sh-pick" data-nid="${n.id}"><span class="pl"><span>${esc(n.title)}</span><small>${esc(t('k_' + n.kind))}</small></span><span class="chv">${CHEV}</span></button>`).join('') : '')
        + `<div class="row"><button class="btn ghost" data-act="close">${esc(t('cancel'))}</button></div>`);
}

/* ---------- click actions (called from app.js click handler) ---------- */
function nbAct(a, el) {
    const nid = el.dataset.nid, v = el.dataset.v, i = +el.dataset.i;
    switch (a) {
        case 'nb-new': nbEditOpen(null); break;
        case 'nb-f': S.nbF = v; persist(); buzz(8); render(); break;
        case 'nb-dice': nbDice(); break;
        case 'nb-open': case 'nb-view': nbView(nid); break;
        case 'nb-edit': nbEditOpen(nid); break;
        case 'nb-del': { const n = nbGet(nid); if (n) ask(esc(t('nbDelAsk', n.title)), t('del'), () => nbDelNote(nid)); break; }
        case 'nb-fav': { const n = nbGet(nid); if (n) { n.fav = !n.fav; save(); render(); buzz(12); nbKeep(() => nbView(nid)); } break; }
        case 'nb-cooked': { nbCooked(nid); const n = nbGet(nid); render(); nbKeep(() => nbView(nid)); if (n) toast(t('cookedIt'), t('cookedN', n.cooked), 2200); break; }
        case 'nb-uncook': nbCooked(nid, true); render(); nbKeep(() => nbView(nid)); break;
        case 'nb-plan': pl = { id: nid, cat: 'Lunch' }; drawPlan(); break;
        case 'nb-plan-cat': if (pl) { pl.cat = v; nbKeep(drawPlan); } break;
        case 'nb-plan-day': if (pl) nbPlanDay(el.dataset.k); break;
        case 'nb-goweek': clearTimeout(toastT); $('#toast').classList.remove('on'); setMode('weekly'); break;
        case 'nb-shop': nbShopAdd(nid); break;
        case 'nb-share': nbShare(nid); break;
        case 'nb-tick': { const on = el.classList.toggle('on'); if (ck && el.closest('#cook') && el.dataset.i !== undefined) { if (on) ck.tk.add(i); else ck.tk.delete(i); } buzz(6); break; }
        case 'nb-timer': nbTimerStart(+el.dataset.s, ck ? (nbGet(ck.id) || {}).title : ''); break;
        case 'nb-timer-x': nbTimerStop(); break;
        case 'nb-link': { const n = nbGet(nid), l = n && n.links[i]; if (l) nbOpenUrl(l.url); break; }
        case 'nb-img': lb = { id: nid, i }; drawLb(); break;
        case 'nb-lb-close': nbLbClose(); break;
        case 'nb-lb-prev': nbLbGo(-1); break;
        case 'nb-lb-next': nbLbGo(1); break;
        case 'nb-cook': nbCookOpen(nid); break;
        case 'nb-ck-close': nbCookClose(true); break;
        case 'nb-ck-ing': if (ck) { ck.ing = !ck.ing; drawCook(0); } break;
        case 'nb-ck-next': nbCkGo(1); break;
        case 'nb-ck-prev': nbCkGo(-1); break;
        case 'nb-ck-fin': if (ck) nbCkFinish(); break;
        case 'nb-kind': nbRead(); nm.kind = v; nbKeep(drawNote); break;
        case 'nb-ladd': {
            const box = $('#nb-' + el.dataset.l + '-list'); if (!box) break;
            const lastRow = box.lastElementChild, lastTa = lastRow && lastRow.querySelector('textarea');
            const row = lastTa && !lastTa.value.trim() ? lastRow : nbAddRowAfter(lastRow, '');
            const ta = row.querySelector('textarea'); ta.focus(); buzz(6); break;
        }
        case 'nb-lrm': { const row = el.closest('.lrow'); if (row) nbRmRow(row, false); break; }
        case 'nb-photo': nbRead(); nbPick('#nb-file'); break;
        case 'nb-cam': nbRead(); nbPick('#nb-cam'); break;
        case 'nb-rmimg': if (nm) { nbRead(); const k = nm.imgs.splice(i, 1)[0]; if (k) { const j = nm.newImgs.indexOf(k); if (j >= 0) { nm.newImgs.splice(j, 1); nbDelImg(k); } else nm.removed.push(k); } nbKeep(drawNote); } break;
        case 'nb-rmlink': if (nm) { nbRead(); nm.links.splice(i, 1); nbKeep(drawNote); } break;
        case 'nb-paste': nbPaste(); break;
        case 'nb-addlink': nbAddLink(); break;
        case 'nb-save': nbSave(); break;
        case 'nb-cancel': nbCancel(); break;
        case 'nb-sh-new': {
            if (!shr) break;
            const l = nbMkLink(shr.url), title = shr.title; shr = null;
            if (S.mode !== 'notes') setMode('notes');
            nbEditOpen(null, { kind: 'video', title, links: [l] });
            nbFetchTitle(l).then(ti => { if (!ti) return; l.title = ti; if (!nm) return; const j = nm.links.indexOf(l), e = document.getElementById('nl-' + j); if (e) e.textContent = ti; const inp = $('#nb-title'); if (inp && !inp.value.trim()) { inp.value = ti; nm.title = ti; } });
            break;
        }
        case 'nb-sh-pick': {
            const n = nbGet(nid); if (!n || !shr) break;
            const l = nbMkLink(shr.url); shr = null;
            if (!n.links.some(x => x.url === l.url)) { n.links.push(l); nbFetchTitle(l).then(ti => { if (ti) { l.title = ti; save(); } }); }
            save(); if (S.mode !== 'notes') setMode('notes'); else render();
            nbView(nid); toast(t('linkAdded'), n.title, 2500);
            break;
        }
        case 'shop-clear': {
            const tk = S.shop[shopKey] || {};
            S.nbShop = S.nbShop.filter(x => { const k2 = x.toLowerCase(); if (tk[k2]) { delete tk[k2]; return false; } return true; });
            persist(); drawShop(); break;
        }
    }
}

/* ---------- start ---------- */
nbFixAll();
nbSharedCheck();
document.addEventListener('visibilitychange', () => { if (!document.hidden) setTimeout(nbSharedCheck, 300); });
try { if (P.App && P.App.addListener) P.App.addListener('appStateChange', s => { if (s && s.isActive) setTimeout(nbSharedCheck, 300); }); } catch (e) {}
/* ---------- backup: one .json file saved on the phone (meals + notebook + photos) ---------- */
const BK_CHUNK = 400000;
function bkSheet() {
    let last = t('bkNever');
    if (S.lastBk) { const d = new Date(S.lastBk); if (!isNaN(d)) last = t('bkLast', fmtDayY(d)); }
    open(`<div class="lbl">${esc(t('backT'))}</div><p class="msg">${esc(t('bkMsg'))}</p><div class="streak">${esc(last)}</div>`
        + pickRow('bk-save', t('bkSave'), t('bkSaveSub')) + pickRow('bk-pick', t('bkPick'), t('bkPickSub')) + backRow());
}
const bkDataUrl = b => new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = () => rej(r.error); r.readAsDataURL(b); });
function bkBlob(u) {
    const i = u.indexOf(','), meta = u.slice(5, i), bin = atob(u.slice(i + 1)), a = new Uint8Array(bin.length);
    for (let k = 0; k < bin.length; k++) a[k] = bin.charCodeAt(k);
    return new Blob([a], { type: meta.split(';')[0] || 'image/jpeg' });
}
async function bkWriter(name) {
    const nat = !!(isNative && P.NavBar && P.NavBar.fileOpen);
    let buf = [], size = 0, parts = [], where = '';
    if (nat) { const r = await P.NavBar.fileOpen({ name }); where = (r && r.where) || ''; }
    const flush = async () => { if (!size) return; const s = buf.join(''); buf = []; size = 0; if (nat) await P.NavBar.fileWrite({ data: s }); else parts.push(s); };
    return {
        put: async s => { buf.push(s); size += s.length; if (size >= BK_CHUNK) await flush(); },
        end: async () => {
            await flush();
            if (nat) { await P.NavBar.fileClose(); return where; }
            const url = URL.createObjectURL(new Blob(parts, { type: 'application/json' })), a = document.createElement('a');
            a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 15000);
            return 'Downloads';
        },
        abort: async () => { if (nat) await P.NavBar.fileClose(); }
    };
}
async function bkSave() {
    if (window.bkBusy) return;
    window.bkBusy = true; toast(t('bkWorking'), '', 120000);
    let w = null, n = 0;
    try {
        const stamp = Date.now(), safe = Object.assign({}, S, { lastBk: stamp }); delete safe.lock; delete safe.nbQ;
        w = await bkWriter(`lunchmate-backup-${key(today())}.json`);
        await w.put('{"app":"lunchmate","v":3,"created":' + JSON.stringify(new Date(stamp).toISOString()) + ',"data":' + JSON.stringify(safe) + ',"images":{');
        const ids = []; S.notes.forEach(x => x.imgs.forEach(k => { if (!ids.includes(k)) ids.push(k); }));
        for (const id of ids) {
            let b = null; try { b = await idbGet(id); } catch (e) {}
            if (!b) continue;
            await w.put((n ? ',' : '') + JSON.stringify(id) + ':' + JSON.stringify(await bkDataUrl(b))); n++;
        }
        await w.put('}}');
        const where = await w.end();
        S.lastBk = stamp; persist(); buzz(15);
        toast(t('bkSaved'), t('bkSavedB', n, where), 5000);
        if (isOpen() && /bk-save/.test($('#panel').innerHTML)) bkSheet();
    } catch (e) {
        if (w) { try { await w.abort(); } catch (x) {} }
        toast(t('bkFail'), String((e && e.message) || ''), 5000);
    } finally { window.bkBusy = false; }
}
function bkPick() {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.accept = '.json,application/json,text/plain'; inp.style.display = 'none';
    inp.addEventListener('change', () => { const f = inp.files && inp.files[0]; inp.remove(); if (f) bkRead(f); });
    inp.addEventListener('cancel', () => inp.remove());
    document.body.appendChild(inp); nbExternal(120000); inp.click();
}
async function bkRead(f) {
    toast(t('bkReading'), '', 60000);
    let o = null;
    try { o = JSON.parse(await f.text()); } catch (e) {}
    clearTimeout(toastT); $('#toast').classList.remove('on');
    const d = o && o.app === 'lunchmate' && o.data;
    if (!d || typeof d !== 'object' || !d.meals || typeof d.meals !== 'object') { toast(t('restoreBad'), t('bkBadB'), 3500); return; }
    const dt = new Date(o.created), when = isNaN(dt) ? '—' : fmtDayY(dt);
    const cnt = o.images && typeof o.images === 'object' ? Object.keys(o.images).length : 0;
    ask(esc(t('bkAsk', when, cnt)), t('restoreGo'), () => bkApply(o));
}
async function bkApply(o) {
    close(); toast(t('bkRestoring'), '', 120000);
    try {
        if (o.images && typeof o.images === 'object') {
            await nbTx('readwrite', s => s.clear());
            nbCache.forEach(u => { try { URL.revokeObjectURL(u); } catch (e) {} }); nbCache.clear();
            for (const id of Object.keys(o.images)) {
                try { const full = bkBlob(o.images[id]), th = await nbShrink(full, 420, .78); await idbPut(id, full); await idbPut(id + 't', th); } catch (e) {}
            }
        }
        applyRestore(o.data);
        save(); render(); buzz(20);
        clearTimeout(toastT); toast(t('restoreOk'), t('restoreOkB'), 3000);
    } catch (e) { toast(t('bkFail'), String((e && e.message) || ''), 5000); }
}
applyLang();
