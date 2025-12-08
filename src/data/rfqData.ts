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

const randomSector = faker.helpers.arrayElement(sectors);
const randomComplexity = faker.helpers.arrayElement(complexity);
const randomRegion = faker.helpers.arrayElement(regions);
const randomProjectStage = faker.helpers.arrayElement(projectStages);
const randomCompanySize = faker.helpers.arrayElement(companySize);
const randomPriorityLevel = faker.helpers.arrayElement(priorityLevel);

export const rfqTestData = {
  serviceName: "Biology",
  serviceOption: "Other Biology",
  turaroundDays: "30",
  deliveryDate: "2026-01-01",
  targetBudget: "700",
  description: `AQA test ${faker.lorem.sentence({ min: 3, max: 7 })}`,
  sector: randomSector,
  complexity: randomComplexity,
  region: randomRegion,
  projectStage: randomProjectStage,
  companySize: randomCompanySize,
  priorityLevel: randomPriorityLevel,
};
