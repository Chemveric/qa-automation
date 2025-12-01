export interface RfqAttachment {
  fileId: string;
  filename: string;
  purpose: string;
}

export interface RfqStructure {
  compoundName: string;
  quantity: string;
  unit: string;
  purity: number;
  analyticalMethods: string[];
  smiles: string;
  molecularFormula: string;
  molecularWeight: number;
  source: string;
}

export interface RfqNonConf {
  projectDescription?: string;
  proposalTurnaroundDays?: number;
  deliveryDate?: string;
  targetBudget?: number;
  sector?: string;
  stage?: string;
  complexity?: string;
  companySize?: string;
  region?: string;
  priority?: string;

  // Common fields
  quantity?: string;
  purityMinPct?: number | string;
  deliveryTime?: string;

  attachments?: RfqAttachment[];
}

export interface RfqConf {
  structures?: RfqStructure[];
  notes?: string;
  attachments?: RfqAttachment[];
}

export interface RfqRequestBase {
  type: "BULK" | "CUSTOM" | "OPEN";
  dueDate?: string;
  services?: { serviceId: string }[];
  engagementModel?: string;

  nonconf?: RfqNonConf;
  conf?: RfqConf;
}
