'use strict';
const fs = require('fs');
const { execFileSync } = require('child_process');

function check(file) {
  execFileSync(process.execPath, ['--check', file], { stdio: 'inherit' });
}

function patch(file, pairs) {
  let source = fs.readFileSync(file, 'utf8');
  pairs.forEach(function (pair) {
    const oldText = pair[0];
    const newText = pair[1];
    if (source.indexOf(oldText) < 0) {
      throw new Error('Ancre introuvable dans ' + file + ' : ' + oldText.slice(0, 100));
    }
    source = source.split(oldText).join(newText);
  });
  fs.writeFileSync(file, source);
}

check('js/reading.js');
check('js/pronunciation.js');

const app = fs.readFileSync('js/app.js', 'utf8');
if (app.indexOf('function pronounceView') >= 0) {
  console.log('Kotoba est déjà patché.');
  process.exit(0);
}

const PRONOUNCE_BLOCK = `function pronounceView() {
const e = session.current;
if (session.phase === 'feedback') return answerCard(e) + feedbackHtml();
const st = session.pronunciation;
let interaction = '';
if (!st) {
interaction = '<button class="btn primary big mic-btn" data-action="pronounce-start" data-testid="pronounce-start">🎙️ Prononcer</button>' +
'<p class="hint">Autorise le micro, puis répète le mot. La reconnaissance se fait dans ton navigateur.</p>';
} else if (st.status === 'listening') {
interaction = '<div class="pronounce-status listening" data-testid="pronounce-status">🎙️ J’écoute… Parle maintenant.</div>';
} else if (st.status === 'error') {
interaction = '<div class="pronounce-status error" data-testid="pronounce-status">' + esc(st.message) + '</div>' +
'<div class="pronounce-actions"><button class="btn primary" data-action="pronounce-retry">Réessayer</button>' +
'<button class="btn ghost" data-action="pronounce-finish" data-good="0">Passer</button></div>';
} else {
interaction = '<div class="pronounce-result ' + (st.good ? 'good' : 'retry') + '" data-testid="pronounce-result">' +
'<div class="pronounce-score">' + (st.good ? '✅' : '🔁') + '</div>' +
'<div><strong>' + (st.good ? 'Bien prononcé !' : 'Presque !') + '</strong>' +
'<span>Score : ' + st.score + ' %</span>' +
'<p class="hint">Entendu : ' + esc(st.transcript || '—') + '</p></div></div>' +
'<div class="pronounce-actions"><button class="btn primary" data-action="pronounce-finish" data-good="' + (st.good ? '1' : '0') + '">' + (st.good ? 'Valider et continuer' : 'Continuer sans valider') + '</button>' +
'<button class="btn ghost" data-action="pronounce-retry">Réessayer</button></div>';
}
return '<div class="session-card pronounce-card" data-testid="pronounce-card"><p class="eyebrow">Prononciation</p><h1 class="prompt-fr">' + frHtml(e.fr) + '</h1>' +
'<div class="jp-big" lang="ja" data-testid="pronounce-word">' + wordRubyHtml(e) + '</div>' +
(state.settings.romaji ? '<div class="romaji">' + esc(e.romaji) + '</div>' : '') +
'<div class="audio-row"><button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '">🔊 Écouter</button>' +
'<button class="btn ghost small" data-action="speak-text" data-text="' + attr(e.jp) + '" data-slow="1">🐢 Lent</button></div>' +
'<p class="hint">Répète le mot japonais à voix haute. Le score est indicatif.</p>' + interaction + '</div>';
}
function startPronunciation() {
if (!session || !session.current) return;
const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!Ctor) {
session.pronunciation = { status: 'error', message: 'La reconnaissance vocale n’est pas disponible dans ce navigateur. Essaie Chrome ou Edge sur ordinateur ou Android.' };
renderSession();
return;
}
if (session.recognition) { try { session.recognition.abort(); } catch (e) { /* ignore */ } session.recognition = null; }
const rec = new Ctor();
rec.lang = 'ja-JP';
rec.interimResults = false;
rec.continuous = false;
rec.maxAlternatives = 3;
session.recognition = rec;
session.pronunciation = { status: 'listening' };
renderSession();
rec.onresult = function (event) {
if (!session || !session.current) return;
const list = [];
const first = event.results && event.results[0];
if (first) { for (let i = 0; i < first.length; i++) list.push(first[i].transcript); }
const best = window.Kotoba.Pronunciation ? window.Kotoba.Pronunciation.best(list, session.current) : { transcript: list[0] || '', score: 0, good: false };
session.pronunciation = { status: 'done', transcript: best.transcript, score: best.score, good: best.good };
session.recognition = null;
renderSession();
};
rec.onerror = function (event) {
if (!session) return;
const messages = {
'not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
'service-not-allowed': 'Autorise le micro dans les réglages du navigateur, puis réessaie.',
'no-speech': 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.',
'audio-capture': 'Aucun micro détecté. Vérifie ton matériel.',
'network': 'La reconnaissance vocale a besoin d’une connexion réseau.'
};
session.pronunciation = { status: 'error', message: messages[event.error] || 'Je n’ai pas pu écouter. Réessaie.' };
session.recognition = null;
renderSession();
};
rec.onend = function () {
if (session && session.pronunciation && session.pronunciation.status === 'listening') {
session.pronunciation = { status: 'error', message: 'Je n’ai rien entendu. Rapproche-toi du micro et réessaie.' };
renderSession();
}
if (session) session.recognition = null;
};
try { rec.start(); } catch (e) {
session.pronunciation = { status: 'error', message: 'Impossible de démarrer le micro. Vérifie les autorisations.' };
session.recognition = null;
renderSession();
}
}
`;

patch('js/app.js', [
["const ui = { filter: 'all', search: '', importText: '', preview: null, lastFocus: null };", "const ui = { filter: 'all', search: '', importText: '', preview: null, lastFocus: null, detailId: null };"],
[`function contextHtml(context, hl) {
const text = String(context || '').trim();
if (!text) return '<span class="muted">Pas encore de phrase de contexte.</span>';`, `function wordRubyHtml(e) {
var jp = e && e.jp ? String(e.jp) : '';
var kanaOnly = jp && !/[一-鿿]/.test(jp);
if (kanaOnly && window.Kotoba.Reading && state.settings.furigana) return window.Kotoba.Reading.kanaReading(e);
return rubyHtml(e && e.ruby, state.settings.furigana);
}
function contextHtml(context, hl) {
const text = String(context || '').trim();
if (text && window.Kotoba.Reading) return window.Kotoba.Reading.annotate(text, hl, state.settings.furigana);
if (!text) return '<span class="muted">Pas encore de phrase de contexte.</span>';`],
['>Écoute</button>', ">Écoute</button><button class='mode-btn' data-action='start' data-kind='due' data-mode='pronounce'>🎙️ Prononciation</button>"],
['function startOne(id) {', 'function startOne(id, mode) {'],
["session = { kind: 'single', mode: 'recall',", "mode = mode || 'recall';\nsession = { kind: 'single', mode: mode,"],
["session.phase = session.mode === 'recall' ? 'front' : 'question';", "session.pronunciation = null;\nsession.phase = session.mode === 'recall' ? 'front' : 'question';"],
["session.options = session.mode === 'recall' ? [] : buildOptions(session.current, session.mode);", "session.options = (session.mode === 'recall' || session.mode === 'pronounce') ? [] : buildOptions(session.current, session.mode);"],
["const body = session.phase === 'summary' ? summaryHtml() : (session.mode === 'recall' ? recallView() : quizView());", "const body = session.phase === 'summary' ? summaryHtml() : (session.mode === 'recall' ? recallView() : (session.mode === 'pronounce' ? pronounceView() : quizView()));"],
[`'<div class="jp-big" lang="ja" data-testid="answer-jp">' + rubyHtml(e.ruby, state.settings.furigana) + '</div>' +`, `'<div class="jp-big" lang="ja" data-testid="answer-jp">' + wordRubyHtml(e) + '</div>' +`],
['const p = state.progress[id];', 'ui.detailId = id;\nconst p = state.progress[id];'],
["<div class='detail-jp' lang='ja'>${rubyHtml(e.ruby, state.settings.furigana)}</div>", "<div class='detail-jp' lang='ja'>${wordRubyHtml(e)}</div>"],
['>Réviser ce mot</button>', '>Réviser ce mot</button><button class="btn ghost small" data-action="pronounce-one">🎙️ Prononcer</button>'],
['rubyHtml(wotd.ruby, state.settings.furigana)', 'wordRubyHtml(wotd)'],
[`'<span class="word-jp" lang="ja">' + rubyHtml(e.ruby, state.settings.furigana) + '</span>' +`, `'<span class="word-jp" lang="ja">' + wordRubyHtml(e) + '</span>' +`],
["if (session.mode === 'recall' && g === 'good') next.said = (prev.said || 0) + 1;", "if ((session.mode === 'recall' || session.mode === 'pronounce') && g === 'good') next.said = (prev.said || 0) + 1;"],
["function closeSession() {\nsession = null;", "function closeSession() {\nif (session && session.recognition) { try { session.recognition.abort(); } catch (e) { /* ignore */ } }\nsession = null;"],
['function quizView() {', PRONOUNCE_BLOCK + 'function quizView() {'],
['case "review-one": startOne(id); break;', `case "review-one": startOne(id); break;
case 'pronounce-one': startOne(ui.detailId, 'pronounce'); break;
case 'pronounce-start': startPronunciation(); break;
case 'pronounce-retry': startPronunciation(); break;
case 'pronounce-finish': grade(el.getAttribute('data-good') === '1' ? 'good' : 'again'); break;`]
]);

patch('index.html', [
["<script src='js/parser.js'></script>\n<script src='js/motivation.js'></script>", "<script src='js/parser.js'></script>\n<script src='js/reading.js'></script>\n<script src='js/pronunciation.js'></script>\n<script src='js/motivation.js'></script>"]
]);

patch('sw.js', [
["const CACHE = 'kotoba-v3-5';", "const CACHE = 'kotoba-v3-6';"],
["'./js/parser.js',\n'./js/motivation.js',", "'./js/parser.js',\n'./js/reading.js',\n'./js/pronunciation.js',\n'./js/motivation.js',"]
]);

fs.appendFileSync('styles.css', `
/* --- Lectures kana et mode prononciation --- */
.jp-big ruby rt,
.detail-jp ruby rt,
.wotd-jp ruby rt { font-size: .32em; line-height: 1.05; color: var(--muted); font-weight: 500; }
.context-jp ruby rt,
.jp ruby rt { font-size: .46em; line-height: 1.1; color: var(--muted); font-weight: 500; }
.word-jp ruby rt { font-size: .44em; line-height: 1.1; color: var(--muted); font-weight: 500; }
.pronounce-card { text-align: center; }
.pronounce-card .jp-big { margin: 10px 0 2px; }
.pronounce-card .audio-row { justify-content: center; margin: 8px 0; }
.pronounce-card .hint { max-width: 470px; margin: 6px auto 14px; }
.mic-btn { font-size: 1.05rem; padding: 14px 28px; }
.pronounce-status { margin: 12px auto; padding: 12px 16px; border-radius: 14px; max-width: 460px; background: #eef4ea; color: #31512a; font-weight: 600; }
.pronounce-status.error { background: #fdecea; color: #8a2d25; }
.pronounce-result { display: flex; gap: 12px; align-items: center; text-align: left; max-width: 470px; margin: 12px auto; padding: 14px 16px; border-radius: 16px; border: 1px solid var(--line, #e2e8df); }
.pronounce-result.good { background: #edf8e7; border-color: #b8e39f; }
.pronounce-result.retry { background: #fff7e8; border-color: #f0d59c; }
.pronounce-result > div:last-child { display: flex; flex-direction: column; gap: 2px; }
.pronounce-result strong { font-size: 1.02rem; }
.pronounce-result span { font-size: .88rem; color: var(--muted); }
.pronounce-score { font-size: 1.7rem; line-height: 1; }
.pronounce-actions { display: flex; gap: 8px; justify-content: center; flex-wrap: wrap; margin-top: 10px; }
.pronounce-actions .btn { min-width: 0; }
.context-jp mark, .jp mark { color: inherit; }
@media (max-width: 560px) {
.pronounce-card .jp-big { font-size: 2.7rem; }
.pronounce-result { align-items: flex-start; }
}
`);

patch('tests/unit.js', [
['const Parser = require("../js/parser.js");', 'const Parser = require("../js/parser.js");\nconst Pron = require("../js/pronunciation.js");'],
["if (failed) {", `test("prononciation : score et variantes", function () {
const entry = { jp: "こんばんは", reading: "こんばんは", romaji: "konbanwa" };
assert.equal(Pron.compare("こんばんは", entry).good, true);
assert.equal(Pron.compare("こんばんわ", entry).good, true);
assert.equal(Pron.compare("おはよう", entry).good, false);
assert.ok(Pron.compare("こんばんは", entry).score >= 75);
});
test("prononciation : la meilleure alternative est retenue", function () {
const entry = { jp: "ありがとう", reading: "ありがとう", romaji: "arigatou" };
const result = Pron.best(["おはよう", "ありがとう"], entry);
assert.equal(result.good, true);
assert.equal(result.transcript, "ありがとう");
});
if (failed) {`]
]);

patch('tests/e2e.spec.js', [
["await expect(page.getByTestId('answer-context')).toContainText('こんにちは');", "await expect(page.getByTestId('answer-context')).toContainText('こんにちは');\nexpect(await page.locator('[data-testid=\"answer-jp\"] rt').count()).toBeGreaterThan(0);\nexpect(await page.locator('[data-testid=\"answer-context\"] rt').count()).toBeGreaterThan(0);"]
]);

fs.appendFileSync('tests/e2e.spec.js', `
test('prononciation : carte dédiée et lecture du mot', async ({ page }) => {
await page.locator('.desktop-nav [data-nav=library]').click();
await page.locator('.word-row').first().click();
await expect(page.locator('.modal-panel')).toContainText('Prononcer');
await page.locator('[data-action=pronounce-one]').click();
await expect(page.getByTestId('pronounce-card')).toBeVisible();
await expect(page.getByTestId('pronounce-start')).toBeVisible();
expect(await page.locator('[data-testid="pronounce-word"] rt').count()).toBeGreaterThan(0);
});
`);

check('js/app.js');
execFileSync(process.execPath, ['tests/unit.js'], { stdio: 'inherit' });

fs.rmSync('.github/kotoba-reading-patch.js', { force: true });
fs.rmSync('.github/workflows/kotoba-reading.yml', { force: true });
console.log('Patch appliqué et vérifié.');
