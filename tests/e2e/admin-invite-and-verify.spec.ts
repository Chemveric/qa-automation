import { test } from "@playwright/test";
import { InvitationsPage } from "../../src/pages/InvitationsPage";
import { Invitations, Messages } from "../../src/data/invitationData";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";

test.describe("E2E: Admin invites Buyer & Vendor", () => {
    let inv: InvitationsPage;
    test.use({
        storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Admin),
    });

  test.beforeEach(async ({ page }) => {
    inv = new InvitationsPage(page);
  });

  test("should show success toaster after sending Buyer invitations", async ({ page }) => {
    await inv.open();
    await inv.openCreateForm();
    const buyerData = Invitations.buyer;
    // Act
    await inv.fillAndSend(buyerData);
    // Assert
    await inv.expectMessage(Messages.success);
  });

  test("should show success toaster after sending Vendor invitations", async ({ page }) => {
    await inv.open();
    await inv.openCreateForm();
    const vendorData = Invitations.vendor;

    // Act
    await inv.fillAndSend(vendorData);

    // Assert
    await inv.expectMessage(Messages.success);
  });
});
