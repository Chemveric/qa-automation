import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env";
import { LoginPage } from "../pages/LoginPage";
import { log } from '../core/logger';
import { DriverProvider, CookiesTag } from '../driver/DriverProvider';

export async function loginAndSaveCookie() {
    log.step("Starting UI login script");
    const driver = new DriverProvider();
    const page = await driver.initDriver(false, CookiesTag.Admin);
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login(ENV.admin.email, ENV.admin.password);
    await driver.storeCookies(CookiesTag.Admin);
    await driver.dispose();
}
