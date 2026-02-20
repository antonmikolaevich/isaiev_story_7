import { test } from '@playwright/test';

// eslint-disable-next-line playwright/expect-expect
test('inspect: outerHTML context for first and last number inputs', async ({ page }) => {
  await page.goto('/products/calculator');

  try {
    const cookieBtn = page.locator('//*[text()="OK, got it"]');
    if (await cookieBtn.isVisible({ timeout: 4000 })) await cookieBtn.click();
  } catch {
    // no cookie banner
  }

  await page.locator('span', { hasText: 'Add to estimate' }).first().click();
  await page.locator('[aria-label="Add to this estimate"]').waitFor({ state: 'visible' });
  await page.locator('h2', { hasText: 'Compute Engine' }).click();
  await page.locator('text=Instances configuration').waitFor({ state: 'visible' });
  await page.waitForTimeout(2000);

  const html = await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    return inputs.map((el, i) => {
      const parent3 = el.parentElement?.parentElement?.parentElement;
      return {
        index: i,
        value: (el as HTMLInputElement).value,
        parentClass: el.parentElement?.className?.substring(0, 80) ?? '',
        grandParentClass: el.parentElement?.parentElement?.className?.substring(0, 80) ?? '',
        parent3HTML: parent3?.outerHTML?.substring(0, 300) ?? '',
      };
    });
  });

  // Print first (instances) and last (disk) inputs context
  [0, 7].forEach((i) => {
    const ctx = html[i];

    console.log(
      `\n--- Input[${ctx.index}] value="${ctx.value}" ---\nparentClass: ${ctx.parentClass}\ngrandParentClass: ${ctx.grandParentClass}\nparent3HTML:\n${ctx.parent3HTML}`,
    );
  });
});
