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
}
