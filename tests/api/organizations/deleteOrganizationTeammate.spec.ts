import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { getBuyerCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { organizationTeammatesSchema } from "../../../src/schema/organizationTeammatesSchema";
import { randomUUID } from "crypto";

const validator = new ResponseValidationHelper();

test.describe("API: delete team member from organization", () => {
  let buyerCookie: string;
  let supplierCookie: string;

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
    supplierCookie = getSupplierCookie();
  });

  test(`Shoul delete existing teammate for buyer`, async () => {
    const api = new OrganizationsApiClient();
    await api.init({}, buyerCookie);
    const params = {
      firstName: "Buyer",
      lastName: "All",
      email: `test${randomUUID()}@globaldev.tech`,
      roles: [
        {
          roleset: "BUYER",
          subRoles: [
            "BUYER_PROCUREMENT_MANAGER",
            "BUYER_SCIENTIST",
            "BUYER_LEGAL",
            "BUYER_CUSTOMER_SERVICE",
          ],
        },
      ],
    };
    const res = await api.inviteOrganizationTeammates(params);
    expect(res.status, `Expected status code 200 but got ${res.status}`).toBe(
      200
    );
    const teammatesRes = await api.getOrganizationTeammates({
      page: 1,
      limit: 600,
    });
    const body = await teammatesRes.body;

    const validated = await validateResponse(
      { status: teammatesRes.status, body },
      organizationTeammatesSchema
    );

    const createdTeammate = validated.items.find(
      (item) => item.email === params.email
    );
    const reinviteRes = await api.deleteOrganizationTeammember({
      teammateId: createdTeammate?.id,
    });
    expect(
      reinviteRes.status,
      `Expected status code 200 but got ${reinviteRes.status}`
    ).toBe(200);

    const teammatesResAfter = await api.getOrganizationTeammates({
      page: 1,
      limit: 600,
    });
    const afterBody = await teammatesResAfter.body;
    const ids = afterBody.items.map((item: { id: string }) => item.id);
  });

  test(`Shoul delete existing teammate for vendor`, async () => {
    const api = new OrganizationsApiClient();
    await api.init({}, supplierCookie);
    const params = {
      firstName: "VENDOR",
      lastName: "All",
      email: `test${randomUUID()}@globaldev.tech`,
      roles: [
        {
          roleset: "VENDOR",
          subRoles: ["VENDOR_QUALITY", "VENDOR_TECH_LEAD", "VENDOR_SALES"],
        },
      ],
    };
    const res = await api.inviteOrganizationTeammates(params);
    expect(res.status, `Expected status code 200 but got ${res.status}`).toBe(
      200
    );
    const teammatesRes = await api.getOrganizationTeammates({
      page: 1,
      limit: 600,
    });
    const body = await teammatesRes.body;

    const validated = await validateResponse(
      { status: teammatesRes.status, body },
      organizationTeammatesSchema
    );

    const createdTeammate = validated.items.find(
      (item) => item.email === params.email
    );
    const reinviteRes = await api.organizationsTeammateReinvite({
      teammateId: createdTeammate?.id,
    });
    expect(
      reinviteRes.status,
      `Expected status code 200 but got ${reinviteRes.status}`
    ).toBe(201);
    await api.deleteOrganizationTeammember({
      teammateId: createdTeammate!.id,
    });
  });

  test(`shoul get error if not existing id for buyer`, async () => {
    const api = new OrganizationsApiClient();
    await api.init({}, buyerCookie);
    const id = randomUUID();
    const reinviteRes = await api.organizationsTeammateReinvite({
      teammateId: id,
    });
    validator.expectStatusCodeAndMessage(reinviteRes, 404, "User not found");
  });

  test(`shoul get error if not existing id for supplier`, async () => {
    const api = new OrganizationsApiClient();
    await api.init({}, supplierCookie);
    const id = randomUUID();
    const reinviteRes = await api.organizationsTeammateReinvite({
      teammateId: id,
    });
    validator.expectStatusCodeAndMessage(reinviteRes, 404, "User not found");
  });

  test("should return 401 Unauthorized when delete with fake cookie", async () => {
    const api = new OrganizationsApiClient();
    const fakeCookie = `__Secure-admin-sid=${randomUUID()}`;
    await api.init({}, fakeCookie);
    const id = randomUUID();
    const reinviteRes = await api.organizationsTeammateReinvite({
      teammateId: id,
    });
    validator.expectStatusCodeAndMessage(reinviteRes, 401, "Unauthorized");
  });
});
