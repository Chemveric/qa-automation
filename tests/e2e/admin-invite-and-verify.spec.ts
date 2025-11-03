import { test } from '../../src/core/fixtures/auth.fixture';
import { InvitationsPage } from '../../src/pages/InvitationsPage';
import { ENV } from '../../src/config/env';
import { Invitations } from "../../src/data/invitationData";

test.describe('E2E: Admin invites Buyer & Vendor', () => {
   test("complete invitation flow", async ({
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
});
