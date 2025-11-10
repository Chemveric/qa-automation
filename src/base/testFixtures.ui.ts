import { test as base, type Page } from '@playwright/test';
import { DriverProvider, CookiesTag } from '../driver/DriverProvider';

export const test = base.extend<{
  page: Page;
}>({
  page: async ({}, use) => {
    const driver = new DriverProvider();
    const page = await driver.initDriver(true, CookiesTag.Admin);
    await use(page);
    await driver.dispose();
  }
});

export { expect } from '@playwright/test';