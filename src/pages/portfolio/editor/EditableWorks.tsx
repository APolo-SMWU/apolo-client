import { useState } from "react";
import { GripVertical } from "lucide-react";
import DeleteIcon from "@/assets/portfolio/Delete.svg?react";
import type { ContentBlock } from "@/types/portfolio";
import { getPortfolioThemeColors } from "../components/portfolioTheme";
import { inputClass, projectLinkLabels } from "./editorUtils";
import { WORK_IMAGE_ACCEPT } from "./workImageUtils";

export function EditableSkillTags({
  skills,
  onChange,
  themeId,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
  themeId: string;
}) {
  const [inputValue, setInputValue] = useState("");
  const themeColors = getPortfolioThemeColors(themeId);

  function addSkill() {
    const skill = inputValue.trim();
    if (!skill || skills.includes(skill)) {
      setInputValue("");
      return;
    }

    onChange([...skills, skill]);
    setInputValue("");
  }

  return (
    <div
      className={`${inputClass} flex min-h-11 flex-wrap items-center gap-2`}
      onClick={(event) => event.stopPropagation()}
    >
      {skills.map((skill) => (
        <button
          key={skill}
          type="button"
          className="rounded-sm px-2 py-1 text-caption-01"
          style={{ backgroundColor: themeColors.background, color: themeColors.text }}
          onClick={() => onChange(skills.filter((item) => item !== skill))}
        >
          {skill}
        </button>
      ))}
      <input
        className="min-w-24 flex-1 bg-transparent outline-none placeholder:text-placeholder"
        value={inputValue}
        placeholder={skills.length ? "기술 추가" : "사용 기술을 입력해주세요."}
        onChange={(event) => setInputValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === " " && inputValue.trim()) {
            event.preventDefault();
            addSkill();
          }

          if (event.key === "Backspace" && !inputValue && skills.length > 0) {
            onChange(skills.slice(0, -1));
          }
        }}
      />
    </div>
  );
}

export function EditableWorks({
  block,
  isBlockSelected,
  onBlockSelect,
  onChange,
  onRemove,
  onReorder,
  onImageSelect,
  onImageDelete,
  imagePreviews,
  uploadingItemId,
  themeId,
}: {
  block: Extract<ContentBlock, { type: "works" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (index: number, key: "title" | "role" | "skills" | "description" | "link", value: string, linkIndex?: number) => void;
  onRemove: (index: number) => void;
  onReorder: (sourceId: string, targetId: string) => void;
  onImageSelect: (itemId: string, file: File) => void;
  onImageDelete: (itemId: string) => void;
  imagePreviews: Record<string, string>;
  uploadingItemId: string | null;
  themeId: string;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);
  const themeColors = getPortfolioThemeColors(themeId);

  return (
    <div className="flex flex-col gap-3">
      {block.items.map((item, index) => (
        <div
          key={item.id}
          className={`relative flex gap-4 rounded-xl border p-4 pl-10 ${
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
            aria-label="프로젝트 순서 변경"
            onPointerDown={(event) => event.stopPropagation()}
          >
            <GripVertical className="size-5" aria-hidden="true" />
          </span>
          <div
            className="w-[145px] shrink-0"
            onClick={(event) => event.stopPropagation()}
            onPointerDown={(event) => event.stopPropagation()}
          >
            <div
              className="relative size-[145px] overflow-hidden rounded-md border bg-focus"
              style={{ borderColor: themeColors.text }}
            >
              <label
                className="block size-full cursor-pointer"
                onClick={(event) => event.stopPropagation()}
              >
                {(imagePreviews[item.id] || item.imageUrl) ? (
                  <img
                    className="size-full object-cover"
                    src={imagePreviews[item.id] ?? item.imageUrl ?? undefined}
                    alt=""
                  />
                ) : (
                  <span className="flex size-full items-center justify-center px-2 text-center text-body-02 font-normal text-primary">
                    이미지 선택
                  </span>
                )}
                <input
                  type="file"
                  className="sr-only"
                  accept={WORK_IMAGE_ACCEPT}
                  aria-label={`${item.title || "프로젝트"} 이미지 선택`}
                  disabled={uploadingItemId === item.id}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onImageSelect(item.id, file);
                    event.target.value = "";
                  }}
                />
              </label>
              {(imagePreviews[item.id] || item.imageUrl) && (
                <button
                  type="button"
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white/90 text-body-02 text-danger shadow-sm disabled:opacity-50"
                  disabled={uploadingItemId === item.id}
                  aria-label="프로젝트 이미지 삭제"
                  onClick={(event) => {
                    event.stopPropagation();
                    onImageDelete(item.id);
                  }}
                >
                  ×
                </button>
              )}
              {uploadingItemId === item.id && (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/50 text-caption-01 text-white">
                  업로드 중...
                </span>
              )}
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <input
              className={`${inputClass} text-title-02 !font-bold`}
              placeholder="프로젝트 제목"
              value={item.title}
              onChange={(event) => onChange(index, "title", event.target.value)}
            />
            <input
              className={inputClass}
              value={item.role ?? ""}
              placeholder="역할"
              onChange={(event) => onChange(index, "role", event.target.value)}
            />
            <EditableSkillTags
              skills={item.skills ?? []}
              onChange={(skills) => onChange(index, "skills", JSON.stringify(skills))}
              themeId={themeId}
            />
            <textarea
              className={`${inputClass} min-h-20 resize-y`}
              placeholder="프로젝트 설명"
              value={item.description}
              onChange={(event) => onChange(index, "description", event.target.value)}
            />
            {(item.links.length > 0
              ? item.links
              : projectLinkLabels.map((label) => ({ label, href: "" }))
            ).map((link, linkIndex) => {
              const label = link.label || projectLinkLabels[linkIndex] || `Link ${linkIndex + 1}`;

              return (
              <label key={label} className="flex items-center gap-3 text-body-02 font-semibold">
                <span
                  className="inline-flex w-14 shrink-0 justify-center rounded-sm px-2 py-1 text-caption-01"
                  style={{ backgroundColor: themeColors.background, color: themeColors.text }}
                >
                  [{label}]
                </span>
                <input
                  className={`${inputClass} font-normal text-ink`}
                  value={link?.href ?? ""}
                  placeholder={`${label} 주소`}
                  aria-label={`${label} 링크`}
                  onChange={(event) => onChange(index, "link", event.target.value, linkIndex)}
                />
              </label>
              );
            })}
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
              aria-label="프로젝트 항목 삭제"
            >
              <DeleteIcon className="size-6" aria-hidden="true" />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
