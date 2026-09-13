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

export default function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { shareId } = useParams();
  const [side, setSide] = useState<"front" | "back">("front");
  const locationState = (location.state as { document?: PortfolioDocument; portfolioId?: number | string } | null) ?? null;
  const [document, setDocument] = useState<PortfolioDocument>(locationState?.document ?? mockPortfolio);
  const [isUpdating, setIsUpdating] = useState(false);
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
  const profileValue = (kind: string) => document.profile.fields.find((field) => field.kind === kind)?.value ?? "";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main className={`relative flex min-h-0 flex-1 flex-col overflow-hidden text-focus ${side === "front" ? "bg-apolo px-6 py-8" : "bg-white p-0"}`}>
        {!shareId && <div className="fixed inset-x-0 top-24 z-20 flex justify-center">
          <UpdateButton onClick={() => void handleUpdateContent()} disabled={isUpdating || typeof document.id !== "number"} />
        </div>}
        {!shareId && <div className="fixed right-6 top-24 z-20">
          <ModeButton
            mode="preview"
            onClick={() => navigate("/editor", { state: { document, side } })}
          />
        </div>}
        {side === "front" ? 
          <div className="flex flex-1 items-center justify-center">
            <PersonalCard 
              role="Professional"
              name={document.profile.name}
              job={document.profile.title}
              tel={profileValue("company")}
              phone={profileValue("phone")}
              email={profileValue("email")}
              address={document.card.organizationAddress ?? ""}
            />
          </div> 
        : 
          <div className="flex min-h-0 w-full flex-1 flex-col overflow-auto bg-white text-ink">
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
              <ProfileBlock profile={document.profile} />
              <div className="flex min-w-0 flex-1 flex-col">
                {document.blocks.map((block) => 
                  <div 
                    id={block.type}
                    key={block.id}
                  >
                    <BlockRenderer block={block} />
                  </div>
                )}
              </div>
            </div>
          </div>}
        <div className="fixed bottom-8 left-1/2 z-20 -translate-x-1/2">
          <CardSideNavigation side={side} onSideChange={setSide} />
        </div>
        {!shareId && <div className="fixed bottom-8 right-6 z-20">
          <ShareButton onClick={() => void handleShare()} />
        </div>}
        {shareMessage && <p role="status" className="fixed bottom-8 right-20 z-20 rounded-full bg-focus px-3 py-2 text-caption-01 text-primary">{shareMessage}</p>}
      </main>
    </div>
  )
}
