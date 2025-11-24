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

  // Open popup safely
  const [popup] = await Promise.all([
    this.page.context().waitForEvent("page"),
    this.page.getByRole("button", { name: "Log In" }).click(),
  ]);

  log.step("Start user LOGIN");

  await popup.waitForLoadState("domcontentloaded");
  await expect(popup.locator("h1")).toHaveText("Login");

  // Fill credentials
  await popup.fill("input#username", email);
  await popup.fill("input#password", password);

  // Submit: wait for either popup close or main page navigation
  await Promise.all([
    popup.waitForEvent("close").catch(() => null), // prevent crash if popup stays open
    popup.click('button[type="submit"]'),
  ]);

  await this.page.waitForLoadState("networkidle");
  
  log.step("Login submitted");

  // Ensure main page loaded
  await expect(this.page.getByText(/dashboard|welcome/i).first()).toBeVisible();
}

}
