import * as dotenv from "dotenv";
dotenv.config();

export const ENV = {
  uiURL:
    process.env.CHEMVERIC_UI_URL || "https://admin-chemveric.dev.gdev.group",
  apiURL:
    process.env.CHEMVERIC_API_URL ||
    "https://api-chemveric.dev.gdev.group/v1/docs",
  admin: {
    email: process.env.CHEMVERIC_ADMIN_EMAIL || "admin@admin.com",
    password: process.env.CHEMVERIC_ADMIN_PASSWORD || "",
    url: process.env.CHEMVERIC_UI_URL,
  },
  buyer: {
    email: process.env.CHEMVERIC_BUYER_EMAIL!,
    password: process.env.CHEMVERIC_BUYER_PASSWORD!,
    url: "/user/home",
  },
  vendor: {
    email: process.env.CHEMVERIC_VENDOR_EMAIL!,
    password: process.env.CHEMVERIC_VENDOR_PASSWORD!,
    url: "/user/home",
  },
  guest: {
    url: process.env.CHEMVERIC_UI_GUEST_URL || '/',
  },
  invites: {
    buyerEmail:
      process.env.INVITE_BUYER_EMAIL || `aqa_buyer_${Date.now()}@example.com`,
    vendorEmail:
      process.env.INVITE_VENDOR_EMAIL || `aqa_vendor_${Date.now()}@example.com`,
  },
  jwtDefaultSettings: {
    secret: process.env.DEFAULT_JWT_SECRET,
    expiresIn: process.env.DEFAULT_JWT_EXPIRES_IN,
    issuer: process.env.DEFAULT_JWT_ISSUER,
    audience: process.env.DEFAULT_JWT_AUDIENCE,
  },
  signUpRejectSettings: {
    secret: process.env.NOTIFICATION_SIGNUP_REJECT_LINK_JWT_SECRET,
    expiresIn: process.env.NOTIFICATION_SIGNUP_REJECT_LINK_JWT_EXPIRES_IN,
    },
  headless: process.env.HEADLESS === "false" || true
};
