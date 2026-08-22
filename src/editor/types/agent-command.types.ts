// ============================================================
// APolo Portfolio - Agent Command Types (Edit Mode)
// ============================================================

import type { BlockLayout, BlockStyle, BlockField } from "./block.types";
import type { BlockValue } from "./template-blocks.types";

// ─────────────────────────────────────────
// Command 종류
// ─────────────────────────────────────────

export type AgentCommandType =
  | "UPDATE_LAYOUT"         // span, order, padding 등 레이아웃 변경
  | "UPDATE_STYLE"          // variant, emphasis 변경
  | "UPDATE_PROPS"          // 블록 고유 props 변경
  | "UPDATE_CONTENT"        // 콘텐츠 값 변경
  | "ADD_BLOCK"             // 블록 추가
  | "REMOVE_BLOCK"          // 블록 삭제
  | "MOVE_BLOCK"            // 블록 순서 이동
  | "TOGGLE_HIDDEN"         // 블록 숨김/표시 전환
  | "ADD_FIELD"             // 필드 추가
  | "REMOVE_FIELD"          // 필드 제거
  | "SET_CHILDREN";         // children 순서 재설정

// ─────────────────────────────────────────
// 각 Command 페이로드
// ─────────────────────────────────────────

export interface UpdateLayoutPayload {
  layout: Partial<BlockLayout>;
}

export interface UpdateStylePayload {
  style: Partial<BlockStyle>;
}

export interface UpdatePropsPayload {
  props: Record<string, unknown>;
}

export interface UpdateContentPayload {
  value: Partial<BlockValue>;
}

export interface AddBlockPayload {
  afterBlockId?: string;       // 특정 블록 뒤에 삽입, 없으면 맨 끝
  parentBlockId?: string;      // section 등 children에 삽입할 경우
  block: import("./portfolio.types").AnyBlock;
}

// blockId는 AgentCommand.targetBlockId에서 가져온다.
export type RemoveBlockPayload = object;

export interface MoveBlockPayload {
  toOrder: number;             // 이동할 order 값
  parentBlockId?: string;      // 부모 블록 내 이동 시
}

export interface ToggleHiddenPayload {
  hidden: boolean;
}

export interface AddFieldPayload {
  field: BlockField;
}

export interface RemoveFieldPayload {
  fieldKey: string;
}

export interface SetChildrenPayload {
  childIds: string[];          // 정렬된 children ID 목록
}

export type AgentCommandPayload =
  | UpdateLayoutPayload
  | UpdateStylePayload
  | UpdatePropsPayload
  | UpdateContentPayload
  | AddBlockPayload
  | RemoveBlockPayload
  | MoveBlockPayload
  | ToggleHiddenPayload
  | AddFieldPayload
  | RemoveFieldPayload
  | SetChildrenPayload;

// ─────────────────────────────────────────
// AgentCommand
// ─────────────────────────────────────────

export interface AgentCommand {
  commandId: string;
  type: AgentCommandType;
  targetBlockId: string;
  payload: AgentCommandPayload;
  reason?: string;             // AI가 이 명령을 생성한 이유 (디버깅/UX용)
  appliedAt?: string;          // ISO 날짜, Patch Applier가 기록
}

// ─────────────────────────────────────────
// Command 검증 결과
// ─────────────────────────────────────────

export type CommandValidationStatus = "valid" | "rejected" | "modified";

export interface CommandValidationResult {
  commandId: string;
  status: CommandValidationStatus;
  rejectReason?: string;
  modifiedCommand?: AgentCommand;  // status === "modified"일 때 수정된 명령
}

// ─────────────────────────────────────────
// Patch 적용 결과
// ─────────────────────────────────────────

export interface PatchApplyResult {
  success: boolean;
  appliedCommandIds: string[];
  rejectedCommandIds: string[];
  warnings: string[];
}

// ─────────────────────────────────────────
// Edit Intent (AI 분석 결과)
// ─────────────────────────────────────────

export type EditIntentType =
  | "layout_change"       // 크기, 순서, 간격 변경
  | "style_change"        // 강조도, 스타일 변경
  | "content_change"      // 텍스트, 이미지 등 콘텐츠 수정
  | "structure_change"    // 블록 추가/삭제/이동
  | "visibility_change"   // 숨김/표시
  | "unknown";

export interface EditIntent {
  intentType: EditIntentType;
  confidence: number;
  rawRequest: string;
  parsedDescription: string;
}
