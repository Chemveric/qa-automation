export const invalidRequestsStepOne = {
  role: [
    {
      value: "",
      expectedError: "ERR012",
    },
    {
      value: "x",
      expectedError: "ERR012",
    },
    {
      value: 123,
      expectedError: "ERR012",
    },
  ],
  secondaryRole: [
    {
      value: "",
      expectedError: "ERR012",
    },
    {
      value: "x",
      expectedError: "ERR012",
    },
    {
      value: 123,
      expectedError: "ERR012",
    },
  ],
  vendorModes: [
    {
      value: [],
      expectedError: "ERR015",
    },
    {
      value: 123,
      expectedError: "ERR016",
    },
  ],
  firstName: [
    { value: "", expectedError: "ERR032" },
    { value: "123", expectedError: "ERR032" },
    { value: "###", expectedError: "ERR032" },
    {
      value: "x".repeat(101),
      expectedError: "ERR008",
    },
  ],
  lastName: [
    { value: "", expectedError: "ERR032" },
    { value: "###", expectedError: "ERR032" },
    { value: "123", expectedError: "ERR032" },
    {
      value: "x".repeat(101),
      expectedError: "ERR008",
    },
  ],
  companyTitle: [
    { value: "", expectedError: "ERR008" },
    {
      value: "x".repeat(101),
      expectedError: "ERR008",
    },
  ],
  termsAccepted: [
    {
      value: "",
      expectedError: "ERR019",
    },
    {
      value: false,
      expectedError: "ERR019",
    },
    {
      value: 0,
      expectedError: "ERR019",
    },
  ],
};

export const requiredFields = [
  { field: "role", message: "ERR002" },
  { field: "email", message: "ERR002" },
  {
    field: "companyTitle",
    message: "ERR002",
  },
  {
    field: "firstName",
    message: "ERR002",
  },
  { field: "lastName", message: "ERR002" },
  { field: "termsAccepted", message: "ERR002" },
];

export const invalidIds = ["", 12345, "hello world!", "!@#%$%^%^&*"];
