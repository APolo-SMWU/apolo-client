import { apiFetch } from "./api";
import type { ContentBlock, PortfolioDocument, ProfileData } from "@/types/portfolio";

export type PortfolioSummary = Pick<
  PortfolioDocument,
  "id" | "title" | "cardDesignId" | "siteDesignId" | "status" | "createdAt" | "updatedAt"
> & {
  userType: "student" | "professor" | "professional";
};

export type CreatePortfolioRequest = {
  title: string;
  cardDesignId: string;
  siteDesignId: string;
  externalLinks: string[];
  requirements?: string;
  attachments?: File[];
};

export type UpdatePortfolioRequest = {
  title?: string;
  card?: Partial<PortfolioDocument["card"]>;
  profile?: Partial<ProfileData>;
  blocks?: ContentBlock[];
  cardDesignId?: string;
  siteDesignId?: string;
};

type PortfolioResponse = { portfolio: PortfolioDocument };

export const createPortfolio = (body: CreatePortfolioRequest) => {
  const { attachments = [], ...fields } = body;
  const formData = new FormData();
  formData.append("title", fields.title);
  formData.append("cardDesignId", fields.cardDesignId);
  formData.append("siteDesignId", fields.siteDesignId);
  formData.append("externalLinks", JSON.stringify(fields.externalLinks));
  if (fields.requirements !== undefined) formData.append("requirements", fields.requirements);
  attachments.forEach((file) => formData.append("attachments", file));

  return apiFetch<PortfolioResponse>("/portfolios/generate", {
    method: "POST",
    auth: true,
    body: formData,
  }).then(({ portfolio }) => portfolio);
};

export const getPortfolios = () =>
  apiFetch<{ portfolios: PortfolioSummary[] }>("/portfolios", {
    method: "GET",
    auth: true,
  }).then(({ portfolios }) => portfolios);

export const getPortfolio = (portfolioId: number | string) =>
  apiFetch<PortfolioResponse>(`/portfolios/${portfolioId}`, {
    method: "GET",
    auth: true,
  }).then(({ portfolio }) => portfolio);

export const getSharedPortfolio = (shareId: string) =>
  apiFetch<PortfolioResponse>(`/share/${encodeURIComponent(shareId)}`, {
    method: "GET",
  }).then(({ portfolio }) => portfolio);

export const updatePortfolio = (
  portfolioId: number | string,
  body: UpdatePortfolioRequest,
) =>
  apiFetch<PortfolioResponse>(`/portfolios/${portfolioId}`, {
    method: "PATCH",
    auth: true,
    body: JSON.stringify(body),
  }).then(({ portfolio }) => portfolio);

export const deletePortfolio = (portfolioId: number | string) =>
  apiFetch<void>(`/portfolios/${portfolioId}`, {
    method: "DELETE",
    auth: true,
  });

export const updatePortfolioContent = (
  portfolioId: number | string,
) =>
  apiFetch<PortfolioResponse>(`/portfolios/${portfolioId}/update-content`, {
    method: "POST",
    auth: true,
  }).then(({ portfolio }) => portfolio);

export const uploadPortfolioAvatar = (portfolioId: number | string, file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiFetch<PortfolioResponse>(`/portfolios/${portfolioId}/profile/avatar`, {
    method: "POST",
    auth: true,
    body: formData,
  }).then(({ portfolio }) => portfolio);
};

export type SharePortfolioResponse = {
  shareId: string;
  shareUrl: string;
};

export const sharePortfolio = (portfolioId: number | string) =>
  apiFetch<SharePortfolioResponse>(`/portfolios/${portfolioId}/share`, {
    method: "POST",
    auth: true,
  });
