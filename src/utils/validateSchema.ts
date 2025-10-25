import { userSchema } from "../schema/userSchema";

export function validateSchema(data: any, schema = userSchema) {
  for (const key in schema) {
    const typedKey = key as keyof typeof schema;
    const type = schema[typedKey]; 
    const value = data[typedKey];

    if (value === undefined) {
      throw new Error(`Missing property: ${key}`);
    }

    switch (type) {
      case "string":
        if (typeof value !== "string")
          throw new Error(`${key} should be string`);
        break;
      case "email":
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          throw new Error(`${key} should be a valid email`);
        break;
      case "uuid":
        if (
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
            value
          )
        )
          throw new Error(`${key} should be a valid UUID`);
        break;
      case "date":
        if (isNaN(Date.parse(value)))
          throw new Error(`${key} should be a valid date`);
        break;
      default:
        if (Array.isArray(type)) {
          if (!type.includes(value))
            throw new Error(`${key} should be one of ${type.join(", ")}`);
        } else {
          throw new Error(`Unknown type for ${key}: ${type}`);
        }
    }
  }
  return true;
}
