export interface RfqRequestBase {
  type: "BULK" | "CUSTOM" | "OPEN";
  dueDate: string;
  nonconf?: RfqNonConf;
}

export interface RfqNonConf {
  quantity?: string;
  purityMinPct?: number | string;
  deliveryTime?: string;
  attachments?: Attachment[];
}
export interface Attachment {
  fileId: string;
  filename: string;
  purpose: string;
}

export type PatchRfqRequest = Partial<RfqRequestBase>;