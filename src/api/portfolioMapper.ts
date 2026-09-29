import type {
  ContentBlock,
  PortfolioDocument,
  SkillCategory,
  SkillItem,
  TimelineDateItem,
  TimelineRangeItem,
} from "@/types/portfolio";

// The API is intentionally normalized at this boundary because older responses
// contain both legacy and v2 block shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function nullableDate(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function itemId(raw: AnyRecord, fallback: string) {
  return typeof raw.id === "string" && raw.id ? raw.id : fallback;
}

function normalizeTimelineItem(raw: AnyRecord, type: ContentBlock["type"], index: number): TimelineRangeItem | TimelineDateItem {
  const base = {
    ...raw,
    id: itemId(raw, `${type}-item-${index + 1}`),
    organization: raw.organization ?? "",
  };

  if (type === "awards" || type === "certification") {
    return { ...base, date: nullableDate(raw.date) } as TimelineDateItem;
  }

  return {
    ...base,
    startDate: nullableDate(raw.startDate),
    endDate: raw.endDate === "Present" ? "Present" : nullableDate(raw.endDate),
  } as TimelineRangeItem;
}

function normalizeBlock(raw: AnyRecord, index: number): ContentBlock {
  const type = raw.type as ContentBlock["type"];
  const id = itemId(raw, `${type}-block-${index + 1}`);

  if (type === "about") {
    return { id, type, visible: raw.visible !== false, description: raw.description ?? raw.body ?? "" };
  }

  if (type === "skills") {
    const categories: SkillCategory[] = (raw.categories ?? []).map((category: AnyRecord, categoryIndex: number) => ({
      ...category,
      id: itemId(category, `${id}-category-${categoryIndex + 1}`),
      category: category.category ?? "",
      items: (category.items ?? []).map((item: string | AnyRecord, itemIndex: number): SkillItem => {
        const normalized = typeof item === "string" ? { name: item } : item;
        return { ...normalized, id: itemId(normalized, `${id}-category-${categoryIndex + 1}-item-${itemIndex + 1}`), name: normalized.name ?? "" };
      }),
    }));
    return { id, type, visible: raw.visible !== false, categories };
  }

  if (type === "works") {
    const projectLinkLabels = ["Link", "GitHub"];
    return {
      ...raw,
      id,
      type,
      visible: raw.visible !== false,
      items: (raw.items ?? []).map((item: AnyRecord, itemIndex: number) => ({
        ...item,
        id: itemId(item, `${id}-item-${itemIndex + 1}`),
        links: (item.links ?? []).map((link: AnyRecord, linkIndex: number) => ({
          ...link,
          label: projectLinkLabels[linkIndex] ?? link.label ?? `Link ${linkIndex + 1}`,
        })),
      })),
    };
  }

  return {
    ...raw,
    id,
    type,
    visible: raw.visible !== false,
    items: (raw.items ?? []).map((item: AnyRecord, itemIndex: number) => normalizeTimelineItem(item, type, itemIndex)),
  } as ContentBlock;
}

export function normalizePortfolioDocument(raw: unknown): PortfolioDocument {
  const source = raw as AnyRecord;
  return {
    ...source,
    blocks: (source.blocks ?? []).map((block: AnyRecord, index: number) => normalizeBlock(block, index)),
  } as PortfolioDocument;
}
