import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ENV } from "../config/env";
import { LoginPage } from "../pages/LoginPage";
import { log } from '../core/logger';

export async function loginAndSaveCookie() {
  log.step("Starting UI login script");
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  const login = new LoginPage(page);
  await login.open();
  await login.login(ENV.admin.email, ENV.admin.password);

  const cookies = await context.cookies();
  const sessionCookie = cookies.find((c) => c.name === "__Secure-admin-sid");

  if (!sessionCookie) throw new Error("Cookie not found after login!");

  const adminCookie = `__Secure-admin-sid=${sessionCookie.value}`;
  const savePath = path.join(__dirname, "../config/env.json");

  fs.writeFileSync(savePath, JSON.stringify({ adminCookie }, null, 2));
  log.step(`Saved cookie to ${savePath}`);

  await browser.close();
}
