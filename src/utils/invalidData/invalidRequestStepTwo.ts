export const invalidSignupStepTwoData = [
  // token
  { field: "token", value: "", expectedError: "token must be a jwt string" },
  {
    field: "token",
    value: "invalid_token",
    expectedError: "token must be a jwt string",
  },
  { field: "token", value: 123, expectedError: "token must be a jwt string" },

  // companyName
  { field: "data.companyName", value: "", expectedError: "ERR009" },
  { field: "data.companyName", value: "A", expectedError: "ERR009" },
  {
    field: "data.companyName",
    value: "A".repeat(201),
    expectedError: "ERR009",
  },

  // companyRegionId
  {
    field: "data.companyRegionId",
    value: "",
    expectedError: "companyRegionId must be a UUID",
  },
  {
    field: "data.companyRegionId",
    value: "invalid",
    expectedError: "companyRegionId must be a UUID",
  },
  {
    field: "data.companyRegionId",
    value: 456,
    expectedError: "companyRegionId must be a UUID",
  },

  // companyCountryId
  { field: "data.companyCountryId", value: "", expectedError: "companyCountryId must be a UUID" },
  { field: "data.companyCountryId", value: null, expectedError: "ERR002" },

  // companyState
  { field: "data.companyState", value: "", expectedError: "ERR008" },
  {
    field: "data.companyState",
    value: "A".repeat(201),
    expectedError: "ERR008",
  },

  // companyCity
  { field: "data.companyCity", value: "", expectedError: "ERR008" },

  // companyStreet
  { field: "data.companyStreet", value: "", expectedError: "ERR009" },
  {
    field: "data.companyStreet",
    value: "A".repeat(201),
    expectedError: "ERR009",
  },

  // companyPostalCode
  { field: "data.companyPostalCode", value: "", expectedError: "ERR008" },
  {
    field: "data.companyPostalCode",
    value: "A".repeat(101),
    expectedError: "ERR008",
  },
] as const;

export const requiredFields = [
  { field: "token", message: "token must be a jwt string" },
  { field: "data.companyName", message: "ERR002" },
  { field: "data.companyRegionId", message: "ERR002" },
  { field: "data.companyCountryId", message: "ERR002" },
  { field: "data.companyState", message: "ERR002" },
  { field: "data.companyCity", message: "ERR002" },
  { field: "data.companyStreet", message: "ERR002" },
  { field: "data.companyPostalCode", message: "ERR002" },
] as const;
