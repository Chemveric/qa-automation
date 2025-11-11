import { ENV } from "../config/env";
import { UserLoginPage } from "../pages/UserLoginPage";
import { log } from '../core/logger';
import { DriverProvider, CookiesTag } from '../driver/DriverProvider';

export async function vendorLoginAndSaveCookie() {
    log.step("Starting vendor UI login script");
    const driver = new DriverProvider();
    const page = await driver.initDriver(false, CookiesTag.Vendor);
    const userLoginPage = new UserLoginPage(page);
    await userLoginPage.loginWithAuth0(ENV.vendor.email, ENV.vendor.password);
    await driver.storeCookies(CookiesTag.Vendor);
    await driver.dispose();
}
