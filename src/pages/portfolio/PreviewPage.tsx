import Header from "@/components/layout/Header";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PersonalCard from "@/pages/home/components/PersonalCard";
import ProfileBlock from "@/pages/portfolio/components/ProfileBlock";
import BlockRenderer from "@/pages/portfolio/components/BlockRenderer";
import { mockPortfolio } from "@/data/mockPortfolio";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import ShareButton from "@/pages/portfolio/components/ShareButton";
import UpdateButton from "@/pages/portfolio/components/UpdateButton";
import type { PortfolioDocument } from "@/types/portfolio";

export default function PreviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [side, setSide] = useState<"front" | "back">("front");
  const document = (location.state as { document?: PortfolioDocument } | null)?.document ?? mockPortfolio;
  const profileValue = (kind: string) => document.profile.fields.find((field) => field.kind === kind)?.value ?? "";

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main className={`relative flex min-h-0 flex-1 flex-col overflow-hidden text-focus ${side === "front" ? "bg-apolo px-6 py-8" : "bg-white p-0"}`}>
        <div className="fixed inset-x-0 top-24 z-20 flex justify-center">
          <UpdateButton />
        </div>
        <div className="fixed right-6 top-24 z-20">
          <ModeButton
            mode="preview"
            onClick={() => navigate("/editor", { state: { document, side } })}
          />
        </div>
        {side === "front" ? 
          <div className="flex flex-1 items-center justify-center">
            <PersonalCard 
              role="Professional"
              name={document.profile.name}
              job={document.profile.title}
              tel={profileValue("company")}
              phone={profileValue("phone")}
              email={profileValue("email")}
              address={profileValue("university")} 
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
        <div className="fixed bottom-8 right-6 z-20">
          <ShareButton />
        </div>
      </main>
    </div>
  )
}
