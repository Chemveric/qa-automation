import { test, expect } from "@playwright/test";
import { ResponseValidationHelper } from "../../../helpers/ResponseValidationHelper";
import { getBuyerCookie, getSupplierCookie } from "../../../src/utils/getEnv";
import { validateResponse } from "../../../helpers/schemaResponseValidator";
import { OrganizationsApiClient } from "../../../src/api/OrganizationsApiClient";
import { organizationTeammatesSchema } from "../../../src/schema/organizationTeammatesSchema";
import {
  inviteBuyerTestCases,
  inviteBuyerValidationTestCases,
  inviteVendorTestCases,
  inviteVendorValidationTestCases,
} from "../../../src/data/inviteTeammatesData";

const validator = new ResponseValidationHelper();

test.describe("API: invite team member to organization", () => {
  let buyerCookie: string;
  let supplierCookie: string;

  test.beforeAll(async () => {
    buyerCookie = getBuyerCookie();
    supplierCookie = getSupplierCookie();
  });

  inviteBuyerTestCases.forEach((testCase) => {
    test(`should invite ${testCase.firstName} ${testCase.lastName} as ${testCase.roles[0].subRoles[0]}`, async () => {
      const api = new OrganizationsApiClient();
      await api.init({}, buyerCookie);
      const res = await api.inviteOrganizationTeammates(testCase);
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
        (item) => item.email === testCase.email
      );
      expect(createdTeammate).toBeDefined();
      expect(createdTeammate?.firstName).toBe(testCase.firstName);
      expect(createdTeammate?.lastName).toBe(testCase.lastName);
      expect(createdTeammate?.roles[0].subRoles).toEqual(
        expect.arrayContaining(testCase.roles[0].subRoles)
      );
      await api.deleteOrganizationTeammember({
        teammateId: createdTeammate!.id,
      });
    });
  });

  inviteVendorTestCases.forEach((testCase) => {
    test(`${testCase.name}`, async () => {
      const api = new OrganizationsApiClient();
      await api.init({}, supplierCookie);
      const { firstName, lastName, email, roles } = testCase;
      const res = await api.inviteOrganizationTeammates({
        firstName,
        lastName,
        email,
        roles,
      });
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
        (item) => item.email === testCase.email
      );
      expect(createdTeammate?.firstName).toBe(testCase.firstName);
      expect(createdTeammate?.lastName).toBe(testCase.lastName);
      expect(createdTeammate?.roles[0].subRoles).toEqual(
        expect.arrayContaining(testCase.roles[0].subRoles)
      );
      await api.deleteOrganizationTeammember({
        teammateId: createdTeammate!.id,
      });
    });
  });

  inviteBuyerValidationTestCases.forEach((testCase) => {
    test(`should get error with wrong data for buyer ${testCase.firstName} ${testCase.lastName}`, async () => {
      const api = new OrganizationsApiClient();
      await api.init({}, buyerCookie);
      const { firstName, lastName, email, roles } = testCase;
      const res = await api.inviteOrganizationTeammates({
        firstName,
        lastName,
        email,
        roles,
      });
      validator.expectStatusCodeAndMessage(res, 400, testCase.expectedError);
    });
  });

  inviteVendorValidationTestCases.forEach((testCase) => {
    test(`should get error with wrong data for supplier ${testCase.firstName} ${testCase.lastName}`, async () => {
      const api = new OrganizationsApiClient();
      await api.init({}, supplierCookie);
      const { firstName, lastName, email, roles } = testCase;
      const res = await api.inviteOrganizationTeammates({
        firstName,
        lastName,
        email,
        roles,
      });
      validator.expectStatusCodeAndMessage(res, 400, testCase.expectedError);
    });
  });
});
