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
import fs from "fs";
import { getFileInfo } from "../../../src/utils/fileInfo";
import { CatalogImportApiClient } from "../../../src/api/CatalogImportApiClient";
import { faker } from "@faker-js/faker";
import { createRandomXlsx } from "../../../src/data/catalogSourceData";
import { createCatalogImportData } from "../../../src/data/catalogImportData";

const validator = new ResponseValidationHelper();

test.describe("API: POST catalog imports", () => {
  let api: UploadSessionsApiClient;
  let importApi: CatalogImportApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let supplierOrganizationId: string;
  let sessionId: string;
  let xlsxPath: string;
  let fileid: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
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
    await api.init({ "Content-Type": false }, supplierCookie);
    const resSessionStatus = await api.getUploadsSessions(
      sessionId,
      supplierOrganizationId
    );
    const sessionStatus = resSessionStatus.body.state;
    console.log("Supplier session status: ", sessionStatus);

    //finalize session
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    expect(resFinalize.status).toBe(201);
    fileid = resFinalize.body.fileIds[0];
  });

  test(`should return jobid for checking file upload`, async () => {
    importApi = new CatalogImportApiClient();
    await importApi.init({}, supplierCookie);
    const importBody = createCatalogImportData(fileid);
    const importCatalog = await importApi.postImports(importBody);
    expect(importCatalog.status).toBe(201);
    expect(importCatalog.body).toHaveProperty("jobId");
  });

  test(`should finalize upload session via backend`, async () => {
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
      expect(importCatalog.status).toBe(201);
      expect(importCatalog.body).toHaveProperty("jobId");
    }
  });

  test(`should finalize upload session via presigned link when send request with buyer cookie`, async () => {
    const fileInfo = await getFileInfo(xlsxPath);

    // get buyer data
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, buyerCookie);
    const resUser = await userApi.getUser();
    supplierOrganizationId = resUser.body.organization.id;

    // get presigned url to upload file
    api = new UploadSessionsApiClient();
    await api.init({}, buyerCookie);
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
    await api.init({}, buyerCookie);
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
    await api.init({ "Content-Type": false }, buyerCookie);
    const resSessionStatus = await api.getUploadsSessions(
      sessionId,
      supplierOrganizationId
    );
    const sessionStatus = resSessionStatus.body.state;
    console.log("Supplier session status: ", sessionStatus);

    //finalize session and get fileId
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    expect(resFinalize.status).toBe(201);
    fileid = resFinalize.body.fileIds[0];

    importApi = new CatalogImportApiClient();
    await importApi.init({}, buyerCookie);
    const importBody = createCatalogImportData(fileid);
    const importCatalog = await importApi.postImports(importBody);
    expect(importCatalog.status).toBe(201);
    expect(importCatalog.body).toHaveProperty("jobId");
  });

  test(`should return 404 when wrong fileId`, async () => {
    importApi = new CatalogImportApiClient();
    var wrongFileId = faker.string.uuid();
    await importApi.init({}, supplierCookie);
    const importBody = createCatalogImportData(wrongFileId);
    const importCatalog = await importApi.postImports(importBody);
    validator.expectStatusCodeAndMessage(importCatalog, 404, "File not found");
  });

  test(`should return 422 when not uuid`, async () => {
    importApi = new CatalogImportApiClient();
    var wrongFileId = "000-3443-223232";
    await importApi.init({}, supplierCookie);
    const importBody = createCatalogImportData(wrongFileId);
    const importCatalog = await importApi.postImports(importBody);
    validator.expectStatusCodeAndMessage(
      importCatalog,
      422,
      "fileId must be a UUID"
    );
  });
});
