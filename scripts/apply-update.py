from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
q = chr(34)


def read(path):
    return (ROOT / path).read_text(encoding='utf-8')


def write(path, text):
    (ROOT / path).write_text(text, encoding='utf-8')


def rep(path, old, new, label):
    text = read(path)
    n = text.count(old)
    if n != 1:
        raise SystemExit(path + ' / ' + label + ' : ' + str(n) + ' occurrence(s)')
    write(path, text.replace(old, new, 1))


def slice_replace(path, start, end, new, label):
    text = read(path)
    i = text.find(start)
    if i < 0:
        raise SystemExit(path + ' / ' + label + ' : début introuvable')
    j = text.find(end, i + len(start))
    if j < 0:
        raise SystemExit(path + ' / ' + label + ' : fin introuvable')
    write(path, text[:i] + new + text[j:])


def replace_line(path, prefix, new_lines):
    lines = read(path).splitlines()
    idx = [i for i, line in enumerate(lines) if line.startswith(prefix)]
    if len(idx) != 1:
        raise SystemExit(path + ' / ligne ' + prefix + ' : ' + str(len(idx)) + ' occurrence(s)')
    lines[idx[0]:idx[0] + 1] = new_lines
    write(path, chr(10).join(lines) + chr(10))


def insert_after(path, needle, new_lines):
    lines = read(path).splitlines()
    idx = [i for i, line in enumerate(lines) if needle in line]
    if len(idx) != 1:
        raise SystemExit(path + ' / insertion ' + needle + ' : ' + str(len(idx)) + ' occurrence(s)')
    lines[idx[0] + 1:idx[0] + 1] = new_lines
    write(path, chr(10).join(lines) + chr(10))


def js(value):
    return q + value + q


# 1. Routage de la grammaire dans l application.
rep('js/app.js',
"const VIEWS = { learn: '#view-learn', review: '#view-review', library: '#view-library', import: '#view-import' };\nconst FROM_HASH = { apprendre: 'learn', reviser: 'review', mots: 'library', importer: 'import' };",
"const VIEWS = { learn: '#view-learn', review: '#view-review', library: '#view-library', import: '#view-import', grammar: '#view-grammar' };\nconst FROM_HASH = { apprendre: 'learn', reviser: 'review', mots: 'library', importer: 'import', grammaire: 'grammar' };",
'VIEWS')

# 2. Vue Réviser : carte cliquable, bouton principal et testids.
new_review = r'''function renderReview() {
const now = Date.now();
const c = S.counts(entries, state, now);
const forecast = S.forecast(entries, state, now);
const max = Math.max.apply(null, forecast.concat([1]));
const labels = ['Auj.', 'Demain', '+2 j', '+3 j', '+4 j', '+5 j', '+6 j'];
const bars = forecast.map(function (n, i) {
return `<div class='forecast-col'><div class='forecast-bar' style='height:${Math.max(3, Math.round(n / max * 100))}%'></div><span class='forecast-label'>${labels[i]}</span></div>`;
}).join('');
const primaryKind = c.due ? 'due' : (c.new ? 'new' : 'quick');
const primaryLabel = c.due ? `Réviser ${plural(c.due, 'carte due', 'cartes dues')}` : (c.new ? `Découvrir ${plural(c.new, 'nouveau mot', 'nouveaux mots')}` : 'Révision rapide');
const primaryHint = c.due ? 'Une session de rappel, puis tu valides ta prononciation.' : (c.new ? 'Commence par une série de nouveaux mots.' : 'Un petit tour sur les mots déjà connus.');
const disabled = !(c.due || c.new || c.seen);
$('#view-review').innerHTML = `
<div class='panel review-hero'>
<div><p class='eyebrow'>Ta session</p><h2>${c.due ? 'On révise un peu ?' : (c.new ? 'Prêt à découvrir ?' : 'Tout est à jour.')}</h2><p class='lead'>${primaryHint}</p></div>
<div class='review-hero-actions'><button class='btn primary big' data-action='start' data-kind='${primaryKind}' data-mode='recall' data-testid='review-start-main'${disabled ? ' disabled' : ''}>${primaryLabel}</button></div>
</div>
<div class='panel'><div class='panel-head'><div><h2>Réviser</h2><p>${c.due ? plural(c.due, 'carte t’attend', 'cartes t’attendent') : 'Rien n’est dû pour le moment.'}</p></div></div>
<div class='review-grid'>
<div class='review-card' role='button' tabindex='0' data-action='start' data-kind='due' data-mode='recall' data-testid='review-card-due'>
<span class='review-num'>${c.due}</span><strong>Cartes dues</strong><span class='hint'>Clique sur la carte pour commencer en rappel, ou choisis un mode.</span>
<button class='btn primary small' data-action='start' data-kind='due' data-mode='recall'${c.due ? '' : ' disabled'}>Commencer</button>
<div class='mode-row'><button class='mode-btn active' data-action='start' data-kind='due' data-mode='recall'${c.due ? '' : ' disabled'}>Rappel</button><button class='mode-btn' data-action='start' data-kind='due' data-mode='choice'${c.due ? '' : ' disabled'}>QCM</button><button class='mode-btn' data-action='start' data-kind='due' data-mode='listen'${c.due ? '' : ' disabled'}>Écoute</button></div>
</div>
<button class='review-card' data-action='start' data-kind='quick' data-mode='recall'${c.seen ? '' : ' disabled'}><span class='review-num'>${Math.min(10, c.seen)}</span><strong>Révision rapide</strong><span class='hint'>Dix mots au hasard, même s’ils ne sont pas dus.</span></button>
<button class='review-card' data-action='start' data-kind='all' data-mode='recall'${c.seen ? '' : ' disabled'}><span class='review-num'>${c.seen}</span><strong>Tout revoir</strong><span class='hint'>Tous les mots déjà rencontrés.</span></button>
<button class='review-card' data-action='start' data-kind='new' data-mode='recall' data-testid='review-start-new'${c.new ? '' : ' disabled'}><span class='review-num'>${c.new}</span><strong>Nouveaux mots</strong><span class='hint'>Découvre jusqu’à dix nouveaux mots.</span></button>
</div></div>
<section class='panel'><div class='panel-head'><h2>Prévisions</h2><p>Les 7 prochains jours</p></div><div class='forecast'>${bars}</div></section>`;
}

'''
slice_replace('js/app.js', 'function renderReview() {', '/* ---------- Mes mots ---------- */', new_review, 'renderReview')

# 3. Filtre Révisés.
rep('js/app.js',
"const filters = [['all', 'Tous'], ['due', 'À réviser'], ['new', 'Nouveaux'], ['learning', 'En cours'], ['known', 'Connus'], ['imported', 'Importés']];",
"const filters = [['all', 'Tous'], ['due', 'À réviser'], ['new', 'Nouveaux'], ['reviewed', 'Révisés'], ['learning', 'En cours'], ['known', 'Connus'], ['imported', 'Importés']];",
'filters')

rep('js/app.js',
"else if (ui.filter === 'new') list = list.filter(function (e) { return S.isNew(state.progress[e.id]); });\nelse if (ui.filter === 'learning') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && !S.isKnown(p); });",
"else if (ui.filter === 'new') list = list.filter(function (e) { return S.isNew(state.progress[e.id]); });\nelse if (ui.filter === 'reviewed') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && ((p.reps || 0) + (p.lapses || 0)) > 0; });\nelse if (ui.filter === 'learning') list = list.filter(function (e) { const p = state.progress[e.id]; return p && p.last && !S.isKnown(p); });",
'filter-reviewed')

# 4. Compter les prononciations validées en rappel.
rep('js/app.js',
"const prev = state.progress[e.id] || S.freshProgress(now);\nstate.progress[e.id] = S.schedule(prev, g, now);\nconst xp = S.bumpStats(state, g, now);",
"const prev = state.progress[e.id] || S.freshProgress(now);\nconst next = S.schedule(prev, g, now);\nif (session.mode === 'recall' && g === 'good') next.said = (prev.said || 0) + 1;\nstate.progress[e.id] = next;\nconst xp = S.bumpStats(state, g, now);",
'grade-said')

# 5. Session sur un seul mot depuis la fiche.
rep('js/app.js',
'function nextCard() {',
r'''function startOne(id) {
const e = entries.filter(function (x) { return x.id === id; })[0];
if (!e) return;
closeModal();
session = { kind: 'single', mode: 'recall', queue: [e], current: null, phase: 'front', done: 0, correct: 0, xp: 0, total: 1, options: [], lastGrade: null, lastDue: 0, lastXp: 0, lastChoice: null };
document.body.style.overflow = 'hidden';
const root = $('#session');
if (root) root.hidden = false;
nextCard();
}
function nextCard() {''',
'startOne')

# 6. Fiche : statistiques et bouton Réviser ce mot.
new_detail = r'''function openDetail(id) {
const e = entries.filter(function (x) { return x.id === id; })[0];
if (!e) return;
const p = state.progress[id];
const status = S.statusOf(p);
const totalReviews = p ? ((p.reps || 0) + (p.lapses || 0)) : 0;
const meta = ['Niveau : ' + S.levelLabel(p), p && p.last ? 'Prochaine révision : ' + S.dueLabel(p.due) : 'Jamais révisé',
plural((p && p.said) || 0, 'prononciation', 'prononciations'),
plural(totalReviews, 'révision', 'révisions'),
plural((p && p.reps) || 0, 'réussite', 'réussites'),
p && p.lapses ? plural(p.lapses, 'oubli', 'oublis') : ''].filter(Boolean)
.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('');
openModal('Fiche du mot', `
<div class='detail-top'><div class='detail-fr'><span class='detail-label'>Français</span>${frHtml(e.fr)}</div><div class='detail-jp' lang='ja'>${rubyHtml(e.ruby, state.settings.furigana)}</div>
<div class='detail-romaji'>${esc(e.romaji)}</div><div class='audio-row' style='justify-content:center'><button class='btn ghost small' data-action='speak-text' data-text='${attr(e.jp)}'>🔊 Écouter</button>
<button class='btn ghost small' data-action='speak-text' data-text='${attr(e.jp)}' data-slow='1'>🐢 Lent</button></div></div>
<div class='detail-context'><div class='context-label'>En contexte</div><p class='jp' lang='ja'>${contextHtml(e.context, e.hl)}</p><p class='muted small'>${esc(e.contextFr || '—')}</p>
${e.context ? '<button class=\'btn ghost small\' data-action=\'speak-text\' data-text=\'' + attr(e.context) + '\'>🔊 La phrase</button>' : ''}</div>
<div class='detail-meta'>${meta}<span>${status === 'known' ? 'Connu' : status === 'learning' ? 'En cours' : 'Nouveau'}</span><span>${esc(e.source === 'import' ? 'Importé' : e.theme)}</span></div>
<div class='modal-actions'><button class='btn primary small' data-action='review-one' data-id='${attr(e.id)}'>Réviser ce mot</button>${e.source === 'import' ? '<button class=\'btn ghost small\' data-action=\'edit-entry\' data-id=\'' + attr(e.id) + '\'>Modifier</button>' : ''}${p ? '<button class=\'btn ghost small\' data-action=\'reset-progress\' data-id=\'' + attr(e.id) + '\'>Réinitialiser la progression</button>' : ''}${e.source === 'import' ? '<button class=\'btn ghost small danger-text\' data-action=\'delete-entry\' data-id=\'' + attr(e.id) + '\'>Supprimer</button>' : ''}</div>`);
}

'''
slice_replace('js/app.js', 'function openDetail(id) {', 'function openEdit(id) {', new_detail, 'openDetail')

# 7. Navigation fiable et action Réviser ce mot.
rep('js/app.js',
"function onClick(event) {\nconst el = event.target.closest ? event.target.closest('[data-action]') : null;\nif (!el) return;",
r'''function onClick(event) {
const nav = event.target.closest ? event.target.closest('[data-nav]') : null;
if (nav) {
event.preventDefault();
const name = nav.getAttribute('data-nav');
const hashes = { learn: '#apprendre', review: '#reviser', library: '#mots', import: '#importer', grammar: '#grammaire' };
const hash = hashes[name];
if (hash) { try { history.replaceState(null, '', hash); } catch (err) { location.hash = hash.slice(1); } }
if (session) closeSession();
showView(name);
return;
}
const el = event.target.closest ? event.target.closest('[data-action]') : null;
if (!el) return;''',
'onClick-nav')

rep('js/app.js',
"case 'detail': openDetail(id); break;\ncase 'edit-entry': openEdit(id); break;",
"case 'detail': openDetail(id); break;\ncase 'review-one': startOne(id); break;\ncase 'edit-entry': openEdit(id); break;",
'review-one')

# 8. SRS : mémoriser le nombre de prononciations.
rep('js/srs.js',
'return { level: 0, reps: 0, lapses: 0, due: now || 0, last: 0 };',
'return { level: 0, reps: 0, lapses: 0, due: now || 0, last: 0, said: 0 };',
'freshProgress-said')

rep('js/srs.js',
'const s = Object.assign({ level: 0, reps: 0, lapses: 0, due: 0, last: 0 }, p || {});',
'const s = Object.assign({ level: 0, reps: 0, lapses: 0, due: 0, last: 0, said: 0 }, p || {});',
'schedule-said')

# 9. Aller : 行きます (ikimasu) en carte principale, 行く (iku) en familier.
lines = read('data.js').splitlines()
idx = [i for i, line in enumerate(lines) if line.startswith('[' + q + '行く' + q) and q + 'iku' + q in line]
if len(idx) != 1:
    raise SystemExit('data.js / 行く : ' + str(len(idx)) + ' occurrence(s)')
new_ikimasu = '[' + js('行きます') + ',' + js('行[い]きます') + ',' + js('ikimasu') + ',' + js('aller (forme polie)') + ',' + js('明日、東京に行きます。') + ',' + js('Demain, j’irai à Tokyo. (forme neutre : 行く / iku)') + '],'
lines[idx[0]] = new_ikimasu
buy = [i for i, line in enumerate(lines) if line.startswith('[' + q + '買う' + q)]
if len(buy) != 1:
    raise SystemExit('data.js / 買う : ' + str(len(buy)) + ' occurrence(s)')
new_iku = '[' + js('行く') + ',' + js('行[い]く') + ',' + js('iku') + ',' + js('aller (forme familière)') + ',' + js('明日、東京に行く。') + ',' + js('Demain, je vais à Tokyo.') + '],'
lines.insert(buy[0] + 1, new_iku)
write('data.js', chr(10).join(lines) + chr(10))

# 10. Lexique : aller pointe vers 行きます, 行く reste disponible.
lines = read('js/lexicon.js').splitlines()
idx = [i for i, line in enumerate(lines) if line.startswith('E(' + q + '行く' + q)]
if len(idx) != 1:
    raise SystemExit('lexicon.js / 行く : ' + str(len(idx)) + ' occurrence(s)')
lex_ikimasu = 'E(' + js('行きます') + ', ' + js('行[い]きます') + ', ' + js('いきます') + ', ' + js('ikimasu') + ', ' + js('aller (forme polie)') + ', ' + js('明日、東京に行きます。') + ', ' + js('Demain, j’irai à Tokyo.') + ', { frAliases: [' + js('aller') + ', ' + js('aller poli') + '], romajiAliases: [' + js('iki-masu') + '] }),'
lex_iku = 'E(' + js('行く') + ', ' + js('行[い]く') + ', ' + js('いく') + ', ' + js('iku') + ', ' + js('aller (forme familière)') + ', ' + js('明日、東京に行く。') + ', ' + js('Demain, je vais à Tokyo.') + ', { frAliases: [' + js('aller familier') + ', ' + js('aller neutre') + '], romajiAliases: [' + js('iku') + '] }),'
lines[idx[0]:idx[0] + 1] = [lex_ikimasu, lex_iku]
write('js/lexicon.js', chr(10).join(lines) + chr(10))

# 11. Test unitaire de l import demandé.
rep('tests/unit.js',
'if (failed) {',
r'''test('aller | ikimasu donne la forme polie', function () {
const e = entryOf('aller | ikimasu');
assert.equal(e.jp, '行きます');
assert.equal(e.romaji, 'ikimasu');
assert.equal(e.context, '明日、東京に行きます。');
});
if (failed) {''',
'unit-ikimasu')

# 12. Tests navigateur des nouveaux parcours.
e2e = read('tests/e2e.spec.js')
e2e += r'''

test('onglet Réviser : une carte due s’ouvre au clic', async ({ page }) => {
await page.goto('/#importer');
await page.getByTestId('import-textarea').fill('bonjour | kon-ni-chi-wa');
await page.getByTestId('preview-import').click();
await page.getByTestId('do-import').click();
await page.locator('.desktop-nav [data-nav=review]').click();
await expect(page.locator('#view-review')).toBeVisible();
await expect(page.getByTestId('review-card-due')).toBeVisible();
await page.getByTestId('review-card-due').click();
await expect(page.getByTestId('session-card')).toBeVisible();
await expect(page.getByTestId('reveal')).toBeVisible();
});

test('compteur de prononciations et filtre Révisés', async ({ page }) => {
await page.getByTestId('cta-main').click();
await page.getByTestId('reveal').click();
await page.getByTestId('grade-good').click();
await page.locator('.desktop-nav [data-nav=library]').click();
await page.locator('.chip[data-filter=reviewed]').click();
await expect(page.locator('#libraryList .word-row').first()).toBeVisible();
await page.locator('#libraryList .word-row').first().click();
await expect(page.locator('.modal-panel')).toContainText('1 prononciation');
});

test('onglet Grammaire et leçon de structure', async ({ page }) => {
await page.locator('.desktop-nav [data-nav=grammar]').click();
await expect(page.locator('#view-grammar')).toBeVisible();
await expect(page.locator('#view-grammar')).toContainText('L’ordre de la phrase');
await expect(page.locator('#view-grammar')).toContainText('私は水を飲みます。');
});

test('plus de 200 mots et aller en forme polie', async ({ page }) => {
const info = await page.evaluate(() => ({
units: window.UNITS_DATA.length,
words: window.UNITS_DATA.reduce((n, u) => n + ((u.words && u.words.length) || 0), 0),
ikimasu: window.UNITS_DATA.some((u) => (u.words || []).some((w) => w[0] === '行きます' && w[2] === 'ikimasu'))
}));
expect(info.words).toBeGreaterThanOrEqual(200);
expect(info.ikimasu).toBe(true);
});
'''
write('tests/e2e.spec.js', e2e)

# 13. Styles de la nouvelle vue et des fiches.
css = r'''
.review-hero {
display: flex;
align-items: center;
justify-content: space-between;
gap: 18px;
flex-wrap: wrap;
background: linear-gradient(135deg, var(--surface) 0%, var(--green-soft) 100%);
}
.review-hero h2 { margin: 0 0 6px; font-size: clamp(1.35rem, 3vw, 1.8rem); }
.review-hero .lead { max-width: 52ch; }
.review-hero-actions { display: flex; gap: 10px; }
.review-card[role='button'] { cursor: pointer; }
.review-card[role='button']:focus-visible { outline: 3px solid var(--blue); outline-offset: 2px; }
.detail-label { display: block; font-size: .6rem; letter-spacing: .13em; text-transform: uppercase; color: var(--muted); font-weight: 900; margin-bottom: 2px; }
.grammar-intro { background: linear-gradient(135deg, var(--surface) 0%, var(--green-soft) 100%); }
.grammar-recipe { display: grid; gap: 4px; margin: 14px 0; padding: 12px 14px; background: var(--bg); border: 1px solid var(--line); border-radius: 12px; font-size: .88rem; }
.grammar-recipe b { font-size: .72rem; text-transform: uppercase; letter-spacing: .08em; color: var(--green-dark); }
.grammar-recipe code { font-family: var(--jp); background: var(--surface-2); border-radius: 5px; padding: 1px 5px; }
.grammar-list { display: grid; gap: 10px; margin-top: 16px; }
.grammar-item { background: var(--surface); border: 1px solid var(--line); border-radius: 18px; padding: 0 16px; box-shadow: var(--shadow-sm); }
.grammar-item summary { display: flex; align-items: center; gap: 12px; padding: 15px 0; cursor: pointer; list-style: none; }
.grammar-item summary::-webkit-details-marker { display: none; }
.grammar-item summary::after { content: '▾'; margin-left: auto; color: var(--muted); font-weight: 900; }
.grammar-item[open] summary::after { content: '▴'; }
.grammar-item summary strong { display: block; font-size: .98rem; }
.grammar-item summary small { display: block; color: var(--muted); font-size: .78rem; margin-top: 2px; }
.grammar-emoji { font-size: 1.35rem; flex: 0 0 auto; }
.grammar-body { border-top: 1px solid var(--line); padding: 2px 0 16px; }
.grammar-point { margin-top: 14px; }
.grammar-point h3 { margin: 0 0 4px; font-size: .94rem; }
.grammar-point p { margin: 4px 0; color: var(--muted); font-size: .87rem; }
.grammar-example { display: flex; align-items: center; flex-wrap: wrap; gap: 8px 12px; margin: 8px 0; padding: 10px 12px; background: var(--bg); border: 1px solid var(--line); border-radius: 12px; }
.grammar-jp { font-family: var(--jp); font-size: 1.12rem; line-height: 1.8; }
.grammar-romaji { color: var(--muted); font-size: .8rem; }
.grammar-fr { flex: 1 1 220px; font-size: .84rem; }
.grammar-example .btn { margin-left: auto; }
.grammar-table-wrap { overflow: auto; margin: 10px 0; border: 1px solid var(--line); border-radius: 12px; }
.grammar-table { width: 100%; border-collapse: collapse; min-width: 520px; font-size: .82rem; }
.grammar-table th, .grammar-table td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
.grammar-table th { background: var(--surface-2); color: var(--muted); font-size: .65rem; text-transform: uppercase; letter-spacing: .06em; }
.grammar-table tr:last-child td { border-bottom: 0; }
.grammar-tip { border-left: 3px solid var(--blue); padding-left: 10px; color: var(--text) !important; }
@media (max-width: 560px) {
.review-hero { padding: 16px; }
.review-hero-actions, .review-hero-actions .btn { width: 100%; }
.grammar-example .btn { margin-left: 0; }
.grammar-item { padding: 0 12px; }
}
'''
write('styles.css', read('styles.css').rstrip() + chr(10) + css)

# 14. Documentation.
replace_line('README.md', '- **100 mots de départ**', [
'- **aller** : la carte de base utilise 行きます (ikimasu, forme polie). La forme neutre 行く (iku) est aussi disponible, et la différence est expliquée dans l’onglet Grammaire.',
'- **Plus de 200 mots de départ** répartis en 20 thèmes (salutations, nourriture, maison, transports, santé, travail, météo, émotions, etc.).'
])

replace_line('README.md', '- **Mes mots**', [
'- **Mes mots** : recherche en français / japonais / romaji, filtres (à réviser, nouveaux, révisés, en cours, connus, importés), fiche détaillée, modification et suppression des mots importés.',
'- **Suivi des révisions** : nombre de prononciations, de révisions et de réussites par mot ; filtre « Révisés ».',
'- **Onglet Grammaire** : ordre de la phrase, particules, formes ます / neutres, passé, négation, questions, compteurs et constructions quotidiennes.'
])

replace_line('README.md', 'data.js 100 mots de départ', [
'data.js + js/vocab-extra.js plus de 200 mots de départ, 20 thèmes'
])

replace_line('TESTING.md', '6. **Réviser**', [
'6. **Réviser** : l’onglet « Réviser » propose les cartes dues, la révision rapide, tout revoir et les nouveaux mots. Clique sur la carte « Cartes dues » ou sur le bouton « Commencer » : la session doit s’ouvrir. Les prévisions sur sept jours sont affichées. Un mot importé est dû immédiatement : il apparaît dans les cartes à réviser.'
])

insert_after('TESTING.md', '9. **Persistance**', [
'',
'10. **Grammaire** : l’onglet « Grammaire » ouvre les leçons. Vérifie que « L’ordre de la phrase » s’affiche et que l’explication de 行きます / iku est présente.'
])

insert_after('TESTING.md', 'débordement horizontal', [
'- l’ouverture de l’onglet Réviser et le compteur de prononciations ;',
'- l’onglet Grammaire et le vocabulaire quotidien.'
])

print('Patch appliqué.')
