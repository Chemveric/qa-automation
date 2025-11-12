import { faker } from "@faker-js/faker";

export class FileUploadInvalidBuilder {
  private request: any;

  constructor() {
    this.request = {
      organizationId: faker.string.uuid(),
      purpose: "PROFILE_IMAGE",
      filename: faker.system.fileName(),
      mime: "image/jpeg",
      size: faker.number.int({ min: 100_000, max: 3_000_000 }),
      checksum: faker.string.alphanumeric(16),
    };
  }

  withoutField(field: keyof typeof this.request) {
    delete this.request[field];
    return this;
  }

  withInvalidValue(field: keyof typeof this.request, value: any) {
    this.request[field] = value;
    return this;
  }

  withOrganozationId(value: string) {
    this.request.organizationId = value;
    return this;
  }

  withPurpose(value: string) {
    this.request.purpose = value;
    return this;
  }

  withMime(value: string) {
    this.request.mime = value;
    return this;
  }

  build() {
    return this.request;
  }
}
