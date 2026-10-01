import type { ContentBlock, PortfolioDocument, TimelineBlock } from "@/types/portfolio";

export type TimelineItem = TimelineBlock["items"][number];

function getItemDate(item: TimelineItem) {
  if ("date" in item) return item.date;
  return item.endDate === "Present" ? "Present" : item.endDate ?? item.startDate;
}

function dateSortValue(value: string | null) {
  if (!value) return Number.NEGATIVE_INFINITY;
  if (value === "Present") return Number.POSITIVE_INFINITY;

  const match = value.match(/(\d{4})\D*(\d{1,2})?/);
  if (!match) return Number.NEGATIVE_INFINITY;

  return Number(match[1]) * 100 + Number(match[2] ?? 0);
}

export function sortTimelineItems(items: TimelineItem[]) {
  return [...items].sort((left, right) => dateSortValue(getItemDate(right)) - dateSortValue(getItemDate(left)));
}

function isTimelineBlock(block: ContentBlock): block is Extract<ContentBlock, { type: TimelineBlock["type"] }> {
  return ["education", "experience", "activities", "awards", "certification"].includes(block.type);
}

export function sortPortfolioTimelineBlocks(document: PortfolioDocument): PortfolioDocument {
  return {
    ...document,
    blocks: document.blocks.map((block) => (
      isTimelineBlock(block)
        ? { ...block, items: sortTimelineItems(block.items as TimelineItem[]) }
        : block
    )) as PortfolioDocument["blocks"],
  };
}
