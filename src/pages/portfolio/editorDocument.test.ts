import { describe, expect, it } from "vitest";
import { buildBlocksPayload } from "./editorDocument";

describe("buildBlocksPayload", () => {
  it("serializes timeline blocks with only their strict contract fields", () => {
    const payload = buildBlocksPayload([
      {
        id: "block-1",
        type: "awards",
        visible: true,
        items: [{ id: "award-1", title: "Award", issuer: "Issuer", date: "2025" }],
      },
      {
        id: "block-2",
        type: "certification",
        visible: true,
        items: [{ id: "cert-1", title: "Cert", grade: "A", issuer: "Issuer", date: null }],
      },
      {
        id: "block-3",
        type: "education",
        visible: true,
        items: [{ id: "education-1", startDate: "2020", endDate: "2024", organization: "School", role: "CS" }],
      },
      {
        id: "block-4",
        type: "experience",
        visible: true,
        items: [{ id: "experience-1", startDate: "2024", endDate: "Present", organization: "Company", role: "Engineer", description: "Impact" }],
      },
    ]);

    expect(payload).toEqual([
      { id: "block-1", type: "awards", visible: true, items: [{ id: "award-1", title: "Award", issuer: "Issuer", date: "2025" }] },
      { id: "block-2", type: "certification", visible: true, items: [{ id: "cert-1", title: "Cert", grade: "A", issuer: "Issuer", date: null }] },
      { id: "block-3", type: "education", visible: true, items: [{ id: "education-1", startDate: "2020", endDate: "2024", organization: "School", role: "CS" }] },
      { id: "block-4", type: "experience", visible: true, items: [{ id: "experience-1", startDate: "2024", endDate: "Present", organization: "Company", role: "Engineer", description: "Impact" }] },
    ]);
  });
});
