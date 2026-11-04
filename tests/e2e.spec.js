const { test, expect } = require('@playwright/test');
test.beforeEach(async ({ page }) => {
await page.goto('/');
await page.evaluate(() => localStorage.clear());
await page.reload();
});
async function baseText(locator) {
return locator.evaluate((el) => {
const clone = el.cloneNode(true);
clone.querySelectorAll('rt').forEach((node) => node.remove());
return clone.textContent.replace(/\s+/g, ' ').trim();
});
}

const SYNC_API_RE = /^https:\/\/site-8663ef28787c4307a825b86f37a2dc1c\.freebuff\.page\/api\//;

function createSyncMock() {
  const users = new Map();
  const tokens = new Map();
  let sequence = 0;
  const headers = {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'access-control-allow-headers': 'content-type, authorization'
  };
  async function reply(route, status, body) {
    await route.fulfill({ status, headers, contentType: 'application/json', body: JSON.stringify(body) });
  }
  function newToken(user) {
    const token = 'e2e-token-' + (++sequence);
    tokens.set(token, user);
    return token;
  }
  function authenticated(route) {
    const value = route.request().headers().authorization || '';
    return tokens.get(value.replace(/^Bearer\s+/i, '')) || null;
  }
  async function install(context) {
    await context.route(SYNC_API_RE, async function (route) {
      const request = route.request();
      const method = request.method();
      if (method === 'OPTIONS') { await route.fulfill({ status: 204, headers }); return; }
      const path = new URL(request.url()).pathname;
      let data = {};
      try { data = request.postDataJSON() || {}; } catch (e) { data = {}; }
      if (path === '/api/register' && method === 'POST') {
        const email = String(data.email || '').trim().toLowerCase();
        if (!email || !data.password) { await reply(route, 400, { error: 'E-mail et mot de passe requis.' }); return; }
        if (users.has(email)) { await reply(route, 409, { error: 'Un compte existe déjà avec cet e-mail.' }); return; }
        const user = { email: email, password: String(data.password), state: null, revision: 0 };
        users.set(email, user);
        const token = newToken(user);
        await reply(route, 200, { token: token, user: { email: email }, revision: 0 });
        return;
      }
      if (path === '/api/login' && method === 'POST') {
        const email = String(data.email || '').trim().toLowerCase();
        const user = users.get(email);
        if (!user || user.password !== String(data.password)) { await reply(route, 401, { error: 'E-mail ou mot de passe incorrect.' }); return; }
        await reply(route, 200, { token: newToken(user), user: { email: email }, revision: user.revision });
        return;
      }
      const user = authenticated(route);
      if (!user) { await reply(route, 401, { error: 'Session expirée.' }); return; }
      if (path === '/api/me' && method === 'GET') {
        await reply(route, 200, { user: { email: user.email }, revision: user.revision });
        return;
      }
      if (path === '/api/state' && method === 'GET') {
        await reply(route, 200, { state: user.state, revision: user.revision });
        return;
      }
      if (path === '/api/state' && method === 'PUT') {
        if (Number(data.baseRevision) !== user.revision) {
          await reply(route, 409, { error: 'Conflit de révision.', state: user.state, revision: user.revision });
          return;
        }
        user.state = data.state;
        user.revision++;
        await reply(route, 200, { revision: user.revision });
        return;
      }
      if (path === '/api/logout' && method === 'POST') {
        tokens.delete((request.headers().authorization || '').replace(/^Bearer\s+/i, ''));
        await reply(route, 200, {});
        return;
      }
      if (path === '/api/account' && method === 'DELETE') {
        tokens.delete((request.headers().authorization || '').replace(/^Bearer\s+/i, ''));
        users.delete(user.email);
        await reply(route, 200, {});
        return;
      }
      await reply(route, 404, { error: 'Route inconnue.' });
    });
  }
  return {
    install: install,
    snapshot: function (email) { return users.get(String(email).trim().toLowerCase()) || null; }
  };
}

test('accueil, carte français puis japonais et contexte', async ({ page }) => {
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
await expect(page.getByTestId('cta-main')).toBeVisible();
await page.getByTestId('cta-main').click();
await expect(page.getByTestId('reveal')).toBeVisible();
await expect(page.getByTestId('session-card')).toContainText('bonjour');
await expect(page.getByTestId('answer-jp')).toHaveCount(0);
await page.getByTestId('reveal').click();
expect(await baseText(page.getByTestId('answer-jp'))).toContain('こんにちは');
await expect(page.getByTestId('answer-romaji')).toContainText('konnichiwa');
await expect(page.getByTestId('grade-again')).toContainText('Je ne connaissais pas ce mot');
await expect(page.getByTestId('grade-good')).toContainText('Passer au suivant');
const answerLayout = await page.evaluate(() => {
const head = document.querySelector('.answer-head').getBoundingClientRect();
const context = document.querySelector('.context-card').getBoundingClientRect();
const fr = parseFloat(getComputedStyle(document.querySelector('.answer-head .fr-small')).fontSize);
const jp = parseFloat(getComputedStyle(document.querySelector('[data-testid="answer-jp"]')).fontSize);
return { contextRight: context.left >= head.left, fr, jp };
});
expect(answerLayout.contextRight).toBe(true);
expect(answerLayout.fr).toBeGreaterThan(30);
expect(Math.abs(answerLayout.fr - answerLayout.jp)).toBeLessThan(2);
expect(await baseText(page.getByTestId('answer-context'))).toContain('こんにちは');
await expect(page.locator('.context-pronunciation')).toHaveCount(0);
expect(await page.locator('[data-testid="answer-jp"] rt').count()).toBeGreaterThan(0);
expect(await page.locator('[data-testid="answer-context"] rt').count()).toBeGreaterThan(0);
await expect(page.locator('[data-testid="answer-context"] .rt-romaji').first()).toHaveText('ko');
const contextReadings = await page.locator('[data-testid="answer-context"] .rt-romaji').allTextContents();
expect(contextReadings).toContain('genki');
await expect(page.locator('[data-testid="answer-context"] .rt-kana')).toHaveCount(0);
await page.getByTestId('grade-good').click();
await expect(page.getByTestId('feedback')).toHaveCount(0);
await expect(page.getByTestId('session-card')).toBeVisible();
await expect(page.getByTestId('reveal')).toBeVisible();
expect(errors).toEqual([]);
});
test('la réponse lance automatiquement le mot puis le contexte', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    class FakeUtterance {
      constructor(text) { this.text = text; }
    }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: FakeUtterance });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      cancel() {},
      getVoices() { return []; },
      speak(utterance) { window.__spoken.push(utterance.text); }
    } });
  });
  await page.reload();
  await page.getByTestId('cta-main').click();
  await page.getByTestId('reveal').click();
  await expect.poll(() => page.evaluate(() => window.__spoken)).toEqual(['こんにちは', 'こんにちは、元気ですか。']);
});

test('formes polies : conjugaison, exemples et lecture du verbe dans la phrase', async ({ page }) => {
  await page.goto('/#mots');
  await page.getByTestId('search').fill('働きます');
  await page.locator('.word-row').first().click();
  await expect(page.getByTestId('polite-forms')).toContainText('Négatif');
  await expect(page.getByTestId('polite-forms')).toContainText('hatarakimasen');
  await expect(page.getByTestId('examples')).toContainText('week-end');
  await expect(page.locator('.detail-context > p.jp .rt-romaji').filter({ hasText: 'hatara' })).toHaveCount(1);
});

test('le micro rend la correction explicite et relit la réponse', async ({ page }) => {
  await page.addInitScript(() => {
    window.__spoken = [];
    class FakeUtterance { constructor(text) { this.text = text; } }
    Object.defineProperty(window, 'SpeechSynthesisUtterance', { configurable: true, value: FakeUtterance });
    Object.defineProperty(window, 'speechSynthesis', { configurable: true, value: {
      paused: false,
      cancel() {},
      resume() {},
      getVoices() { return []; },
      speak(utterance) { window.__spoken.push(utterance.text); }
    } });
    class FakeRecognition {
      constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
      start() {
        const result = [{ transcript: 'おはよう' }];
        result.isFinal = true;
        const results = [result];
        setTimeout(() => {
          if (this.onresult) this.onresult({ results });
          if (this.onend) this.onend();
        }, 30);
      }
      stop() {}
      abort() {}
    }
    window.SpeechRecognition = FakeRecognition;
    window.webkitSpeechRecognition = FakeRecognition;
  });
  await page.reload();
  await page.getByTestId('cta-main').click();
  await page.getByTestId('pronounce-front-start').click();
  await expect(page.getByTestId('answer-verdict')).toContainText('Ce n’est pas correct');
  await expect(page.getByTestId('inline-pronunciation')).toContainText('Tu t’es trompé');
  await expect(page.locator('[data-testid="answer-context"] .rt-romaji').first()).toHaveText('ko');
  const contextReadings = await page.locator('[data-testid="answer-context"] .rt-romaji').allTextContents();
  expect(contextReadings).toContain('genki');
  await expect(page.getByTestId('answer-romaji')).toContainText('konnichiwa');
  await expect(page.getByTestId('answer-verdict')).toHaveClass(/bad/);
  await expect.poll(() => page.evaluate(() => window.__spoken)).toEqual(['こんにちは', 'こんにちは、元気ですか。']);
});
test('la progression et l XP sont conservés après rechargement', async ({ page }) => {
await page.getByTestId('cta-main').click();
await page.getByTestId('reveal').click();
await page.getByTestId('grade-good').click();
await expect(page.getByTestId('reveal')).toBeVisible();
await page.reload();
await expect(page.locator('#xpVal')).toHaveText('10');
});
test('import bonjour | kon-ni-chi-wa avec contexte', async ({ page }) => {
await page.goto('/#importer');
await page.getByTestId('import-textarea').fill('bonjour | kon-ni-chi-wa');
await page.getByTestId('preview-import').click();
const preview = page.getByTestId('import-preview');
await expect(preview).toContainText('こんにちは');
await expect(preview).toContainText('bonjour');
await expect(preview).toContainText('こんにちは、花さん！');
await page.getByTestId('do-import').click();
await expect(page.locator('#view-library')).toBeVisible();
await page.locator('.chip[data-filter="imported"]').click();
expect(await baseText(page.locator('#libraryList'))).toContain('こんにちは');
await expect(page.locator('#libraryList')).toContainText('bonjour');
await page.locator('.word-row').click();
await expect(page.locator('.modal-panel')).toContainText('bonjour');
expect(await baseText(page.locator('.modal-panel'))).toContain('こんにちは');
expect(await baseText(page.locator('.modal-panel'))).toContain('こんにちは、花さん！');
});
test('réglages : objectif et thème sombre persistants', async ({ page }) => {
await page.locator('#settingsBtn').click();
await page.locator('[data-action="set-goal"][data-goal="100"]').click();
await page.locator('[data-setting="theme"]').selectOption('dark');
await page.reload();
await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
await page.locator('#settingsBtn').click();
await expect(page.locator('[data-action="set-goal"][data-goal="100"]')).toHaveClass(/active/);
});
test('mobile : navigation visible et pas de débordement horizontal', async ({ page }) => {
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('/');
await expect(page.locator('.bottom-nav')).toBeVisible();
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
expect(overflow).toBeLessThanOrEqual(1);
});
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
await expect(page.getByTestId('reveal')).toBeVisible();
await page.reload();
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
await expect(page.locator('#view-grammar .grammar-jp rt').first()).toBeAttached();
expect(await baseText(page.locator('#view-grammar .grammar-jp').first())).toContain('私は水を飲みます。');
});
test('plus de 1000 mots et aller en forme polie', async ({ page }) => {
const info = await page.evaluate(() => ({
units: window.UNITS_DATA.length,
words: window.UNITS_DATA.reduce((n, u) => n + ((u.words && u.words.length) || 0), 0),
malformed: window.UNITS_DATA.some((u) => (u.words || []).some((w) => !Array.isArray(w) && !(w && w.jp && w.fr && w.reading && w.context && w.contextFr))),
ikimasu: window.UNITS_DATA.some((u) => (u.words || []).some((w) => w[0] === '行きます' && w[2] === 'ikimasu'))
}));
expect(info.words).toBeGreaterThanOrEqual(1000);
expect(info.malformed).toBe(false);
expect(info.ikimasu).toBe(true);
});
test('série quotidienne, défi du jour et récompense', async ({ page }) => {
await expect(page.getByTestId('streak-panel')).toContainText('0 jour');
await page.getByTestId('daily-challenge').click();
for (let i = 0; i < 3; i++) {
await expect(page.getByTestId('reveal')).toBeVisible();
await page.getByTestId('reveal').click();
await page.getByTestId('grade-good').click();
}
await expect(page.getByTestId('summary')).toBeVisible();
await expect(page.getByTestId('daily-bonus')).toContainText('+20 XP');
await page.getByTestId('finish-session').click();
await expect(page.getByTestId('streak-panel')).toContainText('1 jour');
await expect(page.getByTestId('daily-done')).toBeVisible();
});
test('prononciation : carte dédiée et lecture du mot', async ({ page }) => {
await page.evaluate(() => {
class AutoRecognition {
constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
start() {}
stop() {}
abort() {}
}
window.SpeechRecognition = AutoRecognition;
window.webkitSpeechRecognition = AutoRecognition;
});
await page.locator('.desktop-nav [data-nav=library]').click();
await page.locator('.word-row').first().click();
await expect(page.locator('.modal-panel')).toContainText('Prononcer');
await page.locator('[data-action=pronounce-one]').click();
await expect(page.getByTestId('pronounce-card')).toBeVisible();
await expect(page.getByTestId('pronounce-start')).toBeVisible();
await page.getByTestId('pronounce-start').click();
await expect(page.getByTestId('pronounce-status')).toContainText('J’écoute');
expect(await page.locator('[data-testid="pronounce-word"] rt').count()).toBeGreaterThan(0);
});
test('prononciation : phrase entière, score IA et historique', async ({ page }) => {
await page.addInitScript(() => {
class FakeRecognition {
constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
start() {
const self = this;
setTimeout(function () {
const alternative = { transcript: 'みずをのみます' };
const result = [alternative];
result.isFinal = true;
if (self.onresult) self.onresult({ results: [result] });
}, 20);
}
stop() {}
abort() {}
}
window.SpeechRecognition = FakeRecognition;
window.webkitSpeechRecognition = FakeRecognition;
});
await page.goto('/#importer');
await page.reload();
await page.getByTestId('import-textarea').fill('hydratation | 水分 | suibun | 水を飲みます。 | Je bois de l’eau.');
await page.getByTestId('preview-import').click();
await page.getByTestId('do-import').click();
await page.locator('.chip[data-filter="imported"]').click();
await page.locator('.word-row').first().click();
await page.locator('[data-action=pronounce-one]').click();
await expect(page.getByTestId('pronounce-card')).toBeVisible();
await expect(page.getByTestId('pronounce-engine-whisper')).toBeVisible();
await page.getByTestId('pronounce-engine-whisper').click();
await expect(page.locator('[data-testid="pronounce-card"]')).toContainText('Whisper');
await page.getByTestId('pronounce-engine-browser').click();
await page.getByTestId('pronounce-target-phrase').click();
await expect(page.getByTestId('pronounce-phrase')).toBeVisible();
expect(await page.locator('[data-testid="pronounce-phrase"] rt').count()).toBeGreaterThan(0);
await page.getByTestId('pronounce-start').click();
await expect(page.getByTestId('pronounce-result')).toContainText('100 %');
await expect(page.getByTestId('pronounce-result')).toContainText('phrase');
await expect(page.getByTestId('pronounce-expected')).toContainText('みずおのみます');
await expect(page.getByTestId('pronounce-tip')).toBeVisible();
await page.getByTestId('pronounce-finish').click();
await expect(page.getByTestId('feedback')).toBeVisible();
await page.getByTestId('session-next').click();
await expect(page.getByTestId('summary')).toBeVisible();
await page.getByTestId('finish-session').click();
await page.locator('.desktop-nav [data-nav=library]').click();
await page.locator('.word-row').first().click();
await expect(page.getByTestId('pronunciation-history')).toContainText('100 %');
await expect(page.getByTestId('pronunciation-history')).toContainText('Phrase');
await page.keyboard.press('Escape');
await page.locator('.desktop-nav [data-nav=learn]').click();
await expect(page.getByTestId('pronunciation-progress')).toBeVisible();
await expect(page.getByTestId('pronunciation-average')).toContainText('100 %');
});

test('prononciation : écart syllabique et conseil', async ({ page }) => {
await page.addInitScript(() => {
class FakeRecognition {
constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
start() {
const self = this;
setTimeout(function () {
const alternative = { transcript: 'みずをのみす' };
const result = [alternative];
result.isFinal = true;
if (self.onresult) self.onresult({ results: [result] });
}, 20);
}
stop() {}
abort() {}
}
window.SpeechRecognition = FakeRecognition;
window.webkitSpeechRecognition = FakeRecognition;
});
await page.goto('/#importer');
await page.reload();
await page.getByTestId('import-textarea').fill('hydratation | 水分 | suibun | 水を飲みます。 | Je bois de l’eau.');
await page.getByTestId('preview-import').click();
await page.getByTestId('do-import').click();
await page.locator('.chip[data-filter="imported"]').click();
await page.locator('.word-row').first().click();
await page.locator('[data-action=pronounce-one]').click();
await page.getByTestId('pronounce-target-phrase').click();
await page.getByTestId('pronounce-start').click();
await expect(page.getByTestId('pronounce-diff')).toBeVisible();
await expect(page.getByTestId('pronounce-tip')).toBeVisible();
await expect(page.getByTestId('pronounce-score')).toContainText('%');
});

test('prononciation : une écoute sans résultat propose de réessayer', async ({ page }) => {
await page.addInitScript(() => {
class SilentRecognition {
constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
start() { const self = this; setTimeout(function () { if (self.onend) self.onend(); }, 30); }
stop() {}
abort() {}
}
window.SpeechRecognition = SilentRecognition;
window.webkitSpeechRecognition = SilentRecognition;
});
await page.reload();
await page.locator('.desktop-nav [data-nav=library]').click();
await page.locator('.word-row').first().click();
await page.locator('[data-action=pronounce-one]').click();
await page.getByTestId('pronounce-start').click();
await expect(page.getByTestId('pronounce-status')).toContainText('rien entendu');
});

test('prononciation : réécoute de ma voix avec le moteur IA', async ({ page }) => {
await page.goto('/#importer');
await page.getByTestId('import-textarea').fill('hydratation | 水分 | suibun | 水を飲みます。 | Je bois de l’eau.');
await page.getByTestId('preview-import').click();
await page.getByTestId('do-import').click();
await page.evaluate(() => {
window.__pronunciationPlayed = false;
class SilentAuto {
constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
start() {}
stop() {}
abort() {}
}
window.SpeechRecognition = SilentAuto;
window.webkitSpeechRecognition = SilentAuto;
window.Kotoba.Whisper = {
supported: function () { return true; },
hasRecording: function () { return true; },
play: function () { window.__pronunciationPlayed = true; return Promise.resolve(); },
listen: function () { return Promise.resolve('みずをのみます'); },
stop: function () {},
abort: function () {}
};
});
await page.locator('.chip[data-filter="imported"]').click();
await page.locator('.word-row').first().click();
await page.locator('[data-action=pronounce-one]').click();
await page.getByTestId('pronounce-engine-whisper').click();
await page.getByTestId('pronounce-target-phrase').click();
await page.getByTestId('pronounce-start').click();
await expect(page.getByTestId('pronounce-result')).toContainText('100 %');
await expect(page.getByTestId('pronounce-play')).toBeVisible();
await page.getByTestId('pronounce-play').click();
expect(await page.evaluate(() => window.__pronunciationPlayed)).toBe(true);
});

test('parcours : onglets et filtre des étapes', async ({ page }) => {
  await expect(page.getByTestId('journey-panel')).toBeVisible();
  await expect(page.getByTestId('journey-new')).toContainText('Nouveaux');
  await page.getByTestId('journey-new').click();
  await expect(page.locator('#view-library')).toBeVisible();
  await expect(page.locator('.chip[data-filter="new"]')).toHaveClass(/active/);
  await expect(page.locator('.chip[data-filter="validated"]')).toBeVisible();
  await expect(page.locator('.chip[data-filter="ultimate"]')).toBeVisible();
});

test('entraînement actif : production écrite accepte le romaji', async ({ page }) => {
  await page.goto('/#reviser');
  await page.getByTestId('review-production').click();
  await expect(page.getByTestId('production-card')).toBeVisible();
  await page.getByTestId('production-input').fill('konnichiwa');
  await page.getByTestId('production-submit').click();
  await expect(page.getByTestId('feedback')).toContainText('Bonne réponse');
});

test('entraînement actif : compréhension japonais vers français', async ({ page }) => {
  await page.goto('/#reviser');
  await page.getByTestId('review-comprehension').click();
  expect(await baseText(page.getByTestId('comprehension-prompt'))).toContain('こんにちは');
  await page.locator('.option.fr').filter({ hasText: 'bonjour (après-midi)' }).click();
  await expect(page.getByTestId('feedback')).toContainText('Bonne réponse');
});

test('révision : le micro valide puis révèle la fiche', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeRecognition {
      constructor() {
        this.lang = '';
        this.interimResults = false;
        this.continuous = false;
        this.maxAlternatives = 1;
      }
      start() {
        const result = [{ transcript: 'こんにちは' }];
        result.isFinal = true;
        const results = [result];
        setTimeout(() => {
          if (this.onresult) this.onresult({ results });
          if (this.onend) this.onend();
        }, 30);
      }
      stop() {}
      abort() {}
    }
    window.SpeechRecognition = FakeRecognition;
    window.webkitSpeechRecognition = FakeRecognition;
  });
  await page.reload();
  await page.getByTestId('cta-main').click();
  await expect(page.getByTestId('pronounce-front-start')).toBeVisible();
  await page.getByTestId('pronounce-front-start').click();
  await expect(page.getByTestId('inline-pronunciation')).toBeVisible();
  await expect(page.getByTestId('inline-pronunciation-score')).toContainText('100');
  await expect(page.getByTestId('session-card')).toHaveClass(/glow-good/);
  await expect(page.getByTestId('answer-jp')).toBeVisible();
  await expect(page.getByRole('button', { name: /Modèle/ })).toHaveCount(0);
  const inlineLayout = await page.evaluate(() => {
    const card = document.querySelector('.answer-card').getBoundingClientRect();
    const context = document.querySelector('.context-card').getBoundingClientRect();
    const inline = document.querySelector('[data-testid="inline-pronunciation"]').getBoundingClientRect();
    return {
      below: inline.top >= context.bottom,
      centered: Math.abs((inline.left + inline.width / 2) - (card.left + card.width / 2)) < 4
    };
  });
  expect(inlineLayout.below).toBe(true);
  expect(inlineLayout.centered).toBe(true);
  await page.getByTestId('grade-good').click();
  await expect(page.getByTestId('feedback')).toHaveCount(0);
  await expect(page.getByTestId('reveal')).toBeVisible();
});

test('révision : une mauvaise prononciation est enregistrée', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeRecognition {
      constructor() {
        this.lang = '';
        this.interimResults = false;
        this.continuous = false;
        this.maxAlternatives = 1;
      }
      start() {
        const result = [{ transcript: 'おはよう' }];
        result.isFinal = true;
        const results = [result];
        setTimeout(() => {
          if (this.onresult) this.onresult({ results });
          if (this.onend) this.onend();
        }, 30);
      }
      stop() {}
      abort() {}
    }
    window.SpeechRecognition = FakeRecognition;
    window.webkitSpeechRecognition = FakeRecognition;
  });
  await page.reload();
  await page.getByTestId('cta-main').click();
  await page.getByTestId('pronounce-front-start').click();
  await expect(page.getByTestId('inline-pronunciation')).toContainText('Tu t’es trompé');
  await expect(page.getByTestId('answer-verdict')).toContainText('Ce n’est pas correct');
  await expect(page.getByTestId('session-card')).toHaveClass(/glow-bad/);
  await page.locator('[data-action="quit-session"]').click();
  await page.locator('.desktop-nav [data-nav=library]').click();
  await page.locator('.chip[data-filter="bad"]').click();
  await expect(page.locator('#libraryList')).toContainText('bonjour');
});

test('la carte et la fiche précisent les variantes de au revoir', async ({ page }) => {
  await page.locator('.desktop-nav [data-nav=library]').click();
  await page.getByTestId('search').fill('au revoir');
  await page.locator('#libraryList .word-row').first().click();
  await expect(page.getByTestId('detail-nuance')).toContainText('Formel');
  await expect(page.getByTestId('detail-nuance')).toContainText('さようなら');
  await expect(page.getByTestId('detail-nuance')).toContainText('じゃあね');
  await page.locator('[data-action="review-one"]').click();
  await expect(page.getByTestId('prompt-register')).toHaveText('Version formelle');
  await expect(page.getByTestId('prompt-register')).not.toContainText('さようなら');
  await expect(page.getByTestId('prompt-register')).not.toContainText('sayonara');
});

test('un contexte sans kanji affiche sa prononciation au-dessus', async ({ page }) => {
  await page.locator('.desktop-nav [data-nav=library]').click();
  await page.getByTestId('search').fill('oui');
  await page.getByRole('button', { name: /^oui\b/ }).click();
  await page.locator('[data-action="review-one"]').click();
  await page.getByTestId('reveal').click();
  const readings = await page.locator('[data-testid="answer-context"] rt').allTextContents();
  expect(readings).toEqual(['ha', 'i', 'so', 'u', 'de', 'su']);
});

test('« s’il vous plaît » accepte ください et affiche les lectures latines', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeRecognition {
      constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
      start() {
        const result = [{ transcript: '下さい' }];
        result.isFinal = true;
        const results = [result];
        setTimeout(() => {
          if (this.onresult) this.onresult({ results });
          if (this.onend) this.onend();
        }, 30);
      }
      stop() {}
      abort() {}
    }
    window.SpeechRecognition = FakeRecognition;
    window.webkitSpeechRecognition = FakeRecognition;
  });
  await page.reload();
  await page.locator('.desktop-nav [data-nav=library]').click();
  await page.getByTestId('search').fill("s'il vous plait");
  await expect(page.locator('#libraryList .word-row')).toHaveCount(1);
  await expect(page.locator('#libraryList .word-row')).toContainText("s'il vous plaît");
  await page.getByTestId('search').fill('kudasai');
  await expect(page.locator('#libraryList .word-row')).toHaveCount(1);
  await page.getByTestId('search').fill('onegai');
  await page.locator('#libraryList .word-row').first().click();
  await page.locator('[data-action="review-one"]').click();
  await page.getByTestId('pronounce-front-start').click();
  await expect(page.getByTestId('answer-verdict')).toContainText('C’est correct');
  await expect(page.getByTestId('inline-variant')).toContainText('Autre formulation acceptée');
  await expect(page.getByTestId('inline-variant')).toContainText('ください');
  await expect(page.getByTestId('answer-also')).toContainText('kudasai');
  await expect(page.getByTestId('answer-also')).toContainText('Plus directe');
  await expect(page.getByTestId('answer-also')).toContainText('コーヒーをください。');
  await expect(page.getByTestId('answer-context-note')).toContainText('Au café');
  await expect(page.getByTestId('answer-context-note')).toContainText('plus directe');
  await expect(page.locator('[data-testid="answer-jp"] .rt-romaji').first()).toHaveText('o');
  await expect(page.locator('[data-testid="answer-jp"] .rt-romaji')).toHaveCount(6);
  await expect(page.locator('[data-testid="answer-jp"] .rt-kana')).toHaveCount(0);
  await expect(page.getByTestId('answer-romaji')).toHaveText('onegai shimasu');
  await expect(page.locator('[data-testid="answer-context"] .rt-romaji').first()).toHaveText('koo');
  const contextReadings = await page.locator('[data-testid="answer-context"] .rt-romaji').allTextContents();
  expect(contextReadings).toContain('nega');
  expect(contextReadings).toContain('shi');
  await expect(page.locator('[data-testid="answer-context"] .rt-kana')).toHaveCount(0);
  await expect(page.getByTestId('accepted-alternative')).toContainText('ください');
  await expect(page.getByTestId('accepted-alternative')).toContainText('plus directe');
});


test('atelier de phrases : exercice, révélation et enchaînement', async ({ page }) => {
  await expect(page.getByTestId('phrase-panel')).toBeVisible();
  await page.getByTestId('start-phrase').click();
  await expect(page.getByTestId('phrase-card')).toBeVisible();
  await expect(page.getByTestId('phrase-reveal')).toBeVisible();
  await page.getByTestId('phrase-reveal').click();
  await expect(page.getByTestId('phrase-result')).toBeVisible();
  await expect(page.getByTestId('phrase-full')).toBeVisible();
  await page.getByTestId('phrase-next').click();
  await expect(page.getByTestId('phrase-card')).toBeVisible();
});

test('conversation : répond et accepte le romaji dans une situation réelle', async ({ page }) => {
  await page.goto('/#parler');
  await expect(page.getByTestId('conversation-list')).toBeVisible();
  await page.getByTestId('conversation-scenario-meet').click();
  await expect(page.getByTestId('conversation-session')).toBeVisible();
  await expect(page.getByTestId('conversation-partner')).toContainText('お名前は何ですか');
  await page.getByTestId('conversation-answer').fill('私はレアです。');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Bonne réponse');
  await page.getByTestId('conversation-next').click();
  await expect(page.getByTestId('conversation-partner')).toContainText('お国はどちらですか');
  await page.getByTestId('conversation-answer').fill('furansu kara kimashita');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Bonne réponse');
  await page.getByTestId('conversation-next').click();
  await expect(page.getByTestId('conversation-partner')).toContainText('どのくらい勉強していますか');
  await page.getByTestId('conversation-answer').fill('六ヶ月勉強しています。');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Bonne réponse');
  await page.getByTestId('conversation-next').click();
  await expect(page.getByTestId('conversation-summary')).toContainText('3/3');
});

test('conversation : se débrouiller au konbini', async ({ page }) => {
  await page.goto('/#parler');
  await page.getByTestId('conversation-scenario-konbini').click();
  await expect(page.getByTestId('conversation-partner')).toContainText('袋はご利用ですか');
  await page.getByTestId('conversation-answer').fill('いいえ、大丈夫です。');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Bonne réponse');
  await page.getByTestId('conversation-next').click();
  await page.getByTestId('conversation-answer').fill('カードでお願いします。');
  await page.getByTestId('conversation-submit').click();
  await page.getByTestId('conversation-next').click();
  await page.getByTestId('conversation-answer').fill('はい、お願いします。');
  await page.getByTestId('conversation-submit').click();
  await page.getByTestId('conversation-next').click();
  await expect(page.getByTestId('conversation-summary')).toContainText('3/3');
});

test('conversation : rejoue uniquement les répliques ratées', async ({ page }) => {
  await page.goto('/#parler');
  await page.getByTestId('conversation-scenario-meet').click();
  await page.getByTestId('conversation-answer').fill('さようなら。');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Presque');
  await page.getByTestId('conversation-next').click();
  await page.getByTestId('conversation-answer').fill('フランスから来ました。');
  await page.getByTestId('conversation-submit').click();
  await page.getByTestId('conversation-next').click();
  await page.getByTestId('conversation-answer').fill('六ヶ月勉強しています。');
  await page.getByTestId('conversation-submit').click();
  await page.getByTestId('conversation-next').click();
  await expect(page.getByTestId('conversation-summary')).toContainText('2/3');
  await expect(page.getByTestId('conversation-summary')).toContainText('À revoir');
  const retryMissed = page.getByTestId('conversation-retry-missed');
  await expect(retryMissed).toContainText('Rejouer la réplique ratée');
  await retryMissed.click();
  await expect(page.getByTestId('conversation-review-note')).toContainText('uniquement les répliques');
  await expect(page.getByTestId('conversation-partner')).toContainText('お名前は何ですか');
  await expect(page.getByTestId('conversation-session')).toContainText('1/1');
  await page.getByTestId('conversation-answer').fill('私はレアです。');
  await page.getByTestId('conversation-submit').click();
  await page.getByTestId('conversation-next').click();
  await expect(page.getByTestId('conversation-summary')).toContainText('1/1');
  await expect(page.getByTestId('conversation-summary')).toContainText('Toutes les répliques ciblées sont justes');
  await expect(page.getByTestId('conversation-retry-missed')).toHaveCount(0);
});

test('conversation : les répliques ratées persistent après rechargement', async ({ page }) => {
  await page.goto('/#parler');
  await page.getByTestId('conversation-scenario-cafe').click();
  await page.getByTestId('conversation-answer').fill('さようなら。');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Presque');
  await page.getByTestId('conversation-close').click();
  await expect(page.getByTestId('conversation-review-panel')).toBeVisible();
  await expect(page.getByTestId('conversation-review-cafe')).toContainText('1 réplique');
  await page.reload();
  await expect(page.getByTestId('conversation-review-panel')).toBeVisible();
  await expect(page.getByTestId('conversation-review-panel')).toContainText('Commander au café');
  await page.getByTestId('conversation-review-start-cafe').click();
  await expect(page.getByTestId('conversation-review-note')).toContainText('uniquement les répliques');
  await expect(page.getByTestId('conversation-partner')).toContainText('ご注文は何ですか');
  await page.getByTestId('conversation-answer').fill('ホットコーヒーをください。');
  await page.getByTestId('conversation-submit').click();
  await page.getByTestId('conversation-next').click();
  await page.getByTestId('conversation-other').click();
  await expect(page.getByTestId('conversation-review-panel')).toHaveCount(0);
});

test('conversation : le mode écoute masque le texte avant la réponse', async ({ page }) => {
  await page.goto('/#parler');
  await page.getByTestId('conversation-scenario-cafe').click();
  await page.getByTestId('conversation-listen').click();
  await expect(page.getByTestId('conversation-listen')).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByTestId('conversation-reveal')).toBeVisible();
  await expect(page.getByTestId('conversation-partner')).not.toContainText('ご注文は何ですか');
  await page.getByTestId('conversation-reveal').click();
  await expect(page.getByTestId('conversation-partner')).toContainText('ご注文は何ですか');
});

test('conversation : lance une situation surprise', async ({ page }) => {
  await page.goto('/#parler');
  await page.getByTestId('conversation-random').click();
  await expect(page.getByTestId('conversation-session')).toBeVisible();
  await expect(page.getByTestId('conversation-partner')).toBeVisible();
});

test('conversation : répondre à l’oral remplit la réponse japonaise', async ({ page }) => {
  await page.addInitScript(() => {
    class FakeRecognition {
      constructor() { this.lang = ''; this.interimResults = false; this.continuous = false; this.maxAlternatives = 1; }
      start() {
        const result = [{ transcript: '私はレアです。' }];
        result.isFinal = true;
        const results = [result];
        setTimeout(() => {
          if (this.onresult) this.onresult({ results });
          if (this.onend) this.onend();
        }, 30);
      }
      stop() {}
      abort() {}
    }
    window.SpeechRecognition = FakeRecognition;
    window.webkitSpeechRecognition = FakeRecognition;
  });
  await page.goto('/#parler');
  await page.reload();
  await page.getByTestId('conversation-scenario-meet').click();
  await page.getByTestId('conversation-voice').click();
  await expect(page.getByTestId('conversation-answer')).toHaveValue('私はレアです。');
  await expect(page.getByTestId('conversation-voice-status')).toContainText('Transcription reçue');
  await page.getByTestId('conversation-submit').click();
  await expect(page.getByTestId('conversation-feedback')).toContainText('Bonne réponse');
  await expect(page.getByTestId('conversation-pronunciation')).toBeVisible();
  await expect(page.getByTestId('conversation-pronunciation-score')).toContainText('100');
});

test('session du jour : lance un parcours guidé', async ({ page }) => {
  await expect(page.getByTestId('today-panel')).toBeVisible();
  await page.getByTestId('start-today').click();
  await expect(page.locator('#session')).toBeVisible();
  await expect(page.locator('#session [role="progressbar"]')).toBeVisible();
  await expect(page.locator('#session [role="progressbar"]')).toHaveAttribute('aria-valuenow', '0');
});

test('synchronisation : deux appareils fusionnent leurs progressions', async ({ browser }) => {
  test.setTimeout(60000);
  const email = 'e2e-sync@example.com';
  const password = 'motdepasse-e2e';
  const api = createSyncMock();
  const contextA = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', serviceWorkers: 'block', viewport: { width: 1280, height: 900 } });
  const contextB = await browser.newContext({ baseURL: 'http://127.0.0.1:4173', serviceWorkers: 'block', viewport: { width: 1280, height: 900 } });
  await api.install(contextA);
  await api.install(contextB);
  const a = await contextA.newPage();
  const b = await contextB.newPage();

  await a.goto('/#importer');
  await a.getByTestId('import-textarea').fill('navet de test | かぶ | kabu | かぶを食べます。 | Je mange un navet.');
  await a.getByTestId('preview-import').click();
  await a.getByTestId('do-import').click();
  await expect(a.locator('#view-library')).toBeVisible();
  const importedId = await a.evaluate(function () {
    return Object.keys(JSON.parse(localStorage.getItem('kotoba.v3')).entries)[0];
  });
  expect(importedId).toBeTruthy();

  await a.locator('#accountBtn').click();
  await a.locator('[data-action="sync-mode"][data-mode="register"]').click();
  await a.locator('input[name="email"]').fill(email);
  await a.locator('input[name="password"]').fill(password);
  await a.locator('[data-sync-submit]').click();
  await expect(a.locator('#accountBtn')).toHaveClass(/is-on/);
  await expect.poll(function () {
    const user = api.snapshot(email);
    return !!(user && user.state && user.state.entries && user.state.entries[importedId]);
  }).toBe(true);

  await a.locator('#accountBtn').click();
  await expect(a.locator('.modal-panel')).toContainText('Compte connecté');
  await a.locator('.modal-head [data-action="close-modal"]').click();

  await b.goto('/');
  await b.getByTestId('cta-main').click();
  await b.getByTestId('reveal').click();
  await b.getByTestId('grade-good').click();
  await expect(b.getByTestId('reveal')).toBeVisible();
  const reviewedId = await b.evaluate(function () {
    const state = JSON.parse(localStorage.getItem('kotoba.v3'));
    return Object.keys(state.progress).filter(function (id) { return (state.progress[id].reps || 0) > 0; })[0];
  });
  expect(reviewedId).toBeTruthy();
  await b.evaluate(function () { document.querySelector('.desktop-nav [data-nav=library]').click(); });

  await b.locator('#accountBtn').click();
  await b.locator('input[name="email"]').fill(email);
  await b.locator('input[name="password"]').fill(password);
  await b.locator('[data-sync-submit]').click();
  await expect(b.locator('#accountBtn')).toHaveClass(/is-on/);
  await b.locator('.chip[data-filter="imported"]').click();
  await expect(b.locator('#libraryList')).toContainText('navet de test');
  await expect.poll(function () {
    const user = api.snapshot(email);
    return user && user.state && user.state.progress && user.state.progress[reviewedId] ? user.state.progress[reviewedId].reps : 0;
  }).toBeGreaterThan(0);

  await a.locator('#accountBtn').click();
  await a.locator('[data-action="sync-now"]').click();
  await expect(a.locator('#xpVal')).toHaveText('10');
  const aState = await a.evaluate(function () { return JSON.parse(localStorage.getItem('kotoba.v3')); });
  expect(aState.progress[reviewedId].reps).toBeGreaterThan(0);
  expect(aState.entries[importedId]).toBeTruthy();

  await contextA.close();
  await contextB.close();
});
