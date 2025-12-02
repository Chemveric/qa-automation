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

    // search for product
    await mainPage.searchForProduct("mock");
    await mainPage.assertProductIsFound("Mock compound");

    // open product details
    const productDetails = await mainPage.openProductByName("Mock compound");
    await productDetails.assertLoaded();
    const productId = productDetails.getProductId();
    console.log("Product ID:", productId);

    // assert product details page
    await productDetails.assertProductNameIsVisible("Mock compound");
    await productDetails.assertColumnNamesAreVisisble();

    // add product to cart
    await productDetails.addProductToCart();

    // assert success
    await productDetails.assertProductAddedToCart();

    //check product is in the cart
    await mainPage.sidebar.openDashboard();
    const dashboardPage = new UserDashboardPage(page);
    await dashboardPage.clickOnCart();
    const cartPage = new UserCartPage(page);
    await cartPage.assertProductNameIsVisible("Mock compound");
  });

  test("buyer should delete product from the cart", async ({ page }) => {
    const cartPage = new UserCartPage(page);
    await cartPage.goto();
    await cartPage.assertProductNameIsVisible("Mock compound");

    // act
    await cartPage.removeProduct("Mock compound");

    // assert
    await cartPage.assertProductRemoved();
  });
});
