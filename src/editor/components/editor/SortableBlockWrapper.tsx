// ============================================================
// APolo Portfolio - SortableBlockWrapper
// dnd-kit 기반 블록 드래그 정렬 래퍼
// ============================================================

import React from "react";
import {
  useSortable,
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import type { AnyBlock } from "../../types/portfolio.types";

// ─────────────────────────────────────────
// SortableBlockItem
// ─────────────────────────────────────────

interface SortableBlockItemProps {
  blockId: string;
  children: React.ReactNode;
  disabled?: boolean;
}

export function SortableBlockItem({
  blockId,
  children,
  disabled = false,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: blockId, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: "relative",
    zIndex: isDragging ? 1 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative ${isDragging ? "cursor-grabbing" : ""}`}
      data-block-id={blockId}
      {...attributes}
    >
      <DragHandle listeners={listeners} />
      {children}
    </div>
  );
}

// ─────────────────────────────────────────
// DragHandle
// ─────────────────────────────────────────

function DragHandle({
  listeners,
}: {
  listeners: ReturnType<typeof useSortable>["listeners"];
}) {
  return (
    <span
      className="absolute top-1/2 -left-5 flex h-6 w-4 -translate-y-1/2 cursor-grab items-center justify-center text-placeholder opacity-0 transition-opacity before:content-['⠿'] group-hover:opacity-100"
      {...listeners}
      aria-label="드래그하여 순서 변경"
      role="button"
      tabIndex={0}
    />
  );
}

// ─────────────────────────────────────────
// SortableBlockList
// ─────────────────────────────────────────

interface SortableBlockListProps {
  blocks: AnyBlock[];
  onReorder: (newOrderIds: string[]) => void;
  activeBlockId?: string | null;
  onDragStart?: (blockId: string) => void;
  onDragEnd?: () => void;
  disabled?: boolean;
  children: (block: AnyBlock, index: number) => React.ReactNode;
  renderOverlay?: (block: AnyBlock) => React.ReactNode;
}

export function SortableBlockList({
  blocks,
  onReorder,
  activeBlockId,
  onDragStart,
  onDragEnd,
  disabled = false,
  children,
  renderOverlay,
}: SortableBlockListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  const blockIds = blocks.map((b) => b.id);
  const activeBlock = activeBlockId
    ? blocks.find((b) => b.id === activeBlockId)
    : null;

  const handleDragStart = (event: DragStartEvent) => {
    onDragStart?.(String(event.active.id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blockIds.indexOf(String(active.id));
      const newIndex = blockIds.indexOf(String(over.id));
      onReorder(arrayMove(blockIds, oldIndex, newIndex));
    }
    onDragEnd?.();
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      modifiers={[restrictToVerticalAxis]}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={blockIds}
        strategy={verticalListSortingStrategy}
        disabled={disabled}
      >
        <div className="flex flex-col">
          {blocks.map((block, index) => (
            <SortableBlockItem
              key={block.id}
              blockId={block.id}
              disabled={disabled}
            >
              {children(block, index)}
            </SortableBlockItem>
          ))}
        </div>
      </SortableContext>

      <DragOverlay>
        {activeBlock && renderOverlay ? (
          <div className="border border-primary bg-white opacity-95 shadow-xl">
            {renderOverlay(activeBlock)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
