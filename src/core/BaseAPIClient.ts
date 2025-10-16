import { request, APIRequestContext, expect } from '@playwright/test';
import { ENV } from '../config/env';
import { log } from './logger';

export class BaseAPIClient {
  protected api!: APIRequestContext;

  async init(headers: Record<string,string> = {}) {
    this.api = await request.newContext({
      baseURL: ENV.apiURL,
      extraHTTPHeaders: { 'Content-Type': 'application/json', ...headers }
    });
    return this.api;
  }

  async get(path: string, params?: any) {
    log.step(`API GET ${path}`);
    const res = await this.api.get(path, { params });
    expect(res.ok(), `GET ${path} -> ${res.status()} ${await res.text()}`).toBeTruthy();
    return res;
  }

  async post(path: string, data?: any) {
    log.step(`API POST ${path}`);
    const res = await this.api.post(path, { data });
    expect(res.ok(), `POST ${path} -> ${res.status()} ${await res.text()}`).toBeTruthy();
    return res;
  }
}
