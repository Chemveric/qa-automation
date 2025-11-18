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
import { FileUploadInvalidFactory } from "../../../src/utils/uploadSessions/fileUploadInvalidFactory";
import path from "path";

const validator = new ResponseValidationHelper();

test.describe("API: POST Upload Sessions Relay.", () => {
  let api: UploadSessionsApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;
  let supplierOrganizationId: string;
  let filePath: string;
  let pngFilePath: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    adminCookie = getAdminCookie();
    buyerCookie = getBuyerCookie();
    filePath = path.join(
      process.cwd(),
      "src/data/files/Basic-Non-Disclosure-Agreement.pdf"
    );
    pngFilePath = path.join(process.cwd(), "src/data/files/red_head2.png");
    userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, supplierCookie);
    const resUser = await userApi.getUser();
    supplierOrganizationId = resUser.body.organization.id;
    api = new UploadSessionsApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
  });

  test(`should upload file via backend relay as supplier`, async () => {
    const uploadData: UploadData = FileUploadValidData.nda(
      supplierOrganizationId
    );

    const resUploadFile = await api.postUploadsSessionsRelay(
      "relay",
      filePath,
      uploadData
    );

    expect(resUploadFile.status).toBe(201);
    expect(resUploadFile.body).toHaveProperty("id");
    expect(resUploadFile.body.purpose).toBe(uploadData.purpose);
    expect(resUploadFile.body.filename).toBe(uploadData.filename);
    expect(resUploadFile.body.mime).toBe(uploadData.mime);
    expect(resUploadFile.body.size).toBe(uploadData.size);
    expect(resUploadFile.body.checksum).toBe(uploadData.checksum);
  });

  test(`should return 400 when upload wrong content type.`, async () => {
    await api.init({ "Content-Type": false }, supplierCookie);
    const uploadData = FileUploadInvalidFactory.invalidOrganizationId();
    const res = await api.postUploadsSessionsRelay(
      "relay",
      filePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Content type mismatch. Expected: image/jpeg, Actual: application/pdf"
    );
  });

  test(`should return 422 when send fake organization id`, async () => {
    const uploadData = FileUploadInvalidFactory.invalidOrganizationId();
    const res = await api.postUploadsSessionsRelay(
      "relay",
      pngFilePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(res, 422, "ERR002", "organizationId");
  });

  test(`should return 422 when no organization id was sent`, async () => {
    const uploadData = FileUploadInvalidFactory.missingOrganizationId();
    const res = await api.postUploadsSessionsRelay(
      "relay",
      pngFilePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(res, 422, "ERR002", "organizationId");
  });

  test(`should return 422 when send request with invalid purpose`, async () => {
    const uploadData = FileUploadInvalidFactory.invalidPurpose();
    const res = await api.postUploadsSessionsRelay(
      "relay",
      pngFilePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(res, 422, "ERR002. ERR002", "purpose");
  });

  test(`should return 422 when send request with invalid mime`, async () => {
    const uploadData = FileUploadInvalidFactory.invalidMime(
      supplierOrganizationId
    );
    const res = await api.postUploadsSessionsRelay(
      "relay",
      pngFilePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(res, 422, "FILE003. FILE003", "mime");
  });

  test(`should return 422 when send request with invalid size`, async () => {
    const uploadData = FileUploadInvalidFactory.invalidSize(
      supplierOrganizationId
    );
    const res = await api.postUploadsSessionsRelay(
      "relay",
      pngFilePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "ERR007. FILE018. FILE018",
      "size"
    );
  });

  test(`should return 422 when send request with invalid checksum`, async () => {
    const uploadData = FileUploadInvalidFactory.invalidChecksum();
    const res = await api.postUploadsSessionsRelay(
      "relay",
      pngFilePath,
      uploadData
    );
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "FILE017. FILE017. FILE017",
      "checksum"
    );
  });
});
