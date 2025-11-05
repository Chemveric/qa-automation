import { expect, test, BrowserContext } from "@playwright/test";
import { InvitationsPage } from "../../src/pages/InvitationsPage";
import { ENV } from "../../src/config/env";
import { Invitations } from "../../src/data/invitationData";
import { createStorageState } from "../../src/core/createStorageState";

test.describe("ABA-US-001 Sign Up as Buyer Company Admin Role", () => {
  test("should successfully complete the first step of the signup flow", async ({
    browser,
  }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://chemveric.dev.gdev.group/");
    await expect(page.getByRole("button", { name: "Sign Up" })).toBeVisible();
    await page.getByRole("button", { name: "Sign Up" }).click();
    await expect(
      page.locator("p.MuiTypography-root.MuiTypography-body1.mui-6hzl5p")
    ).toHaveText("Business Type");
    await page
      .getByRole("radio", { name: "Buyer Purchase products and" })
      .check();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.locator("p.MuiTypography-root.MuiTypography-body1.mui-1hi184w")
    ).toHaveText("Personal Information");
    await page.getByRole("textbox", { name: "First Name" }).fill("Nadia");
    await page.getByRole("textbox", { name: "Last Name" }).fill("TEST");
    await page
      .getByRole("textbox", { name: "Corporate Email" })
      .fill("nadiia.patrusheva+test9234628946@globaldev.tech");
    await page
      .getByRole("textbox", { name: "Company Role/Title" })
      .fill("Nadia's");
    await page.getByRole("checkbox").check();
    await page.getByRole("button", { name: "Next" }).click();
    await expect(
      page.locator("p.MuiTypography-root.MuiTypography-body1.mui-1hi184w")
    ).toHaveText("Company Details");
    //Finished step one
    await page.getByRole("textbox", { name: "Company Name" }).fill("some name");
    await page.getByRole("combobox", { name: "Region" }).click();
    await page.getByRole("option", { name: "Europe" }).click();
    await page.getByRole("combobox", { name: "Country" }).click();
    await page.getByRole("option", { name: "Hungary" }).click();
    await page.getByRole("textbox", { name: "State/Province" }).fill("sva");

    await page.getByRole("textbox", { name: "City" }).fill("Gra");

    await page.getByRole("textbox", { name: "Street" }).fill("Main. st. 34");

    await page
      .getByRole("textbox", { name: "Zip/Postal Code" })
      .fill("38746NN");
    await page.getByText("Click to upload").click();
    await page.getByRole("button", { name: "Next" }).click();
    await page.pause();

    await context.close();
  });
});
