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

const PORTFOLIO_CREATION_TIMEOUT_MS = 30_000;
const portfolioCreationRequests = new Map<string, Promise<PortfolioDocument>>();

function createRequestId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function withTimeout<T>(promise: Promise<T>, timeoutMs: number) {
  let timeoutId: number | undefined;
  const timeout = new Promise<T>((_, reject) => {
    timeoutId = window.setTimeout(() => reject(new Error("생성 요청 시간이 초과되었어요.")), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => {
    if (timeoutId !== undefined) window.clearTimeout(timeoutId);
  });
}

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

export const startPortfolioCreation = (body: CreatePortfolioRequest) => {
  return savePortfolioCreation(withTimeout(
    Promise.resolve().then(() => createPortfolio(body)),
    PORTFOLIO_CREATION_TIMEOUT_MS,
  ));
};

export const startPortfolioCreationTask = (task: () => Promise<PortfolioDocument | undefined>) => {
  return savePortfolioCreation(withTimeout(Promise.resolve().then(task), PORTFOLIO_CREATION_TIMEOUT_MS));
};

function savePortfolioCreation(promise: Promise<PortfolioDocument | undefined>) {
  const requestId = createRequestId();
  // Keep the original rejected promise available for LoadingPage without causing
  // an unhandled rejection while the route transition is in progress.
  void promise.catch(() => undefined);
  portfolioCreationRequests.set(requestId, promise as Promise<PortfolioDocument>);
  return requestId;
}

export const getPortfolioCreation = (requestId: string) => {
  const request = portfolioCreationRequests.get(requestId);
  if (!request) return Promise.reject(new Error("생성 요청을 찾을 수 없어요."));

  void request.finally(() => portfolioCreationRequests.delete(requestId)).catch(() => undefined);
  return request;
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
