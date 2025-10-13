import { request as pwRequest, APIRequestContext, expect } from '@playwright/test';
import { ENV } from '../config/env';

export async function apiContext(): Promise<APIRequestContext> {
  return await pwRequest.newContext({
    baseURL: ENV.apiURL,
    extraHTTPHeaders: { 'Content-Type': 'application/json' }
  });
}

export async function expectOk(res: any) {
  expect(res.ok(), `HTTP ${res.status()} — ${await res.text()}`).toBeTruthy();
}
