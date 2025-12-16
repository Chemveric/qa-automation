import { test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getSupplierCookie,
  getBuyerCookie,
} from "../../../src/utils/getEnv";
import {
  UploadSessionsApiClient,
  UploadData,
} from "../../../src/api/UploadSessionsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import path from "path";
import fs from "fs";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { NdaListSchema } from "../../../src/schema/organizationNdaSchema";
import { randomUUID } from "crypto";

const validator = new ResponseValidationHelper();

test.describe("API: POST edit organization NDA", () => {
  let api: OrganizationsApiClient;
  let uploadApi: UploadSessionsApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let organizationId: string;
  let filePath: string;
  let sessionId: string;
  let checksum: string;
  let fileId: string;

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
    await userApi.init({ "Content-Type": false }, buyerCookie);
    const resUser = await userApi.getUser();
    organizationId = resUser.body.organization.id;

    // get presigned url to upload file
    uploadApi = new UploadSessionsApiClient();
    await uploadApi.init({}, buyerCookie);
    const sessionBody = FileUploadValidData.nda(organizationId);
    checksum = sessionBody.checksum;
    const resSession = await uploadApi.postUploadsSessions(sessionBody);
    sessionId = resSession.body.id;

    // upload file via presigned url
    const uploadRes = await uploadApi.uploadFile(
      resSession.body.presignedUrl,
      resSession.body.headers,
      fs.readFileSync(filePath)
    );
    expect([200, 201, 204]).toContain(uploadRes.status);

    // complete session
    const sessionCompleteBody = {
      organizationId: organizationId,
      checksum: checksum,
    };
    const resSessionComplete = await uploadApi.postUploadSessionsComplete(
      sessionId,
      sessionCompleteBody
    );
    expect(resSessionComplete.status).toBe(201);

    await waitForImportCompleted(uploadApi, sessionId, organizationId);

    //finalize upload session
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: organizationId,
    };
    const resFinalize = await uploadApi.postUploadSessionsFinalize(
      finalizeBody
    );
    expect(resFinalize.status).toBe(201);
    fileId = resFinalize.body.fileIds[0];
  });

  test(`should add new custom nda file`, async () => {
    api = new OrganizationsApiClient();
    await api.init({}, buyerCookie);

    const body = {
      ndaFileId: fileId,
      type: "CUSTOM",
    };
    const res = await api.postOrganizationNda(body);
    expect(res.status).toBe(200);
    const validated = await validateResponse(
      { status: res.status, body: res.body },
      NdaListSchema
    );
    expect(validated).not.toBeNull();
    const ndaFileIds = validated.items
      .filter((item) => item.type === "CUSTOM")
      .map((item) => item.ndaFileId);

    expect(ndaFileIds).toContain(fileId);
  });

  test(`should finalize upload session via backend`, async () => {
    // upload file via backend
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, supplierCookie);
    const resUser = await userApi.getUser();
    let supplierOrganizationId = resUser.body.organization.id;

    const uploadApi = new UploadSessionsApiClient();
    await uploadApi.init({ "Content-Type": false }, supplierCookie);
    const uploadData: UploadData = FileUploadValidData.nda(
      supplierOrganizationId
    );
    const backendUploadRes = await uploadApi.postUploadsSessionsRelay(
      "relay",
      filePath,
      uploadData
    );

    await waitForImportCompleted(
      uploadApi,
      backendUploadRes.body.id,
      supplierOrganizationId
    );

    // finalise session if status is clean
    const finalizeBody = {
      sessionIds: [backendUploadRes.body.id],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await uploadApi.postUploadSessionsFinalize(
      finalizeBody
    );
    expect(resFinalize.status).toBe(201);
    fileId = resFinalize.body.fileIds[0];
    api = new OrganizationsApiClient();
    await api.init({}, supplierCookie);

    const body = {
      ndaFileId: fileId,
      type: "CUSTOM",
    };
    const res = await api.postOrganizationNda(body);
    expect(res.status).toBe(200);
    const validated = await validateResponse(
      { status: res.status, body: res.body },
      NdaListSchema
    );
    expect(validated).not.toBeNull();
    const ndaFileIds = validated.items
      .filter((item) => item.type === "CUSTOM")
      .map((item) => item.ndaFileId);

    expect(ndaFileIds).toContain(fileId);
  });

  test(`should return 400 for not exsiting fileId`, async () => {
    api = new OrganizationsApiClient();
    const notExistingFileId = randomUUID();
    await api.init({}, buyerCookie);
    const body = {
      ndaFileId: notExistingFileId,
      type: "CUSTOM",
    };
    const res = await api.postOrganizationNda(body);
    validator.expectStatusCodeAndMessage(res, 400, "NDA file not found");
  });

  test(`should return unauthorized for fake cookie`, async () => {
    api = new OrganizationsApiClient();
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    await api.init({}, fakeCookie);
    const body = {
      ndaFileId: fileId,
      type: "CUSTOM",
    };
    const res = await api.postOrganizationNda(body);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return unauthorized for admin cookie`, async () => {
    api = new OrganizationsApiClient();
    await api.init({}, adminCookie);
    const body = {
      ndaFileId: fileId,
      type: "CUSTOM",
    };
    const res = await api.postOrganizationNda(body);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should finalize upload session via presigned link when send request with supplier cookie`, async () => {
    // get user data
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, supplierCookie);
    const resUser = await userApi.getUser();
    organizationId = resUser.body.organization.id;

    // get presigned url to upload file
    uploadApi = new UploadSessionsApiClient();
    await uploadApi.init({}, supplierCookie);
    const sessionBody = FileUploadValidData.nda(organizationId);
    checksum = sessionBody.checksum;
    const resSession = await uploadApi.postUploadsSessions(sessionBody);
    sessionId = resSession.body.id;

    // upload file via presigned url
    const uploadRes = await uploadApi.uploadFile(
      resSession.body.presignedUrl,
      resSession.body.headers,
      fs.readFileSync(filePath)
    );
    expect([200, 201, 204]).toContain(uploadRes.status);

    // complete session
    const sessionCompleteBody = {
      organizationId: organizationId,
      checksum: checksum,
    };
    const resSessionComplete = await uploadApi.postUploadSessionsComplete(
      sessionId,
      sessionCompleteBody
    );
    expect(resSessionComplete.status).toBe(201);

    await waitForImportCompleted(uploadApi, sessionId, organizationId);

    //finalize upload session
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: organizationId,
    };
    const resFinalize = await uploadApi.postUploadSessionsFinalize(
      finalizeBody
    );
    expect(resFinalize.status).toBe(201);
    fileId = resFinalize.body.fileIds[0];
    api = new OrganizationsApiClient();
    await api.init({}, supplierCookie);

    const body = {
      ndaFileId: fileId,
      type: "CUSTOM",
    };
    const res = await api.postOrganizationNda(body);
    expect(res.status).toBe(200);
    const validated = await validateResponse(
      { status: res.status, body: res.body },
      NdaListSchema
    );
    expect(validated).not.toBeNull();
    const ndaFileIds = validated.items
      .filter((item) => item.type === "CUSTOM")
      .map((item) => item.ndaFileId);

    expect(ndaFileIds).toContain(fileId);
  });

  async function waitForImportCompleted(
    api: UploadSessionsApiClient,
    sessionId: string,
    organizationid: string,
    timeoutMs = 180_000,
    intervalMs = 5000
  ) {
    const start = Date.now();
    while (true) {
      const res = await api.getUploadsSessions(sessionId, organizationid);
      if (res.status !== 200) throw new Error(res.body.failureReason);
      const body = res.body;
      await res.body;
      const state = body.state;
      if (state === "CLEAN") return body;
      if (state === "failed") throw new Error(body.failureReason);
      if (Date.now() - start > timeoutMs)
        throw new Error("Timeout waiting for completion");
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
});
