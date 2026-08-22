// ============================================================
// APolo Portfolio - DropZone
// 블록 삽입 위치를 시각적으로 표시하고 클릭으로 블록 추가
// ============================================================

import React, { useState, useRef } from "react";
import type { BlockType } from "../../types/block.types";
import { BLOCK_REGISTRY } from "../../types/block-registry";

// ─────────────────────────────────────────
// 추가 가능한 블록 목록
// ─────────────────────────────────────────

const ADDABLE_BLOCK_TYPES: BlockType[] = [
  "hero",
  "profile",
  "project",
  "skills",
  "experience",
  "contact",
  "text",
  "image",
  "paper",
  "gallery",
  "troubleshooting",
  "process",
  "architecture",
  "metric",
  "section",
  "columns",
  "spacer",
  "divider",
];

// ─────────────────────────────────────────
// BlockPickerMenu
// DropZone 클릭 시 나타나는 블록 타입 선택 메뉴
// ─────────────────────────────────────────

interface BlockPickerMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}

function BlockPickerMenu({
  onSelect,
  onClose,
  anchorRef,
}: BlockPickerMenuProps) {
  const templateBlocks = ADDABLE_BLOCK_TYPES.filter(
    (t) => BLOCK_REGISTRY[t].category === "template"
  );
  const layoutBlocks = ADDABLE_BLOCK_TYPES.filter(
    (t) => BLOCK_REGISTRY[t].category === "layout"
  );

  // 외부 클릭 닫기
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        anchorRef.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [anchorRef, onClose]);

  const BlockItem = ({ type }: { type: BlockType }) => {
    const entry = BLOCK_REGISTRY[type];
    return (
      <button
        type="button"
        className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left transition-colors hover:bg-surface"
        onClick={() => {
          onSelect(type);
          onClose();
        }}
      >
        <span className="text-body-02 font-medium text-ink">{entry.label}</span>
        <span className="text-caption-01 leading-4 text-placeholder">{entry.description}</span>
      </button>
    );
  };

  return (
    <div className="absolute top-full left-0 z-50 w-[280px] overflow-hidden border border-ink bg-white shadow-xl" role="menu" aria-label="블록 추가">
      <div className="flex items-center justify-between border-b border-ink px-4 py-3 text-body-02 font-semibold text-ink">
        <span>블록 추가</span>
        <button
          type="button"
          className="flex size-6 items-center justify-center text-title-02 text-placeholder hover:bg-surface hover:text-ink"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto p-2">
        <div className="mb-3">
          <p className="mb-1 px-2 py-1 text-caption-01 font-semibold uppercase tracking-wider text-placeholder">콘텐츠 블록</p>
          {templateBlocks.map((type) => (
            <BlockItem key={type} type={type} />
          ))}
        </div>
        <div className="mb-3">
          <p className="mb-1 px-2 py-1 text-caption-01 font-semibold uppercase tracking-wider text-placeholder">레이아웃 블록</p>
          {layoutBlocks.map((type) => (
            <BlockItem key={type} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// DropZone Props
// ─────────────────────────────────────────

interface DropZoneProps {
  /** 이 DropZone 다음에 블록이 삽입됨. undefined면 맨 위 */
  afterBlockId?: string;
  /** 부모 블록 ID (section 내부 등) */
  parentBlockId?: string;
  onAddBlock: (type: BlockType, afterBlockId?: string, parentBlockId?: string) => void;
  /** dnd-kit의 드래그 오버 상태 (외부에서 주입) */
  isOver?: boolean;
  /** 항상 표시 여부. false이면 hover 시에만 표시 */
  alwaysVisible?: boolean;
}

// ─────────────────────────────────────────
// DropZone (메인)
// ─────────────────────────────────────────

export function DropZone({
  afterBlockId,
  parentBlockId,
  onAddBlock,
  isOver = false,
  alwaysVisible = false,
}: DropZoneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [pickerOpen, setPickerOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const isVisible = alwaysVisible || isHovered || isOver || pickerOpen;

  const handleAddBlock = (type: BlockType) => {
    onAddBlock(type, afterBlockId, parentBlockId);
  };

  return (
    <div
      ref={containerRef}
      className={`relative my-1 flex items-center ${isOver ? "h-10" : "h-8"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => !pickerOpen && setIsHovered(false)}
      aria-label="블록 삽입 위치"
    >
      {/* 삽입선 */}
      <div className={`relative flex h-0.5 w-full items-center justify-center ${isOver ? "bg-primary" : isVisible ? "bg-ink" : "bg-transparent"}`}>
        <button
          type="button"
          className={`absolute flex size-6 items-center justify-center rounded-full border border-ink bg-white text-placeholder transition-all hover:scale-110 hover:border-primary hover:bg-primary hover:text-white ${isVisible ? "opacity-100" : "opacity-0"}`}
          aria-label="블록 추가"
          onClick={(e) => {
            e.stopPropagation();
            setPickerOpen((prev) => !prev);
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path
              d="M6 1v10M1 6h10"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* 블록 타입 선택 메뉴 */}
      {pickerOpen && (
        <BlockPickerMenu
          onSelect={handleAddBlock}
          onClose={() => {
            setPickerOpen(false);
            setIsHovered(false);
          }}
          anchorRef={containerRef}
        />
      )}
    </div>
  );
}

export default DropZone;
