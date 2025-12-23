import { BaseAPIClient } from "../core/BaseAPIClient";
import fs from "fs";
import { DocumentCategory } from "../utils/types/documentCategory.typess";
import { DocumentKind } from "../utils/types/documentKind.types";

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
}
