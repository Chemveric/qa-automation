import { BasePage } from '../core/BasePage';
import { Page, expect } from '@playwright/test';
import { ENV } from '../config/env';
import { log } from '../core/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open() {
    await this.page.goto(ENV.uiURL);
    await expect(this.page.getByPlaceholder('Email address')).toBeVisible();
  }

  async login(email: string, password: string) {
    log.step(`Log in as ${email}`);
    await this.page.getByPlaceholder('Email address').fill(email);
    await this.page.getByPlaceholder('Password').fill(password);
    await this.page.getByRole('button', { name: /^Continue$/ }).click();
  }
}
