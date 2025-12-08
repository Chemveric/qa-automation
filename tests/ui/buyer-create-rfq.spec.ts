import { test } from "@playwright/test";
import { UserDashboardPage } from "../../src/pages/UserDashboardPage";
import { UserRfqPage } from "../../src/pages/UserRfqPage";
import { UserMainProductsPage } from "../../src/pages/UserMainProductsPage";
import { UserCartPage } from "../../src/pages/UserCartPage";
import { CookiesTag, DriverProvider } from "../../src/driver/DriverProvider";
import { rfqTestData } from "../../src/data/rfqData";

test.describe("Create RFQ", () => {
  test.use({
    storageState: DriverProvider.getCookiesStateFileName(CookiesTag.Buyer),
  });
  const filePathath = "src/data/files/RFQ.pdf";
  test("buyer can create RFQ", async ({ page }) => {
    // navigate on RFQ page
    const rfqPage = new UserRfqPage(page);
    await rfqPage.goto();
    await rfqPage.assertLoaded();

    // click on crete rfq
    await rfqPage.clickOnCreateRfqButton();
    await rfqPage.assertStepOne();

    // fill step 1
    await rfqPage.selectService(
      rfqTestData.serviceName,
      rfqTestData.serviceOption
    );
    await rfqPage.checkFeeForService();
    await rfqPage.clickContinue();

    // fill step 2
    await rfqPage.assertStepTwo();
    await rfqPage.setProposalTurnaroundDays(rfqTestData.turaroundDays);
    await rfqPage.setRequiredDeliveryDate(rfqTestData.deliveryDate);
    await rfqPage.setTargetBudget(rfqTestData.targetBudget);
    await rfqPage.addDescription(rfqTestData.description);

    await rfqPage.uploadFile(filePathath);

    await rfqPage.selectSector(rfqTestData.sector);
    await rfqPage.selectComplexity(rfqTestData.complexity);
    await rfqPage.selectRegion(rfqTestData.region);
    await rfqPage.selectProjectStage(rfqTestData.projectStage);
    await rfqPage.selectCompanySize(rfqTestData.companySize);
    await rfqPage.selectPriorityLevel(rfqTestData.priorityLevel);
    await rfqPage.clickContinue();

    await rfqPage.assertStepThree();

    // fill step 3
    await rfqPage.addCompoundName("Meldonium");
    await rfqPage.addQuantity("1000");
    await rfqPage.addPurity("99");
    await rfqPage.selectAnalitycalMethod("HPLC");
    // await page.pause();

    await rfqPage.uploadChemFile("src/data/files/meldonium_and_analog.sdf");
    await rfqPage.assertChemFileIsLoaded();
    await rfqPage.clickOnAddCompoundButton();

    await rfqPage.uploadConfFile("src/data/files/confidential_test_file.docx");
    await rfqPage.addConfNotes("Lorem ipsum test");

    await page.pause();

    await rfqPage.clickContinue();
    await rfqPage.assertStepFour();

    // step 4
  });


});
