import fs from "fs";
import path from "path";
import crypto from "crypto";

export async function getFileInfo(filePath: string) {
  const absolutePath = path.resolve(filePath);

  const filename = path.basename(absolutePath);

  const { size } = fs.statSync(absolutePath);

  const fileBuffer = fs.readFileSync(absolutePath);
  const checksum = crypto.createHash("sha256").update(fileBuffer).digest("hex");

  return {
    filename,
    size,
    checksum,
  };
}
