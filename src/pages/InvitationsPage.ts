import { BasePage } from "../core/BasePage";
import { Page, expect } from "@playwright/test";
import { IUserData, MessageStatus } from '../data/invitationData';
import { ENV } from "../config/env";

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

  async expectMessage(message: string, timeout = 15000){
    const locator = this.page.locator("p", { hasText: message });
    await locator.first().waitFor({ timeout });
    const actualCount = await locator.count();
    console.log(`Found ${actualCount} message(s) with text: "${message}"`);
    await expect(locator.first()).toBeVisible();
  }

  async fillAndSend(userData: IUserData){
    const { firstName, lastName, email, company } = userData;

    await this.page.getByLabel(/first name/i).fill(firstName);
    await this.page.getByLabel(/last name/i).fill(lastName);
    await this.page
        .locator('input[type="text"][name="companyName"]')
        .fill(company);
    await this.page.locator('input[type="text"][name="email"]').fill(email);
    await this.page.getByRole("button", { name: /send invitation/i }).click();
  }

  async sendWithEmptyFields() {
      await this.page.getByRole("button", { name: /send invitation/i }).click();
  }

  async expectValidationErrors() {
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
        await expect(
            this.page.getByText(error),
            `Expected error message: ${error} is not visible`
        ).toBeVisible();
    }
  }
}
