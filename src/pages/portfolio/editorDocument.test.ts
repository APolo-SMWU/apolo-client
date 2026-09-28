import { describe, expect, it } from "vitest";
import type { PortfolioDocument } from "@/types/portfolio";
import { buildPortfolioUpdateRequest } from "./editorDocument";

function makeDocument(overrides: Partial<PortfolioDocument["card"]> = {}): PortfolioDocument {
  return {
    id: "portfolio-1",
    title: "Portfolio",
    userType: "professional",
    cardDesignId: "purple",
    siteDesignId: "classic",
    card: {
      phone: "010-1234-5678",
      email: "test@example.com",
      tel: "02-1234-5678",
      ...overrides,
    },
    profile: {
      name: "홍길동",
      title: "개발자",
      fields: [
        { kind: "tel", label: "Tel", value: "02-1234-5678" },
        { kind: "phone", label: "Phone", value: "010-1234-5678" },
      ],
    },
    blocks: [],
    sourceLinks: [],
    sourceSnapshots: [],
    schemaVersion: 1,
    status: "draft",
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  };
}

describe("buildPortfolioUpdateRequest", () => {
  it("includes card.tel when the business card tel changes", () => {
    const originalDocument = makeDocument();
    const draftDocument = makeDocument({ tel: "02-9876-5432" });

    expect(buildPortfolioUpdateRequest(originalDocument, draftDocument)).toEqual({
      card: { tel: "02-9876-5432" },
    });
  });

  it("includes card.tel as null when the business card tel is deleted", () => {
    const originalDocument = makeDocument();
    const draftDocument = makeDocument({ tel: undefined });

    expect(buildPortfolioUpdateRequest(originalDocument, draftDocument)).toEqual({
      card: { tel: null },
    });
  });

  it("does not change profile.fields.tel when only the business card tel changes", () => {
    const originalDocument = makeDocument();
    const draftDocument = makeDocument({ tel: "02-9876-5432" });

    expect(buildPortfolioUpdateRequest(originalDocument, draftDocument)).not.toHaveProperty("profile");
  });
});
