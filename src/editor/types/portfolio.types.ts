// ============================================================
// APolo Portfolio - Portfolio Document Types
// ============================================================

import type { BlockType, PreviewMode } from "./block.types";
import type { LayoutBlock } from "./layout-blocks.types";
import type { TemplateBlock, BlockValue } from "./template-blocks.types";

// ─────────────────────────────────────────
// Block Union (모든 블록 타입)
// ─────────────────────────────────────────

export type AnyBlock = LayoutBlock | TemplateBlock;

// ─────────────────────────────────────────
// Portfolio Template
// AI가 생성하고 프론트가 렌더링하는 구조 데이터
// ─────────────────────────────────────────

export interface PortfolioTemplate {
  id: string;
  title: string;
  jobType?: "developer" | "designer" | "cv";
  description?: string;
  version: number;
  previewMode: PreviewMode;
  blocks: AnyBlock[];
  createdAt?: string;
  updatedAt?: string;
}

// ─────────────────────────────────────────
// Portfolio Content Document
// 사용자가 실제 입력한 콘텐츠 값
// ─────────────────────────────────────────

export interface TemplateBlockValue {
  blockId: string;
  type: BlockType;
  value: BlockValue;
}

export interface PortfolioContentDocument {
  templateId: string;
  values: TemplateBlockValue[];
}

// ─────────────────────────────────────────
// 콘텐츠 완성도
// ─────────────────────────────────────────

export type ContentCompletionStatus = "empty" | "draft" | "complete";

export interface MissingField {
  blockId: string;
  fieldKey: string;
  label: string;
}

export interface ContentCompletion {
  missingRequiredFields: MissingField[];
  completionStatus: ContentCompletionStatus;
}

// ─────────────────────────────────────────
// Render Meta
// 프론트 렌더러가 사용하는 렌더링 메타 정보
// ─────────────────────────────────────────

export interface RenderMeta {
  canRender: boolean;
  initialPreviewMode: PreviewMode;
  rootBlockIds: string[];        // 최상위 블록 ID (children에 속하지 않는)
  editable: boolean;
  contentCompletion: ContentCompletion;
}

// ─────────────────────────────────────────
// Portfolio State
// 프론트 상태 관리 (Zustand store)에서 사용하는 통합 타입
// ─────────────────────────────────────────

export interface PortfolioState {
  template: PortfolioTemplate | null;
  content: PortfolioContentDocument | null;
  renderMeta: RenderMeta | null;
  previewMode: PreviewMode;
  isDirty: boolean;       // 저장되지 않은 변경사항 존재 여부
  isSaving: boolean;
}

// ─────────────────────────────────────────
// 유틸리티: blockId로 블록 찾기
// ─────────────────────────────────────────

export function findBlockById(
  template: PortfolioTemplate,
  blockId: string
): AnyBlock | undefined {
  return template.blocks.find((b) => b.id === blockId);
}

// 유틸리티: blockId로 콘텐츠 값 찾기
export function findContentValue(
  content: PortfolioContentDocument,
  blockId: string
): TemplateBlockValue | undefined {
  return content.values.find((v) => v.blockId === blockId);
}

// 유틸리티: 루트 블록 추출 (다른 블록의 children에 포함되지 않는 블록)
export function getRootBlocks(template: PortfolioTemplate): AnyBlock[] {
  const childIds = new Set(
    template.blocks.flatMap((b) => b.children ?? [])
  );
  return template.blocks
    .filter((b) => !childIds.has(b.id))
    .sort((a, b) => (a.layout.order ?? 0) - (b.layout.order ?? 0));
}
