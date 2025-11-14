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

    // complete session
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

    // get session status
    await api.init({ "Content-Type": false }, supplierCookie);
    const resSessionStatus = await api.getUploadsSessions(
      sessionId,
      supplierOrganizationId
    );
    const sessionStatus = resSessionStatus.body.state;
    console.log("sessionStatus: ", sessionStatus);
  });

  test(`should finalize upload session via presigned link`, async () => {
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    expect(resFinalize.status).toBe(201);
    expect(resFinalize.body).toHaveProperty("fileIds");
  });

  test.skip(`should finalize upload session via presigned link when send request with buyer cookie`, async () => {
    await api.init({}, buyerCookie);
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    expect(resFinalize.status).toBe(201);
  });

  test(`should get 422 when send request with invalid session id`, async () => {
    const finalizeBody = {
      sessionIds: ["sessionId"],
      organizationId: supplierOrganizationId,
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    validator.expectStatusCodeAndMessage(
      resFinalize,
      422,
      "each value in sessionIds must be a UUID",
      "sessionIds"
    );
  });

  test(`should get 422 when send request with fake organizationId`, async () => {
    const finalizeBody = {
      sessionIds: [sessionId],
      organizationId: faker.string.ulid(),
    };
    const resFinalize = await api.postUploadSessionsFinalize(finalizeBody);
    validator.expectStatusCodeAndMessage(
      resFinalize,
      422,
      "ERR017",
      "organizationId"
    );
  });
});
