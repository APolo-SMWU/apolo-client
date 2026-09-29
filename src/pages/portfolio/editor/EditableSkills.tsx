import { useState } from "react";
import { GripVertical } from "lucide-react";
import DeleteIcon from "@/assets/portfolio/Delete.svg?react";
import type { ContentBlock } from "@/types/portfolio";
import { inputClass } from "./editorUtils";

export function EditableSkills({
  block,
  isBlockSelected,
  onBlockSelect,
  onCategoryChange,
  onItemsChange,
  onRemove,
  onReorder,
}: {
  block: Extract<ContentBlock, { type: "skills" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onCategoryChange: (categoryIndex: number, value: string) => void;
  onItemsChange: (categoryIndex: number, value: string) => void;
  onRemove: (categoryIndex: number) => void;
  onReorder: (sourceIndex: number, targetIndex: number) => void;
}) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [draftValues, setDraftValues] = useState<Record<number, string>>({});
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [dragOverCategoryIndex, setDragOverCategoryIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {block.categories.map((category, index) => (
        <div
          key={category.id}
          className={`relative grid items-center gap-2 rounded-xl border p-2 pl-10 sm:grid-cols-[130px_1fr] ${
            isBlockSelected && selectedCategoryIndex === index
              ? "border-primary"
              : "border-transparent"
          } ${dragOverCategoryIndex === index ? "bg-focus" : ""}`}
          onClick={() => {
            onBlockSelect();
            setSelectedCategoryIndex(index);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOverCategoryIndex(index);
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const sourceIndex = Number(event.dataTransfer.getData("text/skill-category-index"));
            if (Number.isInteger(sourceIndex)) onReorder(sourceIndex, index);
            setDraggedCategoryIndex(null);
            setDragOverCategoryIndex(null);
          }}
          onDragLeave={() => setDragOverCategoryIndex(null)}
        >
          <span
            draggable
            className={`absolute left-3 top-1/2 z-10 flex -translate-y-1/2 cursor-grab items-center justify-center text-placeholder active:cursor-grabbing ${draggedCategoryIndex === index ? "opacity-50" : ""}`}
            onDragStart={(event) => {
              event.stopPropagation();
              setDraggedCategoryIndex(index);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/skill-category-index", String(index));
            }}
            onDragEnd={() => {
              setDraggedCategoryIndex(null);
              setDragOverCategoryIndex(null);
            }}
            aria-label="스킬 카테고리 순서 변경"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <GripVertical className="size-5" aria-hidden="true" />
          </span>
          <input
            className={`${inputClass} text-body-02 font-semibold`}
            placeholder="카테고리명"
            value={category.category}
            onChange={(event) => onCategoryChange(index, event.target.value)}
            aria-label="스킬 카테고리 제목"
          />
          <input
            className={`${inputClass} self-center`}
            placeholder="스킬을 쉼표로 구분해 입력해주세요."
            value={draftValues[index] ?? category.items.map((item) => item.name).join(", ")}
            onChange={(event) => {
              const value = event.target.value;

              setDraftValues((current) => ({
                ...current,
                [index]: value,
              }));
              onItemsChange(index, value);
            }}
            onBlur={() => {
              setDraftValues((current) => {
                const next = { ...current };
                delete next[index];
                return next;
              });
            }}
          />
          {isBlockSelected && selectedCategoryIndex === index && (
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-danger"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(index);
                setSelectedCategoryIndex(null);
              }}
              aria-label="스킬 카테고리 삭제"
            >
              <DeleteIcon className="size-6" aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
