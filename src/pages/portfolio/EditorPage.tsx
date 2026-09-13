import { useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FileText, Link2, StickyNote, UserRound } from "lucide-react";
import Header from "@/components/layout/Header";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import { mockPortfolio } from "@/data/mockPortfolio";
import { profileFieldOptions, requiredProfileKinds } from "@/pages/portfolio/components/profileFieldOptions";
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
import type { ComponentType, InputHTMLAttributes, SVGProps } from "react";

const inputClass = "w-full rounded-ml border border-placeholder bg-white px-4 py-2 text-body-02 text-ink outline-none focus:border-placeholder";
const panelClass = "rounded-xl border p-3";
const projectLinkLabels = ["Link", "GitHub"];

function getField(document: PortfolioDocument, kind: ProfileFieldKind) {
  return document.profile.fields.find((field) => field.kind === kind)?.value ?? "";
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
};

function EditableProfile({
  document,
  isSelected,
  onSelect,
  onProfileChange,
  onFieldChange,
  onFieldAdd,
  onFieldRemove,
}: {
  document: PortfolioDocument;
  isSelected: boolean;
  onSelect: () => void;
  onProfileChange: (key: "name" | "title", value: string) => void;
  onFieldChange: (kind: ProfileFieldKind, value: string) => void;
  onFieldAdd: (kind: ProfileFieldKind) => void;
  onFieldRemove: (kind: ProfileFieldKind) => void;
}) {
  const [isFieldMenuOpen, setIsFieldMenuOpen] = useState(false);
  const usedKinds = new Set(document.profile.fields.map((field) => field.kind));
  const availableFields = profileFieldOptions.filter((field) => !usedKinds.has(field.kind));

  return (
    <aside
      className={`relative flex w-full shrink-0 flex-col gap-4 rounded-xl border p-3 transition-colors md:w-[30%] md:min-w-[286px] md:max-w-[320px] ${
        isSelected
          ? "border-primary bg-focus"
          : "border-placeholder bg-white"
      }`}
      onClick={onSelect}
    >
      <div className="flex size-[150px] items-center justify-center overflow-hidden rounded-full bg-white text-primary">
        {document.profile.avatarUrl ? (
          <img className="size-full object-cover" src={document.profile.avatarUrl} alt={`${document.profile.name} 프로필`} />
        ) : (
          <UserRound className="size-14" aria-hidden="true" />
        )}
      </div>

      <label className="flex flex-col gap-1">
        <span className="sr-only">이름</span>
        <input className={`${inputClass} w-fit max-w-full font-bold`} value={document.profile.name} onChange={(event) => onProfileChange("name", event.target.value)} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="sr-only">직함</span>
        <input className={`${inputClass} w-fit max-w-full`} value={document.profile.title} onChange={(event) => onProfileChange("title", event.target.value)} />
      </label>

      <button
        type="button"
        className="absolute right-4 top-[265px] rounded-full text-primary"
        onClick={() => setIsFieldMenuOpen((open) => !open)}
        aria-label="프로필 필드 추가"
      >
        <AddIcon className="size-6" aria-hidden="true" />
      </button>

      <div className="flex flex-col gap-3">
        {document.profile.fields.map((field) => (
          <div key={field.kind} className="flex items-center gap-2">
            {(() => {
              const Icon = profileIcons[field.kind] ?? Link2;
              return <Icon className="size-5 shrink-0" aria-hidden="true" />;
            })()}
            <span className="w-14 shrink-0 text-body-02">{field.label}</span>
            <span className="text-placeholder">|</span>
            <input className={`${inputClass} min-w-0 flex-1`} value={field.value} onChange={(event) => onFieldChange(field.kind, event.target.value)} />
            <button type="button" className="text-danger" disabled={requiredProfileKinds.includes(field.kind)} onClick={() => onFieldRemove(field.kind)} aria-label={`${field.label} 삭제`}>
              <DeleteIcon className="size-6" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {isFieldMenuOpen && availableFields.length > 0 && (
        <select
          autoFocus
          className="absolute right-3 top-[300px] z-10 rounded-md border border-placeholder bg-white px-3 py-2 text-body-02 shadow-md"
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
    </aside>
  );
}

function EditableAbout({ block, onChange }: { block: Extract<ContentBlock, { type: "about" }>; onChange: (value: string) => void }) {
  return (
    <textarea
      className={`${inputClass} min-h-28 resize-y leading-normal`}
      value={block.body}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

function EditableSkillTags({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  const [inputValue, setInputValue] = useState("");

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
          className="rounded-sm bg-focus px-2 py-1 text-caption-01 text-primary"
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
}: {
  block: Extract<ContentBlock, { type: "education" | "experience" | "activities" | "awards" | "certification" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (index: number, key: "startDate" | "endDate" | "organization" | "role" | "description", value: string) => void;
  onRemove: (index: number) => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-4">
      {block.items.map((item, index) => (
        <div
          key={item.id}
          className={`relative grid gap-4 rounded-xl border p-4 sm:grid-cols-[224px_1fr] ${
            isBlockSelected && selectedItemId === item.id
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={() => {
            onBlockSelect();
            setSelectedItemId(item.id);
          }}
        >
          <input
            className={`${inputClass} h-fit w-[200px] self-start`}
            placeholder="기간을 입력해주세요."
            value={`${item.startDate}${item.endDate ? ` - ${item.endDate}` : ""}`}
            onChange={(event) => onChange(index, "startDate", event.target.value)}
          />
          <div className="flex max-w-[448px] flex-col gap-2">
            <input
              className={`${inputClass} font-bold`}
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
}: {
  block: Extract<ContentBlock, { type: "works" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (index: number, key: "title" | "role" | "skills" | "description" | "link", value: string, linkIndex?: number) => void;
  onRemove: (index: number) => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {block.items.map((item, index) => (
        <div
          key={item.id}
          className={`relative flex gap-4 rounded-xl border p-4 ${
            isBlockSelected && selectedItemId === item.id
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={() => {
            onBlockSelect();
            setSelectedItemId(item.id);
          }}
        >
          <div className="size-[145px] shrink-0 overflow-hidden rounded-md border border-placeholder bg-focus">
            {item.imageUrl && <img className="size-full object-cover" src={item.imageUrl} alt="" />}
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <input
              className={`${inputClass} font-bold`}
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
              <label key={label} className="flex items-center gap-3 text-body-02 font-semibold text-primary">
                <span className="w-14 shrink-0">[{label}]</span>
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
}: {
  block: Extract<ContentBlock, { type: "skills" }>;
  isBlockSelected: boolean;
  onBlockSelect: () => void;
  onChange: (categoryIndex: number, value: string) => void;
  onRemove: (categoryIndex: number) => void;
}) {
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number | null>(null);
  const [draftValues, setDraftValues] = useState<Record<number, string>>({});

  return (
    <div className="flex flex-col gap-3">
      {block.categories.map((category, index) => (
        <div
          key={category.category}
          className={`relative grid gap-2 rounded-xl border p-2 sm:grid-cols-[130px_1fr] ${
            isBlockSelected && selectedCategoryIndex === index
              ? "border-primary"
              : "border-transparent"
          }`}
          onClick={() => {
            onBlockSelect();
            setSelectedCategoryIndex(index);
          }}
        >
          <span className="py-2 text-body-02">{category.category}</span>
          <input
            className={inputClass}
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
}: {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (block: ContentBlock) => void;
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
      className={`${panelClass} transition-colors ${
        isSelected
          ? "border-primary bg-focus"
          : "border-placeholder bg-white"
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between border-b border-placeholder pb-3">
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
          />
        )}
      </div>
    </section>
  );
}

function EditableFrontCard({ document, onProfileChange, onChange }: { document: PortfolioDocument; onProfileChange: (key: "name" | "title", value: string) => void; onChange: (kind: ProfileFieldKind, value: string) => void }) {
  return (
    <div className="flex h-[230px] w-[390px] max-w-[calc(100vw-2rem)] shrink-0 flex-col gap-4 rounded-xl border border-ink bg-white p-4 text-ink">
      <div className="flex w-full flex-col items-end justify-center gap-1">
        <HugInput
          className={`${inputClass} h-fit min-w-25 !rounded-sm !px-2 !py-0.5 text-caption-01 text-right`}
          value={document.profile.title}
          onChange={(event) => onProfileChange("title", event.target.value)}
          aria-label="직함"
        />
        <HugInput
          className={`${inputClass} h-fit min-w-25 !rounded-sm !px-2 !py-0.5 text-heading-03 font-semibold leading-none text-right`}
          value={document.profile.name}
          onChange={(event) => onProfileChange("name", event.target.value)}
          aria-label="이름"
        />
      </div>
      <div className="flex w-full border-b border-ink" />
      <div className="flex w-full flex-col items-start justify-start gap-1">
        {[
          ["Tel.", "company"],
          ["Mobile.", "phone"],
          ["E-mail.", "email"],
          ["Address", "university"],
        ].map(([label, kind]) => (
          <label key={kind} className="flex w-full items-center gap-1 text-caption-02 font-bold leading-[1.2]">
            <span className="w-9 shrink-0">{label}</span>
            <HugInput
              className={`${inputClass} h-fit min-w-25 !rounded-sm !px-2 !py-0.5 text-caption-02 font-normal leading-[1.2]`}
              value={getField(document, kind as ProfileFieldKind)}
              onChange={(event) => onChange(kind as ProfileFieldKind, event.target.value)}
            />
          </label>
        ))}
      </div>
    </div>
  );
}

export default function EditorPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const editorState = (location.state as {
    document?: PortfolioDocument;
    side?: "front" | "back";
  } | null) ?? null;
  const [side, setSide] = useState<"front" | "back">(editorState?.side ?? "back");
  const [document, setDocument] = useState<PortfolioDocument>(editorState?.document ?? mockPortfolio);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);

  function updateProfileValue(key: "name" | "title", value: string) {
    setDocument((current) => ({ ...current, profile: { ...current.profile, [key]: value } }));
  }

  function updateField(kind: ProfileFieldKind, value: string) {
    setDocument((current) => {
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
    setDocument((current) => ({ ...current, profile: { ...current.profile, fields: [...current.profile.fields, { kind, label: option.label, value: "" }] } }));
  }

  function removeField(kind: ProfileFieldKind) {
    if (requiredProfileKinds.includes(kind)) return;
    setDocument((current) => ({ ...current, profile: { ...current.profile, fields: current.profile.fields.filter((field) => field.kind !== kind) } }));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main className={`relative flex min-h-0 flex-1 flex-col overflow-hidden text-ink ${side === "front" ? "bg-apolo" : "bg-white"}`}>
        <div className="fixed right-6 top-24 z-20">
          <ModeButton
            mode="edit"
            onClick={() => navigate("/preview", { state: { document, side }, replace: true })}
          />
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-auto p-4 pb-24">
          {side === "front" ? (
            <div className="flex flex-1 items-center justify-center p-4">
              <EditableFrontCard document={document} onProfileChange={updateProfileValue} onChange={updateField} />
            </div>
          ) : (
            <div className="flex flex-col items-start gap-6 md:flex-row">
              <EditableProfile
                document={document}
                isSelected={selectedBlockId === "profile"}
                onSelect={() => setSelectedBlockId("profile")}
                onProfileChange={updateProfileValue}
                onFieldChange={updateField}
                onFieldAdd={addField}
                onFieldRemove={removeField}
              />
              <div className="flex min-w-0 flex-1 flex-col gap-6">
                {document.blocks.map((block) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    isSelected={selectedBlockId === block.id}
                    onSelect={() => setSelectedBlockId(block.id)}
                    onChange={(nextBlock) =>
                      setDocument((current) => ({
                        ...current,
                        blocks: current.blocks.map((currentBlock) =>
                          currentBlock.id === nextBlock.id
                            ? nextBlock
                            : currentBlock,
                        ),
                      }))
                    }
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
          <CardSideNavigation side={side} onSideChange={setSide} />
        </div>
      </main>
    </div>
  );
}
