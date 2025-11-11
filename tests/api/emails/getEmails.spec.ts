import { test, expect } from "@playwright/test";
import { EmailsApiClient } from "../../../src/api/EmailsApiClient";
import { approvalStatusEnum } from "../../../src/config/enums";
import { EmailChangeRequestListSchema } from "../../../src/schema/emailChangeRequestSchema";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { getAdminCookie } from "../../../src/utils/getEnv";
import { faker } from "@faker-js/faker";

const validator = new ResponseValidationHelper();

test.describe("API: Get emails filtered", () => {
  let api: EmailsApiClient;
  let adminCookie: string;

  test.beforeAll(async () => {
  adminCookie = getAdminCookie();
  api = new EmailsApiClient();
  await api.init({}, adminCookie);
  });

  for (const status of approvalStatusEnum) {
    test(`should return expected schema when send valid request with status: ${status}`, async () => {
      const params = {
          sort: ["createdAt", "DESC"],
          range: [0, 10],
          filter: { status: status },
      };
      const res = await api.getEmailChangeRequest(params);
      expect(res.status).toBe(200);
      const body = await res.body;
      const emails = await validateResponse(
        { status: res.status, body },
        EmailChangeRequestListSchema
      );
      expect(Array.isArray(emails.data)).toBe(true);

      for (const email of emails.data) {
          expect(email).toHaveProperty("id");
          expect(email).toHaveProperty("status");
          expect(email).toHaveProperty("organization");
      }
    });
  }

  test("should return expected schema when send valid request with only filter param", async () => {
    const randomStatus =
      Object.values(approvalStatusEnum)[
      Math.floor(Math.random() * Object.values(approvalStatusEnum).length)
      ];
    const res = await api.getEmailChangeRequest({
      filter: { status: randomStatus },
    });
    expect(res.status).toBe(200);
    const body = await res.body;
    const emails = await validateResponse(
      { status: res.status, body },
      EmailChangeRequestListSchema
    );
    expect(Array.isArray(emails.data)).toBe(true);

    for (const email of emails.data) {
      expect(email).toHaveProperty("id");
      expect(email).toHaveProperty("status");
      expect(email).toHaveProperty("organization");
    }
  });

  test("should return expected schema when send valid request with search param", async () => {
    const res = await api.getEmailChangeRequest({
      filter: { status: "ALL" , search: "Co" },
    });
    expect(res.status).toBe(200);
    const body = await res.body;
    const emails = await validateResponse(
      { status: res.status, body },
      EmailChangeRequestListSchema
    );
    expect(Array.isArray(emails.data)).toBe(true);

    for (const email of emails.data) {
      expect(email).toHaveProperty("id");
      expect(email).toHaveProperty("status");
      expect(email).toHaveProperty("organization");
    }
  });

  test("should return 400 when send invalid status value in params", async () => {
    const res = await api.getEmailChangeRequest({
      filter: { status: faker.lorem.word(), search: faker.company.name() },
    });
    validator.expectStatusCodeAndMessage(res, 400, "Invalid status filter");
  });

  test("should return 422 when send invalid sort param", async () => {
    const res = await api.getEmailChangeRequest({
      sort: ["companyName", "ASC"],
    });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Value must be a valid JSON array of two strings"
      );
  });

  test("should return 422 when send invalid range param", async () => {
    const res = await api.getEmailChangeRequest({
      range: [faker.word.words(1), faker.word.words(1)],
      });
    validator.expectStatusCodeAndMessage(
      res,
      422,
      "Value must be a valid JSON array of two numbers"
      );
  });
});