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

function randomSmiles() {
  const smiles = [
    "O=C(N)c1ccc(Cl)cc1",
    "C1=CC=CC=C1",
    "CC(=O)O",
    "N[C@@H](C)C(=O)O",
  ];
  return smiles[Math.floor(Math.random() * smiles.length)];
}

export async function createRandomXlsx(filename: string, count: number = 1) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Chemicals");

  sheet.addRow([
    "name",
    "structureUrl",
    "molWeight",
    "molFormula",
    "mfcd",
    "cas",
    "suppliers",
    "smiles",
  ]);

  for (let i = 0; i < count; i++) {
    const name = randomString(6);
    sheet.addRow([
      name,
      `https://cdn.example.com/structures/${randomString(8)}.png`,
      randomNumber(),
      `C${Math.floor(Math.random() * 20)}H${Math.floor(Math.random() * 40)}`,
      `MFCD${Math.floor(Math.random() * 100000)}`,
      randomCasNumber(),
      `SUP-${Math.floor(Math.random() * 9999)}`,
      randomSmiles(),
    ]);
  }

  const outputDir = path.join(process.cwd(), "test-data");
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir);

  const filePath = path.join(outputDir, filename);
  await workbook.xlsx.writeFile(filePath);

  return filePath;
}
