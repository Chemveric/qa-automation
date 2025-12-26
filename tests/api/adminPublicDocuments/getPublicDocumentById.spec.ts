import { test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getBuyerCookie,
  getSupplierCookie,
} from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { AdminDocumentsApiClient } from "../../../src/api/AdminDocumentsApiClient";
import { DocumentCategory } from "../../../src/utils/types/documentCategory.typess";
import { DocumentKind } from "../../../src/utils/types/documentKind.types";
import { randomUUID } from "crypto";
import { PublicDocumentSchema } from "../../../src/schema/addDocumentSchema";

const validator = new ResponseValidationHelper();

test.describe("API: GET public document by id", () => {
  let api: AdminDocumentsApiClient;
  let adminCookie: string;
  const filePath = "src/data/files/Basic-Non-Disclosure-Agreement.pdf";
  let document = {
    filePath: filePath,
    category: DocumentCategory.LEGAL,
    kind: DocumentKind.TERMS,
    displayName: `New document_${randomUUID()}`,
  };
  let documentId: string;

  test.beforeAll(async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.postUploadDocument(
      document.filePath,
      document.category,
      document.kind,
      document.displayName
    );
    expect(res.status).toBe(201);
    documentId = res.body.id;
  });

  test(`should return document by id`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.getPublicDocumentById(documentId);
    expect(res.status).toBe(200);

    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      PublicDocumentSchema
    );

    expect(validated.id).toBe(documentId);
    expect(validated.category).toBe(document.category);
    expect(validated.kind).toBe(document.kind);
    expect(validated.displayName).toBe(document.displayName);
  });

  test(`should return return error when not existing document id`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);
    let notExistingDocumentId = randomUUID();
    const res = await api.getPublicDocumentById(notExistingDocumentId);
    validator.expectStatusCodeAndMessage(res, 404, "Document not found");
  });

  test(`should return return error when wrong document id`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);
    let wrongDocumentId = "<wrong-document-id>";
    const res = await api.getPublicDocumentById(wrongDocumentId);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });

  test(`should Unauthorized when buyer coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let buyerCookie = getBuyerCookie();
    await api.init({ "Content-Type": false }, buyerCookie);
    const res = await api.getPublicDocumentById(documentId);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should Unauthorized when supplier coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let supplierCookie = getSupplierCookie();
    await api.init({ "Content-Type": false }, supplierCookie);
    const res = await api.getPublicDocumentById(documentId);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should Unauthorized when fake coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let fakeCookie = randomUUID();
    await api.init({ "Content-Type": false }, fakeCookie);
    const res = await api.getPublicDocumentById(documentId);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
