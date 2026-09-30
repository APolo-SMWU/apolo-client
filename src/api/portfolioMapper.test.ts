import { describe, expect, it } from "vitest";
import { normalizePortfolioDocument } from "./portfolioMapper";

describe("normalizePortfolioDocument", () => {
  it("maps legacy awards and certification fields to the current contract", () => {
    const document = normalizePortfolioDocument({
      blocks: [
        {
          type: "awards",
          items: [{ id: "award-1", organization: "Best Award", role: "Acme", description: "legacy" }],
        },
        {
          type: "certification",
          items: [{ id: "cert-1", organization: "TypeScript", role: "Advanced", description: "legacy" }],
        },
      ],
    });

    expect(document.blocks).toEqual([
      {
        id: "awards-block-1",
        type: "awards",
        visible: true,
        items: [{ id: "award-1", title: "Best Award", issuer: "Acme", date: null }],
      },
      {
        id: "certification-block-2",
        type: "certification",
        visible: true,
        items: [{ id: "cert-1", title: "TypeScript", grade: "Advanced", issuer: null, date: null }],
      },
    ]);
  });

  it("keeps only the fields allowed by each current timeline contract", () => {
    const document = normalizePortfolioDocument({
      blocks: [
        { type: "education", items: [{ organization: "School", role: "CS", description: "legacy" }] },
        { type: "experience", items: [{ organization: "Company", role: "Engineer", description: "impact" }] },
      ],
    });

    expect(document.blocks[0]).toMatchObject({ items: [{ organization: "School", role: "CS" }] });
    expect(document.blocks[0]).not.toMatchObject({ items: [{ description: expect.anything() }] });
    expect(document.blocks[1]).toMatchObject({ items: [{ organization: "Company", role: "Engineer", description: "impact" }] });
  });
});
