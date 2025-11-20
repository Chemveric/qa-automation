import {
  Attachment,
  RfqNonConf,
  RfqRequestBase,
  PatchRfqRequest,
} from "../types/rfqs.types";

export class RfqBuilder {
  private data: PatchRfqRequest = {};
  constructor(type?: "BULK" | "CUSTOM" | "OPEN") {
    if (type) {
      this.data.type = type;

      if (type !== "BULK") {
        this.data.nonconf = {
          quantity: "",
          purityMinPct: 0,
          deliveryTime: "",
          attachments: [],
        };
      }
    }
  }

  private ensureNonconf() {
    if (!this.data.nonconf) {
      this.data.nonconf = {} as any;
    }
  }

  setType(type: "BULK" | "CUSTOM" | "OPEN") {
    this.data.type = type;
    return this;
  }

  setDueDate(date: string) {
    this.data.dueDate = date;
    return this;
  }

   setQuantity(q: string) {
    this.ensureNonconf();
    this.data.nonconf!.quantity = q;
    return this;
  }

  setPurity(p: number) {
    this.ensureNonconf();
    this.data.nonconf!.purityMinPct = p;
    return this;
  }

  setDeliveryTime(t: string) {
    this.ensureNonconf();
    this.data.nonconf!.deliveryTime = t;
    return this;
  }

  addAttachment(a: Attachment) {
    this.ensureNonconf();
    if (!this.data.nonconf!.attachments) {
      this.data.nonconf!.attachments = [];
    }
    this.data.nonconf!.attachments.push(a);
    return this;
  }

  setDueDateInMonths(months: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    this.data.dueDate = d.toISOString().split("T")[0];
    return this;
  }

  /**
   * 💥 Override any field for invalid case testing
   */
  override(patch: Partial<RfqRequestBase>) {
    this.data = { ...this.data, ...patch };
    return this;
  }

  /**
   * 💥 Override nested nonconf fields
   */
  overrideNonconf(patch: Partial<RfqNonConf>) {
    this.ensureNonconf();
    this.data.nonconf = { ...this.data.nonconf, ...patch };
    return this;
  }

  build() {
    return structuredClone(this.data);
  }
}
