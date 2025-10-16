import { test } from '../../src/core/fixtures/auth.fixture';
import { InvitationsPage } from '../../src/pages/InvitationsPage';
import { ENV } from '../../src/config/env';

test.describe('E2E: Admin invites Buyer & Vendor', () => {
  test('complete invitation flow', async ({ page }) => {
    const inv = new InvitationsPage(page);
    await inv.open();
    await inv.openCreateForm();
    await inv.fillAndSend('Flow', 'Buyer', ENV.invites.buyerEmail, 'Buyer Flow Co');
    await inv.open();
    await inv.openCreateForm();
    await inv.fillAndSend('Flow', 'Vendor', ENV.invites.vendorEmail, 'Vendor Flow Co');
  });
});
