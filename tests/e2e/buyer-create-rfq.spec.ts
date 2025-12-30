import { test } from "@playwright/test";
import { UserRfqPage } from "../../src/pages/UserRfqPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";
import { rfqTestData } from "../../src/data/rfqData";

test.describe("E2E: Create RFQ", () => {
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });
  const filePath = "src/data/files/RFQ.pdf";
  const chemFilePath = "src/data/files/meldonium.mol";
  const confFilePath = "src/data/files/confidential_test_file.docx";

  test("buyer can create RFQ all steps", async ({ page }) => {
    const rfqPage = new UserRfqPage(page);
    await rfqPage.goto();
    await rfqPage.assertLoaded();
    await rfqPage.clickOnCreateRfqButton();

    // step 1
    await rfqPage.assertStepOneIsVisible();
    await rfqPage.fillStep1(rfqTestData.serviceName, rfqTestData.serviceOption);

    // step 2
    await rfqPage.assertStepTwoIsVisible();
    await rfqPage.fillStep2(
      rfqTestData.turaroundDays,
      rfqTestData.deliveryDate,
      rfqTestData.targetBudget,
      rfqTestData.description,
      filePath,
      rfqTestData.sector,
      rfqTestData.complexity,
      rfqTestData.region,
      rfqTestData.projectStage,
      rfqTestData.companySize,
      rfqTestData.priorityLevel
    );

    // step 3
    await rfqPage.assertStepThreeIsVisible();
    await rfqPage.fillStep3(
      rfqTestData.compoundName,
      rfqTestData.quantity,
      rfqTestData.purity,
      rfqTestData.analyticalMethod,
      chemFilePath,
      confFilePath,
      rfqTestData.notes
    );

    // step 4
    await rfqPage.assertStepFourIsVisible();
    await rfqPage.fillStage4(
      rfqTestData.title,
      rfqTestData.area,
      rfqTestData.startDate,
      rfqTestData.endDate,
      rfqTestData.criteria,
      rfqTestData.firstName,
      rfqTestData.lastName,
      rfqTestData.company,
      rfqTestData.email,
      rfqTestData.phone,
      rfqTestData.notes
    );

    // step 5
    await rfqPage.assertStepFiveIsVisible();
    await rfqPage.fillStep5();
  });
});
