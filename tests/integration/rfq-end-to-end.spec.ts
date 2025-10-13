import { test, expect } from '@playwright/test';
import { RFQFormPage } from '../../src/pages/rfq/RFQFormPage';
import { RFQListPage } from '../../src/pages/rfq/RFQListPage';
import { CatalogPage } from '../../src/pages/catalog/CatalogPage';
import { TestData } from '../../src/config/testData';

test.describe('E2E: Discover → RFQ → Visibility', () => {
  test('search catalog then create RFQ and verify it appears', async ({ page }) => {
    const catalog = new CatalogPage(page);
    await catalog.goto();
    await catalog.searchByCAS(TestData.compounds.aspirin.cas);
    await expect(catalog.productCard).toBeVisible();

    const rfq = new RFQFormPage(page);
    await rfq.open();
    await rfq.fillStep1(TestData.rfq.sample.title, TestData.rfq.sample.description);
    await rfq.selectConfidentiality('restricted');
    await rfq.submit();

    const list = new RFQListPage(page);
    await list.open();
    await list.expectRfqVisible(TestData.rfq.sample.title);
  });
});
