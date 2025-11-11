import { loginAndSaveCookie } from '../setup/uiLogin';
import { vendorLoginAndSaveCookie } from '../setup/vendorUiLogin';
import { buyerLoginAndSaveCookie } from '../setup/buyerUiLogin';
import { log } from '../core/logger';

export default async function globalSetup() {
  log.step('Running global setup: UI login');
  await loginAndSaveCookie();
  await vendorLoginAndSaveCookie();
  await buyerLoginAndSaveCookie();
  log.step("Finished login in global setup!");
}