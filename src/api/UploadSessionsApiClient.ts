import { BaseAPIClient } from "../core/BaseAPIClient";
import fs from "fs";
import path from "path";
import { log } from "../core/logger";
import mime from "mime-types";

export interface UploadData {
  organizationId: string;
  purpose: string;
  filename: string;
  mime: string;
  size: number;
  checksum: string;
}

export class UploadSessionsApiClient extends BaseAPIClient {
  async postUploadsSessions(body: Record<string, any> = {}) {
    return this.post("/v1/uploads/sessions", body);
  }

  async getUploadsSessions(
    id: string | number | undefined,
    organizationId?: string
  ) {
    const params = new URLSearchParams();
    if (organizationId) params.set("organizationId", organizationId);

    const query = params.toString();
    const url = `/v1/uploads/sessions/${id}${query ? `?${query}` : ""}`;
    return this.get(url);
  }

  async postUploadsSessionsRelay(
    sessionId: string,
    filePath: string,
    data: UploadData
  ) {
    const fileStream = fs.createReadStream(filePath);

    const multipartData: { [key: string]: any } = {
      file: fileStream,
      purpose: data.purpose,
      size: data.size,
      mime: data.mime,
      filename: path.basename(filePath),
      checksum: data.checksum,
    };

    if (data.organizationId) {
      multipartData.organizationId = data.organizationId;
    }

    return this.postMultipart(
      `/v1/uploads/sessions/${sessionId}`,
      multipartData
    );
  }
}
