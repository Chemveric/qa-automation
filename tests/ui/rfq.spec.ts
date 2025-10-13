import { test } from '@playwright/test';
import { RFQFormPage } from '../../src/pages/rfq/RFQFormPage';
import { RFQListPage } from '../../src/pages/rfq/RFQListPage';
import { TestData } from '../../src/config/testData';

test.describe('RFQ Creation (UI smoke)', () => {
  test('create RFQ in UI (happy path)', async ({ page }) => {
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
