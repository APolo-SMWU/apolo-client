export type CreateTheme = "blue" | "mono" | "orange" | "purple" | "green";

export type CreateCardRequest = {
  title: string;
  theme: CreateTheme;
  externalLinks: string[];
  requirements: string;
  attachments: File[];
};

export function buildCreateCardRequest(
  theme: CreateTheme,
  title: string,
  externalLinks: string[],
  requirements: string,
  attachments: File[],
): CreateCardRequest {
  return {
    title: title.trim(),
    theme,
    externalLinks,
    requirements,
    attachments,
  };
}
