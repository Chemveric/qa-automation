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

test.describe("API: publish/post RFQs ", () => {
  let api: RfqsApiClient;
  let supplierCookie: string;
  let buyerCookie: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();
  });

  test(`should return success when publish BULK RFQ without notes`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.bulk();
    const resPost = await api.postRfqs(rfqDataOpen);
    const id = resPost.body.id;
    expect(
      resPost.status,
      `Expected status code is 200, but got ${resPost.status}`
    ).toBe(201);
    const publishData = {};
    const publishRes = await api.postRfqsIdPublish(id, publishData);
    expect(publishRes.status).toBe(201);
    expect(publishRes.body).toHaveProperty("id");
    expect(publishRes.body).toHaveProperty("version");
    expect(publishRes.body).toHaveProperty("status");
    expect(publishRes.body).toHaveProperty("publishedAt");
    expect(publishRes.body.status).toBe("SUBMITTED");
    await api.init({ "Content-Type": false }, buyerCookie);
    const resGet = await api.getRfqById(id);
    const body = resGet.body;
    expect(body.status).toEqual(publishRes.body.status);
  });

  test(`should return success when publish CUSTOM RFQ with notes.`, async () => {
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

    // publish RFQ
    const publishData = {
      notes: "Initial release v1",
    };
    const publishRes = await api.postRfqsIdPublish(id, publishData);
    expect(publishRes.status).toBe(201);
    expect(publishRes.body).toHaveProperty("id");
    expect(publishRes.body).toHaveProperty("version");
    expect(publishRes.body).toHaveProperty("status");
    expect(publishRes.body).toHaveProperty("publishedAt");
    expect(publishRes.body.status).toBe("SUBMITTED");
  });

  test(`should return succcess when publish OPEN RFQ with notes`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.open();
    const resPost = await api.postRfqs(rfqDataOpen);
    const id = resPost.body.id;
    const publishData = {
      notes: "Initial release v1",
    };
    const publishRes = await api.postRfqsIdPublish(id, publishData);
    expect(publishRes.status).toBe(201);
    expect(publishRes.body).toHaveProperty("id");
    expect(publishRes.body).toHaveProperty("version");
    expect(publishRes.body).toHaveProperty("status");
    expect(publishRes.body).toHaveProperty("publishedAt");
    expect(publishRes.body.status).toBe("SUBMITTED");
  });

  test(`should return 404 when publish RFQ with fake ID`, async () => {
    const fakeId = faker.string.uuid();
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const publishData = {
      notes: "Initial release v1",
    };
    const publishRes = await api.postRfqsIdPublish(fakeId, publishData);
    validator.expectStatusCodeAndMessage(
      publishRes,
      404,
      "RFQ not found or access denied"
    );
  });

  test(`should return 422 when publish RFQ with invalid body`, async () => {
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const rfqDataOpen = RfqFactory.open();
    const resPost = await api.postRfqs(rfqDataOpen);
    const id = resPost.body.id;
    api = new RfqsApiClient();
    await api.init({}, buyerCookie);
    const invalidPublishData = {
      no: 123,
    };
    const publishRes = await api.postRfqsIdPublish(id, invalidPublishData);
    validator.expectStatusCodeAndMessage(
      publishRes,
      422,
      "property no should not exist",
      "no"
    );
  });

  test(`should return 403 when publish RFQ with supplier cookie`, async () => {
    const fakeId = faker.string.uuid();
    api = new RfqsApiClient();
    await api.init({}, supplierCookie);
    const publishData = {
      notes: "Initial release v1",
    };
    const resGet = await api.postRfqsIdPublish(fakeId, publishData);
    validator.expectStatusCodeAndMessage(
      resGet,
      403,
      "Forbidden for your permission"
    );
  });
});
