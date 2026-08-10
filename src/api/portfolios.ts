import { apiFetch } from "./api";

export type JobRoleOption = "DEVELOPER" | "DESIGNER" | "CV" | "CUSTOM";

export const JOB_ROLE_LABEL: Record<JobRoleOption, string> = {
  DEVELOPER: "개발자",
  DESIGNER: "디자이너",
  CV: "CV",
  CUSTOM: "입력하기",
};

export type PortfolioExternalLink = {
  label: string;
  url: string;
};

export type PortfolioBlock = {
  type: string;
  text: string;
};

export type PortfolioContentJson = {
  blocks: PortfolioBlock[];
};

export type Portfolio = {
  id: number;
  userId: number;
  title: string;
  jobRole: string;
  careerLevel: string;
  directionPrompt: string;
  externalLinks: PortfolioExternalLink[];
  currentContentJson: PortfolioContentJson;
  isPublic: boolean;
  isShared: boolean;
  shareToken: string | null;
  sharedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type GetPortfoliosResponse = {
  message: string;
  portfolios: Portfolio[];
};

export const getPortfolios = () =>
  apiFetch<GetPortfoliosResponse>("/portfolios", {
    method: "GET",
    auth: true,
  });
