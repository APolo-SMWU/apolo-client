// ============================================================
// APolo Portfolio - BlockToolbar
// 블록 선택 시 나타나는 플로팅 액션 바
// 복제 / 삭제 / 숨김 / 위아래 이동 / 강조도 토글
// ============================================================

import React, { useEffect, useRef } from "react";
import type { AnyBlock } from "../../types/portfolio.types";
import { BLOCK_REGISTRY } from "../../types/block-registry";

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface BlockToolbarProps {
  block: AnyBlock;
  isFirst: boolean;
  isLast: boolean;
  onMoveUp: (blockId: string) => void;
  onMoveDown: (blockId: string) => void;
  onDuplicate: (blockId: string) => void;
  onDelete: (blockId: string) => void;
  onToggleHidden: (blockId: string) => void;
}

// ─────────────────────────────────────────
// 아이콘 (SVG inline — 외부 의존 없음)
// ─────────────────────────────────────────

const Icons = {
  MoveUp: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 11V3M7 3L3 7M7 3l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  MoveDown: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M7 3v8M7 11l-4-4M7 11l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  Duplicate: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect x="1" y="4" width="8" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 4V2.5A1.5 1.5 0 0 1 6.5 1H11.5A1.5 1.5 0 0 1 13 2.5V8A1.5 1.5 0 0 1 11.5 9.5H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Hide: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 1l12 12M6.06 6.08A2 2 0 0 0 7.94 7.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M3.46 3.5C2.3 4.36 1.4 5.57 1 7c.9 3.08 3.73 5 6 5 1.1 0 2.17-.4 3.07-1.08M6 2.07C6.32 2.03 6.66 2 7 2c2.27 0 5.1 1.92 6 5a8.3 8.3 0 0 1-1.3 2.45" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Show: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 7c.9-3.08 3.73-5 6-5s5.1 1.92 6 5c-.9 3.08-3.73 5-6 5S1.9 10.08 1 7Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  ),
  Delete: () => (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 3.5h10M5.5 3.5V2.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1M5 3.5l.5 8M9 3.5l-.5 8M3.5 3.5l.5 8.5A1 1 0 0 0 5 13h4a1 1 0 0 0 1-.99l.5-8.51" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  Drag: () => (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="none">
      <circle cx="4" cy="3" r="1" fill="currentColor" />
      <circle cx="8" cy="3" r="1" fill="currentColor" />
      <circle cx="4" cy="7" r="1" fill="currentColor" />
      <circle cx="8" cy="7" r="1" fill="currentColor" />
      <circle cx="4" cy="11" r="1" fill="currentColor" />
      <circle cx="8" cy="11" r="1" fill="currentColor" />
    </svg>
  ),
};

// ─────────────────────────────────────────
// ToolbarButton
// ─────────────────────────────────────────

interface ToolbarButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: "default" | "danger";
}

function ToolbarButton({
  label,
  icon,
  onClick,
  disabled,
  variant = "default",
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`inline-flex size-7 items-center justify-center rounded-sm text-placeholder transition-colors hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-30 ${variant === "danger" ? "hover:bg-danger/10 hover:text-danger" : ""}`}
    >
      {icon}
    </button>
  );
}

// ─────────────────────────────────────────
// BlockToolbar
// ─────────────────────────────────────────

export function BlockToolbar({
  block,
  isFirst,
  isLast,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onToggleHidden,
}: BlockToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const meta = block.agentMeta;
  const registry = BLOCK_REGISTRY[block.type];
  const isHidden = block.layout?.hidden ?? false;

  // 툴바 클릭이 블록 선택 해제로 버블링되지 않도록
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const stop = (e: MouseEvent) => e.stopPropagation();
    el.addEventListener("mousedown", stop);
    return () => el.removeEventListener("mousedown", stop);
  }, []);

  return (
    <div
      ref={ref}
      className="flex h-9 items-center justify-between border border-ink bg-white px-2 text-caption-01 shadow-sm"
      role="toolbar"
      aria-label={`${block.label} 블록 도구`}
    >
      {/* 블록 타입 레이블 + 드래그 핸들 */}
      <div className="flex items-center gap-2">
        <span className="cursor-grab text-placeholder" data-drag-handle>
          <Icons.Drag />
        </span>
        <span className="font-bold text-ink">{registry.label}</span>
      </div>

      {/* 액션 버튼들 */}
      <div className="flex items-center gap-1">
        <ToolbarButton
          label="위로 이동"
          icon={<Icons.MoveUp />}
          onClick={() => onMoveUp(block.id)}
          disabled={isFirst || !(meta?.canMove ?? true)}
        />
        <ToolbarButton
          label="아래로 이동"
          icon={<Icons.MoveDown />}
          onClick={() => onMoveDown(block.id)}
          disabled={isLast || !(meta?.canMove ?? true)}
        />

        <span className="mx-1 h-4 w-px bg-placeholder/40" />

        <ToolbarButton
          label="블록 복제"
          icon={<Icons.Duplicate />}
          onClick={() => onDuplicate(block.id)}
          disabled={!registry.repeatable}
        />
        <ToolbarButton
          label={isHidden ? "블록 표시" : "블록 숨기기"}
          icon={isHidden ? <Icons.Show /> : <Icons.Hide />}
          onClick={() => onToggleHidden(block.id)}
          disabled={!(meta?.canHide ?? true)}
        />
        <ToolbarButton
          label="블록 삭제"
          icon={<Icons.Delete />}
          onClick={() => onDelete(block.id)}
          disabled={!(meta?.canDelete ?? true)}
          variant="danger"
        />
      </div>
    </div>
  );
}

export default BlockToolbar;
