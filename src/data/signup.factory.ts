import { faker } from "@faker-js/faker";

export function createSignupTestData() {
  const firstName = `AQA-${faker.person.firstName()}`;
  const lastName = `AQA-${faker.person.lastName()}`;
  const uniqueId = faker.string.uuid();

  return {
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueId}@mycompany.tech`,
    role: faker.person.jobTitle(),
    company: {
      name: `${faker.company.name()} Guest`,
      region: "Europe",
      country: "Hungary",
      state: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
    },
  };
}
