import { test, expect } from "@playwright/test";
import {
  getAdminCookie,
  getSupplierCookie,
  getBuyerCookie,
} from "../../../src/utils/getEnv";
import { UploadSessionsApiClient } from "../../../src/api/UploadSessionsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadInvalidFactory } from "../../../src/utils/uploadSessions/fileUploadInvalidFactory";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";

const validator = new ResponseValidationHelper();

test.describe("API: POST Upload Sessions.", () => {
  let api: UploadSessionsApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let organizationId: string;

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
  });

  test(`should return success when send valid data with supplier cookie`, async () => {
    const sessionBody = FileUploadValidData.profileImage(organizationId);
    const res = await api.postUploadsSessions(sessionBody);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body.state).toBe("INITIATED");
    expect(body.purpose).toBe(sessionBody.purpose);
    expect(body.filename).toBe(sessionBody.filename);
    expect(body.mime).toBe(sessionBody.mime);
    expect(body.size).toBe(sessionBody.size);
    expect(body.checksum).toBe(sessionBody.checksum);
  });

  test(`should return 404 when send session with invalid organizationId`, async () => {
    const sessionBody = FileUploadInvalidFactory.invalidOrganizationId();
    const res = await api.postUploadsSessions(sessionBody);
    validator.expectStatusCodeAndMessage(res, 404, "Organization not found");
  });

  test(`should return 422 when send session with missing organizationId`, async () => {
    const sessionBody = FileUploadInvalidFactory.missingOrganizationId();
    const res = await api.postUploadsSessions(sessionBody);
    validator.expectStatusCodeAndMessage(res, 422, "ERR002");
  });

  test(`should return 422 when send session with invalid purpose`, async () => {
    const sessionBody = FileUploadInvalidFactory.invalidPurpose();
    const res = await api.postUploadsSessions(sessionBody);
    validator.expectStatusCodeAndMessage(res, 422, "ERR002");
  });

  test(`should return 400 when send session with invalid mime`, async () => {
    const sessionBody = FileUploadInvalidFactory.invalidMime(organizationId);
    const res = await api.postUploadsSessions(sessionBody);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "MIME type not allowed for PROFILE_IMAGE"
    );
  });

  test(`should return 422 when send session with invalid size`, async () => {
    const sessionBody = FileUploadInvalidFactory.invalidSize(organizationId);
    const res = await api.postUploadsSessions(sessionBody);
    validator.expectStatusCodeAndMessage(res, 422, "FILE018");
  });

  test(`should return 422 when send session with invalid checksum`, async () => {
    const sessionBody = FileUploadInvalidFactory.invalidChecksum();
    const res = await api.postUploadsSessions(sessionBody);
    validator.expectStatusCodeAndMessage(res, 422, "FILE017");
  });
});
