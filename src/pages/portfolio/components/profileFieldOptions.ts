import type { ProfileFieldKind } from "@/types/portfolio";

export const profileFieldOptions: { kind: ProfileFieldKind; label: string; required?: boolean }[] = [
  { kind: "email", label: "Email", required: true },
  { kind: "phone", label: "Phone", required: true },
  { kind: "github", label: "GitHub" },
  { kind: "company", label: "Company" },
  { kind: "scholar", label: "Scholar" },
  { kind: "notion", label: "Notion" },
  { kind: "blog", label: "Blog" },
  { kind: "linkedin", label: "LinkedIn" },
];

export const requiredProfileKinds = profileFieldOptions.filter((field) => field.required).map((field) => field.kind);
