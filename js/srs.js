/* Kotoba — état local, répétition espacée et statistiques.
   Aucune dépendance : ce module est testable directement avec Node. */
(function (root) {
  "use strict";

  const KEY = "kotoba.v3";
  const BACKUP_KEY = "kotoba.v3.backups";
  const BACKUP_MAX = 3;
  const BACKUP_GAP = 6 * 60 * 60 * 1000;
  const VERSION = 3;
  const DAY = 86400000;
  // Niveau 0 = 10 minutes, puis 1, 2, 4, 8, 16, 32, 64, 128, 256 jours.
  const LEVELS = [10 * 60 * 1000, 1, 2, 4, 8, 16, 32, 64, 128, 256];

  function storage() {
    try { return root.localStorage; } catch (e) { return null; }
  }

  function todayKey(now) {
    const d = new Date(now == null ? Date.now() : now);
    return d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0");
  }

  function startOfDay(t) {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  }

  function defaultState() {
    return {
      version: VERSION,
      createdAt: Date.now(),
      entries: {},
      progress: {},
      stats: {
        xp: 0, reviews: 0, correct: 0, phraseAttempts: 0, phraseCorrect: 0, streak: 0, bestStreak: 0,
        lastDay: null, daily: {}, history: {}
      },
      settings: { goal: 50, romaji: true, furigana: true, theme: "system", rate: 0.9 },
      flags: {}
    };
  }

  function normalizeState(obj) {
    const s = defaultState();
    if (!obj || typeof obj !== "object") return s;

    s.createdAt = Number(obj.createdAt) || s.createdAt;

    if (Array.isArray(obj.entries)) {
      obj.entries.forEach(function (e) { if (e && e.id) s.entries[e.id] = e; });
    } else if (obj.entries && typeof obj.entries === "object") {
      s.entries = obj.entries;
    }

    if (obj.progress && typeof obj.progress === "object") s.progress = obj.progress;

    if (obj.stats && typeof obj.stats === "object") {
      Object.keys(obj.stats).forEach(function (k) { s.stats[k] = obj.stats[k]; });
      s.stats.daily = (obj.stats.daily && typeof obj.stats.daily === "object") ? obj.stats.daily : {};
      s.stats.history = (obj.stats.history && typeof obj.stats.history === "object") ? obj.stats.history : {};
    }
    ["xp", "reviews", "correct", "phraseAttempts", "phraseCorrect", "streak", "bestStreak"].forEach(function (k) {
      s.stats[k] = Number(s.stats[k]) || 0;
    });
    if (!s.stats.lastDay) s.stats.lastDay = null;

    if (obj.settings && typeof obj.settings === "object") {
      Object.keys(obj.settings).forEach(function (k) { s.settings[k] = obj.settings[k]; });
    }
    s.settings.goal = Math.max(10, Number(s.settings.goal) || 50);
    s.settings.rate = Math.min(1.5, Math.max(0.5, Number(s.settings.rate) || 0.9));
    s.settings.romaji = s.settings.romaji !== false;
    s.settings.furigana = s.settings.furigana !== false;
    if (["system", "light", "dark"].indexOf(s.settings.theme) < 0) s.settings.theme = "system";

    if (obj.flags && typeof obj.flags === "object") s.flags = obj.flags;
    s.version = VERSION;
    return s;
  }

  function load() {
    const ls = storage();
    if (!ls) return defaultState();
    let raw = null;
    try { raw = ls.getItem(KEY); } catch (e) { return defaultState(); }
    if (!raw) return defaultState();
    try { return normalizeState(JSON.parse(raw)); } catch (e) { return defaultState(); }
  }

  function save(state) {
    const ls = storage();
    if (!ls) return false;
    try {
      ls.setItem(KEY, JSON.stringify(state));
      snapshot(state);
      return true;
    } catch (e) {
      return false;
    }
  }

  function snapshot(state, now) {
    const ls = storage();
    if (!ls || !state) return false;
    now = now == null ? Date.now() : now;
    try {
      let list = [];
      try { list = JSON.parse(ls.getItem(BACKUP_KEY) || "[]") || []; } catch (e) { list = []; }
      if (!Array.isArray(list)) list = [];
      const last = list[list.length - 1];
      if (last && now - Number(last.t || 0) < BACKUP_GAP) return false;
      list.push({ t: now, state: JSON.parse(JSON.stringify(state)) });
      while (list.length > BACKUP_MAX) list.shift();
      ls.setItem(BACKUP_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  function backupInfo() {
    const ls = storage();
    if (!ls) return [];
    try {
      const list = JSON.parse(ls.getItem(BACKUP_KEY) || "[]");
      if (!Array.isArray(list)) return [];
      return list.map(function (item) {
        return { t: Number(item && item.t) || 0, bytes: JSON.stringify(item && item.state || {}).length };
      });
    } catch (e) {
      return [];
    }
  }

  function latestBackup() {
    const ls = storage();
    if (!ls) return null;
    try {
      const list = JSON.parse(ls.getItem(BACKUP_KEY) || "[]");
      const last = Array.isArray(list) ? list[list.length - 1] : null;
      return last && last.state ? normalizeState(last.state) : null;
    } catch (e) {
      return null;
    }
  }

  function reset() {
    const ls = storage();
    if (!ls) return;
    try { ls.removeItem(KEY); } catch (e) { /* ignore */ }
    try { ls.removeItem(BACKUP_KEY); } catch (e) { /* ignore */ }
  }

  function freshProgress(now) {
    return { level: 0, reps: 0, lapses: 0, due: now || 0, last: 0, said: 0 };
  }

  function isNew(p) {
    return !p || (!p.last && !p.reps && !p.lapses);
  }

  function isDue(p, now) {
    return !!p && p.last > 0 && p.due <= (now == null ? Date.now() : now);
  }

  function isKnown(p) {
    return !!p && p.level >= 3;
  }

  function reviewCount(p) {
    return Math.max(0, Number(p && p.reps) || 0) + Math.max(0, Number(p && p.lapses) || 0);
  }

  function reviewStage(p) {
    if (isNew(p)) return "new";
    const n = reviewCount(p);
    if (n >= 30) return "ultimate";
    if (n >= 10) return "validated";
    return "learning";
  }

  function stageLabel(p) {
    const stage = reviewStage(p);
    if (stage === "validated") return "Validé";
    if (stage === "ultimate") return "Ultime";
    if (stage === "learning") return "En révision";
    return "Nouveau";
  }

  function stageDetail(p) {
    const stage = reviewStage(p);
    const n = reviewCount(p);
    if (stage === "new") return "Nouveau · 0/10 révisions avant validation";
    if (stage === "learning") return "En révision · " + n + "/10 avant validation";
    if (stage === "validated") return "Validé · " + n + "/30 avant la révision ultime";
    return "Révision ultime · objectif atteint";
  }

  function stageProgress(p) {
    const stage = reviewStage(p);
    const count = reviewCount(p);
    const target = stage === "learning" || stage === "new" ? 10 : 30;
    const pct = stage === "ultimate" ? 100 : Math.min(100, Math.round(count / target * 100));
    return { stage: stage, count: count, target: target, pct: pct, label: stageLabel(p), detail: stageDetail(p) };
  }

  function stageCounts(entries, state) {
    const out = { new: 0, learning: 0, validated: 0, ultimate: 0 };
    (entries || []).forEach(function (e) {
      const p = state && state.progress ? state.progress[e.id] : null;
      out[reviewStage(p)]++;
    });
    return out;
  }

  function dueFor(level, now) {
    if (level <= 0) return now + LEVELS[0];
    return now + LEVELS[Math.min(level, LEVELS.length - 1)] * DAY;
  }

  // « again » remet le mot en apprentissage immédiat ; « good » monte d'un cran.
  function schedule(p, grade, now) {
    now = now == null ? Date.now() : now;
    const s = Object.assign({ level: 0, reps: 0, lapses: 0, due: 0, last: 0, said: 0 }, p || {});
    if (grade === "again") {
      s.lapses = (s.lapses || 0) + 1;
      s.level = 0;
      s.due = now + LEVELS[0];
    } else {
      s.reps = (s.reps || 0) + 1;
      s.level = Math.min(LEVELS.length - 1, (s.level || 0) + 1);
      s.due = dueFor(s.level, now);
    }
    s.last = now;
    return s;
  }

  function bumpStats(state, grade, now) {
    now = now == null ? Date.now() : now;
    const day = todayKey(now);
    const yesterday = todayKey(now - DAY);
    const st = state.stats;
    if (!st.daily) st.daily = {};
    if (!st.history) st.history = {};

    if (st.lastDay !== day) {
      st.streak = st.lastDay === yesterday ? (st.streak || 0) + 1 : 1;
      st.lastDay = day;
      st.bestStreak = Math.max(st.bestStreak || 0, st.streak);
    }

    const xp = grade === "good" ? 10 : 3;
    st.xp = (st.xp || 0) + xp;
    st.daily[day] = (st.daily[day] || 0) + xp;
    st.history[day] = (st.history[day] || 0) + 1;
    st.reviews = (st.reviews || 0) + 1;
    if (grade === "good") st.correct = (st.correct || 0) + 1;

    const cutoff = todayKey(now - 370 * DAY);
    Object.keys(st.daily).forEach(function (d) { if (d < cutoff) delete st.daily[d]; });
    Object.keys(st.history).forEach(function (d) { if (d < cutoff) delete st.history[d]; });
    return xp;
  }

  function addXp(state, amount, now) {
now = now == null ? Date.now() : now;
const day = todayKey(now);
const value = Math.max(0, Number(amount) || 0);
if (!state.stats.daily) state.stats.daily = {};
state.stats.xp = (state.stats.xp || 0) + value;
state.stats.daily[day] = (state.stats.daily[day] || 0) + value;
return value;
}
function counts(entries, state, now) {
    now = now == null ? Date.now() : now;
    let due = 0, fresh = 0, known = 0, learning = 0, seen = 0;
    (entries || []).forEach(function (e) {
      const p = state.progress && state.progress[e.id];
      if (isNew(p)) { fresh++; return; }
      seen++;
      if (isKnown(p)) known++; else learning++;
      if (p && p.due <= now) due++;
    });
    return { due: due, new: fresh, known: known, learning: learning, seen: seen, total: (entries || []).length };
  }

  function dueEntries(entries, state, now) {
    now = now == null ? Date.now() : now;
    return (entries || []).filter(function (e) {
      return isDue(state.progress[e.id], now);
    }).sort(function (a, b) {
      return state.progress[a.id].due - state.progress[b.id].due;
    });
  }

  function nextDue(entries, state, now) {
    now = now == null ? Date.now() : now;
    let min = 0;
    (entries || []).forEach(function (e) {
      const p = state.progress[e.id];
      if (p && p.last && p.due > now && (!min || p.due < min)) min = p.due;
    });
    return min;
  }

  function forecast(entries, state, now) {
    now = now == null ? Date.now() : now;
    const base = startOfDay(now);
    const out = [0, 0, 0, 0, 0, 0, 0];
    (entries || []).forEach(function (e) {
      const p = state.progress[e.id];
      if (!p || !p.last) return;
      const diff = Math.round((startOfDay(p.due) - base) / DAY);
      if (diff <= 0) out[0]++;
      else if (diff < 7) out[diff]++;
    });
    return out;
  }

  function dueLabel(ts, now) {
    if (!ts) return "maintenant";
    const diff = ts - (now == null ? Date.now() : now);
    if (diff <= 0) return "maintenant";
    const min = Math.ceil(diff / 60000);
    if (min < 60) return "dans " + min + " min";
    const h = Math.ceil(min / 60);
    if (h < 24) return "dans " + h + " h";
    const d = Math.ceil(h / 24);
    if (d === 1) return "demain";
    if (d < 30) return "dans " + d + " jours";
    return "dans " + Math.ceil(d / 30) + " mois";
  }

  function levelLabel(p) {
    const names = ["Nouveau", "Découverte", "En cours", "Connu", "Solide", "Ancré", "Maîtrisé", "Expert", "Expert", "Expert"];
    return names[Math.min((p && p.level) || 0, names.length - 1)];
  }

  function statusOf(p) {
    if (!p || !p.last) return "new";
    if (p.level >= 3) return "known";
    return "learning";
  }

  function exportState(state) {
    return JSON.stringify(state, null, 2);
  }

  function importState(text) {
    let obj;
    try { obj = JSON.parse(text); } catch (e) { throw new Error("Ce fichier n'est pas un JSON valide."); }
    if (!obj || typeof obj !== "object" || (!obj.progress && !obj.entries)) {
      throw new Error("Ce fichier ne ressemble pas à une sauvegarde Kotoba.");
    }
    return normalizeState(obj);
  }

  const api = {
    KEY: KEY,
    BACKUP_KEY: BACKUP_KEY,
    VERSION: VERSION,
    LEVELS: LEVELS,
    todayKey: todayKey,
    defaultState: defaultState,
    normalizeState: normalizeState,
    load: load,
    save: save,
    snapshot: snapshot,
    backupInfo: backupInfo,
    latestBackup: latestBackup,
    reset: reset,
    freshProgress: freshProgress,
    isNew: isNew,
    isDue: isDue,
    isKnown: isKnown,
    reviewCount: reviewCount,
    reviewStage: reviewStage,
    stageLabel: stageLabel,
    stageDetail: stageDetail,
    stageProgress: stageProgress,
    stageCounts: stageCounts,
    schedule: schedule,
    bumpStats: bumpStats,
addXp: addXp,
    counts: counts,
    dueEntries: dueEntries,
    nextDue: nextDue,
    forecast: forecast,
    dueLabel: dueLabel,
    levelLabel: levelLabel,
    statusOf: statusOf,
    exportState: exportState,
    importState: importState
  };

  root.Kotoba = root.Kotoba || {};
  root.Kotoba.Store = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
