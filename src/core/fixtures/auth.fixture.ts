import { test as base } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { ENV } from '../../config/env';

export const test = base.extend({
  storageState: async ({ browser }, use) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    const login = new LoginPage(page);
    await login.open();
    await login.login(ENV.admin.email, ENV.admin.password);
    const dash = new DashboardPage(page);
    await dash.assertLoaded();
    const statePath = 'storageState.json';
    await context.storageState({ path: statePath });
    await context.close();
    await use(statePath);
  }
});

export const expect = base.expect;
