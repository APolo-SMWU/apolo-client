// ============================================================
// APolo Portfolio - Block Registry & Type Guards
// ============================================================

import type { BlockType, BlockCategory } from "./block.types";
import type {
  SectionBlock,
  ColumnsBlock,
  SpacerBlock,
  DividerBlock,
} from "./layout-blocks.types";
import type {
  HeroBlock,
  ProfileBlock,
  ProjectBlock,
  SkillsBlock,
  ExperienceBlock,
  ContactBlock,
  TextBlock,
  ImageBlock,
  PaperBlock,
  GalleryBlock,
  TroubleshootingBlock,
  ProcessBlock,
  ArchitectureBlock,
  MetricBlock,
} from "./template-blocks.types";
import type { AnyBlock } from "./portfolio.types";

// ─────────────────────────────────────────
// Block Registry
// 유효한 block type 목록 및 메타 정보
// ─────────────────────────────────────────

export interface BlockRegistryEntry {
  type: BlockType;
  category: BlockCategory;
  label: string;
  description: string;
  repeatable: boolean;
  allowsChildren: boolean;
  defaultLayout: {
    span: number;
    padding: number;
  };
}

export const BLOCK_REGISTRY: Record<BlockType, BlockRegistryEntry> = {
  // ── Layout Blocks ──
  section: {
    type: "section",
    category: "layout",
    label: "Section",
    description: "포트폴리오의 큰 구획을 나누는 컨테이너",
    repeatable: false,
    allowsChildren: true,
    defaultLayout: { span: 12, padding: 20 },
  },
  columns: {
    type: "columns",
    category: "layout",
    label: "Columns",
    description: "2단/3단 레이아웃 구성",
    repeatable: true,
    allowsChildren: true,
    defaultLayout: { span: 12, padding: 0 },
  },
  spacer: {
    type: "spacer",
    category: "layout",
    label: "Spacer",
    description: "블록 사이 여백 제어",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 0 },
  },
  divider: {
    type: "divider",
    category: "layout",
    label: "Divider",
    description: "구분선 표시",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 0 },
  },

  // ── Template Blocks ──
  hero: {
    type: "hero",
    category: "template",
    label: "Hero",
    description: "페이지 최상단 핵심 소개 영역",
    repeatable: false,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  profile: {
    type: "profile",
    category: "template",
    label: "Profile",
    description: "이름/직무/자기소개 입력 영역",
    repeatable: false,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  project: {
    type: "project",
    category: "template",
    label: "Project",
    description: "프로젝트 정보 입력 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  skills: {
    type: "skills",
    category: "template",
    label: "Skills",
    description: "기술 스택 입력 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  experience: {
    type: "experience",
    category: "template",
    label: "Experience",
    description: "경력/활동/인턴 경험 입력 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  contact: {
    type: "contact",
    category: "template",
    label: "Contact",
    description: "Github, email, blog 등 연락/외부 링크 입력 영역",
    repeatable: false,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  text: {
    type: "text",
    category: "template",
    label: "Text",
    description: "자유 서술용 설명 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 16 },
  },
  image: {
    type: "image",
    category: "template",
    label: "Image",
    description: "대표 이미지/배너/썸네일 입력 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 0 },
  },
  paper: {
    type: "paper",
    category: "template",
    label: "Paper",
    description: "읽은 논문과 핵심 요약, 후속 질문을 정리하는 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  gallery: {
    type: "gallery",
    category: "template",
    label: "Gallery",
    description: "디자인 작업물 이미지를 크게 보여주는 갤러리 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  troubleshooting: {
    type: "troubleshooting",
    category: "template",
    label: "Troubleshooting",
    description: "문제, 원인, 해결, 결과를 구조화해 보여주는 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  process: {
    type: "process",
    category: "template",
    label: "Process",
    description: "리서치, 방향 설정, 실행, 결과 등 작업 과정을 정리하는 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  architecture: {
    type: "architecture",
    category: "template",
    label: "Architecture",
    description: "서비스 구조, 프론트엔드/백엔드/배포 구성을 설명하는 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
  metric: {
    type: "metric",
    category: "template",
    label: "Metric",
    description: "성과, 수치, 개선 결과를 강조하는 영역",
    repeatable: true,
    allowsChildren: false,
    defaultLayout: { span: 12, padding: 20 },
  },
};

// ─────────────────────────────────────────
// Type Guards
// ─────────────────────────────────────────

export function isSectionBlock(block: AnyBlock): block is SectionBlock {
  return block.type === "section";
}

export function isColumnsBlock(block: AnyBlock): block is ColumnsBlock {
  return block.type === "columns";
}

export function isSpacerBlock(block: AnyBlock): block is SpacerBlock {
  return block.type === "spacer";
}

export function isDividerBlock(block: AnyBlock): block is DividerBlock {
  return block.type === "divider";
}

export function isHeroBlock(block: AnyBlock): block is HeroBlock {
  return block.type === "hero";
}

export function isProfileBlock(block: AnyBlock): block is ProfileBlock {
  return block.type === "profile";
}

export function isProjectBlock(block: AnyBlock): block is ProjectBlock {
  return block.type === "project";
}

export function isSkillsBlock(block: AnyBlock): block is SkillsBlock {
  return block.type === "skills";
}

export function isExperienceBlock(block: AnyBlock): block is ExperienceBlock {
  return block.type === "experience";
}

export function isContactBlock(block: AnyBlock): block is ContactBlock {
  return block.type === "contact";
}

export function isTextBlock(block: AnyBlock): block is TextBlock {
  return block.type === "text";
}

export function isImageBlock(block: AnyBlock): block is ImageBlock {
  return block.type === "image";
}

export function isPaperBlock(block: AnyBlock): block is PaperBlock {
  return block.type === "paper";
}

export function isGalleryBlock(block: AnyBlock): block is GalleryBlock {
  return block.type === "gallery";
}

export function isTroubleshootingBlock(
  block: AnyBlock
): block is TroubleshootingBlock {
  return block.type === "troubleshooting";
}

export function isProcessBlock(block: AnyBlock): block is ProcessBlock {
  return block.type === "process";
}

export function isArchitectureBlock(
  block: AnyBlock
): block is ArchitectureBlock {
  return block.type === "architecture";
}

export function isMetricBlock(block: AnyBlock): block is MetricBlock {
  return block.type === "metric";
}

export function isLayoutBlock(block: AnyBlock): boolean {
  return BLOCK_REGISTRY[block.type].category === "layout";
}

export function isTemplateBlock(block: AnyBlock): boolean {
  return BLOCK_REGISTRY[block.type].category === "template";
}

// ─────────────────────────────────────────
// 유틸: block type이 유효한지 확인
// ─────────────────────────────────────────

export function isValidBlockType(type: string): type is BlockType {
  return type in BLOCK_REGISTRY;
}

// 유틸: block이 children을 가질 수 있는지 확인
export function canHaveChildren(block: AnyBlock): boolean {
  return BLOCK_REGISTRY[block.type].allowsChildren;
}

// 유틸: block이 반복 가능한지 확인
export function isRepeatable(block: AnyBlock): boolean {
  return BLOCK_REGISTRY[block.type].repeatable;
}
