import { faker } from "@faker-js/faker";

export const sectors = [
  "Academic",
  "Biotech",
  "Contract Research Organization",
  "Government",
  "Pharmaceutical",
  "Other",
];
export const complexity = ["Low", "Medium", "High"];
export const regions = [
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
  "Other",
];
export const projectStages = [
  "Preclinical",
  "Clinical",
  "Regulatory",
  "Commercialization",
  "Other",
];
export const companySize = ["Small", "Medium", "Large"];
export const priorityLevel = ["Low", "Medium", "High", "Urgent"];
export const analyticalMethods = ["HPLC", "NMR", "MS", "IR", "UV-Vis", "Other"];

const randomSector = faker.helpers.arrayElement(sectors);
const randomComplexity = faker.helpers.arrayElement(complexity);
const randomRegion = faker.helpers.arrayElement(regions);
const randomProjectStage = faker.helpers.arrayElement(projectStages);
const randomCompanySize = faker.helpers.arrayElement(companySize);
const randomPriorityLevel = faker.helpers.arrayElement(priorityLevel);
const randomAnalyticalMethod = faker.helpers.arrayElement(analyticalMethods);

export const rfqTestData = {
  serviceName: "Biology",
  serviceOption: "Other Biology",
  turaroundDays: "30",
  deliveryDate: "12 December, 2026",
  targetBudget: "700",
  description: `AQA test ${faker.lorem.sentence({ min: 3, max: 7 })}`,
  sector: randomSector,
  complexity: randomComplexity,
  region: randomRegion,
  projectStage: randomProjectStage,
  companySize: randomCompanySize,
  priorityLevel: randomPriorityLevel,
  compoundName: "1-(4-Fluorophenyl)-3-phenyl-1H-pyrazol-5-amine",
  quantity: "1000",
  purity: "96",
  analyticalMethod: randomAnalyticalMethod,
  notes: `AQA test ${faker.lorem.sentence({ min: 3, max: 7 })}`,
  smile: "Nc1cc(-c2ccccc2)nn1-c1ccc(F)cc1",
  title: "AQA project",
  area: "Cardiology",
  startDate: "2025-12-12",
  endDate: "2026-03-03",
  criteria: `AQA test ${faker.lorem.sentence({ min: 3, max: 5 })}`,
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  company: "AQA First Chem Tech",
  email: `AQA-test@globaldev.tech`,
  phone: faker.phone.number({ style: "international" }),
};
