export const adminOrganizationTestData = [
  {
    name: "Invalid postal code (number instead of string)",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        name: "",
        regionId,
        countryId,
        state: "",
        city: "",
        street: "",
      },
      expectedMessage: '"postalCode":"postalCode must be a string"',
    }),
  },
  {
    name: "Missing city field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        name: "My Org",
        regionId,
        countryId,
        state: "CA",
        street: "Main St",
        postalCode: "90001",
      },
      expectedMessage: '"city":"city must be a string"',
    }),
  },
  {
    name: "Missing street field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        name: "My Org",
        regionId,
        countryId,
        state: "CA",
        city: "City",
        postalCode: "90001",
      },
      expectedMessage: '"street":"street must be a string"',
    }),
  },
  {
    name: "Missing state field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        name: "My Org",
        regionId,
        countryId,
        city: "City",
        street: "Main St",
        postalCode: "90001",
      },
      expectedMessage: '"state":"state must be a string"',
    }),
  },
  {
    name: "Missing name field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        state: "CA",
        city: "City",
        street: "Main St",
        postalCode: "90001",
      },
      expectedMessage: '"name":"name must be a string"',
    }),
  },
];
