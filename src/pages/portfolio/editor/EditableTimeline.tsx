import { useState } from "react";
import { GripVertical } from "lucide-react";
import DeleteIcon from "@/assets/portfolio/Delete.svg?react";
import type { ContentBlock } from "@/types/portfolio";
import { inputClass } from "./editorUtils";

export function EditableTimeline({
  block,
  isBlockSelected,
  onBlockSelect,
  onChange,
  onRemove,
  onReorder,
}: {
  block: Extract<ContentBlock, { type: "education" | "experience" | "activities" | "awards" | "certification" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (index: number, key: "startDate" | "endDate" | "date" | "organization" | "role" | "description", value: string) => void;
  onRemove: (index: number) => void;
  onReorder: (sourceId: string, targetId: string) => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const descriptionPlaceholder =
    block.type === "education"
      ? "전공, 학업 내용 또는 주요 경험을 작성해주세요."
      : block.type === "activities"
        ? "활동 내용과 주요 역할을 작성해주세요."
        : block.type === "experience"
          ? "담당 업무와 주요 성과를 작성해주세요."
          : "수상 또는 자격 내용을 작성해주세요.";

  return (
    <div className="flex flex-col gap-4">
      {block.items.map((item, index) => (
        <div
          key={item.id}
          className={`relative grid gap-4 rounded-xl border p-4 pl-10 sm:grid-cols-[240px_1fr] ${
            isBlockSelected && selectedItemId === item.id
              ? "border-primary"
              : "border-transparent"
          } ${dragOverItemId === item.id ? "bg-focus" : ""}`}
          onClick={() => {
            onBlockSelect();
            setSelectedItemId(item.id);
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOverItemId(item.id);
          }}
          onDrop={(event) => {
            event.preventDefault();
            event.stopPropagation();
            const sourceId = event.dataTransfer.getData("text/plain");
            if (sourceId) onReorder(sourceId, item.id);
            setDraggedItemId(null);
            setDragOverItemId(null);
          }}
          onDragLeave={() => setDragOverItemId(null)}
        >
          <span
            draggable
            className={`absolute left-3 top-4 z-10 flex cursor-grab items-center justify-center text-placeholder active:cursor-grabbing ${draggedItemId === item.id ? "opacity-50" : ""}`}
            onDragStart={(event) => {
              event.stopPropagation();
              setDraggedItemId(item.id);
              event.dataTransfer.effectAllowed = "move";
              event.dataTransfer.setData("text/plain", item.id);
            }}
            onDragEnd={() => {
              setDraggedItemId(null);
              setDragOverItemId(null);
            }}
            aria-label="타임라인 항목 순서 변경"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <GripVertical className="size-5" aria-hidden="true" />
          </span>
          <div className={`grid w-[220px] items-center gap-2 self-start ${"date" in item ? "grid-cols-1" : "grid-cols-[1fr_auto_1fr]"}`}>
            <input
              className={`${inputClass} min-w-0 text-right`}
              placeholder={"date" in item ? "날짜" : "시작일"}
              value={"date" in item ? item.date ?? "" : item.startDate ?? ""}
              onChange={(event) => onChange(index, "date" in item ? "date" : "startDate", event.target.value)}
              aria-label="시작일"
            />
            {!("date" in item) && (
              <>
                <span className="shrink-0" aria-hidden="true">-</span>
                <input
                  className={`${inputClass} min-w-0 text-left`}
                  placeholder="종료일"
                  value={item.endDate ?? ""}
                  onChange={(event) => onChange(index, "endDate", event.target.value)}
                  onBlur={() => {
                    if (!item.endDate?.trim()) onChange(index, "endDate", "Present");
                  }}
                  aria-label="종료일"
                />
              </>
            )}
          </div>
          <div className="flex max-w-[448px] flex-col gap-2">
            <input
              className={`${inputClass} text-title-02 !font-bold`}
              placeholder="기관 또는 회사"
              value={item.organization}
              onChange={(event) => onChange(index, "organization", event.target.value)}
            />
            <input
              className={inputClass}
              placeholder="역할"
              value={item.role ?? ""}
              onChange={(event) => onChange(index, "role", event.target.value)}
            />
            <input
              className={inputClass}
              placeholder={descriptionPlaceholder}
              value={item.description ?? ""}
              onChange={(event) => onChange(index, "description", event.target.value)}
            />
          </div>
          {isBlockSelected && selectedItemId === item.id && (
            <button
              type="button"
              className="absolute right-3 top-3 text-danger"
              onClick={(event) => {
                event.stopPropagation();
                onRemove(index);
                setSelectedItemId(null);
              }}
              aria-label="경력 항목 삭제"
            >
              <DeleteIcon className="size-6" aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
