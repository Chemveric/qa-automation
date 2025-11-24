import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";
import { log } from "../core/logger";

export class UserLoginPage extends BasePage {
  constructor(page: Page) {
    super(page, "", ENV.guest.url);
  }

  async loginWithAuth0(email: string, password: string) {
    log.step("Navigate to user UI");
    await this.page.goto(ENV.guest.url);

    const [popup] = await Promise.all([
      this.page.context().waitForEvent("page"),
      this.page.getByRole("button", { name: "Log In" }).click(),
    ]);

    log.step("Start user LOGIN");

    // Wait for Auth0 login page to load
    await popup.waitForURL(/auth0\.com\/u\/login/, { timeout: 30000 });
    await expect(popup.locator("h1")).toHaveText("Login");
    await popup.waitForSelector("input#username", { timeout: 10000 });

    // Fill credentials
    await popup.fill("input#username", email);
    await popup.fill("input#password", password);

    // Click submit and wait for popup to close (if it closes)
    await Promise.all([
      popup.waitForEvent("close"), 
      popup.click('button[type="submit"]'),
    ]);

    log.step("Login submitted");

    // Now main page should be loaded
    await this.page.waitForLoadState("networkidle");
    await expect(
      this.page.getByText(/dashboard|welcome/i).first()
    ).toBeVisible();
  }
}
