export type ProfileFieldKind =
  | "email" | "github" | "company" | "scholar" | "university" | "notion" | "blog"
  | "linkedin" | "phone" | "tel" | "department" | "major";

export type ProfileField = { kind: ProfileFieldKind; label: string; value: string };
export type ProfileData = { name: string; title: string; avatarUrl?: string | null; fields: ProfileField[] };
export type BlockId = string;
export type ItemId = string;

type BaseBlock = { id: BlockId; visible: boolean };

export type AboutBlock = BaseBlock & { type: "about"; description: string };

type BaseTimelineItem = {
  id: ItemId;
  entityId?: string;
  organization: string;
  role?: string;
  description?: string;
  kind?: "fulltime" | "intern" | "research" | "exchange" | "volunteer" | "club" | "program" | "talk";
};
export type TimelineRangeItem = BaseTimelineItem & { startDate: string | null; endDate: string | null | "Present" };
export type TimelineDateItem = BaseTimelineItem & { date: string | null };
export type EducationBlock = BaseBlock & { type: "education"; items: TimelineRangeItem[] };
export type ExperienceBlock = BaseBlock & { type: "experience"; items: TimelineRangeItem[] };
export type ActivitiesBlock = BaseBlock & { type: "activities"; items: TimelineRangeItem[] };
export type AwardsBlock = BaseBlock & { type: "awards"; items: TimelineDateItem[] };
export type CertificationBlock = BaseBlock & { type: "certification"; items: TimelineDateItem[] };
export type TimelineBlock = EducationBlock | ExperienceBlock | ActivitiesBlock | AwardsBlock | CertificationBlock;
export type TimelineItem = TimelineRangeItem | TimelineDateItem;

export type WorkItem = {
  id: ItemId; entityId?: string; kind: "project" | "publication" | "opensource";
  title: string; role?: string; skills?: string[]; description: string;
  imageUrl?: string; links: { label: string; href: string }[];
};
export type WorksBlock = BaseBlock & { type: "works"; items: WorkItem[] };

export type SkillItem = { id: ItemId; entityId?: string; name: string };
export type SkillCategory = { id: string; category: string; items: SkillItem[] };
export type SkillsBlock = BaseBlock & { type: "skills"; categories: SkillCategory[] };
export type ContentBlock = AboutBlock | TimelineBlock | WorksBlock | SkillsBlock;

export type PortfolioDocument = {
  id: number | string; title: string; userType: "student" | "professor" | "professional";
  cardDesignId: string; siteDesignId: string;
  card: { name?: string; company?: string; university?: string; department?: string; major?: string; headline?: string; tel?: string | null; mobile?: string; phone?: string; email?: string; organizationAddress?: string | null; logoUrl?: string | null };
  profile: ProfileData; blocks: ContentBlock[]; sourceLinks: string[];
  sourceSnapshots: { url: string; contentHash: string; lastFetchedAt: string }[];
  schemaVersion: number; status: "generating" | "draft" | "published" | "failed";
  createdAt: string; updatedAt: string;
};

type WithOptionalId<T extends { id: string }> = Omit<T, "id"> & { id?: string };
type TimelineBlockInput<T extends TimelineItem> = Omit<Extract<TimelineBlock, { items: T[] }>, "id" | "items"> & { id?: string; items: Array<WithOptionalId<T>> };
export type ContentBlockInput =
  | WithOptionalId<AboutBlock>
  | TimelineBlockInput<TimelineRangeItem>
  | TimelineBlockInput<TimelineDateItem>
  | (Omit<WorksBlock, "id" | "items"> & { id?: string; items: Array<WithOptionalId<WorkItem>> })
  | (Omit<SkillsBlock, "id" | "categories"> & { id?: string; categories: Array<Omit<SkillCategory, "id" | "items"> & { id?: string; items: Array<WithOptionalId<SkillItem>> }> });
