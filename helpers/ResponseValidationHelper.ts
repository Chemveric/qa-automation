import { expect } from "@playwright/test";
/**
 * Helper class for validating API responses in tests.
 */
export class ResponseValidationHelper {
  /**
   * Validates the response status code and error message.
   *
   * @param {any} res - The response object returned from the API.
   * @param {number} statusCode - Expected HTTP status code.
   * @param {string} expectedErrorMessage - Expected error message to appear in response.
   * @param {string} [field] - (Optional) Field name to check inside `errors` object.
   */
  expectStatusCodeAndMessage(
    res: any,
    statusCode: number,
    expectedErrorMessage: string,
    field?: string
  ) {
    expect(
      res.status,
      `Expected status code is ${statusCode}, but got ${res.status}`
    ).toBe(statusCode);
    let body = res.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    if (field) {
      expect(body?.errors, `Expected errors object in response`).toBeDefined();
      const fieldError = body.errors[field];
      expect(fieldError, `Expected field "${field}" in errors`).toBeDefined();
      const normalized = Array.isArray(fieldError)
        ? fieldError.join(" ")
        : String(fieldError);
      expect(
        normalized,
        `Expected error message is: ${expectedErrorMessage}, but got: ${body.errors[field]}`
      ).toContain(expectedErrorMessage);
      return;
    }
    const errorMsg =
      body?.message ||
      body?.error ||
      (body?.errors ? JSON.stringify(body.errors) : JSON.stringify(body));
    expect(
      errorMsg,
      `Expected error message is: ${expectedErrorMessage}, but got: ${errorMsg}`
    ).toContain(expectedErrorMessage);
  }

  /**
   * Validates responses with multiple field-level errors.
   *
   * Example response:
   * {
   *   "errors": {
   *     "email": "email must be an email",
   *     "firstName": "firstName should not be null or undefined"
   *   }
   * }
   *
   * @param {any} res - The response object.
   * @param {number} statusCode - Expected status code.
   * @param {Record<string, string>} expectedErrors - Expected field-to-message map.
   * @throws {Error} If any field message differs or status is wrong.
   */

  async expectMultipleFieldErrors(
    res: any,
    statusCode: number,
    expectedErrors: Record<string, string>
  ) {
    const status = typeof res.status === "function" ? res.status() : res.status;
    let body = typeof res.json === "function" ? await res.json() : res.body;

    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch {}
    }

    expect(
      status,
      `Expected status code ${statusCode}, but got ${status}`
    ).toBe(statusCode);

    const errors = body?.errors;
    expect(
      errors,
      'Response does not contain an "errors" object'
    ).toBeDefined();

    for (const [field, expectedMsg] of Object.entries(expectedErrors)) {
      let actualMsg = errors[field];

      if (!actualMsg && field.startsWith("data.")) {
        actualMsg = errors["data"];
      }
      expect(
        actualMsg,
        `Expected error for "${field}" to include "${expectedMsg}", but got: "${actualMsg}"`
      ).toContain(expectedMsg);
    }
  }
}
