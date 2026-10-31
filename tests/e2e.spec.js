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
await expect(page.getByTestId('answer-romaji')).toBeVisible();
await expect(page.getByTestId('answer-context')).toContainText('こんにちは');
expect(await page.locator('[data-testid="answer-jp"] rt').count()).toBeGreaterThan(0);
expect(await page.locator('[data-testid="answer-context"] rt').count()).toBeGreaterThan(0);
await page.getByTestId('grade-good').click();
await expect(page.getByTestId('feedback')).toContainText('Bien joué');
await page.getByTestId('session-next').click();
await expect(page.getByTestId('session-card')).toBeVisible();
expect(errors).toEqual([]);
});
test('la progression et l XP sont conservés après rechargement', async ({ page }) => {
await page.getByTestId('cta-main').click();
await page.getByTestId('reveal').click();
await page.getByTestId('grade-good').click();
await expect(page.getByTestId('feedback')).toBeVisible();
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
await expect(page.getByTestId('feedback')).toBeVisible();
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
await expect(page.locator('#view-grammar')).toContainText('私は水を飲みます。');
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
await expect(page.getByTestId('feedback')).toBeVisible();
await page.getByTestId('session-next').click();
}
await expect(page.getByTestId('summary')).toBeVisible();
await expect(page.getByTestId('daily-bonus')).toContainText('+20 XP');
await page.getByTestId('finish-session').click();
await expect(page.getByTestId('streak-panel')).toContainText('1 jour');
await expect(page.getByTestId('daily-done')).toBeVisible();
});
test('prononciation : carte dédiée et lecture du mot', async ({ page }) => {
await page.locator('.desktop-nav [data-nav=library]').click();
await page.locator('.word-row').first().click();
await expect(page.locator('.modal-panel')).toContainText('Prononcer');
await page.locator('[data-action=pronounce-one]').click();
await expect(page.getByTestId('pronounce-card')).toBeVisible();
await expect(page.getByTestId('pronounce-start')).toBeVisible();
expect(await page.locator('[data-testid="pronounce-word"] rt').count()).toBeGreaterThan(0);
});
