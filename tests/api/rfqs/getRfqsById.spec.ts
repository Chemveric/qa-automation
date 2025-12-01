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
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { FileUploadValidData } from "../../../src/utils/uploadSessions/fileUploadValidData";
import { RfqSchema } from "../../../src/schema/rfqShema";
import { faker } from "@faker-js/faker";
import path from "path";

const validator = new ResponseValidationHelper();

test.describe("API: GET RFQs by ID", () => {
  let api: RfqsApiClient;
  let supplierCookie: string;
  let buyerCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
  });

  test(`should return valid shema when get BULK RFQ by Id`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataBulk = RfqFactory.bulk();
    const resPost = await api.postRfqs(rfqDataBulk);
    const id = resPost.body.id;
    expect(
      resPost.status,
      `Expected status code is 200, but got ${resPost.status}`
    ).toBe(201);
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(id);
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqSchema
    );
    expect(validated).toHaveProperty("id");
    expect(validated).toHaveProperty("type");
    expect(validated).toHaveProperty("status");
    expect(validated).toHaveProperty("dueDate");
  });

  test(`should return valid shema when get CUSTOM RFQ by ID`, async () => {
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
    const fileId = resSessionFinalaize.body.fileIds[0];
    expect(resSessionFinalaize.status).toBe(201);

    // create RFQ
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataCustom = RfqFactory.custom(fileId, "RFQ.pdf");
    const resPost = await api.postRfqs(rfqDataCustom);
    const id = resPost.body.id;

    // get by id
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(id);
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqSchema
    );

    expect(validated).toHaveProperty("id");
    expect(validated).toHaveProperty("type");
    expect(validated).toHaveProperty("status");
    expect(validated).toHaveProperty("dueDate");
  });

  test(`should return valid shema when get OPEN RFQ with by Id`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.open();
    const resPost = await api.postRfqs(rfqDataOpen);
    const id = resPost.body.id;

    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(id);
    const body = resGet.body;
    expect(
      resGet.status,
      `Expected status code is 200, but got ${resGet.status}`
    ).toBe(200);
    const validated = await validateResponse(
      { status: resGet.status, body },
      RfqSchema
    );

    expect(validated).toHaveProperty("id");
    expect(validated).toHaveProperty("type");
    expect(validated).toHaveProperty("status");
    expect(validated).toHaveProperty("dueDate");
  });

  test(`should return 404 when get RFQ by Id with fake ID`, async () => {
    const fakeId = faker.string.uuid();
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(fakeId);
    validator.expectStatusCodeAndMessage(
      resGet,
      404,
      "RFQ not found or access denied"
    );
  });

  test(`should return 403 when get RFQ with supplier cookie`, async () => {
    const fakeId = faker.string.uuid();
    api = new RfqsApiClient();
    await api.init({ "Content-Type": false }, supplierCookie);
    const resGet = await api.getRfqById(fakeId);
    validator.expectStatusCodeAndMessage(
      resGet,
      403,
      "Forbidden for your permission"
    );
  });
});
