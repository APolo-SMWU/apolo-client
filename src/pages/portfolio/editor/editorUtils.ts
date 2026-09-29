import type { ProfileFieldKind, PortfolioDocument } from "@/types/portfolio";
import { getCardField } from "../cardData";

export const inputClass = "w-full border-0 bg-transparent px-0 py-0 font-[inherit] text-inherit leading-[inherit] tracking-[inherit] caret-primary outline-none";
export const panelClass = "rounded-xl border border-transparent p-3";
export const projectLinkLabels = ["Link", "GitHub"];
let clientEntitySequence = 0;

export function createClientId(kind: string) {
  clientEntitySequence += 1;
  return `client-${kind}-${clientEntitySequence}`;
}

export function getField(document: PortfolioDocument, kind: ProfileFieldKind) {
  const profileValue = document.profile.fields.find((field) => field.kind === kind)?.value;
  if (kind === "tel") return document.card.tel ?? "";
  return profileValue || getCardField(document, kind);
}
