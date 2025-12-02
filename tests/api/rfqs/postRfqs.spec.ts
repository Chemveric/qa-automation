import { test, expect } from "@playwright/test";
import {
  getSupplierCookie,
  getBuyerCookie,
  getAdminCookie,
} from "../../../src/utils/getEnv";
import { RfqsApiClient } from "../../../src/api/RfqsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import {
  UploadSessionsApiClient,
  UploadData,
} from "../../../src/api/UploadSessionsApiClient";
import { RfqFactory } from "../../../src/utils/rfqs/rfqFactory";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import path from "path";

const validator = new ResponseValidationHelper();

test.describe("API: POST RFQs", () => {
  let api: RfqsApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let adminCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
    adminCookie = getAdminCookie();
  });

  test(`should return success when send valid data for BULK RFQ`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataBulk = RfqFactory.bulk();
    const res = await api.postRfqs(rfqDataBulk);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("dueDate");
    expect(body).toHaveProperty("createdAt");
    expect(body.type).toBe("BULK");
    expect(body.status).toBe("DRAFT");
  });

  test(`should return success when send valid data for CUSTOM Minimal RFQ Step1 `, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataBulk = RfqFactory.customStep1Minimal();
    const res = await api.postRfqs(rfqDataBulk);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("dueDate");
    expect(body).toHaveProperty("createdAt");
    expect(body.type).toBe("CUSTOM");
    expect(body.status).toBe("DRAFT");
  });

  test(`should return success when send valid data for CUSTOM Non-conf RFQ Step2 Required fields`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataBulk = RfqFactory.customStep2RequiredFields();
    const res = await api.postRfqs(rfqDataBulk);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("dueDate");
    expect(body).toHaveProperty("createdAt");
    expect(body.type).toBe("CUSTOM");
    expect(body.status).toBe("DRAFT");
  });

  test(`should return success when send valid data for Full CUSTOM RFQ Step3 `, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataBulk = RfqFactory.createCustomFullStep3();
    const res = await api.postRfqs(rfqDataBulk);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("dueDate");
    expect(body).toHaveProperty("createdAt");
    expect(body.type).toBe("CUSTOM");
    expect(body.status).toBe("DRAFT");
  });

  test(`should return success when send valid data for CUSTOM RFQ with buyer cookie`, async () => {
    // get user data
    const userApi = new UserApiClient();
    await userApi.init({ "Content-Type": false }, buyerCookie);
    const resUser = await userApi.getUser();
    const organizationId = resUser.body.organization.id;

    // upload file
    const filePath = path.join(process.cwd(), "src/data/files/RFQ.pdf");
    const uploadApi = new UploadSessionsApiClient();
    await uploadApi.init({ "Content-Type": false }, buyerCookie);
    const uploadData: UploadData = FileUploadValidData.rfq(organizationId);
    const backendUploadRes = await uploadApi.postUploadsSessionsRelay(
      "relay",
      filePath,
      uploadData
    );

    // get status by id
    const getRes = await uploadApi.getUploadsSessions(
      backendUploadRes.body.id,
      organizationId
    );
    console.log("State of scanning: ", getRes.body.state);

    // finalise upload session
    await uploadApi.init({}, buyerCookie);
    const finalizeBody = {
      sessionIds: [backendUploadRes.body.id],
      organizationId: organizationId,
    };
    const resSessionFinalaize = await uploadApi.postUploadSessionsFinalize(
      finalizeBody
    );
    const fileId = resSessionFinalaize.body.fileIds[0];
    expect(resSessionFinalaize.status).toBe(201);

    // create RFQ
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataCustom = RfqFactory.custom(fileId, "RFQ.pdf");
    const res = await api.postRfqs(rfqDataCustom);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("dueDate");
    expect(body).toHaveProperty("createdAt");
    expect(body.type).toBe("CUSTOM");
    expect(body.status).toBe("DRAFT");
  });

  test(`should return success when send valid data for OPEN RFQ with buyer cookie`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.open();
    const res = await api.postRfqs(rfqDataOpen);
    const body = res.body;
    expect(
      res.status,
      `Expected status code is 200, but got ${res.status}`
    ).toBe(201);
    expect(body).toHaveProperty("id");
    expect(body).toHaveProperty("type");
    expect(body).toHaveProperty("status");
    expect(body).toHaveProperty("dueDate");
    expect(body).toHaveProperty("createdAt");
    expect(body.type).toBe("OPEN");
    expect(body.status).toBe("DRAFT");
  });

  test(`should return 422 when send wrong RFQ type`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqData = RfqFactory.invalidWrongType();
    const res = await api.postRfqs(rfqData);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "type must be one of the following values: BULK, OPEN, CUSTOM"
    );
  });

  test(`should return 422 when send empty date`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqData = RfqFactory.createOpenWithDueDate("");
    const res = await api.postRfqs(rfqData);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "dueDate must be a valid ISO 8601 date string",
      "dueDate"
    );
  });

  test(`should return 400 when send BULK with buyer cookie`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqData = RfqFactory.bulkFull();
    const res = await api.postRfqs(rfqData);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "BULK RFQs should not contain detailed specs (managed by admin)"
    );
  });

  test(`should return 422 when send invalid date`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqData = RfqFactory.createOpenWithDueDate("date");
    const res = await api.postRfqs(rfqData);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "dueDate must be a valid ISO 8601 date string",
      "dueDate"
    );
  });

  test(`should return 400 when send invalid purity`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqData = RfqFactory.open({
      nonconf: { purityMinPct: "hello!" }, // override only purity
    });
    const res = await api.postRfqs(rfqData);
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "purityMinPct must be a number conforming to the specified constraints",
      "nonconf.purityMinPct"
    );
  });
});
