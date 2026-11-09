/* Kotoba — carnet d'erreurs : mots fragiles, répliques ratées et histoires à consolider.
   Module pur, sans dépendance : testable directement avec Node. */
(function (root) {
"use strict";

const WEAK_PRONUNCIATION = 75;
const FRAGILE_LAPSES = 2;

function progressOf(state, id) {
  return state && state.progress && state.progress[id] ? state.progress[id] : null;
}

function lastPronunciation(p) {
  const list = p && Array.isArray(p.pronunciation) ? p.pronunciation : [];
  if (!list.length) return null;
  const item = list[list.length - 1];
  return {
    score: Math.max(0, Math.min(100, Math.round(Number(item && item.score) || 0))),
    t: Number(item && item.t) || 0,
    good: !!(item && item.good)
  };
}

// Un mot est fragile après deux échecs en révision, ou si sa dernière
// prononciation est sous 75 %. Les deux signaux se renforcent.
function fragileWords(entries, state) {
  const rows = [];
  (entries || []).forEach(function (entry) {
    if (!entry || !entry.id) return;
    const p = progressOf(state, entry.id);
    if (!p) return;
    const attempts = Array.isArray(p.pronunciation) ? p.pronunciation.length : 0;
    if (!p.last && !attempts) return;
    const lapses = Math.max(0, Number(p.lapses) || 0);
    const pron = lastPronunciation(p);
    const weakPron = !!(pron && pron.score < WEAK_PRONUNCIATION);
    if (lapses < FRAGILE_LAPSES && !weakPron) return;
    rows.push({
      entry: entry,
      lapses: lapses,
      lastScore: pron ? pron.score : null,
      reason: lapses >= FRAGILE_LAPSES && weakPron ? "lapses+prononciation" : (lapses >= FRAGILE_LAPSES ? "échecs" : "prononciation"),
      weight: lapses * 100 + (weakPron ? WEAK_PRONUNCIATION - pron.score : 0) + (p.pronunciationBad ? 20 : 0)
    });
  });
  return rows.sort(function (a, b) {
    return b.weight - a.weight || String(a.entry.fr || "").localeCompare(String(b.entry.fr || ""), "fr");
  });
}

function conversationMisses(state) {
  const map = state && state.conversationReview;
  if (!map || typeof map !== "object") return [];
  return Object.keys(map).map(function (key) {
    const item = map[key];
    if (!item || !((Number(item.missedAt) || 0) > (Number(item.clearedAt) || 0))) return null;
    return {
      key: key,
      scenario: String(item.scenario || ""),
      turn: Math.max(0, Math.floor(Number(item.turn) || 0)),
      count: Math.max(1, Number(item.count) || 1),
      missedAt: Number(item.missedAt) || 0
    };
  }).filter(Boolean).sort(function (a, b) { return b.missedAt - a.missedAt; });
}

function storiesToConsolidate(state, stories) {
  const records = state && state.immersion;
  if (!records || typeof records !== "object") return [];
  const byId = {};
  (Array.isArray(stories) ? stories : []).forEach(function (story) {
    if (story && story.id) byId[story.id] = story;
  });
  return Object.keys(records).map(function (id) {
    const record = records[id];
    if (!record || !(Number(record.attempts) > 0)) return null;
    const total = Math.max(0, Math.floor(Number(record.total) || 0));
    const best = Math.max(0, Math.floor(Number(record.bestScore) || 0));
    if (!total || best >= total) return null;
    return { id: id, story: byId[id] || null, bestScore: best, total: total };
  }).filter(Boolean).sort(function (a, b) {
    return (a.bestScore / a.total) - (b.bestScore / b.total);
  });
}

function summary(state, entries, stories) {
  const words = fragileWords(entries, state);
  const conversations = conversationMisses(state);
  const storyRows = storiesToConsolidate(state, stories);
  return {
    words: words.length,
    conversations: conversations.length,
    stories: storyRows.length,
    total: words.length + conversations.length + storyRows.length,
    wordRows: words,
    conversationRows: conversations,
    storyRows: storyRows
  };
}

const api = {
  WEAK_PRONUNCIATION: WEAK_PRONUNCIATION,
  FRAGILE_LAPSES: FRAGILE_LAPSES,
  lastPronunciation: lastPronunciation,
  fragileWords: fragileWords,
  conversationMisses: conversationMisses,
  storiesToConsolidate: storiesToConsolidate,
  summary: summary
};

root.Kotoba = root.Kotoba || {};
root.Kotoba.Mistakes = api;
if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);