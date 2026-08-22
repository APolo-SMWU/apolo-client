import { BLOCK_REGISTRY, isValidBlockType } from "./types/block-registry";
import { injectDefaultFields } from "./types/block-default-fields";
import type { BlockField, BlockType } from "./types/block.types";
import type {
  AnyBlock,
  PortfolioContentDocument,
  PortfolioTemplate,
} from "./types/portfolio.types";

export type GeneratedTemplateBlock = {
  id: string;
  type: string;
  layout?: {
    order?: number;
    span?: number;
    padding?: number;
    gap?: number;
    align?: "left" | "center" | "right";
    hidden?: boolean;
  };
  style?: Record<string, unknown>;
  repeatable?: boolean;
  props?: Record<string, unknown>;
  children?: string[];
};

export type GeneratedPortfolioTemplate = {
  id: string;
  version: number;
  previewMode: string;
  blocks: GeneratedTemplateBlock[];
};

export type NormalizedPortfolio = {
  template: PortfolioTemplate;
  content: PortfolioContentDocument;
};

function placeholderValue(field: BlockField): unknown {
  switch (field.input) {
    case "multiSelect":
    case "toggleTagSelector":
    case "linkList":
    case "imageList":
    case "repeater":
      return [];
    case "switch":
      return false;
    case "dateRange":
      return {};
    case "link":
      return { label: "링크를 입력해주세요", url: "" };
    case "imageUpload":
      return "";
    default:
      return field.placeholder ?? `${field.label}을 입력해주세요`;
  }
}

function normalizeBlock(block: GeneratedTemplateBlock): AnyBlock | null {
  if (!isValidBlockType(block.type)) {
    return null;
  }

  const registry = BLOCK_REGISTRY[block.type];

  return injectDefaultFields({
    id: block.id,
    type: block.type,
    category: registry.category,
    label: registry.label,
    description: registry.description,
    layout: {
      span: registry.defaultLayout.span,
      ...block.layout,
      // Current AI drafts use 48px as their generated default; keep intentional values intact.
      padding: block.layout?.padding === 48 ? 20 : block.layout?.padding ?? registry.defaultLayout.padding,
    },
    style: { variant: "default", emphasis: "medium", ...block.style },
    repeatable: block.repeatable ?? registry.repeatable,
    props: block.props ?? {},
    children: block.children,
    agentMeta: {
      aliases: [block.type],
      canMove: true,
      canResize: true,
      canHide: block.type !== "hero",
      canDelete: !["hero", "contact"].includes(block.type),
      editableLayoutKeys: ["span", "order", "padding"],
    },
  } as AnyBlock);
}

export function normalizePortfolioTemplate(
  generatedTemplate: GeneratedPortfolioTemplate,
): NormalizedPortfolio {
  const blocks = generatedTemplate.blocks
    .map(normalizeBlock)
    .filter((block): block is AnyBlock => block !== null);

  const template: PortfolioTemplate = {
    id: generatedTemplate.id,
    title: "포트폴리오",
    version: generatedTemplate.version,
    previewMode: generatedTemplate.previewMode === "filled" ? "filled" : "template",
    blocks,
  };

  const content: PortfolioContentDocument = {
    templateId: template.id,
    values: blocks
      .filter((block) => block.category === "template")
      .map((block) => ({
        blockId: block.id,
        type: block.type as BlockType,
        value: Object.fromEntries(
          (block.fields ?? [])
            .filter((field) => field.group === "content")
            .map((field) => [field.key, placeholderValue(field)]),
        ) as never,
      })),
  };

  return { template, content };
}
