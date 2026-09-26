import { describe, expect, it } from "vitest";
import { buildPortfolioUpdateRequest, hasDocumentChanged } from "./editorDocument";
import { mockPortfolio } from "@/data/mockPortfolio";

describe("editor document state", () => {
  it("treats an unchanged draft as clean", () => {
    expect(hasDocumentChanged(mockPortfolio, structuredClone(mockPortfolio))).toBe(false);
  });

  it("detects a changed draft without relying on selection state", () => {
    const draft = structuredClone(mockPortfolio);
    draft.profile.name = `${draft.profile.name} 수정`;

    expect(hasDocumentChanged(mockPortfolio, draft)).toBe(true);
  });

  it("sends only the profile when only profile values changed", () => {
    const draft = structuredClone(mockPortfolio);
    draft.profile.name = `${draft.profile.name} 수정`;

    expect(buildPortfolioUpdateRequest(mockPortfolio, draft)).toEqual({
      profile: { name: draft.profile.name },
    });
  });

  it("sends only blocks when only block values changed", () => {
    const draft = structuredClone(mockPortfolio);
    const about = draft.blocks.find((block) => block.type === "about");
    if (!about || about.type !== "about") throw new Error("about block not found");
    about.body = `${about.body} 수정`;

    expect(buildPortfolioUpdateRequest(mockPortfolio, draft)).toEqual({
      blocks: draft.blocks,
    });
  });
});
