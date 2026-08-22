// ============================================================
// APolo Portfolio - PreviewRenderer
// PortfolioTemplate 전체를 받아 root 블록부터 순서대로 렌더링
// ============================================================

import type {
  PortfolioTemplate,
  PortfolioContentDocument,
} from "../types/portfolio.types";
import type { PreviewMode } from "../types/block.types";
import { getRootBlocks } from "../types/portfolio.types";
import { BlockRenderer } from "./BlockRenderer";

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface PreviewRendererProps {
  template: PortfolioTemplate;
  content: PortfolioContentDocument | null;
  previewMode?: PreviewMode;
  /** 에디터 모드: 블록 선택/클릭 UI 활성화 */
  editable?: boolean;
  selectedBlockId?: string;
  onSelectBlock?: (blockId: string) => void;
  onContentChange?: (blockId: string, key: string, value: unknown) => void;
  className?: string;
}

// ─────────────────────────────────────────
// Template 모드 안내 배너
// ─────────────────────────────────────────

function TemplateModeBanner() {
  return (
    <div className="flex items-center gap-3 border-b border-primary bg-focus px-6 py-3 text-body-02 text-ink" role="status" aria-live="polite">
      <span className="inline-flex items-center bg-primary px-2 py-0.5 text-caption-01 font-semibold tracking-wide text-white">템플릿 모드</span>
      <p>각 블록에 내용을 입력하면 포트폴리오가 완성됩니다.</p>
    </div>
  );
}

// ─────────────────────────────────────────
// 빈 상태
// ─────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex h-80 items-center justify-center text-title-02 text-placeholder">
      <p>아직 블록이 없습니다. AI에게 포트폴리오 생성을 요청해보세요.</p>
    </div>
  );
}

// ─────────────────────────────────────────
// PreviewRenderer
// ─────────────────────────────────────────

export function PreviewRenderer({
  template,
  content,
  previewMode,
  editable = false,
  selectedBlockId,
  onSelectBlock,
  onContentChange,
  className,
}: PreviewRendererProps) {
  const mode: PreviewMode = previewMode ?? template.previewMode ?? "template";
  const rootBlocks = getRootBlocks(template);

  return (
    <div
      className={[
        "min-h-screen w-full bg-white",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-template-id={template.id}
      data-preview-mode={mode}
    >
      {/* 템플릿 모드일 때 안내 배너 */}
      {mode === "template" && <TemplateModeBanner />}

      {/* 블록이 없을 때 */}
      {rootBlocks.length === 0 && <EmptyState />}

      {/* 루트 블록 순서대로 렌더링 */}
      <div className="flex flex-col">
        {rootBlocks.map((block) => (
          <BlockRenderer
            key={block.id}
            block={block}
            content={content}
            previewMode={mode}
            allBlocks={template.blocks}
            onContentChange={onContentChange}
            editable={editable}
            selectedBlockId={selectedBlockId}
            onSelectBlock={onSelectBlock}
          />
        ))}
      </div>
    </div>
  );
}

export default PreviewRenderer;
