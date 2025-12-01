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
import {
  createRandomXlsx,
  readChemicalXlsx,
} from "../../../src/data/catalogSourceData";
import { getFileInfo } from "../../../src/utils/fileInfo";
import { CatalogImportApiClient } from "../../../src/api/CatalogImportApiClient";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { CatalogResponseSchema } from "../../../src/schema/catalogProductsSchema";
import { randomUUID } from "crypto";
import { CatalogProductSchema } from "../../../src/schema/catalogProductSchema";

const validator = new ResponseValidationHelper();

test.describe("API: GET catalog product by id", () => {
  let api: UploadSessionsApiClient;
  let importApi: CatalogImportApiClient;
  let userApi: UserApiClient;
  let supplierCookie: string;
  let buyerCookie: string;
  let supplierOrganizationId: string;
  let sessionId: string;
  let xlsxPath: string;
  let fileid: string;
  let productId: string;

  test.beforeAll(async () => {
    supplierCookie = getSupplierCookie();
    buyerCookie = getBuyerCookie();

    xlsxPath = await createRandomXlsx("chemical_random.xlsx", 1);
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

    //import catalog file and wait for complete
    importApi = new CatalogImportApiClient();
    await importApi.init({}, supplierCookie);
    const importBody = {
      fileId: fileid,
      importKind: "BUILDING_BLOCK",
      mode: "merge",
      withRefresh: true,
    };
    const importResponse = await importApi.postImports(importBody);
    let jobId = importResponse.body.jobId;
    await waitForImportCompleted(importApi, jobId);
    // get product id from created products
    const res = await importApi.getProducts();
    const validated = await validateResponse(
      { status: res.status, body: await res.body },
      CatalogResponseSchema
    );
    const excelData = await readChemicalXlsx(xlsxPath);
    const createdProduct = validated.items.find(
      (item) => item.name === excelData.name
    );
    productId = createdProduct?.id as string;
  });

  test(`should return created product by id`, async () => {
    importApi = new CatalogImportApiClient();
    await importApi.init({}, supplierCookie);

    const res = await importApi.getProductById(productId);
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      CatalogProductSchema
    );
    const excelData = await readChemicalXlsx(xlsxPath);
    expect(validated.id).toBe(productId);
    expect(validated.chemicalInfo.name).toBe(excelData.name);
    expect(validated.inStock).toBe(false);
  });

  test(`should return product by id uploaded via backend`, async () => {
    // upload file via backend
    const uploadApi = new UploadSessionsApiClient();
    let xlsxPathbackend = await createRandomXlsx(
      "chemical_random_backend.xlsx",
      1
    );
    const fileInfo = await getFileInfo(xlsxPathbackend);
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
    const statusRes = await uploadApi.getUploadsSessions(
      backendUploadRes.body.id,
      supplierOrganizationId
    );
    const statusBody = statusRes.body;

    // finalise session if status is clean
    if (statusBody.state === "CLEAN") {
      await uploadApi.init({}, supplierCookie);

      const finalizeBody = {
        sessionIds: [backendUploadRes.body.id],
        organizationId: supplierOrganizationId,
      };
      const resSessionComplete = await uploadApi.postUploadSessionsFinalize(
        finalizeBody
      );
      expect(resSessionComplete.status).toBe(201);
      //Get fileupload jobId and wait for complete
      importApi = new CatalogImportApiClient();
      await importApi.init({}, supplierCookie);
      const importBody = {
        fileId: fileid,
        mode: "merge",
        withRefresh: true,
      };
      const importCatalog = await importApi.postImports(importBody);
      await waitForImportCompleted(importApi, importCatalog.body.jobId);

      //get all existing products and get created product
      const productsRes = await importApi.getProducts();
      const products = await validateResponse(
        { status: productsRes.status, body: await productsRes.body },
        CatalogResponseSchema
      );
      const productData = await readChemicalXlsx(xlsxPath);
      const createdProduct = products.items.find(
        (item) => item.name === productData.name
      );
      productId = createdProduct?.id as string;
    }
    //get product by id
    const res = await importApi.getProductById(productId);
    expect(res.status).toBe(200);
    const body = await res.body;

    const validated = await validateResponse(
      { status: res.status, body },
      CatalogProductSchema
    );
    const excelData = await readChemicalXlsx(xlsxPath);
    expect(validated.id).toBe(productId);
    expect(validated.chemicalInfo.name).toBe(excelData.name);
    expect(validated.inStock).toBe(false);
  });

  test(`should return 401 when fake coockie`, async () => {
    importApi = new CatalogImportApiClient();
    await importApi.init({});
    const res = await importApi.getProductById(productId);
    validator.expectStatusCodeAndMessage(res, 401, "Unauthorized");
  });

  test(`should return 400 when fake coockie`, async () => {
    importApi = new CatalogImportApiClient();
    await importApi.init({}, supplierCookie);
    let fakeProductId = "fake-product-id-12345";
    const res = await importApi.getProductById(fakeProductId);
    validator.expectStatusCodeAndMessage(
      res,
      400,
      "Validation failed (uuid is expected)"
    );
  });

  async function waitForImportCompleted(
    importApi: CatalogImportApiClient,
    jobId: number,
    timeoutMs = 180_000,
    intervalMs = 5000
  ) {
    const start = Date.now();
    while (true) {
      const res = await importApi.getImports(jobId);
      if (res.status !== 200) throw new Error(res.body.failureReason);
      const body = res.body;
      await res.body;
      const state = body.state;
      if (state === "completed") return body;
      if (state === "failed") throw new Error(body.failureReason);
      if (Date.now() - start > timeoutMs)
        throw new Error("Timeout waiting for completion");
      await new Promise((r) => setTimeout(r, intervalMs));
    }
  }
});
