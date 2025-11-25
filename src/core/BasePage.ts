import { Page, BrowserContext, expect } from "@playwright/test";
import { log } from "./logger";

export abstract class BasePage {
  protected context: BrowserContext;
  protected page: Page;
  protected path?: string;
  protected baseUrl: string;

  constructor(page: Page, path?: string, baseUrl?: string) {
    this.page = page;
    this.path = path;
    this.context = page.context();
    this.baseUrl = baseUrl || process.env.CHEMVERIC_UI_URL || "";
  }

  async goto(relative?: string) {
    const targetPath = relative ?? this.path ?? "/";

    const url = targetPath.startsWith("http")
      ? targetPath
      : `${this.baseUrl.replace(/\/$/, "")}/${targetPath.replace(/^\//, "")}`;

    log.step(`Navigate to: ${url}`);
    await this.page.goto(url);
  }

  async waitForText(text: string | RegExp) {
    log.step(`Wait for text: ${text}`);
    await expect(this.page.getByText(text)).toBeVisible();
  }

  async clickByText(text: string | RegExp) {
    log.step(`Click by text: ${text}`);
    await this.page.getByText(text).first().click();
  }

  async close() {
    log.step("Closing page and browser context...");
    try {
      await this.page.close();
      await this.context.close();
      log.step("Page and context closed");
    } catch (err) {
      log.warn(`Failed to close page/context → ${err}`);
    }
  }
}
