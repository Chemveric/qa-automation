import { test } from "@playwright/test";
import { InvitationsPage } from "../../src/pages/InvitationsPage";
import { ENV } from "../../src/config/env";
import { Invitations, Messages } from "../../src/data/invitationData";
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
  });

  test("should show success toaster after sending Buyer invitations", async () => {
    await inv.open();
    await inv.openCreateForm();
    const buyerData = Invitations.buyer;
    //Act
    await inv.fillAndSend(buyerData);
    //Assert
    await inv.expectMessage(Messages.success)
  });

    test("should show success toaster after sending Vendor invitations", async () => {
      await inv.open();
      await inv.openCreateForm();
      const vendorData = Invitations.vendor;
      //Act
      await inv.fillAndSend(vendorData);
      //Assert
      await inv.expectMessage(Messages.success)
  });

  test.afterAll(async () => {
    await inv.close();
  });
});
