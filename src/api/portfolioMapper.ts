import type {
  ActivitiesItem,
  AwardItem,
  ContentBlock,
  CertificationItem,
  EducationItem,
  ExperienceItem,
  PortfolioDocument,
  SkillCategory,
  SkillItem,
} from "@/types/portfolio";

// The API is intentionally normalized at this boundary because older responses
// contain both legacy and v2 block shapes.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyRecord = Record<string, any>;

function nullableDate(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function nullableText(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function itemId(raw: AnyRecord, fallback: string) {
  return typeof raw.id === "string" && raw.id ? raw.id : fallback;
}

function normalizeTimelineItem(raw: AnyRecord, type: ContentBlock["type"], index: number): EducationItem | ExperienceItem | ActivitiesItem | AwardItem | CertificationItem {
  const id = itemId(raw, `${type}-item-${index + 1}`);
  const entityId = typeof raw.entityId === "string" ? raw.entityId : undefined;

  if (type === "awards") {
    return {
      id,
      ...(entityId ? { entityId } : {}),
      title: raw.title ?? raw.organization ?? "",
      issuer: nullableText(raw.issuer ?? raw.role),
      date: nullableDate(raw.date),
    };
  }

  if (type === "certification") {
    return {
      id,
      ...(entityId ? { entityId } : {}),
      title: raw.title ?? raw.organization ?? "",
      grade: nullableText(raw.grade ?? raw.role),
      issuer: nullableText(raw.issuer),
      date: nullableDate(raw.date),
    };
  }

  const range = {
    id,
    ...(entityId ? { entityId } : {}),
    startDate: nullableDate(raw.startDate),
    endDate: raw.endDate === "Present" ? "Present" : nullableDate(raw.endDate),
  };

  if (type === "education") {
    return { ...range, organization: raw.organization ?? "", role: nullableText(raw.role) ?? undefined };
  }

  return {
    ...range,
    organization: nullableText(raw.organization),
    role: nullableText(raw.role),
    description: nullableText(raw.description),
    ...(type === "experience" && ["fulltime", "contract", "intern", "research"].includes(raw.kind) ? { kind: raw.kind } : {}),
    ...(type === "activities" && ["club", "volunteer", "program", "talk"].includes(raw.kind) ? { kind: raw.kind } : {}),
  } as ExperienceItem | ActivitiesItem;
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
        const entityIds = Array.isArray(normalized.entityIds)
          ? normalized.entityIds.filter((entityId: unknown): entityId is string => typeof entityId === "string" && entityId.trim().length > 0)
          : typeof normalized.entityId === "string" && normalized.entityId.trim()
            ? [normalized.entityId]
            : undefined;
        return {
          id: itemId(normalized, `${id}-category-${categoryIndex + 1}-item-${itemIndex + 1}`),
          name: normalized.name ?? "",
          ...(typeof normalized.entityId === "string" ? { entityId: normalized.entityId } : {}),
          ...(entityIds !== undefined ? { entityIds } : {}),
        };
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
          label: link.label ?? projectLinkLabels[linkIndex] ?? `Link ${linkIndex + 1}`,
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
