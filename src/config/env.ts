import * as dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  baseURL: process.env.CHEMVERIC_BASE_URL || 'https://chemveric.dev.gdev.group',
  apiURL: process.env.CHEMVERIC_API_URL || 'https://chemveric.dev.gdev.group/api',
  buyer: {
    email: process.env.CHEMVERIC_BUYER_EMAIL || 'buyer@example.com',
    password: process.env.CHEMVERIC_BUYER_PASSWORD || 'changeme'
  },
  vendor: {
    email: process.env.CHEMVERIC_VENDOR_EMAIL || 'vendor@example.com',
    password: process.env.CHEMVERIC_VENDOR_PASSWORD || 'changeme'
  }
};
