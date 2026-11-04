/* Kotoba Sync — compte et synchronisation de la progression.
   Le mode local reste la source de vérité hors ligne ; les états sont fusionnés
   avant chaque envoi pour éviter d'écraser les progrès d'un autre appareil. */
(function (root, factory) {
  var api = factory(root);
  if (root && root.Kotoba) root.Kotoba.Sync = api;
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
})(typeof window !== 'undefined' ? window : globalThis, function (root) {
  'use strict';

  var API_BASE = (root && root.KOTOBA_SYNC_API) || 'https://site-8663ef28787c4307a825b86f37a2dc1c.freebuff.page';
  var TOKEN_KEY = 'kotoba.sync.token';
  var EMAIL_KEY = 'kotoba.sync.email';
  var REVISION_KEY = 'kotoba.sync.revision';
  var LAST_SYNC_KEY = 'kotoba.sync.last';
  var inFlight = null;

  function storage() {
    try { return root.localStorage; } catch (e) { return null; }
  }
  function read(key) {
    const ls = storage();
    try { return ls ? ls.getItem(key) : ''; } catch (e) { return ''; }
  }
  function write(key, value) {
    const ls = storage();
    try { if (ls) ls.setItem(key, String(value)); } catch (e) { /* stockage plein */ }
  }
  function remove(key) {
    const ls = storage();
    try { if (ls) ls.removeItem(key); } catch (e) { /* ignore */ }
  }
  function token() { return read(TOKEN_KEY); }
  function currentRevision() { return Math.max(0, Number(read(REVISION_KEY)) || 0); }
  function lastSync() { return Math.max(0, Number(read(LAST_SYNC_KEY)) || 0); }

  function clearSession() {
    remove(TOKEN_KEY); remove(EMAIL_KEY); remove(REVISION_KEY); remove(LAST_SYNC_KEY);
  }

  function session() {
    var t = token();
    return {
      loggedIn: !!t,
      email: t ? read(EMAIL_KEY) : '',
      revision: t ? currentRevision() : 0,
      lastSync: t ? lastSync() : 0
    };
  }

  async function request(path, options) {
    var opts = options || {};
    var headers = { 'Content-Type': 'application/json' };
    if (token()) headers.Authorization = 'Bearer ' + token();
    var response;
    try {
      response = await root.fetch(API_BASE + path, {
        method: opts.method || 'GET',
        headers: headers,
        body: opts.body == null ? undefined : JSON.stringify(opts.body)
      });
    } catch (e) {
      var network = new Error('Impossible de joindre le serveur de synchronisation.');
      network.network = true;
      throw network;
    }
    var data = null;
    try { data = await response.json(); } catch (e) { data = null; }
    if (!response.ok) {
      if (response.status === 401 && path !== '/api/login' && path !== '/api/register') clearSession();
      var error = new Error((data && data.error) || 'Erreur de synchronisation.');
      error.status = response.status;
      error.data = data;
      throw error;
    }
    return data;
  }

  async function register(email, password) {
    var data = await request('/api/register', { method: 'POST', body: { email: email, password: password } });
    write(TOKEN_KEY, data.token);
    write(EMAIL_KEY, data.user && data.user.email || email);
    write(REVISION_KEY, data.revision || 0);
    return data;
  }

  async function login(email, password) {
    var data = await request('/api/login', { method: 'POST', body: { email: email, password: password } });
    write(TOKEN_KEY, data.token);
    write(EMAIL_KEY, data.user && data.user.email || email);
    write(REVISION_KEY, data.revision || 0);
    return data;
  }

  async function init() {
    if (!token()) return null;
    try {
      var data = await request('/api/me');
      if (data && data.user) write(EMAIL_KEY, data.user.email || '');
      if (data && typeof data.revision === 'number') write(REVISION_KEY, data.revision);
      return data;
    } catch (e) {
      if (e.status === 401) clearSession();
      return null;
    }
  }

  async function logout() {
    try { await request('/api/logout', { method: 'POST' }); } catch (e) { /* déconnexion locale quand même */ }
    clearSession();
  }

  async function deleteAccount() {
    await request('/api/account', { method: 'DELETE' });
    clearSession();
  }

  function numeric(value) {
    return Math.max(0, Number(value) || 0);
  }
  function reviewCount(p) {
    return numeric(p && p.reps) + numeric(p && p.lapses);
  }
  function laterProgress(local, remote) {
    if (!local) return remote;
    if (!remote) return local;
    var localLast = numeric(local.last);
    var remoteLast = numeric(remote.last);
    if (localLast !== remoteLast) return localLast > remoteLast ? local : remote;
    return reviewCount(local) >= reviewCount(remote) ? local : remote;
  }
  function mergePronunciation(local, remote) {
    var seen = {};
    var out = [];
    (Array.isArray(local) ? local : []).concat(Array.isArray(remote) ? remote : []).forEach(function (item) {
      if (!item || typeof item !== 'object') return;
      var key = [item.t || 0, item.target || '', item.expected || '', item.score || 0, item.heard || ''].join('|');
      if (seen[key]) return;
      seen[key] = true;
      out.push(item);
    });
    return out.sort(function (a, b) { return numeric(a.t) - numeric(b.t); }).slice(-30);
  }
  function mergeProgress(local, remote) {
    var chosen = laterProgress(local, remote);
    if (!chosen) return chosen;
    var merged = Object.assign({}, chosen);
    merged.reps = Math.max(numeric(local && local.reps), numeric(remote && remote.reps));
    merged.lapses = Math.max(numeric(local && local.lapses), numeric(remote && remote.lapses));
    merged.said = Math.max(numeric(local && local.said), numeric(remote && remote.said));
    merged.level = Math.max(numeric(local && local.level), numeric(remote && remote.level));
    var history = mergePronunciation(local && local.pronunciation, remote && remote.pronunciation);
    if (history.length) merged.pronunciation = history;
    return merged;
  }
  function mergeMap(local, remote, fn) {
    var out = {};
    var keys = {};
    Object.keys(remote || {}).forEach(function (key) { keys[key] = true; });
    Object.keys(local || {}).forEach(function (key) { keys[key] = true; });
    Object.keys(keys).forEach(function (key) {
      out[key] = fn(local && local[key], remote && remote[key]);
    });
    return out;
  }
  function mergeConversationReview(local, remote) {
    var out = {};
    var keys = {};
    [local, remote].forEach(function (map) {
      Object.keys(map || {}).forEach(function (key) { keys[key] = true; });
    });
    Object.keys(keys).forEach(function (key) {
      var l = local && local[key];
      var r = remote && remote[key];
      if (!l && !r) return;
      var lt = Math.max(numeric(l && l.missedAt), numeric(l && l.clearedAt));
      var rt = Math.max(numeric(r && r.missedAt), numeric(r && r.clearedAt));
      var chosen = (r && (!l || rt > lt)) ? r : l;
      if (chosen) out[key] = Object.assign({}, chosen);
    });
    return out;
  }
  function mergeStats(local, remote) {
    var left = local || {};
    var right = remote || {};
    var out = Object.assign({}, right, left);
    ['xp', 'reviews', 'correct', 'phraseAttempts', 'phraseCorrect', 'streak', 'bestStreak'].forEach(function (key) {
      out[key] = Math.max(numeric(left[key]), numeric(right[key]));
    });
    out.lastDay = String(left.lastDay || '') > String(right.lastDay || '') ? left.lastDay : right.lastDay;
    out.daily = mergeMap(left.daily, right.daily, function (a, b) { return Math.max(numeric(a), numeric(b)); });
    out.history = mergeMap(left.history, right.history, function (a, b) { return Math.max(numeric(a), numeric(b)); });
    return out;
  }
  function mergeStates(local, remote) {
    if (!remote) return JSON.parse(JSON.stringify(local || {}));
    if (!local) return JSON.parse(JSON.stringify(remote || {}));
    var out = Object.assign({}, remote, local);
    out.createdAt = Math.min(numeric(local.createdAt) || Infinity, numeric(remote.createdAt) || Infinity);
    if (!isFinite(out.createdAt)) out.createdAt = Date.now();
    out.entries = Object.assign({}, remote.entries || {}, local.entries || {});
    out.progress = mergeMap(local.progress, remote.progress, mergeProgress);
    out.stats = mergeStats(local.stats, remote.stats);
    var flags = Object.assign({}, remote.flags || {}, local.flags || {});
    if (local.flags && local.flags.daily && remote.flags && remote.flags.daily) {
      flags.daily = String(local.flags.daily) > String(remote.flags.daily) ? local.flags.daily : remote.flags.daily;
    }
    out.flags = flags;
    out.conversationReview = mergeConversationReview(local.conversationReview, remote.conversationReview);
    out.settings = Object.assign({}, remote.settings || {}, local.settings || {});
    out.version = local.version || remote.version;
    return out;
  }

  async function pull() {
    return request('/api/state');
  }
  async function put(state, baseRevision) {
    return request('/api/state', {
      method: 'PUT',
      body: { state: state, baseRevision: baseRevision }
    });
  }
  async function sync(localState) {
    if (!token()) throw new Error('Connecte-toi pour synchroniser.');
    if (inFlight) return inFlight;
    inFlight = (async function () {
      var remote = await pull();
      var merged = mergeStates(localState, remote && remote.state);
      var base = remote && typeof remote.revision === 'number' ? remote.revision : 0;
      var saved;
      try {
        saved = await put(merged, base);
      } catch (e) {
        if (!e || e.status !== 409) throw e;
        var current = e.data && e.data.state ? { state: e.data.state, revision: e.data.revision || 0 } : await pull();
        merged = mergeStates(merged, current && current.state);
        saved = await put(merged, current && typeof current.revision === 'number' ? current.revision : 0);
      }
      write(REVISION_KEY, saved.revision || 0);
      write(LAST_SYNC_KEY, Date.now());
      return { state: merged, revision: saved.revision || 0, remoteState: remote && remote.state || null };
    })();
    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  }

  return {
    API_BASE: API_BASE,
    init: init,
    session: session,
    register: register,
    login: login,
    logout: logout,
    deleteAccount: deleteAccount,
    pull: pull,
    sync: sync,
    mergeStates: mergeStates,
    mergeProgress: mergeProgress
  };
});
