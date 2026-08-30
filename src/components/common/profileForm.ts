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
