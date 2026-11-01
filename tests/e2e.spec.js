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
await expect(page.getByTestId('answer-romaji')).toHaveCount(0);
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
await expect(page.getByTestId('answer-context')).toContainText('こんにちは');
await expect(page.getByTestId('answer-context-pronunciation')).toContainText('konnichiwa');
expect(await page.locator('[data-testid="answer-jp"] rt').count()).toBeGreaterThan(0);
expect(await page.locator('[data-testid="answer-context"] rt').count()).toBeGreaterThan(0);
await page.getByTestId('grade-good').click();
await expect(page.getByTestId('feedback')).toHaveCount(0);
await expect(page.getByTestId('session-card')).toBeVisible();
await expect(page.getByTestId('reveal')).toBeVisible();
expect(errors).toEqual([]);
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
test('plus de 200 mots et aller en forme polie', async ({ page }) => {
const info = await page.evaluate(() => ({
units: window.UNITS_DATA.length,
words: window.UNITS_DATA.reduce((n, u) => n + ((u.words && u.words.length) || 0), 0),
malformed: window.UNITS_DATA.some((u) => (u.words || []).some((w) => !Array.isArray(w))),
ikimasu: window.UNITS_DATA.some((u) => (u.words || []).some((w) => w[0] === '行きます' && w[2] === 'ikimasu'))
}));
expect(info.words).toBeGreaterThanOrEqual(200);
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
await expect(page.getByTestId('pronounce-start')).toHaveCount(0);
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
await expect(page.getByTestId('pronunciation-average')).toContainText('50 %');
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
  await expect(page.getByTestId('inline-pronunciation')).toContainText('À retravailler');
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
  await expect(page.getByTestId('detail-nuance')).toContainText('sayonara');
  await expect(page.getByTestId('detail-nuance')).toContainText('jaa ne');
  await expect(page.getByTestId('detail-nuance')).toContainText('じゃあね');
  await page.locator('[data-action="review-one"]').click();
  await expect(page.getByTestId('prompt-nuance')).toContainText('さようなら');
  await expect(page.getByTestId('prompt-nuance')).toContainText('じゃあね');
});
