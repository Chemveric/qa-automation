import { test, expect } from "@playwright/test";
import { getSupplierCookie, getBuyerCookie } from "../../../src/utils/getEnv";
import {
  UploadSessionsApiClient,
  UploadData,
} from "../../../src/api/UploadSessionsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import fs from "fs";
import { createRandomXlsx } from "../../../src/data/catalogSourceData";
import { getFileInfo } from "../../../src/utils/fileInfo";
import { CatalogImportApiClient } from "../../../src/api/CatalogImportApiClient";
import { JobStatusSchema } from "../../../src/schema/jobSchema";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { createCatalogImportData } from "../../../src/data/catalogImportData";

const validator = new ResponseValidationHelper();

test.describe("API: GET catalog imports", () => {
  let api: UploadSessionsApiClient;
  let importApi: CatalogImportApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let supplierOrganizationId: string;
  let sessionId: string;
  let xlsxPath: string;
  let fileid: string;
  let jobId: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();

    xlsxPath = await createRandomXlsx("chemical_random.xlsx", 3);
    const fileInfo = await getFileInfo(xlsxPath);

    // get user data
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, supplierCookie);
    const resUser = await userApi.getUser();
    supplierOrganizationId = resUser.body.organization.id;

    // get presigned url to upload file
    api = new UploadSessionsApiClient();
    await api.init({}, supplierCookie);
    const sessionBody = FileUploadValidData.catalog(
      supplierOrganizationId,
      fileInfo.filename,
      fileInfo.size,
      fileInfo.checksum
    );
    const resSession = await api.postUploadsSessions(sessionBody);
    sessionId = resSession.body.id;

    // upload file via presigned url
    const uploadRes = await api.uploadFile(
      resSession.body.presignedUrl,
      resSession.body.headers,
      fs.readFileSync(xlsxPath)
    );
    expect([200, 201, 204]).toContain(uploadRes.status);

    // complete session
    await api.init({}, supplierCookie);
    const sessionCompleteBody = {
      organizationId: supplierOrganizationId,
      checksum: fileInfo.checksum,
    };
    const resSessionComplete = await api.postUploadSessionsComplete(
      sessionId,
      sessionCompleteBody
    );
    expect(resSessionComplete.status).toBe(201);

    // get session status
    await waitForCleanStatus(api, sessionId, supplierOrganizationId, {
      intervalMs: 5000,
      timeoutMs: 60000,
    });

    //finalize session
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    expect(resFinalize.status).toBe(201);
    fileid = resFinalize.body.fileIds[0];
    importApi = new CatalogImportApiClient();
    await importApi.init({}, supplierCookie);
    const importBody = createCatalogImportData(fileid);
    const importResponse = await importApi.postImports(importBody);
    jobId = importResponse.body.jobId;
  });

  test(`should return status for existing jobId`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "VENDOR",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    importApi = new CatalogImportApiClient();
    await importApi.init({}, supplierCookie);

    const res = await importApi.getImports(jobId);
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      JobStatusSchema
    );
    expect(validated.jobId).toBe(jobId);
  });

  test(`should return status for existing jobId session via backend`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "VENDOR",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    // upload file via backend
    const uploadApi = new UploadSessionsApiClient();
    const fileInfo = await getFileInfo(xlsxPath);
    await uploadApi.init({ "Content-Type": false }, supplierCookie);
    const uploadData: UploadData = FileUploadValidData.catalog(
      supplierOrganizationId,
      fileInfo.filename,
      fileInfo.size,
      fileInfo.checksum
    );
    const backendUploadRes = await uploadApi.postUploadsSessionsRelay(
      "relay",
      xlsxPath,
      uploadData
    );

    // get status by id
    const res = await uploadApi.getUploadsSessions(
      backendUploadRes.body.id,
      supplierOrganizationId
    );
    const body = res.body;

    // finalise session if status is clean
    if (body.state === "CLEAN") {
      await uploadApi.init({}, supplierCookie);

      const finalizeBody = {
        sessionIds: [backendUploadRes.body.id],
        organizationId: supplierOrganizationId,
      };
      const resSessionComplete = await uploadApi.postUploadSessionsFinalize(
        finalizeBody
      );
      expect(resSessionComplete.status).toBe(201);
      importApi = new CatalogImportApiClient();
      await importApi.init({}, supplierCookie);
      const importBody = createCatalogImportData(fileid);
      const importCatalog = await importApi.postImports(importBody);

      const res = await importApi.getImports(importCatalog.body.jobId);
      expect(res.status).toBe(200);
      const body = await res.body;

      const validated = await validateResponse(
        { status: res.status, body },
        JobStatusSchema
      );
      expect(validated.jobId).toBe(importCatalog.body.jobId);
    }
  });

  test(`should return Forbidden when send request with buyer cookie`, async () => {
    importApi = new CatalogImportApiClient();
    await importApi.init({}, buyerCookie);
    const res = await importApi.getImports(jobId);
    validator.expectStatusCodeAndMessage(res, 403, "Forbidden");
  });

  test(`should return 404 when wrong jobId`, async () => {
    userApi = new UserApiClient();
    await userApi.init({}, supplierCookie);
    const postBody = {
      setRole: "VENDOR",
    };
    const resPost = await userApi.postUserRoles(postBody);
    expect(
      resPost.status,
      `Expected status code is 201, but got ${resPost.status}`
    ).toBe(201);
    importApi = new CatalogImportApiClient();
    const wrongId = 0;
    await importApi.init({}, supplierCookie);
    const res = await importApi.getImports(wrongId);
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      JobStatusSchema
    );
    expect(validated.jobId).toBe(wrongId.toString());
    expect(validated.state).toBe("failed");
    expect(validated.failureReason).toBe("Job not found");
  });

  const waitForCleanStatus = async (
    api: UploadSessionsApiClient,
    uploadId: string,
    supplierOrganizationId: string,
    { intervalMs = 5000, timeoutMs = 60_000 } = {}
  ) => {
    const start = Date.now();

    while (true) {
      const res = await api.getUploadsSessions(
        uploadId,
        supplierOrganizationId
      );

      const state = res.body.state;

      if (state === "CLEAN") {
        return res.body;
      }

      if (Date.now() - start > timeoutMs) {
        throw new Error(
          `Timeout waiting for status CLEAN. Last state: ${state}`
        );
      }

      await new Promise((resolve) => setTimeout(resolve, intervalMs));
    }
  };
});
