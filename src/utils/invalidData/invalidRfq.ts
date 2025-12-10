export const invalidRfqQueryParams = {
  tab: [
    {
      value: "",
      expectedError: "tab must be one of the following values: rfqs, templates, drafts, archived",
    },
    {
      value: "x".repeat(101),
      expectedError:
        "tab must be one of the following values: rfqs, templates, drafts, archived",
    },

    {
      value: 2763,
      expectedError:
        "tab must be one of the following values: rfqs, templates, drafts, archived",
    },
  ],
  page: [
    { value: "", expectedError: "page must not be less than 1" },
    { value: 0, expectedError: "page must not be less than 1" },
    { value: "###", expectedError: "page must not be less than 1" },
    {
      value: "x".repeat(101),
      expectedError:
        "page must not be less than 1",
    },
  ],
  limit: [
    { value: "", expectedError: "limit must not be less than 1" },
    { value: "###", expectedError: "limit must not be greater than 100" },
    { value: 0, expectedError: "limit must not be less than 1" },
    { value: 100000, expectedError: "limit must not be greater than 100" },
    {
      value: "x".repeat(101),
      expectedError: "limit must not be greater than 100",
    },
  ],
};
