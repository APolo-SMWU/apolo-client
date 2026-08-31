export type ProfileFormValues = Record<string, string>;

type ProfileFieldRequirement = {
  name: string;
  required?: boolean;
};

export function areRequiredProfileFieldsComplete(
  fields: ProfileFieldRequirement[],
  values: ProfileFormValues,
) {
  return fields
    .filter((field) => field.required)
    .every((field) => values[field.name]?.trim() !== "");
}

export function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}
