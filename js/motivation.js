/* Kotoba — série quotidienne, défi du jour et célébrations.
Module séparé de l'interface : l'application lui passe l'état et le Store. */
(function () {
'use strict';
if (!window.Kotoba || !window.Kotoba.Store) return;
const S = window.Kotoba.Store;
const DAY = 86400000;
function esc(value) {
return String(value == null ? '' : value).replace(/[&<>"']/g, function (ch) {
return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch];
});
}
function todayXp(state, now) {
const key = S.todayKey(now);
return (state.stats && state.stats.daily && state.stats.daily[key]) || 0;
}
function currentStreak(state, now) {
now = now == null ? Date.now() : now;
const st = state.stats || {};
const today = S.todayKey(now);
const yesterday = S.todayKey(now - DAY);
return (st.lastDay === today || st.lastDay === yesterday) ? (st.streak || 0) : 0;
}
const LEVEL_STEP = 250;
const LEVEL_TITLES = [
{ jp: 'はじめ', fr: 'Débuts' },
{ jp: '探検家', fr: 'Explorateur' },
{ jp: '旅人', fr: 'Voyageur' },
{ jp: '話し手', fr: 'Conteur' },
{ jp: '達人', fr: 'Expert' },
{ jp: '先生', fr: 'Maître' },
{ jp: '伝説', fr: 'Légende' }
];
function levelInfo(state) {
const xp = Math.max(0, Number(state && state.stats && state.stats.xp) || 0);
const number = Math.floor(xp / LEVEL_STEP) + 1;
const inLevel = xp % LEVEL_STEP;
return {
number: number,
 title: LEVEL_TITLES[Math.min(number - 1, LEVEL_TITLES.length - 1)],
 xp: xp,
 inLevel: inLevel,
 pct: Math.round(inLevel / LEVEL_STEP * 100),
 next: LEVEL_STEP - inLevel
};
}
function streakPanel(state, now) {
now = now == null ? Date.now() : now;
const goal = state.settings.goal || 50;
const xp = todayXp(state, now);
const pct = Math.min(100, Math.round(xp / goal * 100));
const streak = currentStreak(state, now);
const best = (state.stats && state.stats.bestStreak) || 0;
const today = S.todayKey(now);
const yesterday = S.todayKey(now - DAY);
const activeToday = state.stats && state.stats.lastDay === today;
const activeYesterday = state.stats && state.stats.lastDay === yesterday;
const level = levelInfo(state);
const spokeToday = !!(state.flags && state.flags.conversationDay === today);
const labels = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const days = [];
for (let i = 6; i >= 0; i--) {
const t = now - i * DAY;
const key = S.todayKey(t);
days.push({
label: labels[new Date(t).getDay()],
done: !!(state.stats && state.stats.daily && state.stats.daily[key] > 0),
today: key === today
});
}
const quote = streak >= 7 ? '最高！ Une semaine, bravo !' : (streak >= 3 ? 'すごい！ Ta série grandit.' : (streak >= 1 ? 'いいね！ Continue comme ça.' : 'はじめよう！ On commence ?'));
const msg = activeToday ? 'Série entretenue aujourd’hui. Reviens demain !' : (activeYesterday ? 'Continue aujourd’hui pour garder ta série.' : (streak ? 'Ta série est en pause. Une carte suffit pour repartir.' : 'Une carte aujourd’hui lance ta série.'));
const done = !!(state.flags && state.flags.daily === today);
const milestones = [3, 7, 30].map(function (m) {
const unlocked = best >= m || streak >= m;
return '<span class="milestone' + (unlocked ? ' unlocked' : '') + '" title="' + m + ' jours de série">' + (unlocked ? '🏅' : '🔒') + ' ' + m + ' j</span>';
}).join('');
const week = days.map(function (d) {
return '<div class="week-day' + (d.done ? ' done' : '') + (d.today ? ' today' : '') + '"><span>' + d.label + '</span><i>' + (d.done ? '✓' : '') + '</i></div>';
}).join('');
return '<section class="panel streak-panel" data-testid="streak-panel">' +
'<div class="streak-top"><div class="streak-flame' + (activeToday ? ' is-lit' : '') + '" aria-hidden="true">🔥</div>' +
'<div class="streak-copy"><p class="eyebrow">Ta série</p><strong class="streak-number">' + streak + ' jour' + (streak === 1 ? '' : 's') + '</strong><p class="hint">' + esc(msg) + '</p></div>' +
'<div class="streak-record"><span>Record</span><b>' + best + '</b><span>jour' + (best === 1 ? '' : 's') + '</span></div></div>' +
'<div class="level-progress" data-testid="level-progress"><span class="level-badge" data-testid="level-number">Niv. ' + level.number + '</span><div class="level-copy"><div class="level-title"><strong lang="ja">' + esc(level.title.jp) + '</strong><span>' + esc(level.title.fr) + '</span></div><div class="mini-bar"><span style="width:' + level.pct + '%"></span></div><div class="level-next">' + level.next + ' XP avant le niveau ' + (level.number + 1) + ' · ' + level.xp + ' XP au total</div></div></div>' +
'<div class="week-strip" aria-label="Activité des sept derniers jours">' + week + '</div>' +
'<div class="streak-mascot"><span class="mascot-face" aria-hidden="true">🦊</span><p>' + esc(quote) + '</p></div>' +
'<div class="streak-goal"><div class="streak-goal-head"><span>Objectif du jour</span><b>' + xp + ' / ' + goal + ' XP</b></div><div class="mini-bar"><span style="width:' + pct + '%"></span></div>' +
(xp >= goal ? '<span class="badge known" data-testid="goal-reached">Objectif atteint ✓</span>' : '<span class="hint">' + Math.max(0, goal - xp) + ' XP pour le valider</span>') + '</div>' +
'<div class="daily-mission' + (spokeToday ? ' done' : '') + '" data-testid="conversation-mission"><div><strong>Mission conversation</strong><span>' + (spokeToday ? 'Une réplique travaillée aujourd’hui.' : 'Une réplique suffit pour garder le rythme.') + '</span></div>' + (spokeToday ? '<span class="badge known" data-testid="conversation-mission-done">Faite ✓</span>' : '<a class="btn ghost small" href="#parler" data-testid="conversation-mission-link">Parler</a>') + '</div>' +
'<div class="streak-milestones" aria-label="Paliers de série">' + milestones + '<button class="btn ghost small weekly-report-link" data-action="weekly-report" data-testid="weekly-report">📊 Bilan</button></div>' +
'<div class="daily-challenge"><div><strong>Défi du jour</strong><span>3 cartes · +20 XP bonus</span></div>' +
(done ? '<span class="badge known" data-testid="daily-done">Relevé ✓</span>' : '<button class="btn primary small" data-action="start" data-kind="daily" data-mode="recall" data-testid="daily-challenge">Relever le défi</button>') + '</div></section>';
}
function toast(message) {
const el = document.getElementById('toast');
if (!el) return;
el.textContent = message;
el.classList.add('show');
clearTimeout(toast._timer);
toast._timer = setTimeout(function () { el.classList.remove('show'); }, 3200);
}
function celebrate(message) {
if (message) toast(message);
if (!document.body || (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
const old = document.querySelector('.confetti-layer');
if (old) old.remove();
const layer = document.createElement('div');
layer.className = 'confetti-layer';
layer.setAttribute('aria-hidden', 'true');
const bits = ['🎉', '✨', '🌸', '⭐', '🎊', '💚', '🔥'];
for (let i = 0; i < 24; i++) {
const span = document.createElement('span');
span.className = 'confetti-piece';
span.textContent = bits[i % bits.length];
span.style.left = (Math.random() * 100) + '%';
span.style.animationDelay = (Math.random() * 0.45) + 's';
span.style.fontSize = (12 + Math.random() * 16) + 'px';
span.style.setProperty('--drift', (Math.random() * 180 - 90) + 'px');
layer.appendChild(span);
}
document.body.appendChild(layer);
setTimeout(function () { layer.remove(); }, 2800);
}
window.Kotoba.Motivation = {
currentStreak: currentStreak,
levelInfo: levelInfo,
streakPanel: streakPanel,
celebrate: celebrate
};
})();
