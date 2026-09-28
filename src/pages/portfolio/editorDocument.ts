import type { PortfolioDocument } from "@/types/portfolio";
import type { UpdatePortfolioRequest } from "@/api/portfolio";

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
    request.blocks = draftDocument.blocks;
  }

  return request;
}
