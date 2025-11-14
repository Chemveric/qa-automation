import { faker } from "@faker-js/faker";

export class FileUploadInvalidBuilder {
  private request: any;

  constructor() {
    this.request = {
      organizationId: faker.string.uuid(),
      purpose: "PROFILE_IMAGE",
      filename: "red_head.jpg",
      mime: "image/jpeg",
      size: 2222370,
      checksum: "2e10524672de6b7ea411f1fe59372a94b51ba0113058d3cd93d368a47b1e5cad",
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
