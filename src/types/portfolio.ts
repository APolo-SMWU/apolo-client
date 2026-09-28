export type ProfileFieldKind =
  | "email"
  | "github"
  | "company"
  | "scholar"
  | "university"
  | "notion"
  | "blog"
  | "linkedin"
  | "phone"
  | "tel"
  | "department"
  | "major";

export type ProfileField = {
  kind: ProfileFieldKind;
  label: string;
  value: string;
};

export type ProfileData = {
  name: string;
  title: string;
  avatarUrl?: string | null;
  fields: ProfileField[];
};

type BaseBlock = {
  id: string;
  visible: boolean;
};

export type AboutBlock = BaseBlock & {
  type: "about";
  body: string;
};

export type TimelineItem = {
  id: string;
  entityId?: string;
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
  entityId?: string;
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
  categories: { id?: string; category: string; items: string[] }[];
};

export type ContentBlock = AboutBlock | TimelineBlock | WorksBlock | SkillsBlock;

export type PortfolioDocument = {
  id: number | string;
  title: string;
  userType: "student" | "professor" | "professional";
  cardDesignId: string;
  siteDesignId: string;
  card: {
    name?: string;
    company?: string;
    university?: string;
    department?: string;
    major?: string;
    headline?: string;
    tel?: string | null;
    mobile?: string;
    /** Legacy response field; prefer mobile when both are present. */
    phone?: string;
    email?: string;
    organizationAddress?: string | null;
    logoUrl?: string | null;
  };
  profile: ProfileData;
  blocks: ContentBlock[];
  sourceLinks: string[];
  sourceSnapshots: { url: string; contentHash: string; lastFetchedAt: string }[];
  schemaVersion: number;
  status: "generating" | "draft" | "published" | "failed";
  createdAt: string;
  updatedAt: string;
};
