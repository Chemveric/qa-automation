import { BaseAPIClient } from "../core/BaseAPIClient";
import fs from "fs";
import { DocumentCategory } from "../utils/types/documentCategory.typess";
import { DocumentKind } from "../utils/types/documentKind.types";

type AdminDocumentsQuery = {
  sort?: string[];
  range?: (number | string)[];
  filter?: Record<string, string>;
};
export class AdminDocumentsApiClient extends BaseAPIClient {
  async health() {
    return this.get("/v1/health");
  }
  async postUploadDocument(
    filePath: string,
    category: DocumentCategory,
    kind: DocumentKind,
    displayName: string
  ) {
    const fileName = filePath;
    const fileBuffer = fs.readFileSync(filePath);

    return await this.postMultipart("/v1/admin/public-documents", {
      file: {
        name: fileName,
        mimeType: "application/pdf",
        buffer: fileBuffer,
      },
      category: category,
      kind: kind,
      displayName: displayName,
    });
  }

  async getPublicDocuments(query?: AdminDocumentsQuery) {
    const params = query
      ? Object.fromEntries(
          Object.entries(query).map(([key, value]) => [
            key,
            JSON.stringify(value),
          ])
        )
      : {};

    const searchParams = new URLSearchParams(params as Record<string, string>);
    const url = `/v1/admin/public-documents?${searchParams.toString()}`;
    return this.get(url);
  }

  async getPublicDocumentById(documentId: string) {
    return this.get(`/v1/admin/public-documents/${documentId}`);
  }
}
