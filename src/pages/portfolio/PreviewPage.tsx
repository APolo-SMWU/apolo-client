import Header from "@/components/layout/Header";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PersonalCard from "@/pages/home/components/PersonalCard";
import ProfileBlock from "@/pages/portfolio/components/ProfileBlock";
import BlockRenderer from "@/pages/portfolio/components/BlockRenderer";
import { mockPortfolio } from "@/data/mockPortfolio";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import ShareButton from "@/pages/portfolio/components/ShareButton";
import UpdateButton from "@/pages/portfolio/components/UpdateButton";
import type { PortfolioDocument } from "@/types/portfolio";
import { getPortfolio, getSharedPortfolio, sharePortfolio, updatePortfolioContent } from "@/api/portfolio";
import { getCardField, getCardJob, getCardName } from "./cardData";

export default function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shareId } = useParams();
  const [side, setSide] = useState<"front" | "back">("front");
  const locationState = (location.state as { document?: PortfolioDocument; portfolioId?: number | string } | null) ?? null;
  const [document, setDocument] = useState<PortfolioDocument>(locationState?.document ?? mockPortfolio);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCardFlipping, setIsCardFlipping] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    if (locationState?.document) return;
    if (shareId) {
      void getSharedPortfolio(shareId).then(setDocument);
      return;
    }
    if (locationState?.portfolioId !== undefined) {
      void getPortfolio(locationState.portfolioId).then(setDocument);
    }
  }, [locationState?.document, locationState?.portfolioId, shareId]);

  async function handleUpdateContent() {
    if (typeof document.id !== "number") return;
    setIsUpdating(true);
    try {
      setDocument(await updatePortfolioContent(document.id));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleShare() {
    if (typeof document.id !== "number") return;
    try {
      const { shareUrl } = await sharePortfolio(document.id);
      await navigator.clipboard.writeText(shareUrl);
      setShareMessage("공유 링크를 복사했어요.");
      window.setTimeout(() => setShareMessage(""), 2000);
    } catch {
      setShareMessage("공유 링크를 만들지 못했어요.");
    }
  }
  const cardRole = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main className={`relative flex min-h-0 flex-1 flex-col overflow-auto text-focus ${side === "front" ? "bg-apolo px-6 pt-8 pb-0" : "bg-white p-0"}`}>
        {side === "front" ? (
          <div className="flex flex-1 items-center justify-center [perspective:1200px]">
            <div
              className="transition-[transform,opacity] duration-500 ease-in-out"
              onTransitionEnd={(event) => {
                if (event.currentTarget !== event.target || event.propertyName !== "transform" || !isCardFlipping) return;
                setSide("back");
                setIsCardFlipping(false);
              }}
              style={isCardFlipping ? { transform: "rotateY(-180deg)", opacity: 0 } : undefined}
            >
              <PersonalCard
                role={cardRole}
                name={getCardName(document)}
                job={getCardJob(document)}
                logoUrl={document.card.logoUrl}
                tel={getCardField(document, "tel")}
                phone={getCardField(document, "phone")}
                email={getCardField(document, "email")}
                address={document.card.organizationAddress ?? ""}
                design={document.cardDesignId === "bold" ? "bold" : "default"}
                onGoto={() => setIsCardFlipping(true)}
              />
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-1 flex-col bg-white text-ink">
            <header className="sticky top-0 z-10 flex shrink-0 items-center justify-between border-b border-ink bg-white px-7 py-4 text-body-01">
              <strong>{document.profile.name}</strong>
              <nav className="flex gap-8" aria-label="Website navigation">
                <a href="#about">About</a>
                <a href="#experience">Experiences</a>
                <a href="#works">Projects</a>
                <a href="#skills">Skills</a>
                <a href="#cv">CV</a>
              </nav>
            </header>
            <div className="flex w-full min-w-0 flex-1 items-start justify-between gap-8 p-4">
              <ProfileBlock profile={document.profile} userType={document.userType} />
              <div className="flex min-w-0 flex-1 flex-col">
                {document.blocks.map((block) => (
                  <div id={block.type} key={block.id}>
                    <BlockRenderer block={block} themeId={document.cardDesignId} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className="relative sticky bottom-0 z-10 mx-auto flex w-full max-w-[1200px] items-center justify-center bg-transparent px-4 py-2">
          {shareMessage && <p role="status" className="absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-full bg-focus px-3 py-2 text-center text-caption-01 text-primary">{shareMessage}</p>}
          <div className="flex items-center justify-center gap-4">
            <CardSideNavigation side={side} onSideChange={setSide} />
            {!shareId && (
              <>
                <UpdateButton onClick={() => void handleUpdateContent()} disabled={isUpdating || typeof document.id !== "number"} />
                <ModeButton
                  mode="preview"
                  onClick={() => navigate("/editor", { state: { document, side } })}
                />
                <ShareButton onClick={() => void handleShare()} />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
