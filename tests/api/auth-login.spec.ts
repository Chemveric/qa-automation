import { test, expect } from '@playwright/test';
import { AuthClient } from '../../src/api/AuthClient';

test('API smoke: /auth/login is reachable', async () => {
  const api = new AuthClient();
  await api.init();
  const res = await api.health();
  expect(res.status()).toBeLessThan(400);
});
