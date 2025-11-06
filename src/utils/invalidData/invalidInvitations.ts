export const invalidInvitations = {
  companyName: [
    {
      value: "",
      expectedError: "companyName must be longer than or equal to 2 characters",
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


  export const requiredFields = [
    { field: "email", message: "email must be an email" },
    {
      field: "companyName",
      message: "companyName should not be null or undefined",
    },
    {
      field: "firstName",
      message: "firstName should not be null or undefined",
    },
    { field: "lastName", message: "lastName should not be null or undefined" },
  ];

  export const invalidIds = ["", 12345, "hello world!", "!@#%$%^%^&*"];