import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useBlocker, useLocation, useNavigate } from "react-router-dom";
import { FileText, GripVertical, Link2, StickyNote, UserRound } from "lucide-react";
import Header from "@/components/layout/Header";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import ProfileBlock from "@/pages/portfolio/components/ProfileBlock";
import BlockRenderer from "@/pages/portfolio/components/BlockRenderer";
import PersonalCard from "@/pages/home/components/PersonalCard";
import { mockPortfolio } from "@/data/mockPortfolio";
import { isProfileFieldVisible, profileFieldOptions, requiredProfileKinds } from "@/pages/portfolio/components/profileFieldOptions";
import type {
  ContentBlock,
  ProfileFieldKind,
  PortfolioDocument,
  TimelineBlock,
  TimelineItem,
  WorkItem,
} from "@/types/portfolio";
import AddIcon from "@/assets/portfolio/Add.svg?react";
import CompanyIcon from "@/assets/portfolio/Company.svg?react";
import DeleteIcon from "@/assets/portfolio/Delete.svg?react";
import EmailIcon from "@/assets/portfolio/Email.svg?react";
import GithubIcon from "@/assets/portfolio/GitHub.svg?react";
import MobileIcon from "@/assets/portfolio/Mobile.svg?react";
import ScholarIcon from "@/assets/portfolio/Scholar.svg?react";
import GoIcon from "@/assets/Goto.svg?react";
import Modal from "@/components/common/Modal";
import type { ComponentType, InputHTMLAttributes, SVGProps } from "react";
import { updatePortfolio, uploadPortfolioAvatar } from "@/api/portfolio";
import { buildPortfolioUpdateRequest, hasDocumentChanged } from "./editorDocument";
import { getCardField, getCardJob, getCardName } from "./cardData";
import { getPortfolioThemeColors } from "./components/portfolioTheme";

const inputClass = "w-full border-0 bg-transparent px-0 py-0 font-[inherit] text-inherit leading-[inherit] tracking-[inherit] caret-primary outline-none";
const panelClass = "rounded-xl border border-transparent p-3";
const projectLinkLabels = ["Link", "GitHub"];

function getField(document: PortfolioDocument, kind: ProfileFieldKind) {
  const profileValue = document.profile.fields.find((field) => field.kind === kind)?.value;
  if (kind === "tel") {
    return document.card.tel ?? "";
  }
  return profileValue || getCardField(document, kind);
}

function HugInput({
  value,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { value: string }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [width, setWidth] = useState<number>();

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const styles = window.getComputedStyle(input);
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (!context) return;

    context.font = `${styles.fontWeight} ${styles.fontSize} ${styles.fontFamily}`;
    const textWidth = context.measureText(value || " ").width;
    const horizontalPadding = Number.parseFloat(styles.paddingLeft) + Number.parseFloat(styles.paddingRight);

    setWidth(Math.ceil(textWidth + horizontalPadding + 2));
  }, [value, props.className]);

  return (
    <input
      {...props}
      ref={inputRef}
      value={value}
      style={{ ...props.style, width }}
    />
  );
}

const profileIcons: Partial<Record<ProfileFieldKind, ComponentType<SVGProps<SVGSVGElement>>>> = {
  github: GithubIcon,
  scholar: ScholarIcon,
  university: ScholarIcon,
  company: CompanyIcon,
  email: EmailIcon,
  phone: MobileIcon,
  notion: StickyNote,
  blog: FileText,
  linkedin: Link2,
  tel: MobileIcon,
  department: ScholarIcon,
  major: ScholarIcon,
};

function EditableProfile({
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

function EditableAbout({ block, onChange }: { block: Extract<ContentBlock, { type: "about" }>; onChange: (value: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [block.body]);

  return (
    <textarea
      ref={textareaRef}
      className={`${inputClass} min-h-28 resize-none overflow-hidden leading-normal`}
      value={block.body}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function EditableSkillTags({
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

function EditableTimeline({
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
  onChange: (index: number, key: "startDate" | "endDate" | "organization" | "role" | "description", value: string) => void;
  onRemove: (index: number) => void;
  onReorder: (sourceId: string, targetId: string) => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
  const [dragOverItemId, setDragOverItemId] = useState<string | null>(null);

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
          <input
            className={`${inputClass} h-fit w-[220px] self-start`}
            placeholder="기간을 입력해주세요."
            value={`${item.startDate}${item.endDate ? ` - ${item.endDate}` : ""}`}
            onChange={(event) => onChange(index, "startDate", event.target.value)}
          />
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
              placeholder="경험에서 받은 일을 작성해주세요."
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

function EditableWorks({
  block,
  isBlockSelected,
  onBlockSelect,
  onChange,
  onRemove,
  onReorder,
  themeId,
}: {
  block: Extract<ContentBlock, { type: "works" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (index: number, key: "title" | "role" | "skills" | "description" | "link", value: string, linkIndex?: number) => void;
  onRemove: (index: number) => void;
  onReorder: (sourceId: string, targetId: string) => void;
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
            className="size-[145px] shrink-0 overflow-hidden rounded-md border bg-focus"
            style={{ borderColor: themeColors.text }}
          >
            {item.imageUrl && <img className="size-full object-cover" src={item.imageUrl} alt="" />}
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
            <input
              className={inputClass}
              placeholder="프로젝트 설명"
              value={item.description}
              onChange={(event) => onChange(index, "description", event.target.value)}
            />
            {projectLinkLabels.map((label, linkIndex) => {
              const link = item.links[linkIndex];

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

function EditableSkills({
  block,
  isBlockSelected,
  onBlockSelect,
  onChange,
  onRemove,
  onReorder,
}: {
  block: Extract<ContentBlock, { type: "skills" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (categoryIndex: number, value: string) => void;
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
          key={category.category}
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
          <span className="text-body-02">{category.category}</span>
          <input
            className={`${inputClass} self-center`}
            value={draftValues[index] ?? category.items.join(", ")}
            onChange={(event) => {
              const value = event.target.value;

              setDraftValues((current) => ({
                ...current,
                [index]: value,
              }));
              onChange(index, value);
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

function BlockEditor({
  block,
  isSelected,
  onSelect,
  onChange,
  themeId,
}: {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (block: ContentBlock) => void;
  themeId: string;
}) {
  const titleMap: Record<ContentBlock["type"], string> = {
    about: "About",
    education: "Education",
    experience: "Experiences",
    activities: "Activities",
    awards: "Awards",
    certification: "Certification",
    works: "Projects",
    skills: "Skills",
  };
  const title = titleMap[block.type];
  const themeColors = getPortfolioThemeColors(themeId);

  function addTimelineItem() {
    if (!("items" in block)) return;
    const newItem: TimelineItem = {
      id: `${block.type}-${block.items.length + 1}`,
      startDate: "",
      organization: "",
      role: "",
      description: "",
    };
    onChange({ ...block, items: [...block.items, newItem] } as ContentBlock);
  }

  function addWorksItem() {
    if (block.type !== "works") return;
    const newItem: WorkItem = {
      id: `${block.type}-${block.items.length + 1}`,
      kind: "project",
      title: "",
      role: "",
      description: "",
      links: [],
    };
    onChange({ ...block, items: [...block.items, newItem] });
  }

  function addSkillCategory() {
    if (block.type !== "skills") return;
    onChange({
      ...block,
      categories: [
        ...block.categories,
        { category: "New Category", items: [] },
      ],
    });
  }

  return (
    <section
      className={`${panelClass} ${isSelected ? "" : "bg-white"}`}
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
      <div className="flex items-center justify-between border-b pb-3" style={{ borderColor: themeColors.text }}>
        <h2 className="text-title-01 font-bold">{title}</h2>
        {block.type !== "about" && (
          <button
            type="button"
            className="text-primary"
            onClick={
              block.type === "works"
                ? addWorksItem
                : block.type === "skills"
                  ? addSkillCategory
                  : addTimelineItem
            }
            aria-label={`${title} 항목 추가`}
          >
            <AddIcon className="size-6" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="pt-3">
        {block.type === "about" && <EditableAbout block={block} onChange={(body) => onChange({ ...block, body })} />}
        {["education", "experience", "activities", "awards", "certification"].includes(block.type) && (
          <EditableTimeline
            block={block as Extract<ContentBlock, { type: "education" | "experience" | "activities" | "awards" | "certification" }>}
            isBlockSelected={isSelected}
            onBlockSelect={onSelect}
            onChange={(index, key, value) => {
              const items = [...(block as TimelineBlock).items];
              items[index] = { ...items[index], [key]: value };
              onChange({ ...block, items } as ContentBlock);
            }}
            onReorder={(sourceId, targetId) => {
              const items = [...(block as TimelineBlock).items];
              const sourceIndex = items.findIndex((item) => item.id === sourceId);
              const targetIndex = items.findIndex((item) => item.id === targetId);
              if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
              const [movedItem] = items.splice(sourceIndex, 1);
              items.splice(targetIndex, 0, movedItem);
              onChange({ ...block, items } as ContentBlock);
            }}
            onRemove={(index) =>
              onChange({
                ...block,
                items: (block as TimelineBlock).items.filter(
                  (_, itemIndex) => itemIndex !== index,
                ),
              } as ContentBlock)
            }
          />
        )}
        {block.type === "works" && (
          <EditableWorks
            block={block}
            isBlockSelected={isSelected}
            onBlockSelect={onSelect}
            themeId={themeId}
            onChange={(index, key, value, linkIndex) =>
              onChange({
                ...block,
                items: block.items.map((item, itemIndex) => {
                  if (itemIndex !== index) return item;
                  if (key === "skills") {
                    return {
                      ...item,
                      skills: JSON.parse(value) as string[],
                    };
                  }

                  if (key === "link" && linkIndex !== undefined) {
                    const links = [...item.links];
                    links[linkIndex] = {
                      label: projectLinkLabels[linkIndex] ?? `Link ${linkIndex + 1}`,
                      href: value,
                    };

                    return {
                      ...item,
                      links,
                    };
                  }
                  return { ...item, [key]: value };
                }),
              })
            }
            onReorder={(sourceId, targetId) => {
              const sourceIndex = block.items.findIndex((item) => item.id === sourceId);
              const targetIndex = block.items.findIndex((item) => item.id === targetId);
              if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;
              const items = [...block.items];
              const [movedItem] = items.splice(sourceIndex, 1);
              items.splice(targetIndex, 0, movedItem);
              onChange({ ...block, items });
            }}
            onRemove={(index) =>
              onChange({
                ...block,
                items: block.items.filter((_, itemIndex) => itemIndex !== index),
              })
            }
          />
        )}
        {block.type === "skills" && (
          <EditableSkills
            block={block}
            isBlockSelected={isSelected}
            onBlockSelect={onSelect}
            onChange={(index, value) =>
              onChange({
                ...block,
                categories: block.categories.map((category, categoryIndex) =>
                  categoryIndex === index
                    ? {
                        ...category,
                        items: value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }
                    : category,
                ),
              })
            }
            onRemove={(index) =>
              onChange({
                ...block,
                categories: block.categories.filter(
                  (_, categoryIndex) => categoryIndex !== index,
                ),
              })
            }
            onReorder={(sourceIndex, targetIndex) => {
              if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

              const categories = [...block.categories];
              const [movedCategory] = categories.splice(sourceIndex, 1);
              categories.splice(targetIndex, 0, movedCategory);
              onChange({ ...block, categories });
            }}
          />
        )}
      </div>
    </section>
  );
}

function EditableFrontCard({ document, onProfileChange, onChange }: { document: PortfolioDocument; onProfileChange: (key: "name" | "title", value: string) => void; onChange: (kind: ProfileFieldKind, value: string) => void }) {
  const role = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";

  return (
    <div className="relative flex h-[230px] w-[390px] max-w-[calc(100vw-2rem)] shrink-0 flex-col rounded-xl border border-ink bg-white p-5 text-ink">
      <div className="flex h-[100px] w-full items-start justify-between">
        <div className="flex size-[70px] shrink-0 items-center justify-center overflow-hidden">
          {document.card.logoUrl ? (
            <img src={document.card.logoUrl} alt="" width={70} height={70} className="size-[70px] object-contain" />
          ) : null}
        </div>
        <div className="flex flex-col items-end justify-start gap-2">
          <GoIcon className="size-4 md:size-5" aria-hidden="true" />
        <HugInput
          className={`${inputClass} !box-border !h-[1.2em] min-w-25 !rounded-sm !px-0 !py-0 !leading-[1.2] text-caption-01 text-right md:text-body-02`}
          value={document.profile.title}
          onChange={(event) => onProfileChange("title", event.target.value)}
          aria-label="직함"
        />
        <HugInput
          className={`${inputClass} !box-border !h-[1em] min-w-25 !rounded-sm !px-0 !py-0 !leading-none text-heading-03 font-semibold text-right md:text-display-02`}
          value={document.profile.name}
          onChange={(event) => onProfileChange("name", event.target.value)}
          aria-label="이름"
          autoFocus
        />
        </div>
      </div>
      <div className="flex w-full border-b border-ink" />
      <div className="flex w-full flex-1 flex-col items-start justify-start gap-2 pt-3">
        {[
          ...(role === "Student" ? [] : [["Tel.", "tel"]]),
          ["Mobile.", "phone"],
          ["E-mail.", "email"],
        ].map(([label, kind]) => (
          <label key={kind} className="flex w-full items-center gap-1 text-caption-02 font-bold leading-[1.2]">
            <span className="w-16 shrink-0">{label}</span>
            <HugInput
              className={`${inputClass} h-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 font-normal leading-[1.2]`}
              value={getField(document, kind as ProfileFieldKind)}
              onChange={(event) => onChange(kind as ProfileFieldKind, event.target.value)}
            />
          </label>
        ))}
        {document.card.organizationAddress && (
          <p className="text-caption-02 leading-[1.2]">{document.card.organizationAddress}</p>
        )}
      </div>
    </div>
  );
}

function ProfilePreviewCard({ document }: { document: PortfolioDocument }) {
  const role = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";

  return (
    <PersonalCard
      role={role}
      name={document.profile.name || getCardName(document)}
      job={document.profile.title || getCardJob(document)}
      logoUrl={document.card.logoUrl}
      tel={getField(document, "tel")}
      phone={getField(document, "phone")}
      email={getField(document, "email")}
      address={document.card.organizationAddress ?? ""}
    />
  );
}

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorState = (location.state as {
    document?: PortfolioDocument;
    side?: "front" | "back";
  } | null) ?? null;
  const forceMockDocument = import.meta.env.DEV && new URLSearchParams(location.search).get("mock") === "1";
  const initialDocument = forceMockDocument ? mockPortfolio : editorState?.document ?? mockPortfolio;
  const [side, setSide] = useState<"front" | "back">(editorState?.side ?? "back");
  const [originalDocument, setOriginalDocument] = useState<PortfolioDocument>(initialDocument);
  const [draftDocument, setDraftDocument] = useState<PortfolioDocument>(initialDocument);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [saveError, setSaveError] = useState("");
  const allowNavigationRef = useRef(false);
  const blocker = useBlocker(() => isDirty && !isSaving && !allowNavigationRef.current);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  function updateDraft(updater: (current: PortfolioDocument) => PortfolioDocument) {
    const nextDocument = updater(draftDocument);
    setDraftDocument(nextDocument);
    setIsDirty(hasDocumentChanged(originalDocument, nextDocument));
  }

  function updateProfileValue(key: "name" | "title", value: string) {
    updateDraft((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  }

  async function handleAvatarChange(file: File) {
    if (!draftDocument.id || isUploadingAvatar) return;
    setIsUploadingAvatar(true);
    setSaveError("");
    try {
      const savedDocument = await uploadPortfolioAvatar(draftDocument.id, file);
      setOriginalDocument((current) => ({
        ...current,
        profile: { ...current.profile, avatarUrl: savedDocument.profile.avatarUrl },
      }));
      setDraftDocument((current) => ({
        ...current,
        profile: { ...current.profile, avatarUrl: savedDocument.profile.avatarUrl },
      }));
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
          ? error.message
          : "프로필 사진을 업로드하지 못했어요.";
      setSaveError(message);
    } finally {
      setIsUploadingAvatar(false);
    }
  }

  function updateField(kind: ProfileFieldKind, value: string) {
    updateDraft((current) => {
      if (kind === "tel") {
        return {
          ...current,
          card: { ...current.card, tel: value || null },
        };
      }

      const existingField = current.profile.fields.find((field) => field.kind === kind);

      if (existingField) {
        return {
          ...current,
          profile: {
            ...current.profile,
            fields: current.profile.fields.map((field) =>
              field.kind === kind ? { ...field, value } : field,
            ),
          },
        };
      }

      const option = profileFieldOptions.find((field) => field.kind === kind);
      if (!option) return current;

      return {
        ...current,
        profile: {
          ...current.profile,
          fields: [
            ...current.profile.fields,
            { kind, label: option.label, value },
          ],
        },
      };
    });
  }

  function addField(kind: ProfileFieldKind) {
    const option = profileFieldOptions.find((field) => field.kind === kind);
    if (!option) return;
    updateDraft((current) => ({ ...current, profile: { ...current.profile, fields: [...current.profile.fields, { kind, label: option.label, value: "" }] } }));
  }

  function removeField(kind: ProfileFieldKind) {
    if (requiredProfileKinds.includes(kind)) return;
    updateDraft((current) => ({ ...current, profile: { ...current.profile, fields: current.profile.fields.filter((field) => field.kind !== kind) } }));
  }

  function reorderField(sourceKind: ProfileFieldKind, targetKind: ProfileFieldKind) {
    if (sourceKind === targetKind) return;
    updateDraft((current) => {
      const isVisibleField = (kind: ProfileFieldKind) =>
        isProfileFieldVisible(kind, current.userType) && (current.userType !== "student" || kind !== "tel");
      const visibleKinds = current.profile.fields
        .filter((field) => isVisibleField(field.kind))
        .map((field) => field.kind);
      const sourceIndex = visibleKinds.indexOf(sourceKind);
      const targetIndex = visibleKinds.indexOf(targetKind);
      if (sourceIndex < 0 || targetIndex < 0) return current;

      const reorderedKinds = [...visibleKinds];
      const [movedKind] = reorderedKinds.splice(sourceIndex, 1);
      reorderedKinds.splice(targetIndex, 0, movedKind);
      let visibleIndex = 0;
      const fields = current.profile.fields.map((field) => {
        if (!isVisibleField(field.kind)) return field;
        const nextKind = reorderedKinds[visibleIndex++];
        return current.profile.fields.find((candidate) => candidate.kind === nextKind) ?? field;
      });
      return { ...current, profile: { ...current.profile, fields } };
    });
  }

  async function saveDocument(shouldNavigate = true) {
    if (!isDirty) {
      if (shouldNavigate) {
        allowNavigationRef.current = true;
        navigate("/preview", { state: { document: draftDocument, side }, replace: true });
      }
      return true;
    }

    setIsSaving(true);
    setSaveError("");
    try {
      const saved = await updatePortfolio(
        draftDocument.id,
        buildPortfolioUpdateRequest(originalDocument, draftDocument),
      );
      setOriginalDocument(saved);
      setDraftDocument(saved);
      setIsDirty(false);
      if (shouldNavigate) {
        allowNavigationRef.current = true;
        navigate("/preview", { state: { document: saved, side }, replace: true });
      }
      return true;
    } catch (error) {
      const message =
        typeof error === "object" && error !== null && "message" in error && typeof error.message === "string"
          ? error.message
          : "저장하지 못했어요. 수정 내용은 유지됩니다.";
      setSaveError(message);
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function moveBlock(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
    updateDraft((current) => {
      const sourceIndex = current.blocks.findIndex((block) => block.id === sourceId);
      const targetIndex = current.blocks.findIndex((block) => block.id === targetId);
      if (sourceIndex < 0 || targetIndex < 0) return current;
      const blocks = [...current.blocks];
      const [moved] = blocks.splice(sourceIndex, 1);
      blocks.splice(targetIndex, 0, moved);
      return { ...current, blocks };
    });
  }

  function updateBlock(nextBlock: ContentBlock) {
    updateDraft((current) => ({
      ...current,
      blocks: current.blocks.map((currentBlock) =>
        currentBlock.id === nextBlock.id ? nextBlock : currentBlock,
      ),
    }));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main
        className={`relative flex min-h-0 flex-1 flex-col overflow-hidden text-ink ${side === "front" ? "bg-apolo px-6 pt-8 pb-0" : "bg-white"}`}
        onClick={() => setSelectedBlockId(null)}
      >
        <div className={`flex min-h-0 flex-1 flex-col overflow-auto ${side === "back" ? "p-4" : ""}`}>
          {side === "front" ? (
            <div className="flex flex-1 items-center justify-center">
              <div
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
              >
                {selectedBlockId === "profile" ? (
                  <EditableFrontCard document={draftDocument} onProfileChange={updateProfileValue} onChange={updateField} />
                ) : (
                  <ProfilePreviewCard document={draftDocument} />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <div
                className="shrink-0"
                onClick={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
                onPointerDown={(event) => {
                  event.stopPropagation();
                  setSelectedBlockId("profile");
                }}
              >
                {selectedBlockId === "profile" ? (
                  <EditableProfile
                    document={draftDocument}
                    isSelected
                    onSelect={() => setSelectedBlockId("profile")}
                    onProfileChange={updateProfileValue}
                    onFieldChange={updateField}
                    onFieldAdd={addField}
                    onFieldRemove={removeField}
                    onFieldReorder={reorderField}
                    onAvatarChange={(file) => void handleAvatarChange(file)}
                    isUploadingAvatar={isUploadingAvatar}
                    themeId={draftDocument.cardDesignId}
                  />
                ) : (
                  <ProfileBlock profile={draftDocument.profile} userType={draftDocument.userType} />
                )}
              </div>
              <div className={`flex min-w-0 flex-1 flex-col gap-6 ${isSaving ? "pointer-events-none opacity-60" : ""}`}>
                {draftDocument.blocks.map((block) => (
                  <div
                    key={block.id}
                    draggable
                    onDragStart={(event) => event.dataTransfer.setData("text/plain", block.id)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={(event) => {
                      event.preventDefault();
                      moveBlock(event.dataTransfer.getData("text/plain"), block.id);
                    }}
                    className="cursor-grab active:cursor-grabbing"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedBlockId(block.id);
                    }}
                    onPointerDown={(event) => {
                      event.stopPropagation();
                      setSelectedBlockId(block.id);
                    }}
                  >
                    {selectedBlockId === block.id ? (
                      <BlockEditor
                        block={block}
                        isSelected
                        onSelect={() => setSelectedBlockId(block.id)}
                        onChange={updateBlock}
                        themeId={draftDocument.cardDesignId}
                      />
                    ) : (
                      <BlockRenderer block={block} themeId={draftDocument.cardDesignId} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="relative sticky bottom-0 z-10 flex items-center justify-center bg-transparent py-2">
            {saveError && <p role="alert" className="absolute bottom-full z-10 mb-3 rounded-full bg-danger/10 px-4 py-2 text-center text-caption-01 text-danger">{saveError}</p>}
            <div className="flex items-center justify-center gap-4">
              <CardSideNavigation side={side} onSideChange={setSide} />
              <ModeButton
                mode="edit"
                onClick={() => void saveDocument()}
                disabled={isSaving}
              />
            </div>
          </div>
        </div>
      </main>
      {blocker.state === "blocked" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <Modal
            title="저장하지 않고 나가시겠습니까?"
            description="저장하지 않은 수정 내용은 사라집니다."
            onCancel={() => blocker.reset()}
            onConfirm={() => {
              allowNavigationRef.current = true;
              blocker.proceed();
            }}
          />
        </div>
      )}
    </div>
  );
}
