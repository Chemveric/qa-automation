import { faker } from "@faker-js/faker";

export const filePurpose = [
  "LICENSE_PRE_SIGNUP",
  "RFQ",
  "CATALOG_SOURCE",
  "NDA",
  "PROFILE_IMAGE",
  "SERVICES_SCANNING",
  "PRODUCT_DOCUMENT",
];

export const FileUploadValidData = {
  profileImage: (orgId: string) => ({
    organizationId: orgId,
    purpose: "PROFILE_IMAGE",
    filename: "red_head",
    mime: "image/jpeg",
    size: 2222370,
    checksum:
      "2e10524672de6b7ea411f1fe59372a94b51ba0113058d3cd93d368a47b1e5cad",
  }),

};
