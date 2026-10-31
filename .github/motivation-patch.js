const fs = require('fs');
function patch(file, pairs) {
let text = fs.readFileSync(file, 'utf8');
pairs.forEach(function (pair) {
const old = pair[0];
const next = pair[1];
const label = pair[2];
const count = text.split(old).length - 1;
if (count !== 1) throw new Error('ancre ' + label + ' introuvable (' + count + ')');
text = text.replace(old, next);
});
fs.writeFileSync(file, text, 'utf8');
}
const q = String.fromCharCode(34);
const s39 = String.fromCharCode(39);
const bonusHtml = '<div class=' + q + 'summary-bonus' + q + ' data-testid=' + q + 'daily-bonus' + q + '>Défi du jour relevé : +20 XP bonus.</div>';
const dailyBonusLine = 'const dailyBonus = (session.kind === ' + s39 + 'daily' + s39 + ' && state.flags.daily === S.todayKey()) ? ' + s39 + bonusHtml + s39 + ' : ' + s39 + s39 + ';';
const summaryActionsOld = '</p><div class=' + q + 'summary-actions' + q + '>';
const summaryActionsNew = '</p>' + s39 + ' + dailyBonus + ' + s39 + '<div class=' + q + 'summary-actions' + q + '>';

patch('js/app.js', [
[
`if (streak) streak.textContent = String(state.stats.streak || 0);`,
`if (streak) {
const streakValue = window.Kotoba.Motivation ? window.Kotoba.Motivation.currentStreak(state) : (state.stats.streak || 0);
streak.textContent = String(streakValue);
const streakPill = streak.closest ? streak.closest('.stat-pill') : null;
if (streakPill) {
streakPill.classList.toggle('is-lit', streakValue > 0 && state.stats.lastDay === S.todayKey());
streakPill.title = streakValue ? 'Série de ' + streakValue + ' jour(s)' : 'Lance ta série aujourd’hui';
}
}`,
'header streak'
],
[
`$('#view-learn').innerHTML = body;`,
`if (window.Kotoba.Motivation) body += window.Kotoba.Motivation.streakPanel(state, now);
$('#view-learn').innerHTML = body;`,
'home panel'
],
[
`else if (kind === 'unit') list = entries.filter(function (e) { return e.unitId === unitId; }).sort(byDue).slice(0, 15);`,
`else if (kind === 'unit') list = entries.filter(function (e) { return e.unitId === unitId; }).sort(byDue).slice(0, 15);
else if (kind === 'daily') {
if (state.flags.daily === S.todayKey()) { toast('Défi du jour déjà relevé.'); return; }
const seen = entries.filter(function (e) { const p = state.progress[e.id]; return p && p.last; }).sort(byDue);
const fresh = entries.filter(function (e) { return S.isNew(state.progress[e.id]); });
list = seen.concat(fresh).slice(0, 3);
}`,
'daily session'
],
[
`function nextCard() {`,
`function claimDaily() {
const day = S.todayKey();
if (state.flags.daily === day) return;
const beforeXp = todayXp();
state.flags.daily = day;
S.addXp(state, 20, Date.now());
if (session) session.xp += 20;
persist();
updateChrome();
const goal = state.settings.goal || 50;
const message = beforeXp < goal && todayXp() >= goal ? 'Objectif du jour atteint + défi relevé ! +20 XP' : 'Défi du jour relevé ! +20 XP';
if (window.Kotoba.Motivation) window.Kotoba.Motivation.celebrate(message); else toast(message);
}
function nextCard() {`,
'daily claim'
],
[
`if (!session.queue.length) { session.current = null; session.phase = 'summary'; renderSession(); return; }`,
`if (!session.queue.length) {
session.current = null; session.phase = 'summary';
if (session.kind === 'daily') claimDaily();
renderSession(); return;
}`,
'daily summary'
],
[
`const next = S.nextDue(entries, state, Date.now());`,
`const next = S.nextDue(entries, state, Date.now());
` + dailyBonusLine,
'summary bonus'
],
[
summaryActionsOld,
summaryActionsNew,
'summary actions'
],
[
`const prev = state.progress[e.id] || S.freshProgress(now);`,
`const beforeXp = todayXp();
const beforeStreak = state.stats.streak || 0;
const prev = state.progress[e.id] || S.freshProgress(now);`,
'grade before'
],
[
`session.phase = 'feedback';`,
`if (window.Kotoba.Motivation) {
const goal = state.settings.goal || 50;
if (beforeXp < goal && todayXp() >= goal) window.Kotoba.Motivation.celebrate('Objectif du jour atteint ! 🎯');
else if (state.stats.streak > beforeStreak && [3, 7, 14, 30, 100].indexOf(state.stats.streak) >= 0) window.Kotoba.Motivation.celebrate('Série de ' + state.stats.streak + ' jours ! 🔥');
}
session.phase = 'feedback';`,
'grade celebrate'
]
]);

patch('js/srs.js', [
[
`function counts(entries, state, now) {`,
`function addXp(state, amount, now) {
now = now == null ? Date.now() : now;
const day = todayKey(now);
const value = Math.max(0, Number(amount) || 0);
if (!state.stats.daily) state.stats.daily = {};
state.stats.xp = (state.stats.xp || 0) + value;
state.stats.daily[day] = (state.stats.daily[day] || 0) + value;
return value;
}
function counts(entries, state, now) {`,
'addXp'
],
[
`bumpStats: bumpStats,`,
`bumpStats: bumpStats,
addXp: addXp,`,
'export addXp'
]
]);

patch('index.html', [
[
`<script src='js/app.js'></script>`,
`<script src='js/motivation.js'></script>
<script src='js/app.js'></script>`,
'script motivation'
]
]);

fs.appendFileSync('styles.css', `
/* ---------- Série et défi quotidien ---------- */
.streak-panel {
background: linear-gradient(135deg, var(--surface) 0%, #fff4d6 100%);
border-color: #f2dfb5;
}
[data-theme='dark'] .streak-panel {
background: linear-gradient(135deg, var(--surface) 0%, #2b2415 100%);
border-color: #4a3a1b;
}
.streak-top { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.streak-flame {
width: 56px; height: 56px; flex: 0 0 auto;
display: grid; place-items: center;
border-radius: 18px; background: #fff0c2; border: 1px solid #f2d58a;
font-size: 1.75rem; line-height: 1;
}
.streak-flame.is-lit { animation: flame-pulse 1.8s ease-in-out infinite; }
[data-theme='dark'] .streak-flame { background: #3a2d12; border-color: #6b5320; }
.streak-copy { flex: 1 1 220px; min-width: 0; }
.streak-copy .eyebrow { margin-bottom: 2px; }
.streak-number { display: block; font-size: 1.55rem; line-height: 1.15; }
.streak-copy .hint { margin: 3px 0 0; }
.streak-record {
display: flex; flex-direction: column; align-items: center; gap: 1px;
min-width: 76px; padding: 8px 12px; border-radius: 14px;
background: var(--surface); border: 1px solid #f2dfb5;
font-size: .62rem; color: var(--muted); font-weight: 800;
}
.streak-record b { font-size: 1.3rem; line-height: 1; color: var(--text); }
[data-theme='dark'] .streak-record { border-color: #4a3a1b; }
.week-strip { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 6px; margin: 14px 0 10px; }
.week-day {
height: 44px; border-radius: 12px; border: 1px solid var(--line);
background: var(--bg); color: var(--muted);
display: grid; place-items: center; gap: 0; font-size: .6rem; font-weight: 900;
}
.week-day span { line-height: 1; }
.week-day i { font-style: normal; font-size: .8rem; line-height: 1; color: transparent; }
.week-day.done { background: var(--green-soft); border-color: #b9e88a; color: var(--green-dark); }
.week-day.done i { color: var(--green-dark); }
.week-day.today { box-shadow: inset 0 0 0 2px var(--green); }
.streak-mascot {
display: flex; align-items: center; gap: 10px;
margin: 10px 0; padding: 10px 12px;
background: var(--surface); border: 1px dashed #e4cf9e; border-radius: 14px;
}
.mascot-face { font-size: 1.8rem; line-height: 1; animation: mascot-bob 3s ease-in-out infinite; }
.streak-mascot p { margin: 0; font-size: .8rem; font-weight: 700; }
[data-theme='dark'] .streak-mascot { border-color: #5a4824; }
.streak-goal { margin-top: 10px; padding: 10px 12px; background: var(--surface); border: 1px solid var(--line); border-radius: 14px; }
.streak-goal-head { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 6px; font-size: .72rem; color: var(--muted); font-weight: 800; }
.streak-goal-head b { color: var(--text); }
.mini-bar { height: 8px; background: var(--surface-2); border-radius: 999px; overflow: hidden; }
.mini-bar span { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--green), #a3e635); transition: width .3s ease; }
.streak-goal .badge { display: inline-block; margin-top: 7px; }
.streak-goal .hint { display: block; margin-top: 6px; }
.streak-milestones { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
.milestone {
display: inline-flex; align-items: center; gap: 2px;
padding: 4px 8px; border: 1px solid var(--line); border-radius: 999px;
background: var(--surface); color: var(--muted); font-size: .68rem; font-weight: 800;
opacity: .62;
}
.milestone.unlocked { opacity: 1; color: #8a5b00; background: #fff3cd; border-color: #f0d38a; }
[data-theme='dark'] .milestone.unlocked { color: #ffd966; background: #3d3200; border-color: #6b5320; }
.daily-challenge {
display: flex; align-items: center; justify-content: space-between; gap: 12px;
margin-top: 12px; padding-top: 12px; border-top: 1px dashed var(--line);
}
.daily-challenge > div { min-width: 0; }
.daily-challenge strong { display: block; font-size: .92rem; }
.daily-challenge span { font-size: .75rem; color: var(--muted); }
.summary-bonus {
margin: 14px 0 0; padding: 10px 12px; border-radius: 12px;
background: #fff3cd; border: 1px solid #f0d38a;
color: #8a5b00; font-size: .82rem; font-weight: 800;
}
[data-theme='dark'] .summary-bonus { background: #3d3200; border-color: #6b5320; color: #ffd966; }
.stat-pill.streak.is-lit { background: #fff3d6; border-color: #f0c96b; }
[data-theme='dark'] .stat-pill.streak.is-lit { background: #3a2d12; border-color: #6b5320; }
.confetti-layer { position: fixed; inset: 0; z-index: 500; pointer-events: none; overflow: hidden; }
.confetti-piece {
position: absolute; top: -10vh; line-height: 1;
animation: confetti-fall 2.4s cubic-bezier(.2, .6, .4, 1) forwards;
will-change: transform, opacity;
}
@keyframes confetti-fall {
0% { transform: translate3d(0, -10vh, 0) rotate(0); opacity: 1; }
100% { transform: translate3d(var(--drift, 0), 110vh, 0) rotate(600deg); opacity: 0; }
}
@keyframes flame-pulse {
0%, 100% { transform: scale(1) rotate(0); }
50% { transform: scale(1.08) rotate(-2deg); }
}
@keyframes mascot-bob {
0%, 100% { transform: translateY(0); }
50% { transform: translateY(-3px); }
}
@media (max-width: 560px) {
.streak-top { align-items: flex-start; }
.streak-record { flex-direction: row; width: 100%; justify-content: flex-start; gap: 6px; }
.streak-record b { font-size: 1.1rem; }
.week-strip { gap: 4px; }
.week-day { height: 40px; }
.daily-challenge { flex-direction: column; align-items: stretch; }
.daily-challenge .btn { width: 100%; }
}
`, 'utf8');

fs.appendFileSync('tests/e2e.spec.js', `
test('série quotidienne, défi du jour et récompense', async ({ page }) => {
await expect(page.getByTestId('streak-panel')).toContainText('0 jour');
await page.getByTestId('daily-challenge').click();
for (let i = 0; i < 3; i++) {
await expect(page.getByTestId('reveal')).toBeVisible();
await page.getByTestId('reveal').click();
await page.getByTestId('grade-good').click();
await expect(page.getByTestId('feedback')).toBeVisible();
await page.getByTestId('session-next').click();
}
await expect(page.getByTestId('summary')).toBeVisible();
await expect(page.getByTestId('daily-bonus')).toContainText('+20 XP');
await page.getByTestId('finish-session').click();
await expect(page.getByTestId('streak-panel')).toContainText('1 jour');
await expect(page.getByTestId('daily-done')).toBeVisible();
});
`, 'utf8');
