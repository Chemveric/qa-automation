import { request, test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getSupplierCookie,
  getBuyerCookie,
} from "../../../src/utils/getEnv";
import { UploadSessionsApiClient } from "../../../src/api/UploadSessionsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import path from "path";
import { faker } from "@faker-js/faker";
import fs from "fs";

const validator = new ResponseValidationHelper();

test.describe("API: POST Complete Upload Session.", () => {
  let api: UploadSessionsApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let supplierOrganizationId: string;
  let filePath: string;
  let sessionId: string;
  let checksum: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    buyerCookie = getBuyerCookie();
    filePath = path.join(
      process.cwd(),
      "src/data/files/Basic-Non-Disclosure-Agreement.pdf"
    );

    // get user data
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, supplierCookie);
    const resUser = await userApi.getUser();
    supplierOrganizationId = resUser.body.organization.id;

    // get presigned url to upload file
    api = new UploadSessionsApiClient();
    await api.init({}, supplierCookie);
    const sessionBody = FileUploadValidData.nda(supplierOrganizationId);
    checksum = sessionBody.checksum;
    const resSession = await api.postUploadsSessions(sessionBody);
    sessionId = resSession.body.id;

    // upload file via presigned url
    const uploadRes = await api.uploadFile(
      resSession.body.presignedUrl,
      resSession.body.headers,
      fs.readFileSync(filePath)
    );
    expect([200, 201, 204]).toContain(uploadRes.status);
  });

  test(`should complete upload session via presigned link`, async () => {
    await api.init({}, supplierCookie);
    const sessionCompleteBody = {
      organizationId: supplierOrganizationId,
      checksum: checksum,
    };
    const resSessionComplete = await api.postUploadSessionsComplete(
      sessionId,
      sessionCompleteBody
    );
    expect(resSessionComplete.status).toBe(201);
    expect(resSessionComplete.body).toHaveProperty("id");
    expect(resSessionComplete.body).toHaveProperty("purpose");
    expect(resSessionComplete.body).toHaveProperty("filename");
    expect(resSessionComplete.body).toHaveProperty("mime");
    expect(resSessionComplete.body).toHaveProperty("size");
    expect(resSessionComplete.body).toHaveProperty("state");
    expect(resSessionComplete.body).toHaveProperty("scanReport");
    expect(resSessionComplete.body).toHaveProperty("checksum");
    expect(resSessionComplete.body).toHaveProperty("createdAt");
    expect(resSessionComplete.body).toHaveProperty("updatedAt");
    expect(resSessionComplete.body).toHaveProperty("expiresAt");
  });

  test(`should get 400 when send fake session id`, async () => {
    await api.init({}, supplierCookie);
    const sessionCompleteBody = {
      organizationId: supplierOrganizationId,
      checksum: checksum,
    };
    const fakeSessionId = faker.string.uuid();
    const resSessionComplete = await api.postUploadSessionsComplete(
      fakeSessionId,
      sessionCompleteBody
    );
    validator.expectStatusCodeAndMessage(
      resSessionComplete,
      400,
      "Upload session not found"
    );
  });

  test(`should get 422 when send fake organizationId`, async () => {
    await api.init({}, supplierCookie);
    const sessionCompleteBody = {
      organizationId: faker.string.ulid(),
      checksum: checksum,
    };

    const resSessionComplete = await api.postUploadSessionsComplete(
      sessionId,
      sessionCompleteBody
    );
    validator.expectStatusCodeAndMessage(
      resSessionComplete,
      422,
      "ERR017",
      "organizationId"
    );
  });

  test(`BUG: should get 400 when send fake checksum`, async () => {
    await api.init({}, supplierCookie);
    const sessionCompleteBody = {
      organizationId: supplierOrganizationId,
      checksum: faker.string.hexadecimal({ length: 64 }),
    };

    const resSessionComplete = await api.postUploadSessionsComplete(
      sessionId,
      sessionCompleteBody
    );
    validator.expectStatusCodeAndMessage(
      resSessionComplete,
      400,
      "Uploaded file not found or verification failed"
    );
  });
});
