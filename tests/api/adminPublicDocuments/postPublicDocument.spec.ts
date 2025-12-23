import { test, expect } from "@playwright/test";
import { getAdminCookie, getBuyerCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { AdminDocumentsApiClient } from "../../../src/api/AdminDocumentsApiClient";
import { DocumentCategory } from "../../../src/utils/types/documentCategory.typess";
import { DocumentKind } from "../../../src/utils/types/documentKind.types";
import { PublicDocumentSchema } from "../../../src/schema/addDocumentSchema";
import { randomUUID } from "crypto";

const validator = new ResponseValidationHelper();

test.describe("API: POST add new public document", () => {
  let api: AdminDocumentsApiClient;
  let adminCookie: string;
  const filePath = "src/data/files/Basic-Non-Disclosure-Agreement.pdf";

  test.beforeAll(async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({}, adminCookie);
  });

  test(`should upload new public document pdf`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.postUploadDocument(
      filePath,
      DocumentCategory.LEGAL,
      DocumentKind.TERMS,
      "New document"
    );
    expect(res.status).toBe(201);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      PublicDocumentSchema,
      201
    );
    expect(validated.category).toBe(DocumentCategory.LEGAL);
    expect(validated.kind).toBe(DocumentKind.TERMS);
    expect(validated.displayName).toBe("New document");
  });

  test(`should upload new public document png`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.postUploadDocument(
      "src/data/files/red_head2.png",
      DocumentCategory.EMAIL_ASSETS,
      DocumentKind.EMAIL_LOGO,
      "New logo"
    );
    expect(res.status).toBe(201);

    const body = await res.body;
    console.log("Response status:", res.status);
    console.log("Response body:", JSON.stringify(res.body, null, 2));
    const validated = await validateResponse(
      { status: res.status, body },
      PublicDocumentSchema,
      201
    );
    expect(validated.category).toBe(DocumentCategory.EMAIL_ASSETS);
    expect(validated.kind).toBe(DocumentKind.EMAIL_LOGO);
    expect(validated.displayName).toBe("New logo");
  });

  test(`should get error when upload pdf to EMAIL_ASSETS category`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.postUploadDocument(
      filePath,
      DocumentCategory.EMAIL_ASSETS,
      DocumentKind.EMAIL_LOGO,
      "New logo"
    );
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Invalid file type for category EMAIL_ASSETS. Allowed types: image/png, image/jpeg, image/jpg, image/svg+xml"
    );
  });

  test(`should get error when upload png to LEGAL category`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const res = await api.postUploadDocument(
      "src/data/files/red_head2.png",
      DocumentCategory.LEGAL,
      DocumentKind.STANDARD_NDA,
      "New nda"
    );
    validator.expectStatusCodeAndMessage(
      res,
      422,
      '"category":"ERR002. ERR002","kind":"ERR002. ERR002","displayName":"ERR009. ERR002. ERR002"'
    );
  });

  test(`should Unauthorized when buyer coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let buyerCookie = getBuyerCookie();
    await api.init({ "Content-Type": false }, buyerCookie);

    const res = await api.postUploadDocument(
      filePath,
      DocumentCategory.LEGAL,
      DocumentKind.STANDARD_NDA,
      "New nda"
    );
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should Unauthorized when fake coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let fakeCookie = randomUUID();
    await api.init({ "Content-Type": false }, fakeCookie);

    const res = await api.postUploadDocument(
      filePath,
      DocumentCategory.LEGAL,
      DocumentKind.STANDARD_NDA,
      "New nda"
    );
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
