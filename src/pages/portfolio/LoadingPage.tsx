import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Lottie, type LottieHandle } from "lottie-react";
import loadingAnimation from "@/assets/loading-animation.json";
import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { PortfolioDocument } from "@/types/portfolio";

export default function LoadingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const lottieRef = useRef<LottieHandle>(null);
  const directionRef = useRef<"forward" | "reverse">("forward");

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      const state = (location.state as { document?: PortfolioDocument } | null) ?? null;
      navigate("/preview", { state: { document: state?.document }, replace: true });
    }, 5000);

    return () => window.clearTimeout(timeoutId);
  }, [location.state, navigate]);

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
      <main className="flex flex-1 items-center justify-center overflow-hidden">
        <Lottie
          src={loadingAnimation}
          loop={false}
          autoplay
          segment={[0, 80]}
          lottieRef={lottieRef}
          subscriptions={{ frame: handleAnimationFrame }}
          role="status"
          aria-label="로딩 중"
          className="w-[min(433px,80vw)]"
        />
      </main>
      <Footer />
    </div>
  )
}
