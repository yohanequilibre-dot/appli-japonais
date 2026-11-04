/* Kotoba Sync API — comptes, sessions et sauvegarde d'état.
   Déployé comme Worker Freebuff Sites avec la base D1 liée à DB. */

const ORIGINS = new Set([
  'https://yohanequilibre-dot.github.io',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'http://127.0.0.1:8080',
  'http://localhost:8080'
]);
const SESSION_DAYS = 30;
const PBKDF2_ITERATIONS = 100000; // Maximum supporté par WebCrypto sur Workers.
const MAX_STATE_BYTES = 1500000;
const MAX_AUTH_BYTES = 16384;
const encoder = new TextEncoder();

let schemaPromise = null;

function corsHeaders(origin) {
  const allowed = !origin || ORIGINS.has(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? (origin || '*') : 'null',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'no-referrer',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  };
}

function json(data, status, headers) {
  return new Response(JSON.stringify(data), { status: status || 200, headers: headers });
}

function originAllowed(request) {
  const origin = request.headers.get('Origin');
  return !origin || ORIGINS.has(origin);
}

async function readJson(request, maxBytes) {
  try {
    const declared = Number(request.headers.get('Content-Length') || 0);
    if (declared > (maxBytes || MAX_STATE_BYTES)) return null;
    const text = await request.text();
    if (text.length > (maxBytes || MAX_STATE_BYTES)) return null;
    return JSON.parse(text);
  } catch (e) {
    return null;
  }
}

function validEmail(value) {
  const email = String(value || '').trim().toLowerCase();
  return email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : '';
}

function bytesToBase64Url(bytes) {
  let binary = '';
  const array = new Uint8Array(bytes);
  for (let i = 0; i < array.length; i++) binary += String.fromCharCode(array[i]);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlToBytes(value) {
  const normalized = String(value || '').replace(/-/g, '+').replace(/_/g, '/');
  const padded = normalized + '='.repeat((4 - normalized.length % 4) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

async function sha256(value) {
  const digest = await crypto.subtle.digest('SHA-256', encoder.encode(String(value)));
  return bytesToBase64Url(digest);
}

async function derivePassword(password, salt) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({
    name: 'PBKDF2',
    salt: base64UrlToBytes(salt),
    iterations: PBKDF2_ITERATIONS,
    hash: 'SHA-256'
  }, key, 256);
  return bytesToBase64Url(bits);
}

function sameSecret(a, b) {
  const left = String(a || '');
  const right = String(b || '');
  let diff = left.length ^ right.length;
  for (let i = 0; i < Math.max(left.length, right.length); i++) {
    diff |= (left.charCodeAt(i) || 0) ^ (right.charCodeAt(i) || 0);
  }
  return diff === 0;
}

async function ensureSchema(env) {
  if (!env || !env.DB) throw new Error('Base de données indisponible.');
  if (!schemaPromise) {
    schemaPromise = (async function () {
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT UNIQUE NOT NULL, salt TEXT NOT NULL, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL)').run();
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL)').run();
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS sync_state (user_id TEXT PRIMARY KEY, state TEXT NOT NULL, revision INTEGER NOT NULL, updated_at INTEGER NOT NULL)').run();
      await env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)').run();
    })();
    schemaPromise = schemaPromise.catch(function (err) {
      schemaPromise = null;
      throw err;
    });
  }
  return schemaPromise;
}

async function sessionFromRequest(request, env) {
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+([A-Za-z0-9_-]+)$/);
  if (!match) return null;
  const tokenHash = await sha256(match[1]);
  const row = await env.DB.prepare(
    'SELECT users.id, users.email, sessions.expires_at FROM sessions JOIN users ON users.id = sessions.user_id WHERE sessions.token_hash = ? AND sessions.expires_at > ?'
  ).bind(tokenHash, Date.now()).first();
  return row || null;
}

async function createSession(env, userId) {
  const token = randomToken();
  const tokenHash = await sha256(token);
  const now = Date.now();
  const expiresAt = now + SESSION_DAYS * 86400000;
  await env.DB.prepare('DELETE FROM sessions WHERE expires_at <= ?').bind(now).run();
  await env.DB.prepare('INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .bind(tokenHash, userId, expiresAt, now).run();
  return { token: token, expiresAt: expiresAt };
}

async function stateMeta(env, userId) {
  const row = await env.DB.prepare('SELECT revision, updated_at FROM sync_state WHERE user_id = ?').bind(userId).first();
  return row ? { revision: Number(row.revision) || 0, updatedAt: Number(row.updated_at) || 0 } : { revision: 0, updatedAt: 0 };
}

async function register(request, env, headers) {
  const body = await readJson(request, MAX_AUTH_BYTES);
  const email = validEmail(body && body.email);
  const password = String(body && body.password || '');
  if (!email) return json({ error: 'Adresse e-mail invalide.' }, 400, headers);
  if (password.length < 8 || password.length > 128) {
    return json({ error: 'Le mot de passe doit contenir entre 8 et 128 caractères.' }, 400, headers);
  }
  const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first();
  if (existing) return json({ error: 'Un compte existe déjà avec cet e-mail.' }, 409, headers);
  const salt = randomToken();
  const userId = crypto.randomUUID();
  const passwordHash = await derivePassword(password, salt);
  try {
    await env.DB.prepare('INSERT INTO users (id, email, salt, password_hash, created_at) VALUES (?, ?, ?, ?, ?)')
      .bind(userId, email, salt, passwordHash, Date.now()).run();
  } catch (e) {
    return json({ error: 'Un compte existe déjà avec cet e-mail.' }, 409, headers);
  }
  const session = await createSession(env, userId);
  return json({ token: session.token, user: { email: email }, revision: 0, expiresAt: session.expiresAt }, 201, headers);
}

async function login(request, env, headers) {
  const body = await readJson(request, MAX_AUTH_BYTES);
  const email = validEmail(body && body.email);
  const password = String(body && body.password || '');
  if (!email || !password) return json({ error: 'E-mail et mot de passe requis.' }, 400, headers);
  const user = await env.DB.prepare('SELECT id, email, salt, password_hash FROM users WHERE email = ?').bind(email).first();
  if (!user) {
    await derivePassword(password, randomToken());
    return json({ error: 'E-mail ou mot de passe incorrect.' }, 401, headers);
  }
  const hash = await derivePassword(password, user.salt);
  if (!sameSecret(hash, user.password_hash)) {
    return json({ error: 'E-mail ou mot de passe incorrect.' }, 401, headers);
  }
  const session = await createSession(env, user.id);
  const meta = await stateMeta(env, user.id);
  return json({ token: session.token, user: { email: user.email }, revision: meta.revision, expiresAt: session.expiresAt }, 200, headers);
}

async function getState(request, env, headers) {
  const user = await sessionFromRequest(request, env);
  if (!user) return json({ error: 'Connecte-toi pour synchroniser.' }, 401, headers);
  const row = await env.DB.prepare('SELECT state, revision, updated_at FROM sync_state WHERE user_id = ?').bind(user.id).first();
  if (!row) return json({ state: null, revision: 0, updatedAt: 0 }, 200, headers);
  let state = null;
  try { state = JSON.parse(row.state); } catch (e) { return json({ error: 'Sauvegarde distante illisible.' }, 500, headers); }
  return json({ state: state, revision: Number(row.revision) || 1, updatedAt: Number(row.updated_at) || 0 }, 200, headers);
}

function conflictResponse(row, headers) {
  let state = null;
  try { state = row && row.state ? JSON.parse(row.state) : null; } catch (e) { state = null; }
  return json({ error: 'La progression a changé sur un autre appareil.', code: 'conflict', state: state, revision: row ? Number(row.revision) || 0 : 0 }, 409, headers);
}

async function putState(request, env, headers) {
  const user = await sessionFromRequest(request, env);
  if (!user) return json({ error: 'Connecte-toi pour synchroniser.' }, 401, headers);
  const body = await readJson(request, MAX_STATE_BYTES + 1024);
  if (!body || !body.state || typeof body.state !== 'object' || Array.isArray(body.state)) {
    return json({ error: 'État de progression invalide.' }, 400, headers);
  }
  let stateText;
  try { stateText = JSON.stringify(body.state); } catch (e) { return json({ error: 'État de progression invalide.' }, 400, headers); }
  if (stateText.length > MAX_STATE_BYTES) return json({ error: 'La progression est trop volumineuse.' }, 413, headers);
  const baseRevision = Number(body.baseRevision);
  if (!Number.isInteger(baseRevision) || baseRevision < 0) return json({ error: 'Révision invalide.' }, 400, headers);
  const current = await env.DB.prepare('SELECT state, revision, updated_at FROM sync_state WHERE user_id = ?').bind(user.id).first();
  if (!current) {
    if (baseRevision !== 0) return conflictResponse(null, headers);
    const now = Date.now();
    try {
      await env.DB.prepare('INSERT INTO sync_state (user_id, state, revision, updated_at) VALUES (?, ?, 1, ?)')
        .bind(user.id, stateText, now).run();
      return json({ revision: 1, updatedAt: now }, 200, headers);
    } catch (e) {
      const raced = await env.DB.prepare('SELECT state, revision, updated_at FROM sync_state WHERE user_id = ?').bind(user.id).first();
      return conflictResponse(raced, headers);
    }
  }
  if (Number(current.revision) !== baseRevision) return conflictResponse(current, headers);
  const now = Date.now();
  const nextRevision = baseRevision + 1;
  const result = await env.DB.prepare('UPDATE sync_state SET state = ?, revision = ?, updated_at = ? WHERE user_id = ? AND revision = ?')
    .bind(stateText, nextRevision, now, user.id, baseRevision).run();
  if (!result.meta || !result.meta.changes) {
    const raced = await env.DB.prepare('SELECT state, revision, updated_at FROM sync_state WHERE user_id = ?').bind(user.id).first();
    return conflictResponse(raced, headers);
  }
  return json({ revision: nextRevision, updatedAt: now }, 200, headers);
}

async function logout(request, env, headers) {
  const header = request.headers.get('Authorization') || '';
  const match = header.match(/^Bearer\s+([A-Za-z0-9_-]+)$/);
  if (match) {
    const tokenHash = await sha256(match[1]);
    await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(tokenHash).run();
  }
  return json({ ok: true }, 200, headers);
}

async function removeAccount(request, env, headers) {
  const user = await sessionFromRequest(request, env);
  if (!user) return json({ error: 'Session expirée.' }, 401, headers);
  await env.DB.batch([
    env.DB.prepare('DELETE FROM sessions WHERE user_id = ?').bind(user.id),
    env.DB.prepare('DELETE FROM sync_state WHERE user_id = ?').bind(user.id),
    env.DB.prepare('DELETE FROM users WHERE id = ?').bind(user.id)
  ]);
  return json({ ok: true }, 200, headers);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin');
    const headers = corsHeaders(origin);
    if (!originAllowed(request)) return json({ error: 'Origine non autorisée.' }, 403, headers);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: headers });
    const url = new URL(request.url);
    if (url.pathname === '/api/health') return json({ ok: true }, 200, headers);
    if (!url.pathname.startsWith('/api/')) return json({ error: 'Route inconnue.' }, 404, headers);
    try {
      await ensureSchema(env);
      if (url.pathname === '/api/register' && request.method === 'POST') return await register(request, env, headers);
      if (url.pathname === '/api/login' && request.method === 'POST') return await login(request, env, headers);
      if (url.pathname === '/api/logout' && request.method === 'POST') return await logout(request, env, headers);
      if (url.pathname === '/api/me' && request.method === 'GET') {
        const user = await sessionFromRequest(request, env);
        if (!user) return json({ error: 'Session expirée.' }, 401, headers);
        const meta = await stateMeta(env, user.id);
        return json({ user: { email: user.email }, revision: meta.revision, updatedAt: meta.updatedAt }, 200, headers);
      }
      if (url.pathname === '/api/state' && request.method === 'GET') return await getState(request, env, headers);
      if (url.pathname === '/api/state' && request.method === 'PUT') return await putState(request, env, headers);
      if (url.pathname === '/api/account' && request.method === 'DELETE') return await removeAccount(request, env, headers);
      return json({ error: 'Route inconnue.' }, 404, headers);
    } catch (err) {
      return json({ error: 'Le service de synchronisation est momentanément indisponible.' }, 500, headers);
    }
  }
};
