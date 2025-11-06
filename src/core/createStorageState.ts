import { Browser } from '@playwright/test';
import { LoginPage } from '.././pages/LoginPage';
import { log } from '../core/logger';

export async function createStorageState(browser: Browser, email: string, password: string, path: string) {
  const context = await browser.newContext();
  const page = await context.newPage();
  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(email, password);
  await context.storageState({ path });
  await context.close();

  log.step(`Saved storage state for ${email} → ${path}`);
}