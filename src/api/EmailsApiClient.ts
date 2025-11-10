import { BaseAPIClient } from "../core/BaseAPIClient";

type EmailChangeQuery = {
  sort?: string[];
  range?: (number | string)[];
  filter?: Record<string, string>;
};

export class EmailsApiClient extends BaseAPIClient {
  async health() {
      return this.get("/v1/health");
  }
  async getEmailChangeRequest(query?: EmailChangeQuery) {
    const params = query
    ? Object.fromEntries(
        Object.entries(query).map(([key, value]) => [
          key,
          JSON.stringify(value),
        ])
      )
    : {};

  const searchParams = new URLSearchParams(params as Record<string, string>);
  const url = `/v1/admin/email-change-requests?${searchParams.toString()}`;

  console.log("👉 Full request URL:", url);
  return this.get(url);        
  }

  async patchEmailChangeRequest(id: string | number) {
    return this.get(`/v1/admin/email-change-requests/${id}`);
  }
}