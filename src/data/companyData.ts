import { faker } from "@faker-js/faker";

export const europeCountries = [
  "Austria",
  "Belgium",
  "Bulgaria",
  "Croatia",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Estonia",
  "Finland",
  "France",
  "Germany",
  "Greece",
  "Hungary",
  "Iceland",
  "Ireland",
  "Italy",
  "Latvia",
  "Lithuania",
  "Luxembourg",
  "Malta",
  "Netherlands",
  "Norway",
  "Poland",
  "Portugal",
  "Romania",
  "Slovakia",
  "Slovenia",
  "Spain",
  "Sweden",
  "Switzerland",
  "United Kingdom"
];

const randomCountry =
  faker.helpers.arrayElement(europeCountries);

export const companyProfileTestData = {
  companyName: faker.company.name(),
  country: randomCountry,
  province: faker.location.state(),
  city: faker.location.city(),
  street: faker.location.streetAddress(),
  postalCode: faker.location.zipCode(),
};