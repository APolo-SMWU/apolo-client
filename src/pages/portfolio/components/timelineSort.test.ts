import { describe, expect, it } from "vitest";
import type { ContentBlock, PortfolioDocument, TimelineBlock } from "@/types/portfolio";
import { sortPortfolioTimelineBlocks, sortTimelineItems } from "./timelineSort";

describe("sortTimelineItems", () => {
  it("sorts dated timeline items from newest to oldest", () => {
    const block: Extract<TimelineBlock, { type: "education" }> = {
      id: "education",
      type: "education",
      visible: true,
      items: [
        { id: "old", startDate: "2022.03", endDate: "2024.02", organization: "Old" },
        { id: "new", startDate: "2026.03", endDate: "Present", organization: "New" },
      ],
    };

    expect(sortTimelineItems(block.items).map((item) => item.id)).toEqual(["new", "old"]);
  });

  it("uses the latest end date when period starts are the same", () => {
    const items = [
      { id: "june", startDate: "2026.03", endDate: "2026.06", organization: "June" },
      { id: "august", startDate: "2026.03", endDate: "2026.08", organization: "August" },
    ];

    expect(sortTimelineItems(items).map((item) => item.id)).toEqual(["august", "june"]);
  });

  it("keeps undated items after dated items", () => {
    const items = [
      { id: "undated", startDate: null, endDate: null, organization: "Undated" },
      { id: "dated", startDate: "2025.01", endDate: null, organization: "Dated" },
    ];

    expect(sortTimelineItems(items).map((item) => item.id)).toEqual(["dated", "undated"]);
  });

  it("sorts timeline blocks without changing the source document", () => {
    const document = {
      id: 1,
      blocks: [{
        id: "education",
        type: "education" as const,
        visible: true,
        items: [
          { id: "old", startDate: "2022.03", endDate: null, organization: "Old" },
          { id: "new", startDate: "2026.03", endDate: null, organization: "New" },
        ],
      }],
    } as unknown as PortfolioDocument;

    const sorted = sortPortfolioTimelineBlocks(document);
    const sortedEducation = sorted.blocks.find(
      (block): block is Extract<ContentBlock, { type: "education" }> => block.type === "education",
    );
    const originalEducation = document.blocks.find(
      (block): block is Extract<ContentBlock, { type: "education" }> => block.type === "education",
    );

    expect(sortedEducation?.items.map((item) => item.id)).toEqual(["new", "old"]);
    expect(originalEducation?.items.map((item) => item.id)).toEqual(["old", "new"]);
  });
});
