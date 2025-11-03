import { expect } from "@playwright/test";
import { test } from "../../src/core/fixtures/auth.fixture";
import { InvitationsPage } from "../../src/pages/InvitationsPage";
import { ENV } from "../../src/config/env";
import { Invitations } from "../../src/data/invitationData";

test.describe("ADA-US-001: Admin sends invitation", () => {
  test("should show success toaster after sending Buyer & Vendor invitations", async ({
    page,
  }) => {
    const inv = new InvitationsPage(page);
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

  test("should show validation error when send Buyer invitations with the same email", async ({
    page,
  }) => {
    const inv = new InvitationsPage(page);
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

  test("should show validation errors when clicking Invitation button without filling data", async ({
    page,
  }) => {
    const inv = new InvitationsPage(page);
    await inv.open();
    await inv.openCreateForm();
    await inv.sendWithEmptyFields();
  });
});
