
export const statusEnum = ["APPLIED", "INVITED", "DELETED", "ALL"] as const;


export type StatusEnum = (typeof statusEnum)[number];
