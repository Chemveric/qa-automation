export const invalidInvitations = {
  companyName: [
    {
      value: "",
      expectedError: "companyName must be longer than or equal to 1 characters",
    },
    {
      value: "x".repeat(101),
      expectedError:
        "companyName must be shorter than or equal to 100 characters",
    },
  ],
  firstName: [
    { value: "", expectedError: "Only letters are allowed" },
    { value: "123", expectedError: "Only letters are allowed" },
    { value: "###", expectedError: "Only letters are allowed" },
    {
      value: "x".repeat(101),
      expectedError:
        "firstName must be shorter than or equal to 100 characters",
    },
  ],
  lastName: [
    { value: "", expectedError: "Only letters are allowed" },
    { value: "###", expectedError: "Only letters are allowed" },
    { value: "123", expectedError: "Only letters are allowed" },
    {
      value: "x".repeat(101),
      expectedError: "lastName must be shorter than or equal to 100 characters",
    },
  ],
};
