import jwt, { SignOptions, Secret } from "jsonwebtoken";
import { faker } from "@faker-js/faker";

/**
 * Generate a signed JWT for testing purposes.
 * @param payload - optional data to include in the token
 * @param expiresIn - optional expiration time (default: 1h)
 */
export function generateTestToken(
  payload: Record<string, any> = {
    firstName: `AQA-${faker.person.firstName}`,
    lastName: `AQA-${faker.person.lastName}`,
    email: `AQA-${faker.internet.email}`,
  },
  expiresIn: string | number = "1h"
): string {
  const secretKey: Secret = process.env.JWT_SECRET || "test-secret-key";

  const options: SignOptions = { expiresIn: expiresIn as any };

  return jwt.sign(payload, secretKey, options);
}
