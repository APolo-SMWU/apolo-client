export type CreateTheme = "blue" | "mono" | "orange" | "purple" | "green";

export type CreateCardRequest = {
  title: string;
  cardDesignId: string;
  theme: CreateTheme;
  externalLinks: string[];
  requirements: string;
  attachments: File[];
};

export function buildCreateCardRequest(
  cardDesignId: string,
  theme: CreateTheme,
  title: string,
  externalLinks: string[],
  requirements: string,
  attachments: File[],
): CreateCardRequest {
  return {
    title: title.trim(),
    cardDesignId,
    theme,
    externalLinks,
    requirements,
    attachments,
  };
}
