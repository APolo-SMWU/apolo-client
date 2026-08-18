import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WindowCard } from "@/components/WindowCard";
import StepItem from "./components/StepItem";
import Button from "@/components/common/Button";

const steps = [
  "입력 정보 분석",
  "포트폴리오 구조 생성",
  "섹션별 내용 작성",
  "디자인 블록 구성",
  "최종 레이아웃 검증",
];

export default function GenerateLoadingPage() {
  const navigate = useNavigate();
  const duration = 15000;
  const totalSeconds = 30;
  const [progress, setProgress] = useState(0);
  const remainingSeconds = Math.max(
    0,
    Math.ceil(totalSeconds * (1 - progress / 100))
  );
  const isComplete = progress >= 100;

  useEffect(() => {
    let frameId = 0;
    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const eased = 1 - Math.pow(1 - t, 3);

      setProgress(eased * 100);

      if (t < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, []);

  const currentStepIndex = Math.min(
    Math.floor((progress / 100) * steps.length),
    steps.length - 1,
  );

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden">
        {/* 배경글씨 TOP */}
        <div className="pointer-events-none absolute left-10 top-10 z-0 select-none leading-none text-ink/6">
          <p className="text-[80px]">GENERATING</p>
          <p className="ml-20 text-[70px]">PROGRESS</p>
        </div>

        {/* 배경글씨 BOTTOM*/}
        <div className="pointer-events-none absolute right-10 bottom-10 z-0 select-none leading-none text-ink/6">
          <p className="mr-20 text-[80px] text-end">PLEASE</p>
          <p className="text-[70px]">WAIT A MOMENT</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-5">
          <WindowCard
            label="GENERATION_PROGRESS"
            variant="blue"
            className="relative z-10 w-[780px]"
            bodyClassName="flex flex-col py-8 gap-8 items-center justify-center"
          >
            <div className="flex flex-col items-center justify-center gap-2">
              <h1 className="text-heading-01 font-bold text-ink leading-none">포트폴리오 생성 중...</h1>
              <p className="text-body-02 text-placeholder">AI가 입력 정보를 분석하고 검증 가능한 블록 구조를 만들고 있습니다.</p>
            </div>

            {/* progress bar */}
            <div className="flex flex-col gap-[10px] items-center justify-center">
              <div className="w-150 h-5 border border-ink">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-body-02 text-placeholder">예상 소요 시간: {remainingSeconds}초</p>
            </div>

            {/* process status */}
            <div className="flex flex-col gap-3 items-start justify-center">
              {steps.map((label, index) => (
                <StepItem
                  key={label}
                  label={label}
                  checked={index <= currentStepIndex}
                />
              ))}
            </div>
          </WindowCard>
          <Button
            type="button"
            className={`w-[210px] h-11 ${isComplete ? "!bg-primary !text-white font-bold" : ""}`}
            onClick={() => {
              if (isComplete) {
                navigate(`/create-complete`);
                return;
              }
              navigate(-1);
            }}
          >
            {isComplete ? "완료!" : "취소하기"}
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  )
};