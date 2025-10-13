import { test, expect } from '@playwright/test';
import { CatalogPage } from '../../src/pages/catalog/CatalogPage';
import { TestData } from '../../src/config/testData';

test.describe('Catalog Search & Cart', () => {
  test('search by CAS and add to cart', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await catalog.searchByCAS(TestData.compounds.aspirin.cas);
    await expect(catalog.productCard).toBeVisible();
    await catalog.addToCartByName(TestData.compounds.aspirin.name);
    await catalog.openCart();
    await expect(catalog.cartItem(TestData.compounds.aspirin.name)).toBeVisible();
  });
});
