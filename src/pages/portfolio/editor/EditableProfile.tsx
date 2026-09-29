import { useState } from "react";
import { FileText, GripVertical, Link2, StickyNote, UserRound } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { PortfolioDocument, ProfileFieldKind } from "@/types/portfolio";
import AddIcon from "@/assets/portfolio/Add.svg?react";
import CompanyIcon from "@/assets/portfolio/Company.svg?react";
import DeleteIcon from "@/assets/portfolio/Delete.svg?react";
import EmailIcon from "@/assets/portfolio/Email.svg?react";
import GithubIcon from "@/assets/portfolio/GitHub.svg?react";
import MobileIcon from "@/assets/portfolio/Mobile.svg?react";
import ScholarIcon from "@/assets/portfolio/Scholar.svg?react";
import { isProfileFieldVisible, profileFieldOptions, requiredProfileKinds } from "../components/profileFieldOptions";
import { getPortfolioThemeColors } from "../components/portfolioTheme";
import { inputClass } from "./editorUtils";

const profileIcons: Partial<Record<ProfileFieldKind, ComponentType<SVGProps<SVGSVGElement>>>> = {
  github: GithubIcon, scholar: ScholarIcon, university: ScholarIcon, company: CompanyIcon,
  email: EmailIcon, phone: MobileIcon, notion: StickyNote, blog: FileText, linkedin: Link2,
  tel: MobileIcon, department: ScholarIcon, major: ScholarIcon,
};

export function EditableProfile({
  document,
  isSelected,
  onSelect,
  onProfileChange,
  onFieldChange,
  onFieldAdd,
  onFieldRemove,
  onFieldReorder,
  onAvatarChange,
  isUploadingAvatar,
  themeId,
}: {
  document: PortfolioDocument;
  isSelected: boolean;
  onSelect: () => void;
  onProfileChange: (key: "name" | "title", value: string) => void;
  onFieldChange: (kind: ProfileFieldKind, value: string) => void;
  onFieldAdd: (kind: ProfileFieldKind) => void;
  onFieldRemove: (kind: ProfileFieldKind) => void;
  onFieldReorder: (sourceKind: ProfileFieldKind, targetKind: ProfileFieldKind) => void;
  onAvatarChange: (file: File) => void;
  isUploadingAvatar: boolean;
  themeId: string;
}) {
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false);
  const [draggedFieldKind, setDraggedFieldKind] = useState<ProfileFieldKind | null>(null);
  const [dragOverFieldKind, setDragOverFieldKind] = useState<ProfileFieldKind | null>(null);
  const themeColors = getPortfolioThemeColors(themeId);
  const usedKinds = new Set(document.profile.fields.map((field) => field.kind));
  const visibleFields = document.profile.fields.filter((field) =>
    isProfileFieldVisible(field.kind, document.userType) && (document.userType !== "student" || field.kind !== "tel"),
  );
  const availableFields = profileFieldOptions.filter((field) =>
    !usedKinds.has(field.kind) && isProfileFieldVisible(field.kind, document.userType) && (document.userType !== "student" || field.kind !== "tel"),
  );

  return (
    <aside
      className={`relative flex w-full shrink-0 flex-col gap-4 rounded-xl border p-3 md:w-[30%] md:min-w-[286px] md:max-w-[320px] ${isSelected ? "" : "border-transparent bg-white"}`}
      style={isSelected ? { borderColor: themeColors.text, backgroundColor: themeColors.background } : undefined}
      onClick={(event) => {
        event.stopPropagation();
        onSelect();
      }}
      onPointerDown={(event) => {
        event.stopPropagation();
        onSelect();
      }}
    >
      <label className="relative flex size-[150px] cursor-pointer items-center justify-center overflow-hidden rounded-full bg-white text-primary">
        {document.profile.avatarUrl ? (
          <img className="size-full object-cover" src={document.profile.avatarUrl} alt={`${document.profile.name} 프로필`} />
        ) : (
          <UserRound className="size-14" aria-hidden="true" />
        )}
        <span className="absolute inset-x-0 bottom-0 bg-ink/60 py-1 text-center text-caption-02 text-white">
          {isUploadingAvatar ? "업로드 중..." : "사진 변경"}
        </span>
        <input
          className="sr-only"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={isUploadingAvatar}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) onAvatarChange(file);
            event.currentTarget.value = "";
          }}
        />
      </label>

      <label className="flex flex-col gap-1">
        <span className="sr-only">이름</span>
        <input className={`${inputClass} w-fit max-w-full font-bold`} value={document.profile.name} onChange={(event) => onProfileChange("name", event.target.value)} />
      </label>
      <label className="relative flex items-center gap-2">
        <span className="sr-only">직함</span>
        <input className={`${inputClass} min-w-0 flex-1`} value={document.profile.title} onChange={(event) => onProfileChange("title", event.target.value)} />
        <button
          type="button"
          className="flex size-6 shrink-0 items-center justify-center rounded-full text-primary"
          onClick={() => setIsFieldMenuOpen((open) => !open)}
          aria-label="프로필 필드 추가"
        >
          <AddIcon className="size-6" aria-hidden="true" />
        </button>
        {isFieldMenuOpen && availableFields.length > 0 && (
          <select
            autoFocus
            className="absolute right-8 top-1/2 z-10 w-30 -translate-y-1/2 rounded-md border border-placeholder bg-white px-3 py-2 text-body-02 shadow-md"
            value=""
            onChange={(event) => {
              if (event.target.value) onFieldAdd(event.target.value as ProfileFieldKind);
              setIsFieldMenuOpen(false);
            }}
            aria-label="추가할 프로필 필드 선택"
          >
            <option value="">선택</option>
            {availableFields.map((field) => (
              <option key={field.kind} value={field.kind}>
                {field.label}
              </option>
            ))}
          </select>
        )}
      </label>

      <div className="relative flex flex-col gap-3">
        {visibleFields.map((field) => (
          <div
            key={field.kind}
            className={`flex items-center gap-2 rounded-md ${dragOverFieldKind === field.kind ? "bg-focus" : ""}`}
            onDragOver={(event) => {
              event.preventDefault();
              setDragOverFieldKind(field.kind);
            }}
            onDrop={(event) => {
              event.preventDefault();
              event.stopPropagation();
              const sourceKind = event.dataTransfer.getData("text/plain") as ProfileFieldKind;
              if (sourceKind) onFieldReorder(sourceKind, field.kind);
              setDraggedFieldKind(null);
              setDragOverFieldKind(null);
            }}
            onDragLeave={() => setDragOverFieldKind(null)}
          >
            <span
              draggable
              className={`flex size-5 shrink-0 cursor-grab items-center justify-center text-placeholder active:cursor-grabbing ${draggedFieldKind === field.kind ? "opacity-50" : ""}`}
              onDragStart={(event) => {
                setDraggedFieldKind(field.kind);
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("text/plain", field.kind);
              }}
              onDragEnd={() => {
                setDraggedFieldKind(null);
                setDragOverFieldKind(null);
              }}
              aria-label={`${field.label} 순서 변경`}
            >
              <GripVertical className="size-4" aria-hidden="true" />
            </span>
            {(() => {
              const Icon = profileIcons[field.kind] ?? Link2;
              return <Icon className="size-5 shrink-0" aria-hidden="true" />;
            })()}
            <span className="w-16 shrink-0 text-body-02">{field.label}</span>
            <span className="text-placeholder">|</span>
            <input className={`${inputClass} min-w-0 flex-1 text-body-02`} value={field.value} onChange={(event) => onFieldChange(field.kind, event.target.value)} />
            <button type="button" className="flex size-6 shrink-0 items-center justify-center text-danger" disabled={requiredProfileKinds.includes(field.kind)} onClick={() => onFieldRemove(field.kind)} aria-label={`${field.label} 삭제`}>
              <DeleteIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

    </aside>
  );
}
