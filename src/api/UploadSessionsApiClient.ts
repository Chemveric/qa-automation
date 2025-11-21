import { BaseAPIClient } from "../core/BaseAPIClient";
import fs from "fs";
import path from "path";

export interface UploadData {
  organizationId: string;
  purpose: string;
  filename: string;
  mime: string;
  size: number;
  checksum: string;
}

export interface UploadFileParams {
  presignedUrl: string;
  presignedHeaders: Record<string, string>;
  fileBuffer: Buffer;
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

  async postUploadSessionsComplete(
    id: string | number | undefined,
    body: Record<string, any> = {}
  ) {
    return this.post(`/v1/uploads/sessions/${id}/complete`, body);
  }

  async postUploadSessionsFinalize(body: Record<string, any> = {}) {
    return this.post("/v1/uploads/sessions/finalize", body);
  }

  async uploadFile(
    presignedUrl: string,
    presignedHeaders: Record<string, string>,
    fileBuffer: Buffer
  ) {
    const res = await this.api.fetch(presignedUrl, {
      method: "PUT",
      headers: presignedHeaders,
      data: fileBuffer,
    });

    const text = await res.text();

    return {
      status: res.status(),
      ok: res.ok(),
      body: text,
    };
  }
}
