export const signupInviteStatusEnum = [
  "APPLIED",
  "INVITED",
  "DELETED",
  "ALL",
] as const;
export const signupRequestStatusEnum = [
  "APPROVED",
  "PENDING",
  "REJECTED",
  "ALL",
] as const;
export const VendorModes = ["CRO_CDMO", "CATALOG"] as const;

export type SingupInvitesStatusEnum = (typeof signupInviteStatusEnum)[number];
export type SignupRequestStatusEnum = (typeof signupRequestStatusEnum)[number];
export type VendorMode = (typeof VendorModes)[number];
