import { expect } from '@playwright/test';
import { test } from '../../src/core/fixtures/auth.fixture';
import { InvitationsPage } from '../../src/pages/InvitationsPage';
import { ENV } from '../../src/config/env';

test.describe('ADA-US-001: Admin sends invitation', () => {
  test('send Buyer & Vendor invitations (toaster appears)', async ({ page }) => {
    const inv = new InvitationsPage(page);
    await inv.open();
    await inv.openCreateForm();
    await inv.fillAndSend('Test', 'Buyer', ENV.invites.buyerEmail, 'Buyer Co');
    await inv.open();
    await inv.openCreateForm();
    await inv.fillAndSend('Test', 'Vendor', ENV.invites.vendorEmail, 'Vendor Co');
  });
});
