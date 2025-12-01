import { test, expect } from "@playwright/test";
import { getSupplierCookie, getBuyerCookie } from "../../../src/utils/getEnv";
import { RfqsApiClient } from "../../../src/api/RfqsApiClient";
import { UserApiClient } from "../../../src/api/UserApiClient";
import {
  UploadSessionsApiClient,
  UploadData,
} from "../../../src/api/UploadSessionsApiClient";
import { RfqFactory } from "../../../src/utils/rfqs/rfqFactory";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import { faker } from "@faker-js/faker";
import path from "path";

const validator = new ResponseValidationHelper();

test.describe("API: PATCH RFQs ", () => {
  let api: RfqsApiClient;
  let supplierCookie: string;
  let buyerCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
  });

  test(`should return success when patch BULK RFQ type`, async () => {
    // create RFQ
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqData = RfqFactory.bulk();
    const resPost = await api.postRfqs(rfqData);
    const id = resPost.body.id;
    expect(
      resPost.status,
      `Expected status code is 200, but got ${resPost.status}`
    ).toBe(201);
    const patchBulkData = RfqFactory.patchOnlyType("OPEN");
    const patchRes = await api.patchRfqsId(id, patchBulkData);
    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toHaveProperty("id");
    expect(patchRes.body).toHaveProperty("type");
    expect(patchRes.body.type).toBe("OPEN");

    // check RFQ type was changed
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(id);
    const body = resGet.body;
    expect(body.type).toEqual(patchRes.body.type);
  });

  test(`should return success when patch CUSTOM RFQ.`, async () => {
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
    await uploadApi.getUploadsSessions(
      backendUploadRes.body.id,
      organizationId
    );

    // finalise session
    await uploadApi.init({}, buyerCookie);
    const finalizeBody = {
      sessionIds: [backendUploadRes.body.id],
      organizationId: organizationId,
    };
    const resSessionFinalaize = await uploadApi.postUploadSessionsFinalize(
      finalizeBody
    );

    expect(
      resSessionFinalaize.body.fileIds.length,
      `Expected file IDs length > 0, but got ${resSessionFinalaize.body.fileIds.length}`
    ).toBeGreaterThan(0);
    const fileId = resSessionFinalaize.body.fileIds[0];
    expect(resSessionFinalaize.status).toBe(201);

    // create RFQ
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataCustom = RfqFactory.custom(fileId, "RFQ.pdf");
    const resPost = await api.postRfqs(rfqDataCustom);
    const id = resPost.body.id;

    //change RFQ
    const patchBulkData = RfqFactory.patchNonconfOnly({
      projectDescription: "Updated project description",
      proposalTurnaroundDays: 10,
      deliveryDate: "2026-01-01",
      targetBudget: 20000,
      sector: "Pharmaceutical",
      stage: "Preclinical",
      complexity: "Medium",
      companySize: "Mid-size",
      region: "Europe",
      priority: "High",
      quantity: "10kg",
      purityMinPct: 97,
      deliveryTime: "3-4 weeks",
    });
    const patchRes = await api.patchRfqsId(id, patchBulkData);
    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toHaveProperty("id");

    // check RFQ was changed
  });

  test(`should return succcess when patch OPEN RFQ`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.open();
    const resPost = await api.postRfqs(rfqDataOpen);
    const id = resPost.body.id;

    //change RFQ
    const patchOpenRfqData = RfqFactory.patchDueDateOnly("2026-04-23");
    const patchRes = await api.patchRfqsId(id, patchOpenRfqData);
    expect(patchRes.status).toBe(200);
    expect(patchRes.body).toHaveProperty("id");
    expect(patchRes.body).toHaveProperty("dueDate");

    // check RFQ date was changed
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(id);
    const body = resGet.body;
    expect(
      body.dueDate,
      `Expected due date is ${patchRes.body.dueDate}, bit got ${body.dueDate}`
    ).toEqual(patchRes.body.dueDate);
  });

  test(`should return 404 when patch RFQ with fake ID`, async () => {
    const fakeId = faker.string.uuid();
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const patchOpenRfqData = RfqFactory.patchDueDateOnly("2026-05-05");
    const patchRes = await api.patchRfqsId(fakeId, patchOpenRfqData);
    validator.expectStatusCodeAndMessage(
      patchRes,
      404,
      "RFQ not found or access denied"
    );
  });

  test(`should return 422 when patch RFQ with invalid body`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.open();
    const resPost = await api.postRfqs(rfqDataOpen);
    const id = resPost.body.id;

    const patchOpenRfqData = RfqFactory.invalidWrongType();
    const patchRes = await api.patchRfqsId(id, patchOpenRfqData);
    validator.expectStatusCodeAndMessage(
      patchRes,
      422,
      "type must be one of the following values: BULK, OPEN, CUSTOM",
      "type"
    );
  });

  test(`should return 403 when patch RFQ with supplier cookie`, async () => {
    const fakeId = faker.string.uuid();
    api = new RfqsApiClient();
    await api.init({}, supplierCookie);
    const patchOpenRfqData = RfqFactory.invalidWrongType();
    const patchRes = await api.patchRfqsId(fakeId, patchOpenRfqData);
    validator.expectStatusCodeAndMessage(
      patchRes,
      403,
      "Forbidden for your permission"
    );
  });
});
