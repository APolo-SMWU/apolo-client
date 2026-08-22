// ============================================================
// APolo Portfolio - Template Block Types
// ============================================================

import type {
  BaseBlock,
  ImageShape,
  ProjectDisplayMode,
  SkillsDisplayMode,
  ContactDisplayMode,
} from "./block.types";

// ─────────────────────────────────────────
// Hero Block
// ─────────────────────────────────────────

export interface HeroBlockProps {
  showCta?: boolean;
  showImage?: boolean;
}

export interface HeroBlock extends BaseBlock {
  type: "hero";
  category: "template";
  repeatable: false;
  props: HeroBlockProps;
}

// Hero 콘텐츠 값 (PortfolioContentDocument에서 사용)
export interface HeroBlockValue {
  headline: string;
  subheadline?: string;
  ctaLabel?: string;
  ctaLink?: string;
  heroImage?: string;   // 이미지 URL 또는 업로드 파일 key
}

// ─────────────────────────────────────────
// Profile Block
// ─────────────────────────────────────────

export interface ProfileBlockProps {
  showLocation?: boolean;
  showLinks?: boolean;
  imageShape?: ImageShape;
}

export interface ProfileBlock extends BaseBlock {
  type: "profile";
  category: "template";
  repeatable: false;
  props: ProfileBlockProps;
}

export interface LinkItem {
  label: string;
  url: string;
  target?: "_blank" | "_self";
}

export interface ProfileBlockValue {
  name?: string;
  role?: string;
  intro?: string;
  profileImage?: string;
  location?: string;
  links?: LinkItem[];
}

// ─────────────────────────────────────────
// Project Block
// ─────────────────────────────────────────

export interface ProjectBlockProps {
  display?: ProjectDisplayMode;
  showThumbnail?: boolean;
  preset?: "developer" | "designer" | "research" | "default";
}

export interface ProjectBlock extends BaseBlock {
  type: "project";
  category: "template";
  repeatable: true;
  minItems: number;
  maxItems: number;
  props: ProjectBlockProps;
}

export interface DateRange {
  start?: string;   // ISO 날짜 문자열
  end?: string;
  isCurrent?: boolean;
}

export interface TroubleshootingItem {
  problem: string;
  solution: string;
}

export interface ProjectBlockValue {
  title: string;
  summary?: string;
  role?: string;
  period?: DateRange;
  techStack?: string[];
  links?: LinkItem[];
  thumbnail?: string;
  troubleshooting?: TroubleshootingItem[];
}

// ─────────────────────────────────────────
// Skills Block
// ─────────────────────────────────────────

export interface SkillsBlockProps {
  display?: SkillsDisplayMode;
  preset?: "developer" | "designer" | "research" | "default";
}

export interface SkillsBlock extends BaseBlock {
  type: "skills";
  category: "template";
  repeatable: true;
  props: SkillsBlockProps;
}

export interface SkillsBlockValue {
  category?: string;
  items: string[];
}

// ─────────────────────────────────────────
// Experience Block
// ─────────────────────────────────────────

export interface ExperienceBlockProps {
  showLogo?: boolean;
}

export interface ExperienceBlock extends BaseBlock {
  type: "experience";
  category: "template";
  repeatable: true;
  props: ExperienceBlockProps;
}

export interface ExperienceBlockValue {
  organization: string;
  role?: string;
  period?: DateRange;
  description?: string;
  achievements?: string[];
}

// ─────────────────────────────────────────
// Contact Block
// ─────────────────────────────────────────

export interface ContactBlockProps {
  display?: ContactDisplayMode;
}

export interface ContactBlock extends BaseBlock {
  type: "contact";
  category: "template";
  repeatable: false;
  props: ContactBlockProps;
}

export interface ContactBlockValue {
  email?: string;
  phone?: string;
  github?: LinkItem | null;
  blog?: LinkItem | null;
  notion?: LinkItem | null;
}

// ─────────────────────────────────────────
// Text Block
// ─────────────────────────────────────────

export interface TextBlockProps {
  align?: "left" | "center" | "right";
}

export interface TextBlock extends BaseBlock {
  type: "text";
  category: "template";
  repeatable: true;
  props: TextBlockProps;
}

export interface TextBlockValue {
  title?: string;
  body: string;
}

// ─────────────────────────────────────────
// Image Block
// ─────────────────────────────────────────

export interface ImageBlockProps {
  objectFit?: "cover" | "contain" | "fill";
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  category: "template";
  repeatable: true;
  props: ImageBlockProps;
}

export interface ImageBlockValue {
  image: string;
  caption?: string;
  alt: string;
}

// ─────────────────────────────────────────
// Paper Block
// ─────────────────────────────────────────

export interface PaperBlockProps {
  showMeta?: boolean;
}

export interface PaperBlock extends BaseBlock {
  type: "paper";
  category: "template";
  repeatable: true;
  props: PaperBlockProps;
}

export interface PaperBlockValue {
  title: string;
  authors?: string;
  venue?: string;
  year?: string;
  topic?: string;
  summary?: string;
  takeaway?: string;
  followUpQuestion?: string;
  link?: LinkItem | null;
}

// ─────────────────────────────────────────
// Gallery Block
// ─────────────────────────────────────────

export interface GalleryBlockProps {
  layout?: "grid" | "feature" | "carousel";
}

export interface GalleryBlock extends BaseBlock {
  type: "gallery";
  category: "template";
  repeatable: true;
  props: GalleryBlockProps;
}

export interface GalleryBlockValue {
  title: string;
  description?: string;
  images?: string[];
  mainImage?: string;
  subImage1?: string;
  subImage2?: string;
  alt?: string;
  caption?: string;
}

// ─────────────────────────────────────────
// Troubleshooting Block
// ─────────────────────────────────────────

export interface TroubleshootingBlockProps {
  showResult?: boolean;
}

export interface TroubleshootingBlock extends BaseBlock {
  type: "troubleshooting";
  category: "template";
  repeatable: true;
  props: TroubleshootingBlockProps;
}

export interface TroubleshootingBlockValue {
  title: string;
  context?: string;
  problem?: string;
  cause?: string;
  solution?: string;
  result?: string;
}

// ─────────────────────────────────────────
// Process Block
// ─────────────────────────────────────────

export interface ProcessBlockProps {
  layout?: "timeline" | "stack";
}

export interface ProcessBlock extends BaseBlock {
  type: "process";
  category: "template";
  repeatable: true;
  props: ProcessBlockProps;
}

export interface ProcessBlockValue {
  title: string;
  overview?: string;
  research?: string;
  direction?: string;
  execution?: string;
  outcome?: string;
}

// ─────────────────────────────────────────
// Architecture Block
// ─────────────────────────────────────────

export interface ArchitectureBlockProps {
  showDiagram?: boolean;
}

export interface ArchitectureBlock extends BaseBlock {
  type: "architecture";
  category: "template";
  repeatable: true;
  props: ArchitectureBlockProps;
}

export interface ArchitectureBlockValue {
  title: string;
  summary?: string;
  frontend?: string;
  backend?: string;
  database?: string;
  deployment?: string;
  diagramImage?: string;
}

// ─────────────────────────────────────────
// Metric Block
// ─────────────────────────────────────────

export interface MetricBlockProps {
  emphasis?: "single" | "compact";
}

export interface MetricBlock extends BaseBlock {
  type: "metric";
  category: "template";
  repeatable: true;
  props: MetricBlockProps;
}

export interface MetricBlockValue {
  title: string;
  value?: string;
  label?: string;
  description?: string;
  evidence?: string;
}

// ─────────────────────────────────────────
// Template Block Union
// ─────────────────────────────────────────

export type TemplateBlock =
  | HeroBlock
  | ProfileBlock
  | ProjectBlock
  | SkillsBlock
  | ExperienceBlock
  | ContactBlock
  | TextBlock
  | ImageBlock
  | PaperBlock
  | GalleryBlock
  | TroubleshootingBlock
  | ProcessBlock
  | ArchitectureBlock
  | MetricBlock;

// ─────────────────────────────────────────
// Block Value Union
// (PortfolioContentDocument.values에서 사용)
// ─────────────────────────────────────────

export type BlockValue =
  | HeroBlockValue
  | ProfileBlockValue
  | ProjectBlockValue
  | SkillsBlockValue
  | ExperienceBlockValue
  | ContactBlockValue
  | TextBlockValue
  | ImageBlockValue
  | PaperBlockValue
  | GalleryBlockValue
  | TroubleshootingBlockValue
  | ProcessBlockValue
  | ArchitectureBlockValue
  | MetricBlockValue;

// 블록 타입 → 값 타입 매핑 (유틸리티)
export interface BlockValueMap {
  hero: HeroBlockValue;
  profile: ProfileBlockValue;
  project: ProjectBlockValue;
  skills: SkillsBlockValue;
  experience: ExperienceBlockValue;
  contact: ContactBlockValue;
  text: TextBlockValue;
  image: ImageBlockValue;
  paper: PaperBlockValue;
  gallery: GalleryBlockValue;
  troubleshooting: TroubleshootingBlockValue;
  process: ProcessBlockValue;
  architecture: ArchitectureBlockValue;
  metric: MetricBlockValue;
}
