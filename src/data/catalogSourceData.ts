import ExcelJS from "exceljs";
import path from "path";
import fs from "fs";

function randomString(length: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  return Array.from(
    { length },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

function randomNumber(min = 1, max = 500) {
  return +(Math.random() * (max - min) + min).toFixed(2);
}

function randomCasNumber() {
  return `${Math.floor(Math.random() * 9000000) + 1000000}-${
    Math.floor(Math.random() * 90) + 10
  }-${Math.floor(Math.random() * 9)}`;
}

export async function createRandomXlsx(filename: string, count: number = 1) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Chemicals");

  sheet.addRow([
    "structure",
    "molecular_weight",
    "molecular_formula",
    "mfcd",
    "cas_number",
    "supplier",
    "catalog_no",
    "product_name",
    "name",
  ]);

  for (let i = 0; i < count; i++) {
    const productName = randomString(8);
    const catalogNo = "CAT-" + Math.floor(Math.random() * 999999);

    sheet.addRow([
      `https://cdn.example.com/structures/${randomString(8)}.png`,
      randomNumber(),
      `C${Math.floor(Math.random() * 20)}H${Math.floor(Math.random() * 40)}`,
      `MFCD${Math.floor(Math.random() * 100000)}`,
      randomCasNumber(),
      `Supplier-${Math.floor(Math.random() * 5000)}`,
      catalogNo,
      productName,
      randomString(6),
    ]);
  }

  const outputDir = path.join(process.cwd(), "test-data");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
}

export async function readChemicalXlsx(xlsxPath: string) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(xlsxPath);

  const sheet = workbook.getWorksheet("Chemicals");
  if (!sheet) throw new Error("Worksheet 'Chemicals' not found");

  const row = sheet.getRow(2);

  return {
    structure: row.getCell(1).value?.toString() || "",
    molecular_weight: Number(row.getCell(2).value),
    molecular_formula: row.getCell(3).value?.toString() || "",
    mfcd: row.getCell(4).value?.toString() || "",
    cas_number: row.getCell(5).value?.toString() || "",
    supplier: row.getCell(6).value?.toString() || "",
    catalog_no: row.getCell(7).value?.toString() || "",
    product_name: row.getCell(8).value?.toString() || "",
    name: row.getCell(9).value?.toString() || "",
  };
}
