/* Kotoba — interface, sessions et import.
   Dépend de data.js, js/lexicon.js, js/srs.js et js/parser.js. */
(function () {
'use strict';

if (!window.Kotoba || !window.Kotoba.Parser || !window.Kotoba.Store) {
  document.body.innerHTML = '<p style="padding:2rem;font-family:system-ui">Kotoba n a pas pu charger ses modules. Recharge la page.</p>';
  return;
}

const P = window.Kotoba.Parser;
const S = window.Kotoba.Store;
const $ = function (sel, root) { return (root || document).querySelector(sel); };
const $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

const state = S.load();
let entries = [];
let view = 'learn';
let session = null;
const ui = { filter: 'all', search: '', importText: '', preview: null, lastFocus: null };
let toastTimer = 0;
let voices = [];
let tessPromise = null;

const VIEWS = { learn: '#view-learn', review: '#view-review', library: '#view-library', import: '#view-import' };
const FROM_HASH = { apprendre: 'learn', reviser: 'review', mots: 'library', importer: 'import' };

/* ---------- Utilitaires ---------- */
function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
    return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
  });
}
function attr(value) { return esc(value); }
function frHtml(fr) {
  const s = String(fr || '');
  const m = s.match(/^(.*?)\s*\(([^)]*)\)\s*$/);
  if (m) return esc(m[1]) + '<span class="fr-note">(' + esc(m[2]) + ')</span>';
  return esc(s);
}
function rubyHtml(annotated, showFurigana) {
  const s = String(annotated || '');
  if (!showFurigana) return esc(P.stripAnnotations(s));
  let out = '';
  let last = 0;
  const re = /([^\s\[\]]+?)\[([^\]]+)\]/g;
  let m;
  while ((m = re.exec(s))) {
    out += esc(s.slice(last, m.index));
    out += '<ruby>' + esc(m[1]) + '<rt>' + esc(m[2]) + '</rt></ruby>';
    last = re.lastIndex;
  }
  out += esc(s.slice(last));
  return out;
}
function contextHtml(context, hl) {
  const text = String(context || '').trim();
  if (!text) return '<span class="muted">Pas encore de phrase de contexte.</span>';
  const target = String(hl || '').trim();
  const safe = esc(text);
  if (!target) return safe;
  const escTarget = esc(target);
  const idx = safe.indexOf(escTarget);
  if (idx < 0) return safe;
  return safe.slice(0, idx) + '<mark>' + escTarget + '</mark>' + safe.slice(idx + escTarget.length);
}
function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }
function todayXp() { return (state.stats.daily && state.stats.daily[S.todayKey()]) || 0; }
function greeting() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return { jp: 'おはよう', fr: 'Bonjour' };
  if (h >= 11 && h < 18) return { jp: 'こんにちは', fr: 'Bonjour' };
  return { jp: 'こんばんは', fr: 'Bonsoir' };
}
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}
function byDue(a, b) {
  const pa = state.progress[a.id];
  const pb = state.progress[b.id];
  const da = pa && pa.last ? pa.due : Infinity;
  const db = pb && pb.last ? pb.due : Infinity;
  if (da !== db) return da - db;
  return String(a.fr).localeCompare(String(b.fr), 'fr');
}
function entryKey(e) {
  return P.stripAnnotations(e.jp || '') + '|' + String(e.fr || '').toLowerCase().replace(/\s+/g, ' ').trim();
}
function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () { el.classList.remove('show'); }, 3000);
}
function persist() {
  if (!S.save(state)) toast('Impossible d enregistrer (stockage du navigateur plein ?).');
}
function applyTheme() {
  const pref = state.settings.theme || 'system';
  const dark = pref === 'dark' || (pref === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', dark ? '#101714' : '#58cc02');
}
function updateChrome() {
  const c = S.counts(entries, state, Date.now());
  const badge = $('#dueBadge');
  if (badge) { badge.textContent = String(c.due); badge.setAttribute('data-zero', c.due ? '0' : '1'); }
  const streak = $('#streakVal');
  if (streak) streak.textContent = String(state.stats.streak || 0);
  const xp = $('#xpVal');
  if (xp) xp.textContent = String(todayXp());
}
function loadVoices() {
  if (!('speechSynthesis' in window)) return;
  try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { voices = []; }
}
function speak(text, rate) {
  const t = String(text || '').trim();
  if (!t) return;
  if (!('speechSynthesis' in window) || typeof window.SpeechSynthesisUtterance === 'undefined') {
    toast('La synthèse vocale n est pas disponible ici.');
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new window.SpeechSynthesisUtterance(t);
    u.lang = 'ja-JP';
    u.rate = rate || state.settings.rate || 0.9;
    const v = voices.filter(function (x) { return /^ja/i.test(x.lang); })[0];
    if (v) u.voice = v;
    window.speechSynthesis.speak(u);
  } catch (e) { toast('Impossible de lire l audio.'); }
}
function download(name, text) {
  const blob = new Blob([text], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
}

/* ---------- Données ---------- */
function buildEntries() {
  const list = [];
  (window.UNITS_DATA || []).forEach(function (unit) {
    (unit.words || []).forEach(function (w, i) {
      const jp = w[0] || '';
      const fr = w[3] || '';
      if (!jp || !fr) return;
      const ruby = w[1] || jp;
      list.push({
        id: 'u:' + unit.id + ':' + i,
        unitId: unit.id, theme: unit.name, emoji: unit.emoji || '📘',
        jp: P.stripAnnotations(jp), ruby: ruby,
        reading: P.stripAnnotations(ruby), romaji: w[2] || '', fr: fr,
        context: w[4] || '', contextFr: w[5] || '',
        hl: w[6] || P.stripAnnotations(jp), source: 'base'
      });
    });
  });
  Object.keys(state.entries || {}).forEach(function (key) {
    const e = state.entries[key];
    if (!e || !e.jp) return;
    list.push(Object.assign({ theme: 'Mes mots importés', emoji: '📥', source: 'import' }, e, {
      id: e.id || key,
      ruby: e.ruby || e.jp,
      reading: e.reading || P.stripAnnotations(e.ruby || e.jp),
      hl: e.hl || e.jp
    }));
  });
  return list;
}
function unitStats(unitId, now) {
  const list = entries.filter(function (e) { return e.unitId === unitId; });
  let seen = 0, known = 0, due = 0, fresh = 0;
  list.forEach(function (e) {
    const p = state.progress[e.id];
    if (S.isNew(p)) { fresh++; return; }
    seen++;
    if (S.isKnown(p)) known++;
    if (p && p.due <= now) due++;
  });
  return { total: list.length, seen: seen, known: known, due: due, new: fresh };
}
function showView(name, opts) {
  if (!VIEWS[name]) name = 'learn';
  view = name;
  Object.keys(VIEWS).forEach(function (key) {
    const el = $(VIEWS[key]);
    if (el) el.hidden = key !== name;
  });
  $$('[data-nav]').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === name); });
  render();
  if (!opts || !opts.noScroll) window.scrollTo(0, 0);
}
function render() {
  if (view === 'learn') renderHome();
  else if (view === 'review') renderReview();
  else if (view === 'library') renderLibrary();
  else if (view === 'import') renderImport();
  updateChrome();
}
function route() {
  const key = (location.hash || '').replace(/^#/, '');
  showView(FROM_HASH[key] || 'learn', { noScroll: true });
}

/* ---------- Accueil ---------- */
function renderHome() {
  const now = Date.now();
  const c = S.counts(entries, state, now);
  const xp = todayXp();
  const goal = state.settings.goal || 50;
  const pct = Math.min(100, Math.round(xp / goal * 100));
  const g = greeting();
  const wotd = entries.length ? entries[Math.floor(now / 86400000) % entries.length] : null;
  const primaryKind = c.due ? 'due' : (c.new ? 'new' : 'all');
  const primaryLabel = c.due ? 'Réviser maintenant' : (c.new ? 'Apprendre de nouveaux mots' : 'Tout revoir');
  const units = (window.UNITS_DATA || []).map(function (unit) {
    const st = unitStats(unit.id, now);
    const p = st.total ? Math.round(st.seen / st.total * 100) : 0;
    return '<button class="theme-card" data-action="start" data-kind="unit" data-unit="' + attr(unit.id) + '" data-mode="recall">' +
      '<span class="theme-top"><span class="theme-emoji">' + esc(unit.emoji || '📘') + '</span><span class="theme-name">' + esc(unit.name) + '</span></span>' +
      '<span class="theme-meta"><span>' + st.seen + '/' + st.total + ' vus</span><span>' + (st.due ? st.due + ' à revoir' : st.known + ' connus') + '</span></span>' +
      '<span class="bar"><span class="bar-fill" style="width:' + p + '%"></span></span></button>';
  }).join('');
  let body = '<section class="hero">' +
    '<div><p class="eyebrow">' + esc(g.jp) + ' · ' + esc(g.fr) + '</p>' +
      '<h1>' + (c.due ? 'On révise un peu ?' : (c.new ? 'Prêt à apprendre ?' : 'Tout est à jour.')) + '</h1>' +
      '<p class="lead">' + (c.due
        ? plural(c.due, 'carte t attend', 'cartes t attendent') + ' aujourd hui. Un petit tour et ta mémoire te dira merci.'
        : (c.new ? plural(c.new, 'nouveau mot', 'nouveaux mots') + ' à découvrir. Commence par cinq, tu verras.'
          : 'Reviens demain pour entretenir ta mémoire, ou révise tout ce que tu connais déjà.')) + '</p>' +
      '<div class="hero-actions"><button class="btn primary big" data-action="start" data-kind="' + primaryKind + '" data-mode="recall" data-testid="cta-main">' + primaryLabel + '</button>' +
      (c.seen ? '<button class="btn ghost" data-action="start" data-kind="all" data-mode="recall">Tout revoir</button>' : '') + '</div>' +
      '<p class="hero-sub">' + (c.due ? plural(c.due, 'carte due', 'cartes dues') : (c.new ? plural(c.new, 'mot à découvrir', 'mots à découvrir') : 'Série : ' + (state.stats.streak || 0) + ' jour(s)')) + '</p></div>' +
    '<div class="goal-ring" aria-label="Objectif quotidien : ' + xp + ' sur ' + goal + ' XP"><svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52"></circle>' +
      '<circle class="ring-fill" cx="60" cy="60" r="52" stroke-dasharray="' + (pct / 100 * 326.7).toFixed(1) + ' 326.7"></circle></svg>' +
      '<div class="ring-label"><b>' + xp + '</b><span>/ ' + goal + ' XP</span></div></div></section>' +
    '<div class="stat-row"><div class="stat-card"><span class="stat-num">' + c.due + '</span><span class="stat-label">À réviser</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + c.known + '</span><span class="stat-label">Mots connus</span></div>' +
      '<div class="stat-card"><span class="stat-num">' + c.new + '</span><span class="stat-label">Nouveaux</span></div></div>' +
    '<section class="panel"><div class="panel-head"><h2>Mes thèmes</h2><p>' + c.seen + '/' + c.total + ' mots découverts</p></div><div class="theme-grid">' + units + '</div></section>';
  if (wotd) {
    body += '<section class="panel"><div class="panel-head"><h2>Mot du jour</h2><button class="btn ghost small" data-action="speak-text" data-text="' + attr(wotd.jp) + '">🔊 Écouter</button></div>' +
      '<div class="wotd"><div><div class="wotd-fr">' + frHtml(wotd.fr) + '</div><div class="wotd-jp" lang="ja">' + rubyHtml(wotd.ruby, state.settings.furigana) + '</div>' +
      '<div class="muted small">' + esc(wotd.romaji) + '</div></div><div><p class="wotd-context" lang="ja">' + contextHtml(wotd.context, wotd.hl) + '</p>' +
      '<p class="muted small">' + esc(wotd.contextFr) + '</p><button class="btn ghost small" data-action="detail" data-id="' + attr(wotd.id) + '">Voir la fiche</button></div></div></section>';
  }
  $('#view-learn').innerHTML = body;
}

/* ---------- Réviser ---------- */
function renderReview() {
  const now = Date.now();
  const c = S.counts(entries, state, now);
  const forecast = S.forecast(entries, state, now);
  const max = Math.max.apply(null, forecast.concat([1]));
  const labels = ['Auj.', 'Demain', '+2 j', '+3 j', '+4 j', '+5 j', '+6 j'];
  const bars = forecast.map(function (n, i) {
    return '<div class="forecast-col"><div class="forecast-bar" style="height:' + Math.max(3, Math.round(n / max * 100)) + '%"></div><span class="forecast-label">' + labels[i] + '</span></div>';
  }).join('');
  $('#view-review').innerHTML = '<div class="panel"><div class="panel-head"><div><h2>Réviser</h2><p>' +
    (c.due ? plural(c.due, 'carte t attend', 'cartes t attendent') : 'Rien n est dû pour le moment.') + '</p></div></div><div class="review-grid">' +
    '<div class="review-card"><span class="review-num">' + c.due + '</span><strong>Cartes dues</strong><span class="hint">Choisis ton mode : rappel, QCM ou écoute.</span><div class="mode-row">' +
      '<button class="mode-btn active" data-action="start" data-kind="due" data-mode="recall"' + (c.due ? '' : ' disabled') + '>Rappel</button>' +
      '<button class="mode-btn" data-action="start" data-kind="due" data-mode="choice"' + (c.due ? '' : ' disabled') + '>QCM</button>' +
      '<button class="mode-btn" data-action="start" data-kind="due" data-mode="listen"' + (c.due ? '' : ' disabled') + '>Écoute</button></div></div>' +
    '<button class="review-card" data-action="start" data-kind="quick" data-mode="recall"' + (c.seen ? '' : ' disabled') + '><span class="review-num">' + Math.min(10, c.seen) + '</span><strong>Révision rapide</strong><span class="hint">Dix mots au hasard, même s ils ne sont pas dus.</span></button>' +
    '<button class="review-card" data-action="start" data-kind="all" data-mode="recall"' + (c.seen ? '' : ' disabled') + '><span class="review-num">' + c.seen + '</span><strong>Tout revoir</strong><span class="hint">Tous les mots déjà rencontrés.</span></button>' +
    '<button class="review-card" data-action="start" data-kind="new" data-mode="recall"' + (c.new ? '' : ' disabled') + '><span class="review-num">' + c.new + '</span><strong>Nouveaux mots</strong><span class="hint">Découvre jusqu à dix nouveaux mots.</span></button>' +
    '</div></div><section class="panel"><div class="panel-head"><h2>Prévisions</h2><p>Les 7 prochains jours</p></div><div class="forecast">' + bars + '</div></section>';
}

/* ---------- Mes mots ---------- */
function renderLibrary() {
  const filters = [['all', 'Tous'], ['due', 'À réviser'], ['new', 'Nouveaux'], ['learning', 'En cours'], ['known', 'Connus'], ['imported', 'Importés']];
  const chips = filters.map(function (f) {
    return '<button class="chip' + (ui.filter === f[0] ? ' active' : '') + '" data-action="filter" data-filter="' + f[0] + '">' + f[1] + '</button>';
  }).join('');
  $('#view-library').innerHTML = '<div class="panel"><div class="panel-head"><div><h2>Mes mots</h2><p>' + entries.length + ' mots dans ta collection</p></div>' +
    '<button class="btn ghost small" data-action="go-import">Importer</button></div>' +
    '<div class="library-tools"><input class="search" id="searchInput" type="search" placeholder="Chercher en français, japonais ou romaji…" value="' + attr(ui.search) + '" data-testid="search">' +
    '<div class="chips">' + chips + '</div></div><div id="libraryList" data-testid="library-list"></div></div>';
  renderLibraryList();
}
function renderLibraryList() {
  const box = $('#libraryList');
  if (!box) return;
  const now = Date.now();
  const q = ui.search.trim().toLowerCase();
  let list = entries.slice();
  if (ui.filter === 'imported') list = list.filter(function (e) { return e.source === 'import'; });
  else if (ui.filter === 'due') list = list.filter(function (e) { return S.isDue(state.progress[e.id], now); });
  else if (ui.filter === 'new') list = list.filter(function (e) { return S.isNew(state.progress[e.id]); });
  else if (ui.filter === 'learning') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && !S.isKnown(p); });
  else if (ui.filter === 'known') list = list.filter(function (e) { return S.isKnown(state.progress[e.id]); });
  if (q) list = list.filter(function (e) { return [e.fr, e.jp, e.ruby, e.romaji, e.context, e.contextFr].join(' ').toLowerCase().indexOf(q) >= 0; });
  list.sort(function (a, b) {
    const pa = state.progress[a.id], pb = state.progress[b.id];
    const da = pa && pa.last ? pa.due : Infinity, db = pb && pb.last ? pb.due : Infinity;
    if (da !== db) return da - db;
    return String(a.fr).localeCompare(String(b.fr), 'fr');
  });
  if (!list.length) { box.innerHTML = '<div class="empty"><span class="big">🔎</span>Aucun mot ne correspond à ce filtre.</div>'; return; }
  box.innerHTML = '<div class="word-list">' + list.map(function (e) {
    const p = state.progress[e.id];
    const status = S.statusOf(p);
    const label = status === 'known' ? 'Connu' : (status === 'learning' ? 'En cours' : 'Nouveau');
    return '<div class="word-row" role="button" tabindex="0" data-action="detail" data-id="' + attr(e.id) + '">' +
      '<span><span class="word-fr">' + frHtml(e.fr) + '</span><br><span class="badge ' + status + '">' + label + '</span></span>' +
      '<span class="word-jp" lang="ja">' + rubyHtml(e.ruby, state.settings.furigana) + '</span>' +
      '<span class="word-romaji">' + esc(e.romaji) + (e.source === 'import' ? ' <span class="badge import">Importé</span>' : '') + '</span></div>';
  }).join('') + '</div>';
}

/* ---------- Import ---------- */
function renderImport() {
  $('#view-import').innerHTML = '<div class="panel"><div class="panel-head"><div><h2>Importer des mots</h2><p>Colle une liste, un fichier ou une capture d écran.</p></div></div>' +
    '<p class="hint">Format conseillé : <b>français | japonais | romaji | phrase | traduction</b>. Les deux premiers champs suffisent. Le japonais peut être en kanji, en kana ou en romaji.</p>' +
    '<textarea class="import-text" id="importText" data-testid="import-textarea" placeholder="bonjour | kon-ni-chi-wa&#10;merci | arigatou&#10;manger | 食べる | taberu">' + esc(ui.importText) + '</textarea>' +
    '<div class="import-actions"><button class="btn primary" data-action="preview-import" data-testid="preview-import">Analyser la liste</button><button class="btn ghost" data-action="clear-import">Effacer</button></div>' +
    '<div id="importPreview" data-testid="import-preview"></div></div>' +
    '<div class="panel"><div class="panel-head"><h2>Depuis un fichier</h2><p>.txt, .csv, .tsv ou .json</p></div><div class="file-row"><input type="file" id="importFile" accept=".txt,.csv,.tsv,.json,text/plain,application/json"></div></div>' +
    '<div class="panel"><div class="panel-head"><h2>Depuis une capture d écran</h2><p>OCR japonais + français</p></div>' +
    '<div id="dropZone" class="drop-zone" data-testid="drop-zone">Glisse une image ici, colle-la avec Ctrl+V, ou <button class="btn ghost small" data-action="pick-image">choisir une image</button></div>' +
    '<input type="file" id="ocrFile" accept="image/*" hidden><div id="ocrStatus" class="ocr-status"></div></div>';
  if (ui.preview) renderPreview();
}
function renderPreview() {
  const box = $('#importPreview');
  if (!box) return;
  const p = ui.preview;
  if (!p) { box.innerHTML = ''; return; }
  const existing = new Set(entries.map(entryKey));
  const newCount = p.entries.filter(function (e) { return !existing.has(entryKey(e)); }).length;
  const rows = p.entries.slice(0, 50).map(function (e) {
    const dup = existing.has(entryKey(e));
    return '<div class="preview-row"><span>' + esc(e.fr) + (dup ? '<br><span class="badge new">déjà présent</span>' : '') + '</span>' +
      '<span class="preview-jp" lang="ja">' + rubyHtml(e.ruby, state.settings.furigana) + '</span>' +
      '<span class="muted">' + esc(e.romaji) + '</span>' +
      '<span>' + esc(e.context || '—') + (e.contextFr ? '<br><span class="muted">' + esc(e.contextFr) + '</span>' : '') + '</span></div>';
  }).join('');
  const errors = p.errors.length ? '<div class="errors"><b>' + p.errors.length + ' ligne(s) ignorée(s)</b>' + p.errors.slice(0, 5).map(function (x) {
    return '<div class="error-item">Ligne ' + x.line + ' : ' + esc(x.reason) + ' — <i>' + esc(x.text) + '</i></div>';
  }).join('') + '</div>' : '';
  box.innerHTML = '<div class="preview-table"><div class="preview-row head"><span>Français</span><span>Japonais</span><span>Romaji</span><span>Contexte</span></div>' + rows + '</div>' +
    (p.entries.length > 50 ? '<p class="hint">Aperçu limité à 50 lignes sur ' + p.entries.length + '.</p>' : '') +
    '<div class="import-actions"><button class="btn primary" data-action="do-import" data-testid="do-import"' + (newCount ? '' : ' disabled') + '>Importer ' + newCount + ' mot(s)</button>' +
    '<span class="hint">' + p.entries.length + ' détecté(s), ' + p.errors.length + ' erreur(s).</span></div>' + errors;
}
function previewImport() {
  const el = $('#importText');
  if (!el) return;
  ui.importText = el.value;
  const p = P.parseText(el.value);
  if (!p.entries.length && !p.errors.length) { toast('Colle d abord quelques mots.'); return; }
  ui.preview = p;
  renderPreview();
  const box = $('#importPreview');
  if (box) box.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function doImport() {
  if (!ui.preview || !ui.preview.entries.length) return;
  const keys = new Set(entries.map(entryKey));
  let added = 0, skipped = 0;
  ui.preview.entries.forEach(function (e) {
    if (keys.has(entryKey(e))) { skipped++; return; }
    state.entries[e.id] = e; keys.add(entryKey(e)); added++;
  });
  if (!added) { toast('Ces mots sont déjà dans ta collection.'); return; }
  persist();
  entries = buildEntries();
  ui.preview = null; ui.importText = '';
  toast(added + ' mot(s) importé(s)' + (skipped ? ' · ' + skipped + ' doublon(s) ignoré(s)' : ''));
  try { history.replaceState(null, '', '#mots'); } catch (e) { location.hash = 'mots'; }
  showView('library');
}
function readImportFile(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    let text = String(reader.result || '');
    if (/\.json$/i.test(file.name)) {
      try {
        const data = JSON.parse(text);
        const arr = Array.isArray(data) ? data : (data.entries ? (Array.isArray(data.entries) ? data.entries : Object.keys(data.entries).map(function (k) { return data.entries[k]; })) : null);
        if (!arr) throw new Error('JSON sans liste d entrées');
        text = arr.filter(function (e) { return e && (e.jp || e.ruby) && e.fr; }).map(function (e) {
          return [e.fr, e.jp || e.ruby, e.romaji || '', e.context || '', e.contextFr || ''].join(' | ');
        }).join('\n');
      } catch (err) { toast('Fichier JSON non reconnu.'); return; }
    }
    ui.importText = text; ui.preview = null;
    renderImport();
    previewImport();
  };
  reader.onerror = function () { toast('Impossible de lire le fichier.'); };
  reader.readAsText(file, 'utf-8');
}
function cleanOcr(text) {
  return String(text || '').replace(/[ \t]+/g, ' ').replace(/([\u3040-\u30ff\u3400-\u9fff]) (?=[\u3040-\u30ff\u3400-\u9fff])/g, '$1').replace(/\n{3,}/g, '\n\n').trim();
}
function loadTesseract() {
  if (window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tessPromise) return tessPromise;
  tessPromise = new Promise(function (resolve, reject) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.async = true;
    s.onload = function () { if (window.Tesseract) resolve(window.Tesseract); else reject(new Error('moteur OCR indisponible')); };
    s.onerror = function () { tessPromise = null; reject(new Error('téléchargement de l OCR impossible')); };
    document.head.appendChild(s);
  });
  return tessPromise;
}
function handleImage(file) {
  if (!file || !/^image\//.test(file.type || '')) { toast('Choisis une image (PNG, JPG…).'); return; }
  const status = $('#ocrStatus');
  if (status) status.textContent = 'Chargement de l OCR…';
  loadTesseract().then(function (T) {
    return T.createWorker(['jpn', 'fra'], 1, { logger: function (m) {
      if (status) status.textContent = m.status === 'recognizing text' ? 'Lecture… ' + Math.round((m.progress || 0) * 100) + '%' : 'Préparation de l OCR…';
    } }).then(function (worker) {
      return worker.recognize(file).then(function (res) { return worker.terminate().then(function () { return res; }); });
    });
  }).then(function (res) {
    const text = cleanOcr(res && res.data && res.data.text);
    if (!text) { if (status) status.textContent = 'Aucun texte détecté. Essaie une image plus nette.'; return; }
    ui.importText = text; ui.preview = null;
    renderImport();
    if (status) status.textContent = 'Texte reconnu. Vérifie-le avant d importer.';
    previewImport();
  }).catch(function (err) {
    if (status) status.textContent = '';
    toast('OCR impossible : ' + (err && err.message ? err.message : 'vérifie ta connexion.'));
  });
}

/* ---------- Session ---------- */
function startSession(kind, mode, unitId) {
  mode = mode || 'recall';
  if (!entries.length) { toast('Aucun mot à afficher.'); return; }
  if (mode === 'listen' && !('speechSynthesis' in window)) { mode = 'choice'; toast('Pas de synthèse vocale ici : passage en QCM.'); }
  const now = Date.now();
  let list = [];
  if (kind === 'due') list = S.dueEntries(entries, state, now);
  else if (kind === 'new') list = entries.filter(function (e) { return S.isNew(state.progress[e.id]); }).slice(0, 10);
  else if (kind === 'quick') list = shuffle(entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; })).slice(0, 10);
  else if (kind === 'all') list = entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; }).sort(byDue);
  else if (kind === 'unit') list = entries.filter(function (e) { return e.unitId === unitId; }).sort(byDue).slice(0, 15);
  if (!list.length) { toast('Rien à réviser pour l instant.'); return; }
  if (kind === 'due') list = list.slice(0, 30);
  session = { kind: kind, mode: mode, queue: list.slice(), current: null, phase: 'front', done: 0, correct: 0, xp: 0, total: list.length, options: [], lastGrade: null, lastDue: 0, lastXp: 0, lastChoice: null };
  document.body.style.overflow = 'hidden';
  const root = $('#session');
  if (root) root.hidden = false;
  nextCard();
}
function nextCard() {
  if (!session) return;
  if (!session.queue.length) { session.current = null; session.phase = 'summary'; renderSession(); return; }
  session.current = session.queue.shift();
  session.phase = session.mode === 'recall' ? 'front' : 'question';
  session.options = session.mode === 'recall' ? [] : buildOptions(session.current, session.mode);
  session.lastGrade = null; session.lastChoice = null;
  session.total = Math.max(session.total, session.done + session.queue.length + 1);
  renderSession();
  if (session.mode === 'listen') speak(session.current.jp);
}
function buildOptions(entry, mode) {
  const seen = new Set([entry.id]);
  const pool = [];
  const same = shuffle(entries.filter(function (e) { return e.unitId === entry.unitId && e.id !== entry.id; }));
  const rest = shuffle(entries.filter(function (e) { return e.unitId !== entry.unitId && e.id !== entry.id; }));
  same.concat(rest).forEach(function (e) {
    if (pool.length >= 3 || seen.has(e.id)) return;
    if (pool.some(function (x) { return x.jp === e.jp || (mode === 'listen' && x.fr === e.fr); })) return;
    seen.add(e.id); pool.push(e);
  });
  return shuffle([entry].concat(pool));
}
function renderSession() {
  const root = $('#session');
  if (!root) return;
  if (!session) { root.hidden = true; return; }
  root.hidden = false;
  const pct = Math.min(100, Math.round(session.done / Math.max(1, session.total) * 100));
  const body = session.phase === 'summary' ? summaryHtml() : (session.mode === 'recall' ? recallView() : quizView());
  root.innerHTML = '<div class="session-shell"><div class="session-top"><button class="icon-btn" data-action="quit-session" aria-label="Quitter la session">✕</button>' +
    '<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><div class="progress-fill" style="width:' + pct + '%" data-testid="progress"></div></div>' +
    '<span class="session-count">' + session.done + '/' + Math.max(session.done, session.total) + '</span></div><div class="session-body">' + body + '</div></div>';
  root.tabIndex = -1;
  root.style.outline = 'none';
  try { root.focus({ preventScroll: true }); } catch (e) { root.focus(); }
}
function answerCard(e) {
  return '<div class="session-card answer-card" data-testid="session-card"><div class="answer-head"><div class="fr-small">' + frHtml(e.fr) + '</div>' +
    '<div class="jp-big" lang="ja" data-testid="answer-jp">' + rubyHtml(e.ruby, state.settings.furigana) + '</div>' +
    (state.settings.romaji ? '<div class="romaji" data-testid="answer-romaji">' + esc(e.romaji) + '</div>' : '') +
    '<div class="audio-row"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '">🔊 Écouter</button>' +
    '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '" data-slow="1">🐢 Lent</button></div></div>' +
    '<aside class="context-card" data-testid="answer-context"><div class="context-label">En contexte</div><p class="context-jp" lang="ja">' + contextHtml(e.context, e.hl) + '</p>' +
    '<p class="context-fr">' + esc(e.contextFr || '—') + '</p>' +
    (e.context ? '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.context) + '">🔊 La phrase</button>' : '<p class="hint">Pas encore de phrase. Ajoute-en une depuis Mes mots.</p>') + '</aside></div>';
}
function recallView() {
  const e = session.current;
  if (session.phase === 'front') {
    return '<div class="session-card front" data-testid="session-card"><p class="eyebrow">' + esc(e.theme) + '</p><h1 class="prompt-fr">' + frHtml(e.fr) + '</h1>' +
      '<p class="prompt-hint">Prononce-le à voix haute, puis révèle la réponse.</p><button class="btn primary big" data-action="reveal" data-testid="reveal">Révéler la réponse <kbd>Espace</kbd></button></div>';
  }
  const answer = answerCard(e);
  if (session.phase === 'feedback') return answer + feedbackHtml();
  return answer + '<div class="grade-row" data-testid="grade-row"><button class="btn ghost danger-text" data-action="grade" data-grade="again" data-testid="grade-again">Je ne savais pas <kbd>1</kbd></button>' +
    '<button class="btn primary" data-action="grade" data-grade="good" data-testid="grade-good">J ai prononcé ✓ <kbd>2</kbd></button></div>';
}
function quizView() {
  const e = session.current;
  if (session.phase === 'feedback') return answerCard(e) + feedbackHtml();
  const listen = session.mode === 'listen';
  return '<div class="session-card" data-testid="session-card"><p class="eyebrow">' + (listen ? 'Écoute et choisis' : 'Choisis la bonne traduction') + '</p>' +
    (listen ? '<button class="btn primary big" data-action="speak-text" data-text="' + attr(e.jp) + '" data-testid="listen-again">🔊 Réécouter</button><p class="prompt-hint">Quel est le sens de ce mot ?</p>'
      : '<h1 class="prompt-fr">' + frHtml(e.fr) + '</h1><p class="prompt-hint">Quel mot japonais correspond ?</p>') +
    '<div class="options" data-testid="options">' + session.options.map(function (o, i) {
      return '<button class="option' + (listen ? ' fr' : '') + '" data-action="choose" data-id="' + attr(o.id) + '" data-testid="option-' + i + '">' +
        (listen ? esc(o.fr) : rubyHtml(o.ruby, state.settings.furigana)) + '<span class="option-key">' + (i + 1) + '</span></button>';
    }).join('') + '</div></div>';
}
function feedbackHtml() {
  const good = session.lastGrade === 'good';
  const wrongChoice = session.lastChoice && session.current && session.lastChoice !== session.current.id;
  return '<div class="feedback ' + (good ? 'good' : 'again') + '" data-testid="feedback"><div class="feedback-text"><strong>' + (good ? 'Bien joué !' : 'On la reverra bientôt') + '</strong>' +
    '<span>Prochaine révision : ' + S.dueLabel(session.lastDue) + ' · +' + session.lastXp + ' XP</span>' + (wrongChoice ? '<span>La bonne réponse est affichée ci-dessus.</span>' : '') + '</div>' +
    '<button class="btn ' + (good ? 'primary' : 'warn') + '" data-action="continue-session" data-testid="session-next">Continuer <kbd>Entrée</kbd></button></div>';
}
function summaryHtml() {
  const accuracy = session.done ? Math.round(session.correct / session.done * 100) : 0;
  const c = S.counts(entries, state, Date.now());
  const next = S.nextDue(entries, state, Date.now());
  return '<div class="summary-card" data-testid="summary"><div class="summary-emoji">🎉</div><h1>Session terminée !</h1><p class="muted">' + (session.done ? 'Bien joué, continue comme ça.' : 'Rien à faire pour l instant.') + '</p>' +
    '<div class="summary-stats"><div><b>' + session.done + '</b><span>cartes</span></div><div><b>' + accuracy + '%</b><span>réussite</span></div><div><b>+' + session.xp + '</b><span>XP</span></div></div>' +
    '<p class="hint">' + (next ? 'Prochaine révision : ' + S.dueLabel(next) + '.' : 'Tu es à jour.') + '</p><div class="summary-actions">' +
    '<button class="btn primary" data-action="finish-session" data-testid="finish-session">Retour à l accueil</button>' +
    (c.due ? '<button class="btn ghost" data-action="start-again" data-testid="start-again">Réviser encore</button>' : '') + '</div></div>';
}
function reveal() { if (session && session.phase === 'front') { session.phase = 'revealed'; renderSession(); } }
function grade(g) {
  if (!session || !session.current) return;
  const e = session.current, now = Date.now();
  const prev = state.progress[e.id] || S.freshProgress(now);
  state.progress[e.id] = S.schedule(prev, g, now);
  const xp = S.bumpStats(state, g, now);
  session.xp += xp; session.done++;
  if (g === 'good') session.correct++;
  session.lastGrade = g; session.lastXp = xp; session.lastDue = state.progress[e.id].due;
  if (g === 'again') session.queue.splice(Math.min(3, session.queue.length), 0, e);
  session.total = Math.max(session.total, session.done + session.queue.length);
  persist();
  session.phase = 'feedback';
  renderSession();
  updateChrome();
}
function choose(id) { if (session && session.phase === 'question' && session.current) { session.lastChoice = id; grade(id === session.current.id ? 'good' : 'again'); } }
function quitSession() {
  if (!session) return;
  if (session.done > 0 && !window.confirm('Quitter la session ? Ta progression est déjà enregistrée.')) return;
  closeSession();
}
function closeSession() {
  session = null;
  const root = $('#session');
  if (root) { root.hidden = true; root.innerHTML = ''; }
  document.body.style.overflow = '';
  render();
  window.scrollTo(0, 0);
}
function finishSession() {
  closeSession();
  try { history.replaceState(null, '', '#apprendre'); } catch (e) { /* ignore */ }
  showView('learn');
}
function startAgain() { closeSession(); if (S.counts(entries, state, Date.now()).due) startSession('due', 'recall'); else toast('Rien à réviser pour l instant.'); }

/* ---------- Modales ---------- */
function openModal(title, body) {
  const modal = $('#modal');
  if (!modal) return;
  ui.lastFocus = document.activeElement;
  modal.innerHTML = '<div class="modal-backdrop" data-action="close-modal"></div><div class="modal-panel" role="dialog" aria-modal="true" aria-label="' + attr(title) + '">' +
    '<div class="modal-head"><h2>' + esc(title) + '</h2><button class="icon-btn" data-action="close-modal" aria-label="Fermer">✕</button></div><div class="modal-body">' + body + '</div></div>';
  modal.hidden = false;
  const panel = $('.modal-panel', modal);
  if (panel) { const focusable = panel.querySelector('button, input, select, textarea, [tabindex]'); if (focusable) setTimeout(function () { focusable.focus(); }, 30); }
}
function closeModal() {
  const modal = $('#modal');
  if (!modal) return;
  modal.hidden = true; modal.innerHTML = '';
  if (ui.lastFocus && ui.lastFocus.focus) { try { ui.lastFocus.focus(); } catch (e) { /* ignore */ } }
  ui.lastFocus = null;
}
function openSettings() {
  const s = state.settings;
  const goals = [20, 30, 50, 100];
  openModal('Réglages', '<div class="setting-row"><div><strong>Objectif quotidien</strong><small>XP à gagner chaque jour</small></div><div class="seg">' +
    goals.map(function (g) { return '<button class="' + (s.goal === g ? 'active' : '') + '" data-action="set-goal" data-goal="' + g + '">' + g + '</button>'; }).join('') + '</div></div>' +
    '<div class="setting-row"><div><strong>Furigana</strong><small>Lecture au-dessus des kanji</small></div><label class="switch"><input type="checkbox" data-setting="furigana"' + (s.furigana ? ' checked' : '') + '> Afficher</label></div>' +
    '<div class="setting-row"><div><strong>Romaji</strong><small>Prononciation en lettres latines</small></div><label class="switch"><input type="checkbox" data-setting="romaji"' + (s.romaji ? ' checked' : '') + '> Afficher</label></div>' +
    '<div class="setting-row"><div><strong>Thème</strong><small>Clair, sombre ou système</small></div><select data-setting="theme"><option value="system"' + (s.theme === 'system' ? ' selected' : '') + '>Système</option><option value="light"' + (s.theme === 'light' ? ' selected' : '') + '>Clair</option><option value="dark"' + (s.theme === 'dark' ? ' selected' : '') + '>Sombre</option></select></div>' +
    '<div class="setting-row"><div><strong>Vitesse audio</strong><small>Voix japonaise du navigateur</small></div><div style="display:flex;align-items:center;gap:8px"><input type="range" min="0.5" max="1.3" step="0.05" value="' + s.rate + '" data-setting="rate" style="width:110px"><button class="btn ghost small" data-action="test-voice">Tester</button></div></div>' +
    '<div class="setting-row"><div><strong>Sauvegarde</strong><small>Exporte ou restaure ta progression</small></div><div class="modal-actions" style="margin:0"><button class="btn ghost small" data-action="export-data">Exporter</button><button class="btn ghost small" data-action="import-data">Importer</button></div></div>' +
    '<input type="file" id="dataFile" accept=".json,application/json" hidden><div class="modal-actions"><button class="btn danger-text" data-action="reset-data">Tout effacer</button></div>' +
    '<p class="hint">Kotoba stocke tout dans ce navigateur. Utilise l export pour passer d un appareil à l autre.</p>');
}
function openDetail(id) {
  const e = entries.filter(function (x) { return x.id === id; })[0];
  if (!e) return;
  const p = state.progress[id];
  const status = S.statusOf(p);
  const meta = ['Niveau : ' + S.levelLabel(p), p && p.last ? 'Prochaine révision : ' + S.dueLabel(p.due) : 'Jamais révisé',
    (p ? (p.reps || 0) : 0) + ' réussite(s)', p && p.lapses ? p.lapses + ' oubli(s)' : ''].filter(Boolean)
    .map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
  openModal('Fiche du mot', '<div class="detail-top"><div class="detail-fr">' + frHtml(e.fr) + '</div><div class="detail-jp" lang="ja">' + rubyHtml(e.ruby, state.settings.furigana) + '</div>' +
    '<div class="detail-romaji">' + esc(e.romaji) + '</div><div class="audio-row" style="justify-content:center"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '">🔊 Écouter</button>' +
    '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '" data-slow="1">🐢 Lent</button></div></div>' +
    '<div class="detail-context"><div class="context-label">En contexte</div><p class="jp" lang="ja">' + contextHtml(e.context, e.hl) + '</p><p class="muted small">' + esc(e.contextFr || '—') + '</p>' +
    (e.context ? '<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.context) + '">🔊 La phrase</button>' : '') + '</div>' +
    '<div class="detail-meta">' + meta + '<span>' + (status === 'known' ? 'Connu' : status === 'learning' ? 'En cours' : 'Nouveau') + '</span><span>' + esc(e.source === 'import' ? 'Importé' : e.theme) + '</span></div>' +
    '<div class="modal-actions">' + (e.source === 'import' ? '<button class="btn ghost small" data-action="edit-entry" data-id="' + attr(e.id) + '">Modifier</button>' : '') +
    (p ? '<button class="btn ghost small" data-action="reset-progress" data-id="' + attr(e.id) + '">Réinitialiser la progression</button>' : '') +
    (e.source === 'import' ? '<button class="btn ghost small danger-text" data-action="delete-entry" data-id="' + attr(e.id) + '">Supprimer</button>' : '') + '</div>');
}
function openEdit(id) {
  const e = state.entries[id];
  if (!e) return;
  openModal('Modifier le mot', '<form class="edit-form" data-form="edit" data-id="' + attr(id) + '">' +
    '<label>Français<input name="fr" value="' + attr(e.fr) + '" required></label><label>Japonais<input name="jp" value="' + attr(e.jp) + '" required></label>' +
    '<label>Romaji<input name="romaji" value="' + attr(e.romaji || '') + '"></label><label>Phrase de contexte<input name="context" value="' + attr(e.context || '') + '"></label>' +
    '<label>Traduction du contexte<input name="contextFr" value="' + attr(e.contextFr || '') + '"></label><p class="hint">Pour ajouter un furigana, écris par exemple 食[た]べる.</p>' +
    '<div class="modal-actions"><button class="btn primary" type="submit">Enregistrer</button><button class="btn ghost" type="button" data-action="detail" data-id="' + attr(id) + '">Annuler</button></div></form>');
}
function deleteEntry(id) {
  if (!state.entries[id]) return;
  if (!window.confirm('Supprimer ce mot importé ?')) return;
  delete state.entries[id]; delete state.progress[id];
  entries = buildEntries(); persist(); closeModal(); render(); toast('Mot supprimé.');
}
function resetProgress(id) {
  if (!window.confirm('Réinitialiser la progression de ce mot ?')) return;
  delete state.progress[id]; persist(); closeModal(); render(); toast('Progression réinitialisée.');
}
function exportData() { download('kotoba-sauvegarde-' + S.todayKey() + '.json', S.exportState(state)); toast('Sauvegarde exportée.'); }
function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function () {
    try {
      const next = S.importState(String(reader.result || ''));
      if (!window.confirm('Remplacer ta progression actuelle par cette sauvegarde ?')) return;
      Object.keys(state).forEach(function (k) { delete state[k]; });
      Object.keys(next).forEach(function (k) { state[k] = next[k]; });
      entries = buildEntries(); persist(); applyTheme(); closeModal(); render(); updateChrome(); toast('Sauvegarde restaurée.');
    } catch (err) { toast(err.message || 'Sauvegarde invalide.'); }
  };
  reader.onerror = function () { toast('Impossible de lire le fichier.'); };
  reader.readAsText(file, 'utf-8');
}
function resetAll() {
  if (!window.confirm('Effacer toute la progression et les mots importés ?')) return;
  if (!window.confirm('Cette action est définitive. Confirmer ?')) return;
  S.reset();
  const fresh = S.defaultState();
  Object.keys(state).forEach(function (k) { delete state[k]; });
  Object.keys(fresh).forEach(function (k) { state[k] = fresh[k]; });
  entries = buildEntries(); persist(); applyTheme(); closeModal(); render(); updateChrome(); toast('Tout a été effacé.');
}

/* ---------- Événements ---------- */
function onClick(event) {
  const el = event.target.closest ? event.target.closest('[data-action]') : null;
  if (!el) return;
  const action = el.getAttribute('data-action');
  const id = el.getAttribute('data-id');
  switch (action) {
    case 'start': startSession(el.getAttribute('data-kind'), el.getAttribute('data-mode') || 'recall', el.getAttribute('data-unit')); break;
    case 'reveal': reveal(); break;
    case 'grade': grade(el.getAttribute('data-grade')); break;
    case 'choose': choose(id); break;
    case 'continue-session': nextCard(); break;
    case 'quit-session': quitSession(); break;
    case 'finish-session': finishSession(); break;
    case 'start-again': startAgain(); break;
    case 'open-settings': openSettings(); break;
    case 'close-modal': closeModal(); break;
    case 'set-goal': state.settings.goal = Number(el.getAttribute('data-goal')) || 50; persist(); render(); openSettings(); break;
    case 'test-voice': speak('こんにちは、花さん！'); break;
    case 'export-data': exportData(); break;
    case 'import-data': { const f = $('#dataFile'); if (f) f.click(); break; }
    case 'reset-data': resetAll(); break;
    case 'speak-text': speak(el.getAttribute('data-text'), el.getAttribute('data-slow') ? Math.max(0.5, (state.settings.rate || 0.9) * 0.72) : (state.settings.rate || 0.9)); break;
    case 'detail': openDetail(id); break;
    case 'edit-entry': openEdit(id); break;
    case 'delete-entry': deleteEntry(id); break;
    case 'reset-progress': resetProgress(id); break;
    case 'filter': ui.filter = el.getAttribute('data-filter') || 'all'; $$('.chip[data-filter]').forEach(function (c) { c.classList.toggle('active', c.getAttribute('data-filter') === ui.filter); }); renderLibraryList(); break;
    case 'preview-import': previewImport(); break;
    case 'do-import': doImport(); break;
    case 'clear-import': ui.importText = ''; ui.preview = null; renderImport(); break;
    case 'pick-image': { const f = $('#ocrFile'); if (f) f.click(); break; }
    case 'go-import': if (location.hash !== '#importer') { try { history.replaceState(null, '', '#importer'); } catch (e) { /* ignore */ } } showView('import'); break;
    default: break;
  }
}
function onSubmit(event) {
  const form = event.target.closest ? event.target.closest('[data-form="edit"]') : null;
  if (!form) return;
  event.preventDefault();
  const id = form.getAttribute('data-id');
  const old = state.entries[id];
  if (!old) return;
  const fd = new FormData(form);
  const fr = String(fd.get('fr') || '').trim();
  const jp = String(fd.get('jp') || '').trim();
  const romaji = String(fd.get('romaji') || '').trim();
  const context = String(fd.get('context') || '').trim();
  const contextFr = String(fd.get('contextFr') || '').trim();
  if (!fr || !jp) { toast('Le français et le japonais sont obligatoires.'); return; }
  const built = P.buildEntry([fr, jp, romaji, context, contextFr]);
  if (!built.entry) { toast(built.reason || 'Impossible de lire ce mot.'); return; }
  state.entries[id] = Object.assign({}, built.entry, { id: id, context: context, contextFr: contextFr, source: 'import', createdAt: old.createdAt || Date.now() });
  entries = buildEntries(); persist(); closeModal(); render(); toast('Mot modifié.');
}
function onChange(event) {
  const t = event.target;
  if (t.id === 'importFile') { const f = t.files && t.files[0]; t.value = ''; if (f) readImportFile(f); return; }
  if (t.id === 'ocrFile') { const f = t.files && t.files[0]; t.value = ''; if (f) handleImage(f); return; }
  if (t.id === 'dataFile') { const f = t.files && t.files[0]; t.value = ''; if (f) importData(f); return; }
  const key = t.getAttribute ? t.getAttribute('data-setting') : null;
  if (!key) return;
  let value;
  if (t.type === 'checkbox') value = t.checked;
  else if (key === 'rate') value = Number(t.value);
  else value = t.value;
  state.settings[key] = value;
  persist(); applyTheme(); render();
}
function onInput(event) {
  const t = event.target;
  if (t.id === 'searchInput') { ui.search = t.value; renderLibraryList(); }
  else if (t.id === 'importText') ui.importText = t.value;
  else if (t.getAttribute && t.getAttribute('data-setting') === 'rate') state.settings.rate = Number(t.value) || 0.9;
}
function onKeydown(event) {
  const modal = $('#modal');
  if (modal && !modal.hidden && event.key === 'Escape') { closeModal(); return; }
  if (session) {
    if (event.key === 'Escape') { quitSession(); return; }
    const tag = (event.target && event.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    const onButton = event.target && event.target.closest && event.target.closest('button');
    if (onButton && (event.key === 'Enter' || event.key === ' ')) return;
    if (session.phase === 'front' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); reveal(); return; }
    if (session.phase === 'revealed') {
      if (event.key === '1') { event.preventDefault(); grade('again'); return; }
      if (event.key === '2' || event.key === 'Enter') { event.preventDefault(); grade('good'); return; }
      if (event.key.toLowerCase() === 'a') { speak(session.current.jp); return; }
    }
    if (session.phase === 'feedback' && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); nextCard(); return; }
    if (session.phase === 'question') {
      if (event.key.toLowerCase() === 'a') { speak(session.current.jp); return; }
      const n = parseInt(event.key, 10);
      if (n >= 1 && n <= session.options.length) { event.preventDefault(); choose(session.options[n - 1].id); }
    }
    return;
  }
  if ((event.key === 'Enter' || event.key === ' ') && event.target && event.target.getAttribute && event.target.getAttribute('role') === 'button') {
    event.preventDefault(); event.target.click();
  }
}

function registerSW() {
  if (!('serviceWorker' in navigator)) return;
  if (!/^https?:$/.test(location.protocol)) return;
  const run = function () { navigator.serviceWorker.register('./sw.js').catch(function () { /* offline bonus */ }); };
  if (document.readyState === 'complete') run(); else window.addEventListener('load', run);
}

/* ---------- Démarrage ---------- */
function init() {
  entries = buildEntries();
  applyTheme();
  updateChrome();
  loadVoices();
  if ('speechSynthesis' in window) window.speechSynthesis.onvoiceschanged = loadVoices;
  if (window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const fn = function () { if (state.settings.theme === 'system') applyTheme(); };
    if (mq.addEventListener) mq.addEventListener('change', fn); else if (mq.addListener) mq.addListener(fn);
  }
  document.addEventListener('click', onClick);
  document.addEventListener('submit', onSubmit);
  document.addEventListener('change', onChange);
  document.addEventListener('input', onInput);
  document.addEventListener('keydown', onKeydown);
  window.addEventListener('hashchange', function () { if (session) closeSession(); route(); });
  document.addEventListener('dragover', function (e) {
    const z = e.target.closest && e.target.closest('#dropZone');
    if (z) { e.preventDefault(); z.classList.add('drag'); }
  });
  document.addEventListener('dragleave', function (e) {
    const z = e.target.closest && e.target.closest('#dropZone');
    if (z) z.classList.remove('drag');
  });
  document.addEventListener('drop', function (e) {
    const z = e.target.closest && e.target.closest('#dropZone');
    if (!z) return;
    e.preventDefault(); z.classList.remove('drag');
    const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) handleImage(f);
  });
  document.addEventListener('paste', function (e) {
    if (view !== 'import') return;
    const items = e.clipboardData && e.clipboardData.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type && items[i].type.indexOf('image/') === 0) {
        const f = items[i].getAsFile();
        if (f) { e.preventDefault(); handleImage(f); }
        break;
      }
    }
  });
  registerSW();
  route();
}

init();
})();
