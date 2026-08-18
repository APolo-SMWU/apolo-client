import { apiFetch } from "./api";

export type JobRoleOption = "DEVELOPER" | "DESIGNER" | "POSTGRADUATE" | "CUSTOM";
export type CareerOption = "JUNIOR" | "MID_LEVEL" | "SENIOR" | "LEAD"

export const JOB_ROLE_LABEL: Record<JobRoleOption, string> = {
  DEVELOPER: "개발자",
  DESIGNER: "디자이너",
  POSTGRADUATE: "대학원 CV",
  CUSTOM: "입력하기",
};

export const CAREER_LABEL: Record<CareerOption, string> = {
  JUNIOR: "신입",
  MID_LEVEL: "3년 이상",
  SENIOR: "5년 이상",
  LEAD: "10년 이상",
}

export type PortfolioExternalLink = {
  label: string;
  url: string;
};

export type PortfolioTemplateBlock = {
  id: string;
  type: string;
  layout: {
    order: number;
    span: number;
    padding: number;
  };
  style: {
    variant: string;
    emphasis: string;
  };
  repeatable: boolean;
  props: {
    showCta?: boolean;
    showImage?: boolean;
  };
};

export type PortfolioTemplate = {
  id: string;
  version: number;
  previewMode: string;
  blocks: PortfolioTemplateBlock[];
};

export type PortfolioContentJson = {
  portfolioTemplate: PortfolioTemplate;
};

export type Portfolio = {
  id: number;
  userId: number;
  title: string;
  jobRole: string;
  careerLevel: string;
  userPrompt: string;
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
