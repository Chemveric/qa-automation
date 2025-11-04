import { test, BrowserContext } from "@playwright/test";
import { InvitationsPage } from "../../src/pages/InvitationsPage";
import { ENV } from "../../src/config/env";
import { Invitations } from "../../src/data/invitationData";
import { createStorageState } from "../../src/core/createStorageState";

test.describe("ADA-US-001: Admin sends invitation", () => {
  let adminStoragePath = "storage/admin.json";
  let inv: InvitationsPage;
  let context!: BrowserContext;

  test.beforeAll(async ({ browser }) => {
    await createStorageState(
      browser,
      ENV.admin.email,
      ENV.admin.password,
      adminStoragePath
    );
    const context = await browser.newContext({
      storageState: adminStoragePath,
    });
    const page = await context.newPage();
    inv = new InvitationsPage(page);
  });

  test.afterAll(async ({ browser }) => {
  await context?.close();
  await browser.close(); 
});
  test("should show success toaster after sending Buyer & Vendor invitations", async () => {
    await inv.open();
    await inv.openCreateForm();
    await inv.fillAndSend(
      Invitations.buyer.firstName,
      Invitations.buyer.lastName,
      ENV.invites.buyerEmail,
      Invitations.buyer.company,
      Invitations.messages.success
    );
    await inv.openCreateForm();
    await inv.fillAndSend(
      Invitations.vendor.firstName,
      Invitations.vendor.lastName,
      ENV.invites.vendorEmail,
      Invitations.vendor.company,
      Invitations.messages.success
    );
  });

  test("should show validation error when send Buyer invitations with the same email", async () => {
    await inv.open();
    await inv.openCreateForm();
    await inv.fillAndSend(
      Invitations.buyer.firstName,
      Invitations.buyer.lastName,
      Invitations.buyer.email,
      Invitations.buyer.company,
      Invitations.messages.duplicate
    );
  });

  test("should show validation errors when clicking Invitation button without filling data", async ({page}) => {
    await inv.open();
    await inv.openCreateForm();
    await inv.sendWithEmptyFields();
  });
});
