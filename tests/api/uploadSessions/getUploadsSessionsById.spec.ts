import { test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getSupplierCookie,
  getBuyerCookie,
} from "../../../src/utils/getEnv";
import { UploadSessionsApiClient } from "../../../src/api/UploadSessionsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { SessionShema } from "../../../src/schema/sessionShema";
import { faker } from "@faker-js/faker";
import { invalidIds } from "../../../src/utils/invalidData/invalidIds";

const validator = new ResponseValidationHelper();

test.describe("API: GET Upload Session Status by Id.", () => {
  let api: UploadSessionsApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let organizationId: string;
  let sessionId: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    buyerCookie = getBuyerCookie();
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, supplierCookie);
    const resUser = await userApi.getUser();
    organizationId = resUser.body.organization.id;
    api = new UploadSessionsApiClient();
    await api.init({}, supplierCookie);
    const sessionBody = FileUploadValidData.profileImage(organizationId);
    const res = await api.postUploadsSessions(sessionBody);
    const body = res.body;
    sessionId = body.id;
  });

  test(`should return expected schema when send valid data`, async () => {
    const res = await api.getUploadsSessions(sessionId, organizationId);
    const body = res.body;
    const session = await validateResponse(
      { status: res.status, body },
      SessionShema,
      200
    );
    expect(session).toHaveProperty("id");
    expect(session).toHaveProperty("purpose");
    expect(session).toHaveProperty("filename");
    expect(session).toHaveProperty("mime");
    expect(session).toHaveProperty("size");
    expect(session).toHaveProperty("state");
    expect(session).toHaveProperty("scanReport");
    expect(session).toHaveProperty("checksum");
    expect(session).toHaveProperty("createdAt");
    expect(session).toHaveProperty("updatedAt");
    expect(session).toHaveProperty("expiresAt");
  });

  test(`should return 400 when send fake session id`, async () => {
    const fakeSessionId = faker.string.uuid();
    const res = await api.getUploadsSessions(fakeSessionId, organizationId);
    validator.expectStatusCodeAndMessage(res, 400, "Upload session not found");
  });

  test(`should return 400 when send fake organization id`, async () => {
    const fakeOrganizationId = faker.string.uuid();
    const res = await api.getUploadsSessions(sessionId, fakeOrganizationId);
    validator.expectStatusCodeAndMessage(res, 400, "Upload session not found");
  });

  for (const invId of invalidIds) {
    test(`should return 422 when send invalid session id ${invId} bug CHM-575`, async () => {
      const res = await api.getUploadsSessions(invId, organizationId);
      validator.expectStatusCodeAndMessage(
        res,
        422,
        "Upload session not found"
      );
    });
  }
});
