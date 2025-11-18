import { Attachment, RfqNonConf, RfqRequestBase } from "../types/rfqs.types";

export class RfqBuilder {
  private data: RfqRequestBase;
  constructor(type: "BULK" | "CUSTOM" | "OPEN") {
    this.data = {
      type,
      dueDate: "",
    };

    if (type !== "BULK") {
      this.data.nonconf = {
        quantity: "",
        purityMinPct: 0,
        deliveryTime: "",
        attachments: [],
      };
    }
  }

  setDueDate(date: string) {
    this.data.dueDate = date;
    return this;
  }

  setQuantity(quantuty: string) {
    if (!this.data.nonconf) throw new Error("Quantity not allowed for type B");
    this.data.nonconf.quantity = quantuty;
    return this;
  }

  setPurity(pct: number) {
    if (!this.data.nonconf) throw new Error("Purity not allowed for type B");
    this.data.nonconf.purityMinPct = pct;
    return this;
  }

  setDeliveryTime(time: string) {
    if (!this.data.nonconf)
      throw new Error("deliveryTime not allowed for type B");
    this.data.nonconf.deliveryTime = time;
    return this;
  }

  addAttachment(att: Attachment) {
    if (!this.data.nonconf)
      throw new Error("Attachments not allowed for type B");
    this.data.nonconf.attachments?.push(att);
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
  overrideNonconf(patch: any) {
    if (!this.data.nonconf) this.data.nonconf = {} as any;
    this.data.nonconf = { ...this.data.nonconf, ...patch };
    return this;
  }

  build() {
    return JSON.parse(JSON.stringify(this.data));
  }
}
