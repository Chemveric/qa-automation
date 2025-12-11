import { test } from "@playwright/test";
import { BuyerOrderDetailsPage } from "../../src/pages/BuyerOrderDetailsPage";
import { BuyerOrdersPage } from "../../src/pages/BuyerOrdersPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";

test.describe("User open orders page and open order details", () => {
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });
  test("buyer should open orders page", async ({ page }) => {
    const ordersPage = new BuyerOrdersPage(page);
    // act
    await ordersPage.goto();

    //assert
    await ordersPage.assertOrderPageLoaded();
    await ordersPage.assertTabsVisible();
    await ordersPage.assertColumnsVisible();
  });

  test("buyer should open pending orders tab", async ({ page }) => {
    const ordersPage = new BuyerOrdersPage(page);
    await ordersPage.goto();
    await ordersPage.assertOrderPageLoaded();

    // act
    await ordersPage.clickTab("pending");

    // assert
    await ordersPage.checkPendingOrdersStatusAndStatusColor();
  });

  test("buyer should open pending order details", async ({ page }) => {
    const ordersPage = new BuyerOrdersPage(page);
    const detailsPage = new BuyerOrderDetailsPage(page);
    await ordersPage.goto();
    await ordersPage.assertOrderPageLoaded();

    //act
    await ordersPage.clickTab("pending");
    await ordersPage.clickOnFirstPendingOrder();

    //assert
    await detailsPage.assertLoaded();
    await detailsPage.assertAllSectionsVisible();
    await detailsPage.assertSupplierTab("dfgdfh");
  });
});
