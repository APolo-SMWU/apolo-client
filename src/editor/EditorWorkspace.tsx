import { useState } from "react";

import { WindowCard } from "@/components/WindowCard";
import { BlockRenderer } from "./components/BlockRenderer";
import { BlockToolbar } from "./components/editor/BlockToolbar";
import { SortableBlockList } from "./components/editor/SortableBlockWrapper";
import { useSortableBlocks } from "./components/editor/useSortableBlocks";
import { usePortfolioStore } from "./store/portfolioStore";
import { BLOCK_REGISTRY } from "./types/block-registry";
import type { BlockType } from "./types/block.types";
import { getRootBlocks } from "./types/portfolio.types";

const BLOCK_TYPES = Object.keys(BLOCK_REGISTRY) as BlockType[];

export function EditorWorkspace() {
  const [isAdding, setIsAdding] = useState(false);
  const template = usePortfolioStore((state) => state.template);
  const content = usePortfolioStore((state) => state.content);
  const selectedBlockId = usePortfolioStore((state) => state.selectedBlockId);
  const selectBlock = usePortfolioStore((state) => state.selectBlock);
  const addBlock = usePortfolioStore((state) => state.addBlock);
  const removeBlock = usePortfolioStore((state) => state.removeBlock);
  const duplicateBlock = usePortfolioStore((state) => state.duplicateBlock);
  const moveBlockUp = usePortfolioStore((state) => state.moveBlockUp);
  const moveBlockDown = usePortfolioStore((state) => state.moveBlockDown);
  const toggleBlockHidden = usePortfolioStore((state) => state.toggleBlockHidden);
  const reorderBlocks = usePortfolioStore((state) => state.reorderBlocks);
  const updateContentValue = usePortfolioStore((state) => state.updateContentValue);
  const { activeBlockId, onDragStart, onDragEnd, onReorder } = useSortableBlocks({
    onReorder: reorderBlocks,
  });

  const rootBlocks = template ? getRootBlocks(template) : [];

  return (
    <section className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)] gap-6 overflow-hidden">
      <WindowCard
        label="BLOCK_LIST"
        variant="black"
        className="relative z-10 w-[300px] self-start"
        bodyClassName="flex flex-col px-6 py-9 gap-5"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-heading-03 font-bold text-ink">블록 목록</h2>
          <span className="text-caption-01 text-placeholder">{rootBlocks.length}</span>
        </div>
        <div className="flex max-h-[calc(100dvh-22rem)] flex-col gap-3 overflow-y-auto">
          {rootBlocks.map((block) => (
            <button
              key={block.id}
              type="button"
              onClick={() => selectBlock(block.id)}
              className={`border h-10 px-4 text-left text-body-01 transition-colors ${
                selectedBlockId === block.id
                  ? "border-primary bg-focus"
                  : "border-ink bg-white hover:bg-focus"
              }`}
            >
              {block.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setIsAdding((current) => !current)}
          className="border border-ink bg-white h-10 px-4 text-left text-body-01 font-bold hover:bg-primary hover:text-white"
        >
          + 블록 추가
        </button>
        {isAdding && (
          <div className="grid max-h-48 grid-cols-2 gap-2 overflow-y-auto">
            {BLOCK_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className="border border-ink bg-white px-2 py-2 text-caption-01 hover:bg-focus"
                onClick={() => {
                  addBlock(type);
                  setIsAdding(false);
                }}
              >
                {BLOCK_REGISTRY[type].label}
              </button>
            ))}
          </div>
        )}
      </WindowCard>

      <div className="min-h-0 overflow-y-auto border border-ink bg-surface p-4">
        <div className="w-full bg-white p-6 shadow-sm">
          {template && content ? (
            <SortableBlockList
              blocks={rootBlocks}
              activeBlockId={activeBlockId}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onReorder={onReorder}
              renderOverlay={(block) => <span>{block.label}</span>}
            >
              {(block, index) => (
                <div
                  key={block.id}
                  className={`relative p-4 ${selectedBlockId === block.id ? "outline outline-2 outline-offset-8 outline-primary" : ""}`}
                  onClick={() => selectBlock(block.id)}
                >
                  <BlockToolbar
                    block={block}
                    isFirst={index === 0}
                    isLast={index === rootBlocks.length - 1}
                    onMoveUp={moveBlockUp}
                    onMoveDown={moveBlockDown}
                    onDuplicate={duplicateBlock}
                    onDelete={removeBlock}
                    onToggleHidden={toggleBlockHidden}
                  />
                  <BlockRenderer
                    block={block}
                    content={content}
                    previewMode="template"
                    allBlocks={template.blocks}
                    editable
                    selectedBlockId={selectedBlockId ?? undefined}
                    onSelectBlock={selectBlock}
                    onContentChange={updateContentValue}
                  />
                </div>
              )}
            </SortableBlockList>
          ) : (
            <p className="text-body-02 text-placeholder">포트폴리오를 불러오는 중입니다.</p>
          )}
        </div>
      </div>

    </section>
  );
}
