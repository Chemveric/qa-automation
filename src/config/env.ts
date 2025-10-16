import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  uiURL: process.env.CHEMVERIC_UI_URL || 'https://admin-chemveric.dev.gdev.group',
  apiURL: process.env.CHEMVERIC_API_URL || 'https://api-chemveric.dev.gdev.group/v1',
  admin: {
    email: process.env.CHEMVERIC_ADMIN_EMAIL || 'admin@admin.com',
    password: process.env.CHEMVERIC_ADMIN_PASSWORD || ''
  },
  invites: {
    buyerEmail: process.env.INVITE_BUYER_EMAIL || `buyer_${Date.now()}@example.com`,
    vendorEmail: process.env.INVITE_VENDOR_EMAIL || `vendor_${Date.now()}@example.com`
  }
};
