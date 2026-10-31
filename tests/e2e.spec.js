const { test, expect } = require('@playwright/test');

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('accueil, carte français puis japonais et contexte', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  await expect(page.getByTestId('cta-main')).toBeVisible();
  await page.getByTestId('cta-main').click();
  await expect(page.getByTestId('reveal')).toBeVisible();
  await expect(page.getByTestId('session-card')).toContainText('bonjour');
  await expect(page.getByTestId('answer-jp')).toHaveCount(0);

  await page.getByTestId('reveal').click();
  await expect(page.getByTestId('answer-jp')).toContainText('こんにちは');
  await expect(page.getByTestId('answer-romaji')).toBeVisible();
  await expect(page.getByTestId('answer-context')).toContainText('こんにちは');

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
  await expect(page.locator('#libraryList')).toContainText('こんにちは');
  await expect(page.locator('#libraryList')).toContainText('bonjour');

  await page.locator('.word-row').click();
  await expect(page.locator('.modal-panel')).toContainText('bonjour');
  await expect(page.locator('.modal-panel')).toContainText('こんにちは');
  await expect(page.locator('.modal-panel')).toContainText('こんにちは、花さん！');
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
