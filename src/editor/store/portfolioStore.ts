// ============================================================
// APolo Portfolio - Zustand Store
// portfolio template + content 상태 관리
// undo/redo: zustand/middleware의 temporal 사용
//
// 의존성: zustand zundo
// ============================================================

import { create } from "zustand";
import { temporal } from "zundo";
import { immer } from "zustand/middleware/immer";
import type {
  PortfolioTemplate,
  PortfolioContentDocument,
  AnyBlock,
  RenderMeta,
} from "../types/portfolio.types";
import type { PreviewMode, BlockLayout, BlockStyle } from "../types/block.types";
import type { BlockType } from "../types/block.types";
import { BLOCK_REGISTRY } from "../types/block-registry";
import { injectDefaultFields } from "../types/block-default-fields";
import { getRootBlocks } from "../types/portfolio.types";

// ─────────────────────────────────────────
// Store State
// ─────────────────────────────────────────

export interface PortfolioStoreState {
  // ── 핵심 데이터 ──
  template: PortfolioTemplate | null;
  content: PortfolioContentDocument | null;
  renderMeta: RenderMeta | null;

  // ── UI 상태 ──
  previewMode: PreviewMode;
  selectedBlockId: string | null;
  isDirty: boolean;
  isSaving: boolean;
  isGenerating: boolean;
}

// ─────────────────────────────────────────
// Store Actions
// ─────────────────────────────────────────

export interface PortfolioStoreActions {
  // ── 초기화 ──
  initPortfolio: (
    template: PortfolioTemplate,
    content: PortfolioContentDocument
  ) => void;
  resetPortfolio: () => void;

  /**
   * AI가 반환한 결과 JSON을 통째로 받아 state를 초기화한다.
   * portfolioTemplate + portfolioContent 둘 다 포함된 AI 응답 전체를 넘기면 되고,
   * portfolioContent가 없으면 template의 blocks를 순회해 빈 값으로 자동 생성한다.
   */
  loadFromAI: (aiResponse: AIPortfolioResponse) => void;

  // ── 블록 조작 ──
  addBlock: (
    blockType: BlockType,
    afterBlockId?: string,
    parentBlockId?: string
  ) => void;
  removeBlock: (blockId: string) => void;
  duplicateBlock: (blockId: string) => void;
  moveBlockUp: (blockId: string) => void;
  moveBlockDown: (blockId: string) => void;
  reorderBlocks: (newOrderIds: string[]) => void;

  // ── 블록 속성 변경 ──
  updateBlockLayout: (blockId: string, layout: Partial<BlockLayout>) => void;
  updateBlockStyle: (blockId: string, style: Partial<BlockStyle>) => void;
  updateBlockProps: (
    blockId: string,
    props: Record<string, unknown>
  ) => void;
  toggleBlockHidden: (blockId: string) => void;

  // ── 콘텐츠 값 변경 ──
  updateContentValue: (blockId: string, key: string, value: unknown) => void;

  // ── UI 상태 ──
  setPreviewMode: (mode: PreviewMode) => void;
  selectBlock: (blockId: string | null) => void;
  setIsSaving: (v: boolean) => void;
  setIsGenerating: (v: boolean) => void;
  markClean: () => void;
}

export type PortfolioStore = PortfolioStoreState & PortfolioStoreActions;

// ─────────────────────────────────────────
// 초기 상태
// ─────────────────────────────────────────

const initialState: PortfolioStoreState = {
  template: null,
  content: null,
  renderMeta: null,
  previewMode: "template",
  selectedBlockId: null,
  isDirty: false,
  isSaving: false,
  isGenerating: false,
};

// ─────────────────────────────────────────
// 유틸: RenderMeta 재계산
// ─────────────────────────────────────────

function computeRenderMeta(
  template: PortfolioTemplate,
  content: PortfolioContentDocument
): RenderMeta {
  const rootBlocks = getRootBlocks(template);
  const rootBlockIds = rootBlocks.map((b) => b.id);

  // 필수 필드 누락 검사
  const missingRequiredFields: RenderMeta["contentCompletion"]["missingRequiredFields"] =
    [];

  for (const block of template.blocks) {
    const fields = block.fields ?? [];
    const blockValue = content.values.find((v) => v.blockId === block.id)
      ?.value as Record<string, unknown> | undefined;

    for (const field of fields) {
      if (
        field.validation?.required &&
        (!blockValue || !blockValue[field.key])
      ) {
        missingRequiredFields.push({
          blockId: block.id,
          fieldKey: field.key,
          label: field.label,
        });
      }
    }
  }

  const completionStatus =
    missingRequiredFields.length === 0
      ? "complete"
      : content.values.length === 0
      ? "empty"
      : "draft";

  return {
    canRender: true,
    initialPreviewMode: template.previewMode,
    rootBlockIds,
    editable: true,
    contentCompletion: {
      missingRequiredFields,
      completionStatus,
    },
  };
}

// ─────────────────────────────────────────
// AI 응답 타입
// 프로젝트 제안서의 "Frontend Renderer에 최종 반환" 구조와 동일
// ─────────────────────────────────────────

export interface AIPortfolioResponse {
  /** AI가 생성한 포트폴리오 구조 */
  portfolioTemplate: PortfolioTemplate;
  /** AI가 생성한 초기 콘텐츠 값. 없으면 자동 생성 */
  portfolioContent?: PortfolioContentDocument;
  /** 렌더링 메타 (있으면 그대로 사용, 없으면 재계산) */
  renderMeta?: RenderMeta;
}

// ─────────────────────────────────────────
// 유틸: template.blocks에서 빈 content 자동 생성
// portfolioContent가 없을 때 fallback으로 사용
// ─────────────────────────────────────────

function extractContentFromTemplate(
  template: PortfolioTemplate
): PortfolioContentDocument {
  return {
    templateId: template.id,
    values: template.blocks
      .filter((b) => b.category === "template") // layout 블록은 content 불필요
      .map((b) => ({
        blockId: b.id,
        type: b.type,
        value: {} as never,
      })),
  };
}

// ─────────────────────────────────────────
// 유틸: 새 블록 기본 객체 생성
// ─────────────────────────────────────────

function createDefaultBlock(
  type: BlockType,
  order: number,
  jobType?: PortfolioTemplate["jobType"]
): AnyBlock {
  const entry = BLOCK_REGISTRY[type];
  const id = `${type}-${Date.now()}`;

  return normalizeBlockDefaults({
    id,
    type,
    category: entry.category,
    label: entry.label,
    description: entry.description,
    layout: {
      span: entry.defaultLayout.span,
      order,
      padding: entry.defaultLayout.padding,
    },
    style: { variant: "default", emphasis: "medium" },
    repeatable: entry.repeatable,
    props: getDefaultBlockProps(type, jobType),
    agentMeta: {
      aliases: [type],
      canMove: true,
      canResize: true,
      canHide: type !== "hero",
      canDelete: !["hero", "contact"].includes(type),
      editableLayoutKeys: ["span", "order", "padding"],
    },
  } as AnyBlock, jobType);
}

function getDefaultBlockProps(
  type: BlockType,
  jobType?: PortfolioTemplate["jobType"]
): object {
  const preset =
    jobType === "cv" ? "research" : jobType === "developer" || jobType === "designer" ? jobType : undefined;

  if (type === "gallery") {
    return { layout: "carousel" };
  }
  if (type === "project") {
    return { showThumbnail: true, ...(preset ? { preset } : {}) };
  }
  if (type === "skills") {
    return { display: "tag", ...(preset ? { preset } : {}) };
  }
  return {};
}

function normalizeBlockDefaults(
  block: AnyBlock,
  jobType?: PortfolioTemplate["jobType"]
): AnyBlock {
  const entry = BLOCK_REGISTRY[block.type];

  return injectDefaultFields({
    ...block,
    category: block.category ?? entry.category,
    label: block.label ?? entry.label,
    description: block.description ?? entry.description,
    layout: {
      span: entry.defaultLayout.span,
      padding: entry.defaultLayout.padding,
      ...(block.layout ?? {}),
    },
    style: block.style ?? { variant: "default", emphasis: "medium" },
    repeatable: block.repeatable ?? entry.repeatable,
    props: { ...getDefaultBlockProps(block.type, jobType), ...(block.props ?? {}) },
    agentMeta: {
      aliases: block.agentMeta?.aliases ?? [block.type],
      canMove: block.agentMeta?.canMove ?? true,
      canResize: block.agentMeta?.canResize ?? true,
      canHide: block.agentMeta?.canHide ?? block.type !== "hero",
      canDelete:
        block.agentMeta?.canDelete ?? !["hero", "contact"].includes(block.type),
      editableLayoutKeys: block.agentMeta?.editableLayoutKeys ?? [
        "span",
        "order",
        "padding",
      ],
    },
  } as AnyBlock);
}

// ─────────────────────────────────────────
// Store 생성
// ─────────────────────────────────────────

export const usePortfolioStore = create<PortfolioStore>()(
  temporal(
    immer((set) => ({
      ...initialState,

      // ── 초기화 ──
      initPortfolio: (template, content) => {
        set((state) => {
          state.template = template;
          state.content = content;
          state.renderMeta = computeRenderMeta(template, content);
          state.previewMode = template.previewMode ?? "template";
          state.isDirty = false;
        });
      },

      // ── AI 응답 JSON 통째로 로드 ──
      loadFromAI: (aiResponse) => {
        set((state) => {
          const { portfolioTemplate, portfolioContent, renderMeta } = aiResponse;

          // fields/agentMeta 없는 블록에 기본 편집 메타 자동 주입
          portfolioTemplate.blocks = portfolioTemplate.blocks.map((block) =>
            normalizeBlockDefaults(block, portfolioTemplate.jobType)
          ) as typeof portfolioTemplate.blocks;

          // content가 없으면 template 기반으로 빈 값 자동 생성
          const content =
            portfolioContent ?? extractContentFromTemplate(portfolioTemplate);

          // templateId 불일치 보정
          if (content.templateId !== portfolioTemplate.id) {
            content.templateId = portfolioTemplate.id;
          }

          // template에는 있는데 content.values에 없는 블록은 빈 값으로 채워줌
          const existingIds = new Set(content.values.map((v) => v.blockId));
          for (const block of portfolioTemplate.blocks) {
            if (block.category === "template" && !existingIds.has(block.id)) {
              content.values.push({
                blockId: block.id,
                type: block.type,
                value: {} as never,
              });
            }
          }

          state.template   = portfolioTemplate;
          state.content    = content;
          state.renderMeta = renderMeta ?? computeRenderMeta(portfolioTemplate, content);
          state.previewMode = portfolioTemplate.previewMode ?? "template";

          // UI 상태 초기화
          state.selectedBlockId   = null;
          state.isDirty           = false;
        });
      },

      resetPortfolio: () => {
        set(() => ({ ...initialState }));
      },

      // ── 블록 추가 ──
      addBlock: (blockType, afterBlockId, parentBlockId) => {
        set((state) => {
          if (!state.template) {
            const templateId = `tpl-${Date.now()}`;
            state.template = {
              id: templateId,
              title: "Untitled Portfolio",
              version: 1,
              previewMode: "template",
              blocks: [],
            };
            state.content = {
              templateId,
              values: [],
            };
            state.previewMode = "template";
          }

          const blocks = state.template.blocks;

          // 위치가 지정되지 않은 블록은 현재 마지막 블록 다음에 추가한다.
          let insertOrder = blocks.reduce(
            (lastOrder, block) => Math.max(lastOrder, block.layout.order ?? -1),
            -1
          ) + 1;
          if (afterBlockId) {
            const target = blocks.find((b) => b.id === afterBlockId);
            if (target) insertOrder = (target.layout.order ?? 0) + 1;
          }

          // 새 블록 생성
          const newBlock = createDefaultBlock(
            blockType,
            insertOrder,
            state.template.jobType
          );

          // insertOrder 이후 블록들 order + 1
          for (const b of blocks) {
            if ((b.layout.order ?? 0) >= insertOrder) {
              b.layout.order = (b.layout.order ?? 0) + 1;
            }
          }

          blocks.push(newBlock);

          // 부모 블록 children에 추가
          if (parentBlockId) {
            const parent = blocks.find((b) => b.id === parentBlockId);
            if (parent) {
              parent.children = [...(parent.children ?? []), newBlock.id];
            }
          }

          // 콘텐츠 초기값 추가: layout 블록은 별도 content가 필요 없음
          if (newBlock.category === "template") {
            state.content?.values.push({
              blockId: newBlock.id,
              type: blockType,
              value: {} as never,
            });
          }

          state.renderMeta = computeRenderMeta(state.template, state.content!);
          state.selectedBlockId = newBlock.id;
          state.isDirty = true;
        });
      },

      // ── 블록 삭제 ──
      removeBlock: (blockId) => {
        set((state) => {
          if (!state.template) return;
          const block = state.template.blocks.find((b) => b.id === blockId);
          if (!block || !(block.agentMeta?.canDelete ?? true)) return;

          // 블록 및 하위 블록 모두 제거
          const idsToRemove = new Set<string>([blockId]);
          const collectChildren = (id: string) => {
            const b = state.template!.blocks.find((x) => x.id === id);
            b?.children?.forEach((childId) => {
              idsToRemove.add(childId);
              collectChildren(childId);
            });
          };
          collectChildren(blockId);

          state.template.blocks = state.template.blocks.filter(
            (b) => !idsToRemove.has(b.id)
          );

          // 다른 블록의 children에서도 제거
          for (const b of state.template.blocks) {
            if (b.children) {
              b.children = b.children.filter((id) => !idsToRemove.has(id));
            }
          }

          // 콘텐츠도 제거
          if (state.content) {
            state.content.values = state.content.values.filter(
              (v) => !idsToRemove.has(v.blockId)
            );
          }

          state.renderMeta = computeRenderMeta(state.template, state.content!);
          state.selectedBlockId = null;
          state.isDirty = true;
        });
      },

      // ── 블록 복제 ──
      duplicateBlock: (blockId) => {
        set((state) => {
          if (!state.template) return;
          const original = state.template.blocks.find((b) => b.id === blockId);
          if (!original || !BLOCK_REGISTRY[original.type].repeatable) return;

          const newId = `${original.type}-${Date.now()}`;
          const newBlock: AnyBlock = {
            ...JSON.parse(JSON.stringify(original)),
            id: newId,
            label: `${original.label} (복사)`,
            layout: {
              ...original.layout,
              order: (original.layout.order ?? 0) + 1,
            },
          };

          // 기존 블록들의 order 밀기
          for (const b of state.template.blocks) {
            if ((b.layout.order ?? 0) > (original.layout.order ?? 0)) {
              b.layout.order = (b.layout.order ?? 0) + 1;
            }
          }

          state.template.blocks.push(newBlock);

          // 콘텐츠 복제
          const originalContent = state.content?.values.find(
            (v) => v.blockId === blockId
          );
          if (originalContent && state.content) {
            state.content.values.push({
              ...JSON.parse(JSON.stringify(originalContent)),
              blockId: newId,
            });
          }

          state.renderMeta = computeRenderMeta(state.template, state.content!);
          state.isDirty = true;
        });
      },

      // ── 블록 위로 이동 ──
      moveBlockUp: (blockId) => {
        set((state) => {
          if (!state.template) return;
          const blocks = state.template.blocks;
          const block = blocks.find((b) => b.id === blockId);
          if (!block || !block.agentMeta?.canMove) return;

          const currentOrder = block.layout.order ?? 0;
          const prev = blocks
            .filter((b) => (b.layout.order ?? 0) < currentOrder)
            .sort((a, b) => (b.layout.order ?? 0) - (a.layout.order ?? 0))[0];

          if (prev) {
            const prevOrder = prev.layout.order ?? 0;
            prev.layout.order = currentOrder;
            block.layout.order = prevOrder;
            state.isDirty = true;
          }
        });
      },

      // ── 블록 아래로 이동 ──
      moveBlockDown: (blockId) => {
        set((state) => {
          if (!state.template) return;
          const blocks = state.template.blocks;
          const block = blocks.find((b) => b.id === blockId);
          if (!block || !block.agentMeta?.canMove) return;

          const currentOrder = block.layout.order ?? 0;
          const next = blocks
            .filter((b) => (b.layout.order ?? 0) > currentOrder)
            .sort((a, b) => (a.layout.order ?? 0) - (b.layout.order ?? 0))[0];

          if (next) {
            const nextOrder = next.layout.order ?? 0;
            next.layout.order = currentOrder;
            block.layout.order = nextOrder;
            state.isDirty = true;
          }
        });
      },

      // ── 블록 순서 재배치 (dnd-kit 결과 반영) ──
      reorderBlocks: (newOrderIds) => {
        set((state) => {
          if (!state.template) return;
          newOrderIds.forEach((id, index) => {
            const block = state.template!.blocks.find((b) => b.id === id);
            if (block) block.layout.order = index;
          });
          state.isDirty = true;
        });
      },

      // ── 레이아웃 변경 ──
      updateBlockLayout: (blockId, layout) => {
        set((state) => {
          const block = state.template?.blocks.find((b) => b.id === blockId);
          if (!block) return;
          block.layout = { ...block.layout, ...layout };
          state.isDirty = true;
        });
      },

      // ── 스타일 변경 ──
      updateBlockStyle: (blockId, style) => {
        set((state) => {
          const block = state.template?.blocks.find((b) => b.id === blockId);
          if (!block) return;
          block.style = { ...(block.style ?? {}), ...style };
          state.isDirty = true;
        });
      },

      // ── Props 변경 ──
      updateBlockProps: (blockId, props) => {
        set((state) => {
          const block = state.template?.blocks.find((b) => b.id === blockId);
          if (!block) return;
          block.props = { ...(block.props ?? {}), ...props };
          state.isDirty = true;
        });
      },

      // ── 숨김 토글 ──
      toggleBlockHidden: (blockId) => {
        set((state) => {
          const block = state.template?.blocks.find((b) => b.id === blockId);
          if (!block || !block.agentMeta?.canHide) return;
          block.layout.hidden = !block.layout.hidden;
          state.isDirty = true;
        });
      },

      // ── 콘텐츠 값 변경 ──
      updateContentValue: (blockId, key, value) => {
        set((state) => {
          if (!state.content || !state.template) return;
          const entry = state.content.values.find(
            (v) => v.blockId === blockId
          );
          if (entry) {
            (entry.value as Record<string, unknown>)[key] = value;
          } else {
            const block = state.template.blocks.find((b) => b.id === blockId);
            if (block) {
              state.content.values.push({
                blockId,
                type: block.type,
                value: { [key]: value } as never,
              });
            }
          }
          state.renderMeta = computeRenderMeta(state.template, state.content);
          state.isDirty = true;
        });
      },

      // ── UI 상태 ──
      setPreviewMode: (mode) => set({ previewMode: mode }),

      selectBlock: (blockId) => set({ selectedBlockId: blockId }),

      setIsSaving: (v) => set({ isSaving: v }),
      setIsGenerating: (v) => set({ isGenerating: v }),
      markClean: () => set({ isDirty: false }),
    })),
    // ── temporal 옵션 (undo/redo 대상 제한) ──
    {
      // UI 상태 변화는 undo 대상에서 제외
      partialize: (state) => ({
        template: state.template,
        content: state.content,
      }),
      limit: 50, // 최대 50단계 undo
    }
  )
);

// ─────────────────────────────────────────
// Undo / Redo 훅
// ─────────────────────────────────────────

export function usePortfolioHistory() {
  const store = usePortfolioStore.temporal.getState();
  return {
    undo: store.undo,
    redo: store.redo,
    clear: store.clear,
    canUndo: store.pastStates.length > 0,
    canRedo: store.futureStates.length > 0,
    pastCount: store.pastStates.length,
    futureCount: store.futureStates.length,
  };
}

// ─────────────────────────────────────────
// 자주 쓰는 selector 훅 모음
// ─────────────────────────────────────────

export const useTemplate = () =>
  usePortfolioStore((s) => s.template);

export const useContent = () =>
  usePortfolioStore((s) => s.content);

export const useSelectedBlock = () => {
  const selectedBlockId = usePortfolioStore((s) => s.selectedBlockId);
  const template = usePortfolioStore((s) => s.template);
  return selectedBlockId
    ? template?.blocks.find((b) => b.id === selectedBlockId) ?? null
    : null;
};

export const usePreviewMode = () =>
  usePortfolioStore((s) => s.previewMode);

export const useRenderMeta = () =>
  usePortfolioStore((s) => s.renderMeta);

export const useIsDirty = () =>
  usePortfolioStore((s) => s.isDirty);
