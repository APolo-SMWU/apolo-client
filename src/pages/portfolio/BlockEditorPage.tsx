import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WindowCard } from "@/components/WindowCard";
import EditIcon from "@/assets/Edit.svg?react";
import Button from "@/components/common/Button";
import ArrowIcon from "@/assets/Arrow-up.svg?react";
import { EditorWorkspace } from "@/editor/EditorWorkspace";
import { normalizePortfolioTemplate } from "@/editor/normalizePortfolio";
import { usePortfolioStore } from "@/editor/store/portfolioStore";

const editorFixture = normalizePortfolioTemplate({
  id: "tpl-frontend-developer-project-focused",
  version: 1,
  previewMode: "template",
  blocks: [
    {
      id: "hero-01",
      type: "hero",
      layout: { order: 1, span: 12, padding: 48 },
      style: { variant: "highlight", emphasis: "high" },
      repeatable: false,
      props: { showCta: true, showImage: true },
    },
  ],
});

export default function BlockEditorPage() {
  const navigate = useNavigate();
  const template = usePortfolioStore((state) => state.template);
  const initPortfolio = usePortfolioStore((state) => state.initPortfolio);

  useEffect(() => {
    if (!template) {
      initPortfolio(editorFixture.template, editorFixture.content);
    }
  }, [initPortfolio, template]);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden p-10">

        {/* 상단 바 */}
        <section className="flex w-full items-center justify-between">
          <WindowCard
            label="EDIT_NAME"
            variant="blue"
            className="relative z-10 w-[240px]"
            bodyClassName="flex p-3 items-center justify-between"
          >
            <input
              className="h-6 text-body-02 text-ink placeholder:text-placeholder leading-none"
              placeholder="프론트엔드 포트폴리오"
            />
            <EditIcon
              className="size-5"
            />

          </WindowCard>

          <WindowCard
            label="EDITOR_ACTIONS"
            variant="black"
            className="relative z-10"
            bodyClassName="flex px-5 py-2 gap-4 items-center justify-center"
          >
            <Button
              className="w-25 h-8"
              onClick={() => navigate(``)}
            >
              저장
            </Button>
             <Button
              className="w-25 h-8"
              onClick={() => navigate(`/preview`)}
            >
              미리보기
            </Button>
             <Button
              className="w-25 h-8"
              onClick={() => navigate(``)}
            >
              되돌리기
            </Button>
             <Button
              className="w-25 h-8"
              onClick={() => navigate(``)}
            >
              공유
            </Button>
          </WindowCard>

        </section>

        {/* 포트폴리오 블록 에디터 */}
        <section className="min-h-0 w-full flex-1">
          <EditorWorkspace />
        </section>

      </main>

      {/* AI 수정 입력 */}
      <section className="fixed inset-x-0 bottom-2.5 z-50 flex justify-center px-4">
        <WindowCard
          label="EDIT_REQUEST"
          variant="blue"
          className="w-full max-w-[665px]"
          bodyClassName="flex w-full items-center gap-5 px-5 py-[10px]"
        >
          <span className="text-body-02 font-bold leading-6 whitespace-nowrap text-ink">
            AI 수정 입력
          </span>
          <textarea
            rows={1}
            className="min-h-6 max-h-24 flex-1 resize-none overflow-y-auto border-0 bg-transparent p-0 text-body-02 leading-6 text-ink outline-none placeholder:text-placeholder [scrollbar-color:var(--color-focus)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-surface [&::-webkit-scrollbar-track]:bg-transparent"
            placeholder="예: 프로젝트 설명을 더 간결하게 바꿔줘"
            onInput={(event) => {
              const textarea = event.currentTarget;
              textarea.style.height = "0px";
              textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
            }}
          />
          <button
            type="button"
            className="flex size-[30px] shrink-0 items-center justify-center border border-ink bg-placeholder"
            aria-label="AI 수정 요청 보내기"
          >
            <ArrowIcon className="size-6" />
          </button>
        </WindowCard>
      </section>
      <Footer />
    </div>
  )
};
