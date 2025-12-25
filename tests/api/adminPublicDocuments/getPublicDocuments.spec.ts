import { test, expect } from "@playwright/test";
import { getAdminCookie, getBuyerCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { AdminDocumentsApiClient } from "../../../src/api/AdminDocumentsApiClient";
import { DocumentCategory } from "../../../src/utils/types/documentCategory.typess";
import { DocumentKind } from "../../../src/utils/types/documentKind.types";
import { randomUUID } from "crypto";
import { GetAdminDocumentsResponseSchema } from "../../../src/schema/getAdminDocumentResponseSchema";

const validator = new ResponseValidationHelper();

test.describe("API: GET public documents", () => {
  let api: AdminDocumentsApiClient;
  let adminCookie: string;
  const filePath = "src/data/files/Basic-Non-Disclosure-Agreement.pdf";
  let document = {
    filePath: filePath,
    category: DocumentCategory.LEGAL,
    kind: DocumentKind.TERMS,
    displayName: `New document_${randomUUID()}`,
  };

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
  });

  test(`should return exist documents in descending order`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "DESC"],
      range: [0, 20],
    };

    const res = await api.getPublicDocuments(params);
    expect(res.status).toBe(200);

    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      GetAdminDocumentsResponseSchema
    );

    for (let i = 0; i < validated.data.length - 1; i++) {
      const current = new Date(validated.data[i].createdAt).getTime();
      const next = new Date(validated.data[i + 1].createdAt).getTime();

      expect(current).toBeGreaterThanOrEqual(next);
    }

    const targetRecord = validated.data.find(
      (item) => item.displayName === document.displayName
    );
    expect(targetRecord!.category).toBe(DocumentCategory.LEGAL);
    expect(targetRecord!.kind).toBe(DocumentKind.TERMS);
    expect(targetRecord!.displayName).toBe(document.displayName);
  });

  test(`should return exist documents in ascending order`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 20],
    };

    const res = await api.getPublicDocuments(params);
    expect(res.status).toBe(200);

    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      GetAdminDocumentsResponseSchema
    );

    for (let i = 0; i < validated.data.length - 1; i++) {
      const current = new Date(validated.data[i].createdAt).getTime();
      const next = new Date(validated.data[i + 1].createdAt).getTime();

      expect(current).toBeLessThanOrEqual(next);
    }
  });

  test(`should return exist documents in given range`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 3],
    };

    const res = await api.getPublicDocuments(params);
    expect(res.status).toBe(200);

    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      GetAdminDocumentsResponseSchema
    );

    expect(validated.data.length).toBeLessThanOrEqual(4);
  });

  test(`should return exist documents with given filter`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 3],
      filter: { category: DocumentCategory.EMAIL_ASSETS },
    };

    const res = await api.getPublicDocuments(params);
    expect(res.status).toBe(200);

    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      GetAdminDocumentsResponseSchema
    );

    expect(validated.data.every((d) => d.category === "EMAIL_ASSETS")).toBe(
      true
    );
  });

  test(`should return exist documents with given kind`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 3],
      filter: { kind: DocumentKind.EMAIL_LOGO },
    };

    const res = await api.getPublicDocuments(params);
    expect(res.status).toBe(200);

    const body = await res.body;
    const validated = await validateResponse(
      { status: res.status, body },
      GetAdminDocumentsResponseSchema
    );

    expect(validated.data.every((d) => d.kind === "EMAIL_LOGO")).toBe(true);
  });

  test(`should get error when given wrong filter`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 3],
      filter: { displayName: document.displayName },
    };

    const res = await api.getPublicDocuments(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Filter must be a JSON object with allowed fields: category, kind, isCurrent, isActive"
    );
  });

  test(`should get error when given wrong range`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: ["invalid", "range"],
      filter: { kind: DocumentKind.EMAIL_LOGO },
    };

    const res = await api.getPublicDocuments(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      '"range":"Value must be a valid JSON array of two numbers: e.g. \\"[0, 10]\\""'
    );
  });

  test(`should get error when given wrong sorting`, async () => {
    api = new AdminDocumentsApiClient();
    adminCookie = getAdminCookie();
    await api.init({ "Content-Type": false }, adminCookie);

    const params = {
      sort: ["invalid", "range"],
      range: [0, 3],
      filter: { kind: DocumentKind.EMAIL_LOGO },
    };

    const res = await api.getPublicDocuments(params);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      '"sort":"Value must be a valid JSON array of two strings: e.g. \\"[\\"field\\",\\"ASC|DESC\\"]\\""'
    );
  });

  test(`should Unauthorized when buyer coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let buyerCookie = getBuyerCookie();
    await api.init({ "Content-Type": false }, buyerCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 3],
    };
    const res = await api.getPublicDocuments(params);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should Unauthorized when fake coockie`, async () => {
    api = new AdminDocumentsApiClient();
    let fakeCookie = randomUUID();
    await api.init({ "Content-Type": false }, fakeCookie);

    const params = {
      sort: ["createdAt", "ASC"],
      range: [0, 3],
    };
    const res = await api.getPublicDocuments(params);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });
});
