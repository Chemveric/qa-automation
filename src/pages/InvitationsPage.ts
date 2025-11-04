import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";

export class InvitationsPage extends BasePage {
  constructor(page: Page) {
    super(page, "/#/invitations");
  }

  async open() {
    await this.goto(this.path);
    await expect(
      this.page.getByRole("link", { name: /create/i })
    ).toBeVisible();
  }

  async openCreateForm() {
    await this.page.getByRole("link", { name: /create/i }).click();
    await expect(this.page).toHaveURL(/#\/invitations\/create/);
  }

  async expectMessage(message: string, timeout = 15000) {
    const locator = this.page.locator("p", { hasText: message });
    await locator.first().waitFor({ timeout });
    const actualCount = await locator.count();
    console.log(`Found ${actualCount} message(s) with text: "${message}"`);
    await expect(locator.first()).toBeVisible();
  }

  async fillAndSend(
    first: string,
    last: string,
    email: string,
    company: string,
    message: string
  ) {
    await this.page.getByLabel(/first name/i).fill(first);
    await this.page.getByLabel(/last name/i).fill(last);
    await this.page
      .locator('input[type="text"][name="companyName"]')
      .fill(company);
    await this.page.locator('input[type="text"][name="email"]').fill(email);
    await this.page.getByRole("button", { name: /send invitation/i }).click();
    await this.expectMessage(message);
  }

  async sendWithEmptyFields() {
    await this.page.getByRole("button", { name: /send invitation/i }).click();
    const fields = [
      { name: "First name", error: "First name is required" },
      { name: "Last name", error: "Last name is required" },
      { name: "Company name", error: "Company name is required" },
      { name: "Email", error: "Email is required" },
    ];

    for (const { name, error } of fields) {
      const input = this.page.getByRole("textbox", { name });
      await expect(input, `Expect ${name} to be red color`).toHaveCSS(
        "color",
        "rgb(211, 47, 47)"
      );
      const errorMessage = this.page.getByText(error);
      await expect(
        errorMessage,
        `Expected error message: ${error} is not visible`
      ).toBeVisible();
    }
  }
}
