import { RfqBuilder } from "./rfqBuilder";
import {
  RfqAttachment,
  RfqNonConf,
  RfqRequestBase,
  RfqStructure,
  RfqConf,
} from "../types/rfqs.types";

export class RfqFactory {
  static bulk() {
    return new RfqBuilder("BULK").build();
  }

  static bulkFull() {
    return new RfqBuilder("BULK")
      .setDueDate("2025-12-31T23:59:59Z")
      .setNonconfField(
        "projectDescription",
        "Bulk catalog replenishment managed by Chemveric ops."
      )
      .setNonconfField("proposalTurnaroundDays", 7)
      .setNonconfField("deliveryDate", "2025-09-15")
      .setNonconfField("targetBudget", 25000)
      .setNonconfField("sector", "Catalog")
      .setNonconfField("stage", "Commercial")
      .setNonconfField("complexity", "Low")
      .setNonconfField("companySize", "Enterprise")
      .setNonconfField("region", "Global")
      .setNonconfField("priority", "Standard")
      .setNonconfField("quantity", "10kg")
      .setNonconfField("purityMinPct", 95)
      .setNonconfField("deliveryTime", "2 weeks")
      .build();
  }

  static custom(fileId: string, fileName: string) {
    return new RfqBuilder("CUSTOM")
      .addService("00145593-4a92-4c53-ab93-7c0fbf52632b")
      .setEngagementModel("FFS")
      .setNonconfField(
        "projectDescription",
        "Bulk catalog replenishment managed by Chemveric ops AQA test."
      )
      .setNonconfField("proposalTurnaroundDays", 7)
      .setNonconfField("deliveryDate", "2026-03-15")
      .setNonconfField("targetBudget", 25000)
      .setNonconfField("sector", "Pharmaceutical")
      .setNonconfField("stage", "Preclinical")
      .setNonconfField("complexity", "High")
      .setNonconfField("companySize", "Large")
      .setNonconfField("region", "US")
      .setNonconfField("priority", "High")
      .setNonconfField("quantity", "500g")
      .setNonconfField("purityMinPct", 99)
      .setNonconfField("deliveryTime", "4-6 weeks")
      .addNonconfAttachment({
        fileId,
        filename: fileName,
        purpose: "RFQ",
      })
      .addStructure({
        compoundName: "2 Amino 5 Chlorobenzophenone Intermediate",
        quantity: "100",
        unit: "gram(s)",
        purity: 96.25,
        analyticalMethods: ["HPLC", "NMR", "MS"],
        smiles: "C1=CC=CC=C1",
        molecularFormula: "C6H6",
        molecularWeight: 78.11,
        source: "SMILES",
      })
      .setConfNotes("Handle under inert atmosphere")
      .addConfAttachment({
        fileId: "f25e4328-bf1d-5d7d-85fe-fe717b1cd2ed",
        filename: "compound1.mol",
        purpose: "RFQ_CONFIDENTIAL",
      })
      .build();
  }

  static customStep1Minimal() {
    return new RfqBuilder("CUSTOM")
      .setDueDate("2026-02-20T23:59:59Z")
      .override({
        services: [
          { serviceId: "00145593-4a92-4c53-ab93-7c0fbf52632b" },
          { serviceId: "00d6a995-5413-4062-8e61-96a49608b849" },
        ],
        engagementModel: "FFS",
      })
      .setNonconfField(
        "projectDescription",
        "Discovery-stage scope to identify CRO partner for impurity synthesis and analytical method validation AQA test."
      )
      .setNonconfField("proposalTurnaroundDays", 10)
      .setNonconfField("deliveryDate", "2026-03-01")
      .setNonconfField("targetBudget", 40000)
      .setNonconfField("sector", "Pharmaceutical")
      .setNonconfField("stage", "Preclinical")
      .setNonconfField("complexity", "Medium")
      .setNonconfField("companySize", "Mid-size")
      .setNonconfField("region", "North America")
      .setNonconfField("priority", "High")
      .setNonconfField("quantity", "500g")
      .setNonconfField("purityMinPct", 99)
      .setNonconfField("deliveryTime", "4-6 weeks")
      .build();
  }

  static customStep2RequiredFields() {
    return new RfqBuilder("CUSTOM")
      .setDueDate("2026-03-20T23:59:59Z")
      .override({
        services: [{ serviceId: "00145593-4a92-4c53-ab93-7c0fbf52632b" }],
        engagementModel: "FFS",
      })
      .setNonconfField(
        "projectDescription",
        "Process development for late-stage intermediate including analytical validation and tech transfer package."
      )
      .setNonconfField("proposalTurnaroundDays", 14)
      .setNonconfField("deliveryDate", "2026-03-20")
      .setNonconfField("targetBudget", 75000)
      .setNonconfField("sector", "Pharmaceutical")
      .setNonconfField("stage", "Preclinical")
      .setNonconfField("complexity", "High")
      .setNonconfField("companySize", "Enterprise")
      .setNonconfField("region", "North America")
      .setNonconfField("priority", "Critical")
      .setNonconfField("quantity", "500g")
      .setNonconfField("purityMinPct", 99)
      .setNonconfField("deliveryTime", "4-6 weeks")
      .setNonconfField("attachments", [
        {
          fileId: "nonconf-file-123",
          filename: "scope-summary.pdf",
          purpose: "RFQ",
        },
      ])
      .build();
  }

  static createCustomFullStep3(
    overrides: Partial<RfqRequestBase> = {}
  ): RfqRequestBase {
    const builder = new RfqBuilder("CUSTOM")
      .setDueDate("2025-12-31T23:59:59Z")
      .addService("00145593-4a92-4c53-ab93-7c0fbf52632b")
      .setEngagementModel("FFS")

      // --- Nonconf section ---
      .setNonconfField(
        "projectDescription",
        "Multi-compound custom synthesis project with analytical validation and tech transfer package."
      )
      .setNonconfField("proposalTurnaroundDays", 14)
      .setNonconfField("deliveryDate", "2025-12-31")
      .setNonconfField("targetBudget", 50000)
      .setNonconfField("sector", "Pharmaceutical")
      .setNonconfField("stage", "Preclinical")
      .setNonconfField("complexity", "High")
      .setNonconfField("companySize", "Large")
      .setNonconfField("region", "US")
      .setNonconfField("priority", "High")
      .setNonconfField("quantity", "500g")
      .setNonconfField("purityMinPct", 99)
      .setNonconfField("deliveryTime", "4-6 weeks");

    // --- CONF section ---
    const structures: RfqStructure[] = [
      {
        compoundName: "2-Amino-5-chlorobenzophenone Intermediate",
        smiles: "C1=CC(=CC=C1C(=O)C2=CC(=C(C=C2)Cl)N)",
        quantity: "100",
        unit: "gram(s)",
        purity: 96.25,
        analyticalMethods: ["HPLC", "NMR", "MS"],
        source: "SMILES",
        molecularFormula: "C13H10ClNO", // ✔ add this
        molecularWeight: 227.68,
      },
      {
        compoundName: "3-Hydroxynorvaline",
        smiles: "CC(CCCO)N",
        quantity: "100",
        unit: "gram(s)",
        purity: 96.25,
        analyticalMethods: ["HPLC", "NMR"],
        source: "SMILES",
        molecularFormula: "C5H11NO2",
        molecularWeight: 117.15,
      },
      {
        compoundName: "3-Pyridinylboronic acid",
        smiles: "B(C1=CC=CN=C1)O",
        quantity: "100",
        unit: "gram(s)",
        purity: 96.25,
        analyticalMethods: ["HPLC", "MS"],
        source: "SMILES",
        molecularFormula: "C5H6BNO2",
        molecularWeight: 111.91,
      },
    ];
    structures.forEach((s) => builder.addStructure(s));

    const confAttachments: RfqAttachment[] = [
      {
        fileId: "f25e4328-bf1d-5d7d-85fe-fe717b1cd2ed",
        filename: "compound1.mol",
        purpose: "RFQ_CONFIDENTIAL",
      },
      {
        fileId: "6fdc03fa-7169-5018-8c94-bba86084313e",
        filename: "compound2.sdf",
        purpose: "RFQ_CONFIDENTIAL",
      },
    ];
    confAttachments.forEach((att) => builder.addConfAttachment(att));

    builder.setConfNotes(
      "These compounds are proprietary. Handle under inert atmosphere. Temperature sensitive - store at -20°C."
    );

    // Apply optional overrides for testing negative cases
    if (overrides.nonconf) builder.overrideNonconf(overrides.nonconf);
    if (overrides.conf) builder.overrideConf(overrides.conf);

    return builder.override(overrides).build();
  }

  static open(overrides: Partial<RfqRequestBase> = {}) {
    const builder = new RfqBuilder("OPEN")
      .setDueDate("2026-10-30T12:00:00Z")

      // --- Nonconf fields ---
      .setNonconfField(
        "projectDescription",
        "Open-market request for general catalog compound resupply."
      )
      .setNonconfField("proposalTurnaroundDays", 5)
      .setNonconfField("deliveryDate", "2025-09-25")
      .setNonconfField("targetBudget", 15000)
      .setNonconfField("sector", "Manufacturing")
      .setNonconfField("stage", "Commercial")
      .setNonconfField("complexity", "Low")
      .setNonconfField("companySize", "Startup")
      .setNonconfField("region", "Europe")
      .setNonconfField("priority", "Normal")
      .setNonconfField("quantity", "1kg")
      .setNonconfField("purityMinPct", 95)
      .setNonconfField("deliveryTime", "2-3 weeks");

    // Apply overrides (works for negative tests)
    if (overrides.nonconf) builder.overrideNonconf(overrides.nonconf);
    if (overrides.conf) builder.overrideConf(overrides.conf);

    const result = builder.override(overrides).build();

    return result;
  }

  static createOpenWithDueDate(dueDate: string) {
    const builder = new RfqBuilder("OPEN")
      // set default nonconf fields
      .setNonconfField(
        "projectDescription",
        "Open-market request for general catalog compound resupply."
      )
      .setNonconfField("proposalTurnaroundDays", 5)
      .setNonconfField("deliveryDate", "2025-09-25")
      .setNonconfField("targetBudget", 15000)
      .setNonconfField("sector", "Manufacturing")
      .setNonconfField("stage", "Commercial")
      .setNonconfField("complexity", "Low")
      .setNonconfField("companySize", "Startup")
      .setNonconfField("region", "Europe")
      .setNonconfField("priority", "Normal")
      .setNonconfField("quantity", "1kg")
      .setNonconfField("purityMinPct", 95)
      .setNonconfField("deliveryTime", "2-3 weeks");

    // Just override the dueDate
    return builder.override({ dueDate }).build();
  }

  static patchOnlyType(type: "BULK" | "CUSTOM" | "OPEN") {
    return new RfqBuilder().setType(type).build();
  }

  static patchDueDateOnly(date: string) {
    return new RfqBuilder().setDueDate(date).build();
  }

  static patchNonconfOnly(patch: Partial<RfqNonConf>) {
    return new RfqBuilder().overrideNonconf(patch).build();
  }

  static patchNonconfInvalid() {
    return new RfqBuilder("BULK")
      .overrideNonconf({
        projectDescription: 123 as any,
        proposalTurnaroundDays: -5 as any,
        deliveryDate: "not-a-date" as any,
        targetBudget: -1000 as any,
        sector: 456 as any,
        stage: true as any,
        complexity: null as any,
        companySize: {} as any,
        region: [] as any,
        priority: 789 as any,
      })
      .build();
  }

  static invalidWrongType() {
    return new RfqBuilder("BULK")
      .override({
        type: "INVALID" as unknown as RfqRequestBase["type"],
        dueDate: "2026-01-01T00:00:00Z",
      })
      .build();
  }
}
