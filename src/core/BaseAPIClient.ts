import { request, APIRequestContext, expect } from "@playwright/test";
import { ENV } from "../config/env";
import { log } from "./logger";

export class BaseAPIClient {
  protected api!: APIRequestContext;

  async init(headers: Record<string, string> = {}, cookie?: string) {
    const extraHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (cookie) {
      extraHeaders["Cookie"] = cookie;
    }
    this.api = await request.newContext({
      baseURL: ENV.apiURL,
      extraHTTPHeaders: extraHeaders,
    });

    return this.api;
  }

  async get(path: string, params?: any) {
    log.step(`API GET ${path}`);
    const res = await this.api.get(path, { params });
    let responseBody: any;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text();
    }

    return {
      status: res.status(),
      body: responseBody,
      ok: res.ok(),
    };
  }

  async post(path: string, data?: any) {
    log.step(`API POST ${path}`);
    const res = await this.api.post(path, { data });
    let responseBody: any;
    try {
      responseBody = await res.json();
    } catch {
      responseBody = await res.text();
    }
    return {
      status: res.status(),
      body: responseBody,
      ok: res.ok(),
    };
  }
}
