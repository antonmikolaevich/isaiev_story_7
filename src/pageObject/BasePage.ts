import { Page } from '@playwright/test';

export class BasePage {
  constructor(
    protected readonly page: Page,
    private readonly url: string,
  ) {}

  async open(): Promise<void> {
    await this.page.goto(this.url);
  }

  async getUrl(): Promise<string> {
    return this.page.url();
  }

  async handleCookieConsent(buttonText: string): Promise<void> {
    try {
      const cookieButton = this.page.locator(`//*[text()="${buttonText}"]`);
      const isVisible = await cookieButton.isVisible({ timeout: 3000 });
      if (isVisible) {
        await cookieButton.click();
      }
    } catch (_error) {
      // Cookie consent not found or already accepted - continue
    }
  }
}
