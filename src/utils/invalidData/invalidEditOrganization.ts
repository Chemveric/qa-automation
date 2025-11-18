import { faker } from '@faker-js/faker';

export const organizationTestData = [
  {
    name: "Missing email field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
      },
      expectedMessage: '"email": "ERR002"',
    }),
  },
  {
    name: "Missing postal code field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        email: faker.internet.email(),
      },
      expectedMessage: '"postalCode": "ERR002"',
    }),
  },
  {
    name: "Missing street field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        city: faker.location.city(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"street": "ERR002"',
    }),
  },
  {
    name: "Missing city field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"city": "ERR002"',
    }),
  },
  {
    name: "Missing state field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"state": "ERR002"',
    }),
  },
  {
    name: "Missing name field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"name": "ERR002"',
    }),
  },
  {
    name: "Missing country id field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"countryId": "ERR002"',
    }),
  },
  {
    name: "Missing region id field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"regionId": "ERR002"',
    }),
  },
  {
    name: "Missing id field",
    getData: (orgId: string, regionId: string, countryId: string) => ({
      params: {
        id: orgId,
        regionId,
        countryId,
        licenseFilesIds: [],
        name: faker.company.name(),
        state: faker.location.state(),
        city: faker.location.city(),
        street: faker.location.streetAddress(),
        postalCode: faker.location.zipCode(),
        email: faker.internet.email(),
      },
      expectedMessage: '"id": "ERR002"',
    }),
  },
];
