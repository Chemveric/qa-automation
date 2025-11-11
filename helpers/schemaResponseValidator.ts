import { ZodType, ZodError } from "zod";
import { expect } from "@playwright/test";

/**
 * Helper to get nested value from object by path
 */
function getValueByPath(obj: any, path: (string | number | symbol)[]) {
  return path.reduce((acc, key) => {
    if (acc === undefined) return undefined;
    if (typeof key === "symbol") return acc; // skip symbols
    return acc[key as string | number];
  }, obj);
}

/**
 * Validates a response body against a Zod schema.
 * Prints detailed errors for each field with value and path.
 */
export async function validateResponse<T>(
  res: { status: number; body: any },
  schema: ZodType<T>,
  expectedStatus = 200
): Promise<T> {
  expect(
    res.status,
    `Expected status ${expectedStatus}, but got ${res.status}`
  ).toBe(expectedStatus);

  const parsed = schema.safeParse(res.body);

  if (!parsed.success) {
    console.error("Schema validation failed:");

    parsed.error.issues.forEach((issue) => {
      const invalidValue = getValueByPath(res.body, issue.path);
      console.error(
        `Field: ${issue.path.join(".") || "(root)"} | Issue: ${
          issue.message
        } | Value:`,
        invalidValue
      );
    });
    console.error(parsed.error.format());
    throw new Error("Response schema validation failed");
  }

  return parsed.data;
}
