import { ENV } from "../config/env";
import { UserLoginPage } from "../pages/UserLoginPage";
import { log } from '../core/logger';
import { DriverProvider, CookiesTag } from '../driver/DriverProvider';

export async function buyerLoginAndSaveCookie() {
    log.step("Starting vendor UI login script");
    const driver = new DriverProvider();
    const page = await driver.initDriver(false, CookiesTag.Buyer);
    const userLoginPage = new UserLoginPage(page);
    await userLoginPage.loginWithAuth0(ENV.buyer.email, ENV.buyer.password);
    await driver.storeCookies(CookiesTag.Buyer);
    await driver.dispose();
}
