import { request, APIRequestContext } from "@playwright/test";
import { ENV } from "../config/env";
import { log } from "./logger";
import fs from "fs";

export class BaseAPIClient {
  protected api!: APIRequestContext;

  async init(headers: Record<string, string | false> = {}, cookie?: string) {
    const filteredHeaders: Record<string, string> = Object.fromEntries(
      Object.entries(headers).filter(([_, v]) => v !== false)
    ) as Record<string, string>;

    const contentType =
      "Content-Type" in filteredHeaders
        ? filteredHeaders["Content-Type"]
        : "application/json";

    this.api = await request.newContext({
      baseURL: ENV.apiURL,
      extraHTTPHeaders: {
        "X-Rate-Limit-Bypass": "GcMpQjt4k7p1tx2e3UU2",
        "Content-Type": contentType,
        ...(cookie ? { Cookie: cookie } : {}),
        ...filteredHeaders,
      },
      userAgent: "Chemveric Automation",
    });

    return this.api;
  }

  private async request(
    method: "get" | "post" | "put" | "patch" | "delete",
    path: string,
    options: any = {}
  ) {
    log.step(`API ${method.toUpperCase()} ${path}`);
    const methodMap = {
      get: this.api.get.bind(this.api),
      post: this.api.post.bind(this.api),
      put: this.api.put.bind(this.api),
      patch: this.api.patch.bind(this.api),
      delete: this.api.delete.bind(this.api),
    };

    const res = await methodMap[method](path, options);

    let body: any;
    try {
      body = await res.json();
    } catch {
      body = await res.text();
    }

    log.error(`➡️ Request URL: ${res.url()}`);
    if (options.data)
      log.error(`➡️ Request body: ${JSON.stringify(options.data)}`);
    log.error(`⬅️ Response: ${JSON.stringify(body)}`);

    return {
      status: res.status(),
      body,
      ok: res.ok(),
    };
  }

  get(path: string, params?: any) {
    return this.request("get", path, { params });
  }

  post(path: string, data?: any) {
    return this.request("post", path, { data });
  }

  put(path: string, data?: any) {
    return this.request("put", path, { data });
  }

  patch(path: string, data?: any) {
    return this.request("patch", path, { data });
  }

  delete(path: string, data?: any) {
    return this.request("delete", path, data ? { data } : {});
  }

  postMultipart(path: string, multipartData: Record<string, any>) {
    return this.request("post", path, { multipart: multipartData });
  }
}
