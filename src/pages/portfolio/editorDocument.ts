import type { PortfolioDocument } from "@/types/portfolio";
import type { UpdatePortfolioRequest } from "@/api/portfolio";
import type { ContentBlock, ContentBlockInput } from "@/types/portfolio";

export function hasDocumentChanged(
  originalDocument: PortfolioDocument,
  draftDocument: PortfolioDocument,
) {
  return JSON.stringify(originalDocument) !== JSON.stringify(draftDocument);
}

export function buildPortfolioUpdateRequest(
  originalDocument: PortfolioDocument,
  draftDocument: PortfolioDocument,
): UpdatePortfolioRequest {
  const request: UpdatePortfolioRequest = {};

  const profile: NonNullable<UpdatePortfolioRequest["profile"]> = {};
  if (originalDocument.profile.name !== draftDocument.profile.name) {
    profile.name = draftDocument.profile.name;
  }
  if (originalDocument.profile.title !== draftDocument.profile.title) {
    profile.title = draftDocument.profile.title;
  }
  if (originalDocument.profile.avatarUrl !== draftDocument.profile.avatarUrl) {
    profile.avatarUrl = draftDocument.profile.avatarUrl;
  }
  if (JSON.stringify(originalDocument.profile.fields) !== JSON.stringify(draftDocument.profile.fields)) {
    profile.fields = draftDocument.profile.fields;
  }
  if (Object.keys(profile).length > 0) {
    request.profile = profile;
  }

  const card: NonNullable<UpdatePortfolioRequest["card"]> = {};
  if (originalDocument.card.phone !== draftDocument.card.phone) {
    card.phone = draftDocument.card.phone;
  }
  if (originalDocument.card.email !== draftDocument.card.email) {
    card.email = draftDocument.card.email;
  }
  if (originalDocument.card.tel !== draftDocument.card.tel) {
    card.tel = draftDocument.card.tel ?? null;
  }
  if (originalDocument.card.organizationAddress !== draftDocument.card.organizationAddress) {
    card.organizationAddress = draftDocument.card.organizationAddress;
  }
  if (Object.keys(card).length > 0) {
    request.card = card;
  }

  if (JSON.stringify(originalDocument.blocks) !== JSON.stringify(draftDocument.blocks)) {
    request.blocks = buildBlocksPayload(draftDocument.blocks);
  }

  return request;
}

export function buildBlocksPayload(blocks: Array<ContentBlock | ContentBlockInput>): ContentBlockInput[] {
  const stripClientId = <T extends { id?: string }>(value: T) => {
    if (!value.id?.startsWith("client-")) return value;
    const withoutId = { ...value } as Partial<T>;
    delete withoutId.id;
    return withoutId as Omit<T, "id">;
  };
  const normalizeDate = (value: string | null | undefined) => value?.trim() ? value : null;

  return blocks.map((block) => {
    const blockWithoutClientId = stripClientId(block);
    if (block.type === "about") return { ...blockWithoutClientId };
    if (block.type === "skills") {
      return {
        ...blockWithoutClientId,
        categories: block.categories.map((category) => ({
          ...stripClientId(category),
          items: category.items.map((item) => ({ ...stripClientId(item) })),
        })),
      };
    }
    if (block.type === "works") {
      return { ...blockWithoutClientId, items: block.items.map((item) => ({ ...stripClientId(item) })) } as ContentBlockInput;
    }
    return {
      ...blockWithoutClientId,
      items: block.items.map((item) => {
        const normalizedItem = stripClientId(item);
        if ("date" in item) return { ...normalizedItem, date: normalizeDate(item.date) };
        return {
          ...normalizedItem,
          startDate: normalizeDate(item.startDate),
          endDate: item.endDate === "Present" ? "Present" : normalizeDate(item.endDate),
        };
      }),
    } as ContentBlockInput;
  }) as ContentBlockInput[];
}

export function resolveSavedWorkItemId(
  draftDocument: PortfolioDocument,
  savedDocument: PortfolioDocument,
  itemId: string,
) {
  const draftBlockIndex = draftDocument.blocks.findIndex(
    (block) => block.type === "works" && block.items.some((item) => item.id === itemId),
  );
  const draftBlock = draftDocument.blocks[draftBlockIndex];
  if (!draftBlock || draftBlock.type !== "works") return itemId;

  const draftItemIndex = draftBlock.items.findIndex((item) => item.id === itemId);
  if (draftItemIndex < 0 || !itemId.startsWith("client-")) return itemId;

  const savedBlock = draftBlock.id.startsWith("client-")
    ? savedDocument.blocks[draftBlockIndex]
    : savedDocument.blocks.find((block) => block.id === draftBlock.id);
  return savedBlock?.type === "works"
    ? savedBlock.items[draftItemIndex]?.id ?? itemId
    : itemId;
}
