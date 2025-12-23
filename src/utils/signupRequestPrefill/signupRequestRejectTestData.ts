export interface TestUser {
  role: string;
  secondaryRole: string | null;
  vendorModes: [];
  email: string;
  firstName: string;
  lastName: string;
  companyTitle: string;
  companyCity: string;
  companyName: string;
  companyRegionId: string;
  companyCountryId: string;
  companyState: string;
  companyStreet: string;
  companyPostalCode: string;
  licenseFilesId: [string];
  termsAccepted: boolean;
  lastRejectTokenUuid: string | null;
}

export function getRejectedRequestData(): TestUser {
  return {
    role: "BUYER",
    secondaryRole: null,
    vendorModes: [],
    email: "nadiia.patrusheva+1230@globaldev.tech",
    firstName: "Nadia",
    lastName: "Test",
    companyTitle: "cosmetics boom",
    companyCity: "LA",
    companyName: "Cosmetics boom",
    companyRegionId: "e532e8d6-0943-48ec-9085-de33133efe6d",
    companyCountryId: "de5c50d1-ef20-4870-ae3b-9e4c2a85dc8b",
    companyState: "California",
    companyStreet: "4511 Sunset Blvd, Los Angeles, CA ",
    companyPostalCode: "90027",
    licenseFilesId: ["52d6d016-e0c6-4d2a-bfaf-f1de10fec268"],
    termsAccepted: true,
    lastRejectTokenUuid: null,
  };
}

export function getRejectedRequestId(): string {
  return "d7725706-4c8a-40d1-8aac-aec3835c5f59";
}
