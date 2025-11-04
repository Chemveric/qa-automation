// import { test } from "../../src/core/fixtures/auth.fixture";
import { test  } from '@playwright/test';
import { InvitationsPage } from "../../src/pages/InvitationsPage";
import { ENV } from "../../src/config/env";
import { Invitations } from "../../src/data/invitationData";
import { createStorageState } from "../../src/core/createStorageState";

test.describe("E2E: Admin invites Buyer & Vendor", () => {
  let adminStoragePath = "storage/admin.json";
  let inv: InvitationsPage;

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
    await inv.open();
  });
  test("complete invitation flow", async () => {
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

});
