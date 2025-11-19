import { randomUUID } from "crypto";

export const inviteBuyerTestCases = [
  {
    firstName: "Buyer",
    lastName: "All",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "BUYER",
        subRoles: [
          "BUYER_PROCUREMENT_MANAGER",
          "BUYER_SCIENTIST",
          "BUYER_LEGAL",
          "BUYER_CUSTOMER_SERVICE",
        ],
      },
    ],
  },
  {
    firstName: "Buyer",
    lastName: "Manager",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "BUYER",
        subRoles: ["BUYER_PROCUREMENT_MANAGER"],
      },
    ],
  },
];

export const inviteBuyerValidationTestCases = [
  {
    firstName: "Buyer",
    lastName: "Admin",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "BUYER",
        subRoles: ["BUYER_ADMIN"],
      },
    ],
    expectedError: "Admin count exceeded for this organization",
  },
  {
    firstName: "VENDOR",
    lastName: "Admin",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "VENDOR",
        subRoles: ["VENDOR_ADMIN"],
      },
    ],
    expectedError: "Invalid role set",
  },
  {
    firstName: "VENDOR",
    lastName: "All",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "VENDOR",
        subRoles: ["VENDOR_QUALITY", "VENDOR_TECH_LEAD", "VENDOR_SALES"],
      },
    ],
    expectedError: "Invalid role set",
  },
];

export const inviteVendorTestCases = [
  {
    firstName: "VENDOR",
    lastName: "All",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "VENDOR",
        subRoles: ["VENDOR_QUALITY", "VENDOR_TECH_LEAD", "VENDOR_SALES"],
      },
        ],
    name: "Invite vendor with all subroles",
  },
  {
    firstName: "VENDOR",
    lastName: "Tech Lead",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "VENDOR",
        subRoles: ["VENDOR_TECH_LEAD"],
      },
      ],
      name: "Invite vendor with tech lead subrole",
  },
  {
    firstName: "Buyer",
    lastName: "All",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "BUYER",
        subRoles: [
          "BUYER_PROCUREMENT_MANAGER",
          "BUYER_SCIENTIST",
          "BUYER_LEGAL",
          "BUYER_CUSTOMER_SERVICE",
        ],
      },
      ],
      name: "Invite buyer to vendor organization with all subroles",
  },
];

export const inviteVendorValidationTestCases = [
  {
    firstName: "VENDOR",
    lastName: "Admin",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "VENDOR",
        subRoles: ["VENDOR_ADMIN"],
      },
    ],
    expectedError: "Admin count exceeded for this organization",
  },
  {
    firstName: "Buyer",
    lastName: "Admin",
    email: `test${randomUUID()}@globaldev.tech`,
    roles: [
      {
        roleset: "BUYER",
        subRoles: ["BUYER_ADMIN"],
      },
    ],
    expectedError: "Admin count exceeded for this organization",
  },
];
