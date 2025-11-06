import { faker } from "@faker-js/faker";
export const SignupTestData = {
  guestUser: {
    firstName: `AQA-${faker.person.firstName()}`,
    lastName: `AQA-${faker.person.firstName()}`,
    email: `nadiia.patrusheva+guest_${faker.string.uuid()}@globaldev.tech`,
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
  },

  invitedUser: {
    firstName: `AQA-${faker.person.firstName()}`,
    lastName: `AQA-${faker.person.firstName()}`,
    email: `nadiia.patrusheva+inv_${faker.string.uuid()}@globaldev.tech`,
    role: faker.person.jobTitle(),
    company: {
      name: `${faker.company.name()} Invited`,
      region: "Europe",
      country: "Poland",
      state: faker.location.state(),
      city: faker.location.city(),
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
    },
  },
};
