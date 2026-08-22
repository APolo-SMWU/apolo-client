// ============================================================
// APolo Portfolio - Layout Block Types
// ============================================================

import type { BaseBlock, StyleVariant, ColumnDirection } from "./block.types";

// ─────────────────────────────────────────
// Section Block
// ─────────────────────────────────────────

export interface SectionBlockProps {
  title?: string;
  description?: string;
  variant?: StyleVariant;
}

export interface SectionBlock extends BaseBlock {
  type: "section";
  category: "layout";
  props: SectionBlockProps;
  children: string[];   // SectionBlock은 children 필수
}

// ─────────────────────────────────────────
// Columns Block
// ─────────────────────────────────────────

export interface ColumnsBlockProps {
  count: 2 | 3;
  ratios: number[];    // 각 컬럼 비율 (합산 기준, 예: [7, 5] or [4, 4, 4])
  gap: number;
}

export interface ColumnsBlock extends BaseBlock {
  type: "columns";
  category: "layout";
  props: ColumnsBlockProps;
  children: string[];
}

// ─────────────────────────────────────────
// Spacer Block
// ─────────────────────────────────────────

export interface SpacerBlockProps {
  size: number;   // px
}

export interface SpacerBlock extends BaseBlock {
  type: "spacer";
  category: "layout";
  props: SpacerBlockProps;
}

// ─────────────────────────────────────────
// Divider Block
// ─────────────────────────────────────────

export interface DividerBlockProps {
  direction: ColumnDirection;
  thickness: number;   // px
  label?: string;
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  category: "layout";
  props: DividerBlockProps;
}

// ─────────────────────────────────────────
// Layout Block Union
// ─────────────────────────────────────────

export type LayoutBlock =
  | SectionBlock
  | ColumnsBlock
  | SpacerBlock
  | DividerBlock;
