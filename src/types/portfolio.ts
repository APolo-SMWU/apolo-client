export type ProfileFieldKind =
  | "email"
  | "github"
  | "company"
  | "scholar"
  | "university"
  | "notion"
  | "blog"
  | "linkedin"
  | "phone";

export type ProfileField = {
  kind: ProfileFieldKind;
  label: string;
  value: string;
};

export type ProfileData = {
  name: string;
  title: string;
  avatarUrl?: string;
  fields: ProfileField[];
};

type BaseBlock = {
  id: string;
  visible: boolean;
};

export type AboutBlock = BaseBlock & {
  type: "about";
  body: string;
  interests: string[];
};

export type TimelineItem = {
  id: string;
  startDate: string;
  endDate?: string;
  organization: string;
  role?: string;
  description?: string;
  kind?: "fulltime" | "intern" | "research" | "exchange" | "volunteer" | "club" | "program" | "talk";
};

export type TimelineBlock = BaseBlock & {
  type: "education" | "experience" | "activities" | "awards" | "certification";
  items: TimelineItem[];
};

export type WorkItem = {
  id: string;
  kind: "project" | "publication" | "opensource";
  title: string;
  role?: string;
  skills?: string[];
  description: string;
  imageUrl?: string;
  links: { label: string; href: string }[];
};

export type WorksBlock = BaseBlock & {
  type: "works";
  items: WorkItem[];
};

export type SkillsBlock = BaseBlock & {
  type: "skills";
  categories: { category: string; items: string[] }[];
};

export type ContentBlock = AboutBlock | TimelineBlock | WorksBlock | SkillsBlock;

export type PortfolioDocument = {
  id: string;
  designId: string;
  profile: ProfileData;
  blocks: ContentBlock[];
};
