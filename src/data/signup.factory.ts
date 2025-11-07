import { faker } from "@faker-js/faker";

export function createSignupTestData() {
  const firstName = `AQA-${faker.person.firstName()}`;
  const lastName = `AQA-${faker.person.lastName()}`;
  const uniqueId = faker.string.uuid();

  return {
    firstName,
    lastName,
    email: `nadiia.patrusheva+${firstName.toLowerCase()}.${lastName.toLowerCase()}.${uniqueId}@globaldev.tech`,
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
