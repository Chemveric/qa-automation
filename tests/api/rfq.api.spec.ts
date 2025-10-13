import { test, expect } from '@playwright/test';
import { apiContext, expectOk } from '../../src/api/http';
import { TestData } from '../../src/config/testData';

test('create RFQ (API)', async () => {
  const api = await apiContext();
  const payload = {
    title: TestData.rfq.sample.title,
    description: TestData.rfq.sample.description,
    budget_range_min: TestData.rfq.sample.budgetMin,
    budget_range_max: TestData.rfq.sample.budgetMax,
    confidentiality_level: TestData.rfq.sample.confidentiality
  };
  const res = await api.post('/rfqs', { data: payload });
  await expectOk(res);
  const body = await res.json();
  expect(body.title).toBe(payload.title);
});
