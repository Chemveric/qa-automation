import { loginAndSaveCookie } from '../setup/uiLogin';

export default async function globalSetup() {
  console.log('Running global setup: UI login');
  await loginAndSaveCookie();
  console.log("finish login in global setup!");
}
