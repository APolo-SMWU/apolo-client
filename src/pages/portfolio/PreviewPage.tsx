import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WindowCard } from "@/components/WindowCard";
import EditIcon from "@/assets/Edit.svg?react";
import Button from "@/components/common/Button";
import { PreviewRenderer } from "@/editor/components/PreviewRenderer";
import { usePortfolioStore } from "@/editor/store/portfolioStore";

export default function PreviewPage() {
  const navigate = useNavigate();
  const template = usePortfolioStore((state) => state.template);
  const content = usePortfolioStore((state) => state.content);

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
              onClick={() => navigate(`/block-editor`)}
            >
              수정하기
            </Button>
             <Button
              className="w-25 h-8"
              onClick={() => navigate(``)}
            >
              되돌리기
            </Button>
          </WindowCard>

        </section>

        {/* 포트폴리오 미리보기 영역 */}
        <section className="min-h-0 w-full flex-1 overflow-y-auto border border-ink bg-surface p-6">
          {template && content ? (
            <PreviewRenderer
              template={template}
              content={content}
              previewMode="filled"
            />
          ) : (
            <div className="flex h-full min-h-80 items-center justify-center bg-white text-body-02 text-placeholder">
              미리볼 포트폴리오가 없습니다.
            </div>
          )}
        </section>

      </main>
      <Footer />
    </div>
  )
};
