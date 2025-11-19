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
    filename: "red_head2.png",
    mime: "image/png",
    size: 397049,
    checksum:
      "6e7970f881c4e77dba19765f177d8da5b62c845e6b8fd5cf68239e23272add5b",
  }),

  nda: (orgId: string) => ({
    organizationId: orgId,
    purpose: "NDA",
    filename: "Basic-Non-Disclosure-Agreement.pdf",
    mime: "application/pdf",
    size: 71694,
    checksum:
      "203788e953b24dddab8f335632ab258ce98d436349be26acedd929a511e34e4e",
  }),

    rfq: (orgId: string) => ({
    organizationId: orgId,
    purpose: "RFQ",
    filename: "src/data/files/RFQ.pdf",
    mime: "application/pdf",
    size: 73056,
    checksum:
      "579f1d2cdcd6844454bc968dceddde97e6c7493d41a0b12d60ecbe771d87a5b2",
  }),
};
