import type { ProfileFieldKind, PortfolioDocument } from "@/types/portfolio";

const cardFieldByKind: Partial<Record<ProfileFieldKind, keyof PortfolioDocument["card"]>> = {
  tel: "tel",
  phone: "mobile",
  email: "email",
  company: "company",
  university: "university",
  department: "department",
  major: "major",
};

export function getCardField(document: PortfolioDocument, kind: ProfileFieldKind) {
  const cardKey = cardFieldByKind[kind];
  const cardValue = cardKey ? document.card[cardKey] : undefined;
  if (typeof cardValue === "string" && cardValue.length > 0) return cardValue;

  if (kind === "phone" && document.card.phone) return document.card.phone;
  return document.profile.fields.find((field) => field.kind === kind)?.value ?? "";
}

export function getCardName(document: PortfolioDocument) {
  return document.card.name || document.profile.name;
}

export function getCardJob(document: PortfolioDocument) {
  return document.card.headline || document.profile.title;
}
