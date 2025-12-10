export const signupInviteStatusEnum = [
  "APPLIED",
  "INVITED",
  "DELETED",
  "ALL",
] as const;
export const approvalStatusEnum = [
  "APPROVED",
  "PENDING",
  "REJECTED",
  "ALL",
] as const;
export const VendorModes = ["CRO_CDMO", "CATALOG"] as const;
export const RfqTabParams = ["rfqs", "templates", "drafts", "archived"] as const;


export type SingupInvitesStatusEnum = (typeof signupInviteStatusEnum)[number];
export type SignupRequestStatusEnum = (typeof approvalStatusEnum)[number];
export type VendorMode = (typeof VendorModes)[number];
export type RfqTabParams = (typeof RfqTabParams)[number];
