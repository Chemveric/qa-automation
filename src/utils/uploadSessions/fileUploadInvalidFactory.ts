import { FileUploadInvalidBuilder } from "./fileUploadInvalidBuilder";


export const FileUploadInvalidFactory = {
  missingOrganizationId() {
    return new FileUploadInvalidBuilder().withoutField("organizationId").build();
  },

  invalidPurpose() {
    return new FileUploadInvalidBuilder().withPurpose("INVALID_PURPOSE").build();
  },

  invalidMime(id: string) {
    return new FileUploadInvalidBuilder().withOrganozationId(id).withMime("text/plain").build();
  },

  invalidSize(id: string) {
    return new FileUploadInvalidBuilder().withOrganozationId(id).withInvalidValue("size", -100).build();
  },

  invalidChecksum() {
    return new FileUploadInvalidBuilder().withInvalidValue("checksum", "").build();
  },

  invalidOrganizationId(){
    return new FileUploadInvalidBuilder().build();
  }
};
