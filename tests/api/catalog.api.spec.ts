import { test, expect } from '@playwright/test';
import { apiContext, expectOk } from '../../src/api/http';
import { TestData } from '../../src/config/testData';

test('catalog search by CAS (API)', async () => {
  const api = await apiContext();
  const res = await api.get('/catalog/search', { params: { q: TestData.compounds.aspirin.cas } });
  await expectOk(res);
  const body = await res.json();
  expect(Array.isArray(body)).toBeTruthy();
});
