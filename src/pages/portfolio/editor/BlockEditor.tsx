import AddIcon from "@/assets/portfolio/Add.svg?react";
import DeleteIcon from "@/assets/portfolio/Delete.svg?react";
import type { ContentBlock, TimelineBlock, TimelineItem, WorkItem } from "@/types/portfolio";
import { getPortfolioThemeColors } from "../components/portfolioTheme";
import { createClientId, panelClass, projectLinkLabels } from "./editorUtils";
import { EditableAbout } from "./EditableAbout";
import { EditableSkills } from "./EditableSkills";
import { EditableTimeline } from "./EditableTimeline";
import { EditableWorks } from "./EditableWorks";

export function BlockEditor({
  block,
  isSelected,
  onSelect,
  onChange,
  onRemove,
  onImageSelect,
  onImageDelete,
  imagePreviews,
  uploadingItemId,
  themeId,
}: {
  block: ContentBlock;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (block: ContentBlock) => void;
  onRemove: () => void;
  onImageSelect: (itemId: string, file: File) => void;
  onImageDelete: (itemId: string) => void;
  imagePreviews: Record<string, string>;
  uploadingItemId: string | null;
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
    const newItem: TimelineItem = ["awards", "certification"].includes(block.type)
      ? { id: createClientId(`${block.type}-item`), date: null, organization: "", role: "", description: "" }
      : { id: createClientId(`${block.type}-item`), startDate: null, endDate: null, organization: "", role: "", description: "" };
    onChange({ ...block, items: [...block.items, newItem] } as ContentBlock);
  }

  function addWorksItem() {
    if (block.type !== "works") return;
    const newItem: WorkItem = {
      id: createClientId(`${block.type}-item`),
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
        { id: createClientId(`${block.type}-category`), category: "New Category", items: [] },
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="text-caption-01 text-primary"
            onClick={() => onChange({ ...block, visible: !block.visible })}
            aria-label={`${title} ${block.visible ? "숨기기" : "보이기"}`}
          >
            {block.visible ? "숨김" : "표시"}
          </button>
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
          <button type="button" className="text-danger" onClick={onRemove} aria-label={`${title} 블록 삭제`}>
            <DeleteIcon className="size-6" aria-hidden="true" />
            <span className="sr-only">블록 삭제</span>
          </button>
        </div>
      </div>
      <div className="pt-3">
        {block.type === "about" && <EditableAbout block={block} onChange={(description) => onChange({ ...block, description })} />}
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
            onImageSelect={onImageSelect}
            onImageDelete={onImageDelete}
            imagePreviews={imagePreviews}
            uploadingItemId={uploadingItemId}
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
            onCategoryChange={(index, value) =>
              onChange({
                ...block,
                categories: block.categories.map((category, categoryIndex) =>
                  categoryIndex === index ? { ...category, category: value } : category,
                ),
              })
            }
            onItemsChange={(index, value) =>
              onChange({
                ...block,
                categories: block.categories.map((category, categoryIndex) =>
                  categoryIndex === index
                    ? {
                        ...category,
                        items: value
                          .split(",")
                          .map((item) => item.trim())
                          .filter(Boolean)
                          .map((name, itemIndex) => ({
                            ...(category.items[itemIndex] ?? { id: createClientId(`${category.id}-item`) }),
                            name,
                          })),
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
