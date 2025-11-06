import { loginAndSaveCookie } from '../setup/uiLogin';
import { log } from '../core/logger';

export default async function globalSetup() {
    log.step('Running global setup: UI login');
    await loginAndSaveCookie();
    log.step("Finished login in global setup!");
}