import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WindowCard } from "@/components/WindowCard";
import CTAButton from "@/components/common/CTAButton";
import Button from "@/components/common/Button";

export default function CreateCompletePage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col p-10 items-center overflow-hidden gap-10">
        <WindowCard
          label="GENERATION_RESULT"
          variant="blue"
          className="relative z-10 w-[1200px]"
          bodyClassName="flex px-15 py-[30px] items-center justify-between"
        >
          <div className="flex flex-col gap-2 items-start">
            <h1 className="text-heading-01 font-bold text-ink leading-none">포트폴리오 생성 완료</h1>
            <p className="text-body-02 text-placeholder leading-none">AI가 아래과 같은 포트폴리오 초안을 생성했습니다.</p>
          </div>

          <CTAButton
            type="button"
            className="w-[170px] h-10"
            onClick={() => navigate(`/block-editor`)}
          >
            에디터로 이동
          </CTAButton>
        </WindowCard>

        <div className="flex w-[1200px] h-100 items-center justify-between">
          {/* 포트폴리오 블록 리스트 */}
          <WindowCard
            label="SUMMARY"
            variant="black"
            className="relative z-10 w-[430px] h-full"
            bodyClassName="flex flex-col p-5 items-start gap-5"
          >
            <div className="flex flex-col items-start gap-2">
              <h2 className="text-heading-03 font-bold text-ink leading-none">생성된 포트폴리오 요약</h2>
              <p className="text-body-01 text-ink">제목: </p>
            </div>

            <div className="flex flex-col items-start">
              <p className="text-body-01 text-in">구성:</p>
              <ul className="list-disc pl-4 text-body-01 text-ink whitespace-nowrap text-start">
              <li></li>
            </ul>
            </div>
          </WindowCard>

          {/* 레이아웃 미리보기 */}
          <WindowCard
            label="GENERATION_PREVIEW"
            variant="blue"
            className="relative z-10 w-[720px] h-full"
            bodyClassName="p-10"
          >
            <div>
              
            </div>
          </WindowCard>
        </div>

        <div className="flex items-center justify-center gap-60">
          <Button
            type="button"
            className="w-[210px] h-10"
            onClick={() => navigate(`/generate-loading`)}
          >
            다시 생성하기
          </Button>

          <Button
            type="button"
            className="w-[210px] h-10"
            onClick={() => navigate(`/prompt`)}
          >
            프롬프트 수정하기
          </Button>

          <Button
            type="button"
            className="w-[210px] h-10"
            onClick={() => navigate(`/block-editor`)}
          >
            에디터로 이동하기
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
};