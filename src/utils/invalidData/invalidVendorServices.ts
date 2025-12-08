export const invalidVendorServices = {
  categoryId: [
    { value: "", expectedError: "categoryId must be a UUID" },
    { value: 12345, expectedError: "categoryId must be a UUID" },
    { value: "hello world!", expectedError: "categoryId must be a UUID" },
  ],
  name: [
    { value: "", expectedError: "ERR008" },
    { value: "123", expectedError: "ERR008" },
    { value: "###", expectedError: "ERR008" },
    {
      value: "x".repeat(101),
      expectedError: "ERR008",
    },
  ],
  description: [
    {
      value: "",
      expectedError: "description must be longer than or equal to 1 characters",
    },
    { value: "123", expectedError: "Only letters are allowed" },
    { value: "###", expectedError: "Only letters are allowed" },
    {
      value: "x".repeat(256),
      expectedError:
        "description must be shorter than or equal to 255 characters",
    },
  ],
  domain: [
    {
      value: "",
      expectedError:
        "domain must be one of the following values: BIOLOGY, CHEMISTRY, CLINICAL_OPERATIONS, DIGITAL_SOLUTIONS, MANUFACTURING, MEDICAL_DEVICES, REGULATORY_AND_QUALITY",
    },
    {
      value: "123",
      expectedError:
        "domain must be one of the following values: BIOLOGY, CHEMISTRY, CLINICAL_OPERATIONS, DIGITAL_SOLUTIONS, MANUFACTURING, MEDICAL_DEVICES, REGULATORY_AND_QUALITY",
    },
    {
      value: "###",
      expectedError:
        "domain must be one of the following values: BIOLOGY, CHEMISTRY, CLINICAL_OPERATIONS, DIGITAL_SOLUTIONS, MANUFACTURING, MEDICAL_DEVICES, REGULATORY_AND_QUALITY",
    },
    {
      value: "discovery",
      expectedError:
        "domain must be one of the following values: BIOLOGY, CHEMISTRY, CLINICAL_OPERATIONS, DIGITAL_SOLUTIONS, MANUFACTURING, MEDICAL_DEVICES, REGULATORY_AND_QUALITY",
    },
  ],
  developmentPhase: [
    {
      value: "",
      expectedError:
        "developmentPhase must be one of the following values: DISCOVERY, PRECLINICAL, CLINICAL_DEVELOPMENT, MULTI_STAGE, FUNCTIONAL_SERVICES, COMMERCIAL_POST_MARKET, POST_MARKET",
    },
    {
      value: "123",
      expectedError:
        "developmentPhase must be one of the following values: DISCOVERY, PRECLINICAL, CLINICAL_DEVELOPMENT, MULTI_STAGE, FUNCTIONAL_SERVICES, COMMERCIAL_POST_MARKET, POST_MARKET",
    },
    {
      value: "###",
      expectedError:
        "developmentPhase must be one of the following values: DISCOVERY, PRECLINICAL, CLINICAL_DEVELOPMENT, MULTI_STAGE, FUNCTIONAL_SERVICES, COMMERCIAL_POST_MARKET, POST_MARKET",
    },
    {
      value: "discovery",
      expectedError:
        "developmentPhase must be one of the following values: DISCOVERY, PRECLINICAL, CLINICAL_DEVELOPMENT, MULTI_STAGE, FUNCTIONAL_SERVICES, COMMERCIAL_POST_MARKET, POST_MARKET",
    },
  ],
};

export const requiredFields = [
  { field: "name", message: "ERR002" },
  {
    field: "description",
    message: "ERR002",
  },
  {
    field: "categoryId",
    message: "ERR002",
  },
  { field: "domain", message: "ERR002" },
  { field: "developmentPhase", message: "ERR002" },
];
