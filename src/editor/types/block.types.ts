// ============================================================
// APolo Portfolio - Block & Field Core Types
// ============================================================

// ─────────────────────────────────────────
// 공통 Enum / Union Types
// ─────────────────────────────────────────

export type BlockCategory = "layout" | "template";

export type BlockType =
  // Layout
  | "section"
  | "columns"
  | "spacer"
  | "divider"
  // Template
  | "hero"
  | "profile"
  | "project"
  | "skills"
  | "experience"
  | "contact"
  | "text"
  | "image"
  | "paper"
  | "gallery"
  | "troubleshooting"
  | "process"
  | "architecture"
  | "metric";

export type FieldInputType =
  // 기본 입력
  | "text"
  | "textarea"
  | "datePicker"
  | "dateRange"
  | "select"
  | "multiSelect"
  | "switch"
  // 포트폴리오 특화
  | "tagInput"
  | "toggleTagSelector"
  | "link"
  | "linkList"
  | "imageUpload"
  | "imageList"
  | "repeater";

export type FieldGroup = "content" | "setting";

export type StyleVariant = "default" | "highlight" | "minimal" | "ghost";

export type StyleEmphasis = "high" | "medium" | "low";

export type PreviewMode = "template" | "filled";

export type ColumnDirection = "horizontal" | "vertical";

export type ProjectDisplayMode = "card" | "grid" | "list";

export type SkillsDisplayMode = "tag" | "list" | "grid";

export type ContactDisplayMode = "iconList" | "list";

export type ImageShape = "circle" | "square" | "rounded";

// ─────────────────────────────────────────
// Layout Config
// ─────────────────────────────────────────

export interface BlockLayout {
  span?: number;           // 1~12, 그리드 컬럼 span
  order?: number;          // 블록 순서
  padding?: number;        // px 단위
  gap?: number;            // 자식 간격 (layout 블록용)
  align?: "left" | "center" | "right";
  hidden?: boolean;
  minHeight?: number;
}

// ─────────────────────────────────────────
// Style Config
// ─────────────────────────────────────────

export interface BlockStyle {
  variant?: StyleVariant;
  emphasis?: StyleEmphasis;
}

// ─────────────────────────────────────────
// Agent Meta
// ─────────────────────────────────────────

export interface BlockAgentMeta {
  aliases: string[];                   // AI가 블록을 식별할 때 사용하는 별칭
  canMove: boolean;
  canResize: boolean;
  canHide: boolean;
  canDelete: boolean;
  editableLayoutKeys: (keyof BlockLayout)[];
}

// ─────────────────────────────────────────
// Field Validation
// ─────────────────────────────────────────

export interface FieldValidation {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// ─────────────────────────────────────────
// Field Option (Select, MultiSelect용)
// ─────────────────────────────────────────

export interface FieldOption {
  label: string;
  value: string;
}

// ─────────────────────────────────────────
// 공통 Field 정의
// ─────────────────────────────────────────

export interface BlockField {
  key: string;
  label: string;
  input: FieldInputType;
  group: FieldGroup;
  placeholder?: string;
  helperText?: string;
  defaultValue?: unknown;
  visible?: boolean;
  disabled?: boolean;
  validation?: FieldValidation;
  options?: FieldOption[];       // select / multiSelect용
  allowCustom?: boolean;         // toggleTagSelector용
  preset?: "developer" | "designer" | "research" | "default"; // toggleTagSelector 기본 후보군
  multiple?: boolean;            // 다중 선택 여부
}

// ─────────────────────────────────────────
// 베이스 Block 인터페이스
// ─────────────────────────────────────────

export interface BaseBlock {
  id: string;
  type: BlockType;
  category: BlockCategory;
  label: string;
  description?: string;
  layout: BlockLayout;
  style?: BlockStyle;
  repeatable?: boolean;
  minItems?: number;
  maxItems?: number;
  props?: object;
  fields?: BlockField[];
  settings?: BlockField[];
  children?: string[];           // 자식 블록 ID 목록
  agentMeta?: BlockAgentMeta;
}
