import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTAButton from "@/components/common/CTAButton";
import { Lottie, type LottieHandle } from "lottie-react";
import loadingAnimation from "@/assets/loading-animation.json";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getPortfolioCreation } from "@/api/portfolio";
import type { PortfolioDocument } from "@/types/portfolio";

type LoadingLocationState = {
  requestId?: string;
  cardDesignId?: string;
};

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const lottieRef = useRef<LottieHandle>(null);
  const directionRef = useRef<"forward" | "reverse">("forward");
  const [error, setError] = useState("");
  const loadingState = (location.state as LoadingLocationState | null) ?? null;
  const requestId = loadingState?.requestId;
  const displayError = error || (!requestId ? "생성 요청을 찾을 수 없어요." : "");

  useEffect(() => {
    if (!requestId) return;

    let isCurrent = true;
    getPortfolioCreation(requestId)
      .then((document) => {
        if (!isCurrent) return;
        navigate("/preview", {
          state: {
            document: {
              ...(document as PortfolioDocument),
              ...(loadingState?.cardDesignId ? { cardDesignId: loadingState.cardDesignId } : {}),
            },
          },
          replace: true,
        });
      })
      .catch((reason: unknown) => {
        if (!isCurrent) return;
        setError(reason instanceof Error ? reason.message : "포트폴리오 생성에 실패했어요.");
      });

    return () => {
      isCurrent = false;
    };
  }, [navigate, requestId]);

  function handleAnimationFrame({ currentFrame }: { currentFrame: number }) {
    const isMovingForward = directionRef.current === "forward";
    const isAtDirectionEnd = isMovingForward ? currentFrame >= 78 : currentFrame <= 2;

    if (isAtDirectionEnd) {
      const nextDirection = isMovingForward ? "reverse" : "forward";
      directionRef.current = nextDirection;
      lottieRef.current?.setDirection(nextDirection);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="flex flex-1 flex-col items-center justify-center gap-6 overflow-hidden px-4">
        {displayError ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <p role="alert" className="text-body-01 text-danger">{displayError}</p>
            <CTAButton type="button" onClick={() => navigate("/create", { replace: true })}>
              다시 만들기
            </CTAButton>
          </div>
        ) : (
          <Lottie
            src={loadingAnimation}
            loop={false}
            autoplay
            segment={[0, 80]}
            lottieRef={lottieRef}
            subscriptions={{ frame: handleAnimationFrame }}
            role="status"
            aria-label="생성 중"
            className="w-[min(433px,80vw)]"
          />
        )}
      </main>
      <Footer />
    </div>
  )
}
