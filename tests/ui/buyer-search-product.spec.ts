import { test } from "@playwright/test";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserCartPage } from "../../src/pages/UserCartPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";

test.describe("Product search", () => {
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });
  test("buyer should search for product by product name", async ({ page }) => {
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
  });

  test("buyer should search for product by product SMILE", async ({ page }) => {
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    // act
    await mainPage.searchForProduct("CC(=O)NC(CCc1ccccc1)C(=O)O");

    // assert
    await mainPage.assertProductIsFound("Acetyl-D-homophenylalanine");
  });

  test("buyer should search for product by product molecular formula", async ({
    page,
  }) => {
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    // act
    await mainPage.searchForProduct("C12H15NO3");

    // assert
    await mainPage.assertProductIsFound("Acetyl-D-homophenylalanine");
  });

  test("buyer should search for product by product catalog number", async ({
    page,
  }) => {
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    // act
    await mainPage.searchForProduct("11769-25G");

    // assert
    await mainPage.assertProductIsFound("Acetyl-D-homophenylalanine");

  });

  test("should allow Buyer to search for a product by structure similarity", async ({
    page,
  }) => {
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    // act

    await mainPage.performStructureSearchBySimilarity();

    // assert
    await mainPage.assertProductIsFound("-Bromo-2-methylpyridine");
  });

  test("should allow Buyer to search for a product by substructure", async ({
    page,
  }) => {
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    // act

    await mainPage.performStructureSearchBySubstructure();

    // assert
    await mainPage.assertProductIsFound("-Bromo-2-methylpyridine");
  });

  test("should allow Buyer to search for a product by exact structure", async ({
    page,
  }) => {
    const mainPage = new UserMainProductsPage(page);
    await mainPage.goto();
    await mainPage.assertLoaded();

    // act

    await mainPage.performStructureSearchByExactStructure();

    // assert
    await mainPage.assertProductIsFound("-Bromo-2-methylpyridine");
  });
});
