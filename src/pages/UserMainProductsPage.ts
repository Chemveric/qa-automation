import { BasePage } from "../core/BasePage";
import { UserSidebar } from "./components/UserSidebar";
import { Page, expect } from "@playwright/test";
import { ENV } from "../config/env";
import { BuyerProductDetailsPage } from "./BuyerProductDetailsPage";

export class UserMainProductsPage extends BasePage {
  readonly sidebar: UserSidebar;
  readonly search;
  readonly structureSearchBtn;
  readonly similarityTab;
  readonly firstTemplate;
  readonly canvas;
  readonly bonds;
  readonly brButton;
  readonly nButton;
  readonly searchBtn;
  readonly subSrtuctureTab;
  readonly exactTab;

  constructor(page: Page) {
    super(page, "products", ENV.guest.url);
    this.sidebar = new UserSidebar(page);
    this.search = page.getByRole("textbox", {
      name: "Search by chemical name, CAS",
    });

    // structure search locators
    this.structureSearchBtn = page.getByRole("button", {
      name: "Structure Search",
    });
    this.similarityTab = page.getByRole("tab", { name: "Similarity" });
    this.subSrtuctureTab = page.getByRole("tab", { name: "Substructure" });
    this.exactTab = page.getByRole("tab", { name: "Exact" });
    this.firstTemplate = this.page.getByTestId("template-0");
    this.canvas = this.page.getByTestId("canvas");
    this.bonds = this.page.getByTestId("bonds");
    this.brButton = this.page.getByTestId("Br-button");
    this.nButton = this.page.getByTestId("N-button");
    this.searchBtn = this.page.getByRole("button", { name: "Search" });
  }

  async assertLoaded() {
    await expect(
      this.page.getByRole("heading", { name: "Products Marketplace" })
    ).toBeVisible();
  }

  async assertProductIsFound(productName: string) {
    await expect(this.page.getByText(productName).first()).toBeVisible();
  }

  async assertProductNameIsVisible(productName: string) {
    await expect(
      this.page.getByRole("heading", {
        name: productName,
      })
    ).toBeVisible();
  }

  async searchForProduct(partialProductName: string) {
    await this.search.click();
    await this.search.fill(partialProductName);
  }

  /**
   * Click any product card by displayed name
   * and return ProductDetailsPage.
   */
  async openProductByName(name: string): Promise<BuyerProductDetailsPage> {
    const productCard = this.page.getByText(name).first();

    await Promise.all([
      this.page.waitForURL("**/products/*"),
      productCard.click(),
    ]);

    return new BuyerProductDetailsPage(this.page);
  }

  async openStructureSearch() {
    await this.structureSearchBtn.click();
  }

  async selectSimilarityMode() {
    await this.similarityTab.click();
  }

  async selectSubstuctureMode() {
    await this.subSrtuctureTab.click();
  }

  async selectExactMode() {
    await this.exactTab.click();
  }

  async useTemplate() {
    await this.firstTemplate.click();
  }

  async placeOnCanvas(x: number, y: number) {
    await this.canvas.click({ position: { x, y } });
  }

  async selectBondTool() {
    await this.bonds.click();
  }

  async selectBr() {
    await this.brButton.click();
  }

  async selectN() {
    await this.nButton.click();
  }

  async clickSearch() {
    await this.searchBtn.click();
  }

  async performStructureSearchBySimilarity() {
    await this.openStructureSearch();
    await this.selectSimilarityMode();
    await this.useTemplate();
    await this.placeOnCanvas(150, 120);
    await this.selectBondTool();
    await this.placeOnCanvas(150, 150);
    await this.placeOnCanvas(150, 90);
    await this.selectBr();
    await this.placeOnCanvas(150, 50);
    await this.selectN();
    await this.placeOnCanvas(180, 150);
    await this.clickSearch();
  }

  async performStructureSearchBySubstructure() {
    await this.openStructureSearch();
    await this.selectSubstuctureMode();
    await this.useTemplate();
    await this.placeOnCanvas(150, 120);
    await this.selectBondTool();
    await this.placeOnCanvas(150, 150);
    await this.placeOnCanvas(150, 90);
    await this.selectBr();
    await this.placeOnCanvas(150, 50);
    await this.selectN();
    await this.placeOnCanvas(180, 150);
    await this.clickSearch();
  }

  async performStructureSearchByExactStructure() {
    await this.openStructureSearch();
    await this.selectExactMode();
    await this.useTemplate();
    await this.placeOnCanvas(150, 120);
    await this.selectBondTool();
    await this.placeOnCanvas(150, 150);
    await this.placeOnCanvas(150, 90);
    await this.selectBr();
    await this.placeOnCanvas(150, 50);
    await this.selectN();
    await this.placeOnCanvas(180, 150);
    await this.clickSearch();
  }
}
