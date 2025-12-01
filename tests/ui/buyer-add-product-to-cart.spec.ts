import { test } from "@playwright/test";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserCartPage } from "../../src/pages/UserCartPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";
import { da } from "@faker-js/faker/.";

test.describe("Add product to cart", () => {
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });
  test("buyer should search for product and add to cart, check that product is present in cart", async ({
    page,
  }) => {
    // navigate on Dashboard page
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    await mainPage.searchForProduct();
    await mainPage.assertProductIsFound();


    await mainPage.openProductDetails();

    // product details page
    await mainPage.assertProductNameIsVisible();
    await mainPage.assertColumnNamesAreVisisble();

    await mainPage.addProductToCart();
    await mainPage.assertProductAddedToCart();

    await mainPage.sidebar.openDashboard();
    
    const dashboardPage = new UserDashboardPage(page);
    await dashboardPage.clickOnCart();

    const cartPage = new UserCartPage(page);

    await page.pause();
  });
});
