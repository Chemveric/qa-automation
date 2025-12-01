import {
  RfqAttachment,
  RfqNonConf,
  RfqRequestBase,
  RfqStructure,
  RfqConf
} from "../types/rfqs.types";

export class RfqBuilder {
  private data: RfqRequestBase;

  constructor(type?: RfqRequestBase["type"]) {
    this.data = {
      type: type ?? "BULK",
    };
  }

  // --- Core fields ---
  setType(type: RfqRequestBase["type"]) {
    this.data.type = type;
    return this;
  }

  setDueDate(date: string) {
    this.data.dueDate = date;
    return this;
  }

  setDueDateInMonths(months: number) {
    const d = new Date();
    d.setMonth(d.getMonth() + months);
    this.data.dueDate = d.toISOString();
    return this;
  }

  // --- Services / Engagement ---
  addService(serviceId: string) {
    if (!this.data.services) this.data.services = [];
    this.data.services.push({ serviceId });
    return this;
  }

  setEngagementModel(model: string) {
    this.data.engagementModel = model;
    return this;
  }

  // --- Non-conf section ---
  private ensureNonconf() {
    if (!this.data.nonconf) this.data.nonconf = {};
  }

  setNonconfField<K extends keyof RfqNonConf>(key: K, value: RfqNonConf[K]) {
    this.ensureNonconf();
    this.data.nonconf![key] = value;
    return this;
  }

  addNonconfAttachment(att: RfqAttachment) {
    this.ensureNonconf();
    if (!this.data.nonconf!.attachments) this.data.nonconf!.attachments = [];
    this.data.nonconf!.attachments.push(att);
    return this;
  }

  // --- CONF section ---
  private ensureConf() {
    if (!this.data.conf) this.data.conf = {};
  }

  addStructure(struct: RfqStructure) {
    this.ensureConf();
    if (!this.data.conf!.structures) this.data.conf!.structures = [];
    this.data.conf!.structures.push(struct);
    return this;
  }

  addConfAttachment(att: RfqAttachment) {
    this.ensureConf();
    if (!this.data.conf!.attachments) this.data.conf!.attachments = [];
    this.data.conf!.attachments.push(att);
    return this;
  }

  setConfNotes(notes: string) {
    this.ensureConf();
    this.data.conf!.notes = notes;
    return this;
  }

  // --- Overrides for negative tests ---
  override(patch: Partial<RfqRequestBase>) {
    this.data = { ...this.data, ...patch };
    return this;
  }

  overrideNonconf(patch: Partial<RfqNonConf>) {
    this.ensureNonconf();
    this.data.nonconf = { ...this.data.nonconf!, ...patch };
    return this;
  }

  overrideConf(patch: Partial<RfqConf>) {
    this.ensureConf();
    this.data.conf = { ...this.data.conf!, ...patch };
    return this;
  }
  

  build(): RfqRequestBase {
    return JSON.parse(JSON.stringify(this.data));
  }
}



