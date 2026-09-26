import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import CreateModal from "./components/CreateModal";
import CardPreview from "./components/CardPreview";
import PersonalCard, { type PersonalCardProps } from "./components/PersonalCard";
import Modal from "@/components/common/Modal";
import LinkIcon from "@/assets/Link.svg?react";
import { deletePortfolio, getPortfolio, getPortfolios, sharePortfolio } from "@/api/portfolio";
import type { PortfolioDocument } from "@/types/portfolio";

type ActiveModal = {
  type: "delete" | "share";
  portfolioId: number | string;
} | null;

export default function HomePage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioDocument[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    getPortfolios()
      .then((summaries) => Promise.all(summaries.map(({ id }) => getPortfolio(id))))
      .then((documents) => {
        if (!cancelled) setPortfolios(documents);
      })
      .catch(() => {
        if (!cancelled) setErrorMessage("온라인 명함을 불러오지 못했어요.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  function toPersonalCard(document: PortfolioDocument): PersonalCardProps {
    const role = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";
    const profileValue = (kind: string) => document.profile.fields.find((field) => field.kind === kind)?.value ?? "";
    return {
      role,
      name: document.profile.name,
      job: document.profile.title,
      tel: profileValue("tel"),
      phone: profileValue("phone"),
      email: profileValue("email"),
      address: document.card.organizationAddress ?? "",
    } as PersonalCardProps;
  }

  async function handleShare(portfolioId: number | string) {
    setActiveModal({ type: "share", portfolioId });
    setShareLink("");
    setIsCopied(false);
    try {
      const result = await sharePortfolio(portfolioId);
      setShareLink(result.shareUrl);
    } catch {
      setShareLink("공유 링크를 생성하지 못했어요.");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 flex-col items-start overflow-hidden px-8 md:py-16 py-8 gap-16">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start justify-center gap-2">
            <h1 className="md:text-display-01 text-heading-03 font-bold text-focus leading-none">My Personal Card</h1>
            <p className="md:text-body-02 text-caption-01 text-[#4DA3FF] leading-none">나의 온라인 명함을 관리할 수 있어요.</p>
            <div className="flex items-start justify-center gap-4">
              <div className="flex items-center justify-center gap-1">
                <div className="w-[10px] h-[10px] rounded-full bg-danger" />
                <p className="md:text-body-02 text-caption-01 text-surface leading-none">Delete</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-[10px] h-[10px] rounded-full bg-warn" />
                <p className="md:text-body-02 text-caption-01 text-surface leading-none">Edit</p>
              </div>
              <div className="flex items-center justify-center gap-1">
                <div className="w-[10px] h-[10px] rounded-full bg-success" />
                <p className="md:text-body-02 text-caption-01 text-surface leading-none">Share</p>
              </div>
            </div>
          </div>
          <Button 
            type="button"
            className="md:w-[140px] w-[100px]"
            onClick={() => navigate("/select")}
          >
            + 만들기
          </Button>
        </div>

        {errorMessage ? <p role="alert" className="text-body-02 text-danger">{errorMessage}</p> : portfolios.length === 0 ? (
          <CreateModal />
        ) : (
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[repeat(2,minmax(0,424px))] md:justify-between xl:grid-cols-[repeat(3,minmax(0,424px))]">
            {portfolios.map((document) => (
              <CardPreview
                key={document.id}
                title={document.title}
                onOpen={() => navigate("/preview", { state: { document } })}
                onEdit={() => navigate("/editor", { state: { document } })}
                onDelete={() => setActiveModal({ type: "delete", portfolioId: document.id })}
                onShare={() => void handleShare(document.id)}
              >
                <PersonalCard {...toPersonalCard(document)} />
              </CardPreview>
            ))}
          </div>
        )}
      </main>
      {activeModal ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setActiveModal(null);
            }
          }}
        >
          {activeModal.type === "delete" ? (
            <Modal
              title="이 명함을 삭제하시겠습니까?"
              description="삭제 후 복구는 불가능합니다."
              onCancel={() => setActiveModal(null)}
              onConfirm={async () => {
                if (!activeModal) return;
                await deletePortfolio(activeModal.portfolioId);
                setPortfolios((current) => current.filter((document) => document.id !== activeModal.portfolioId));
                setActiveModal(null);
              }}
            />
          ) : null}

          {activeModal.type === "share" ? (
            <Modal
              title="이 명함을 공유하시겠습니까?"
              description="링크나 QR 코드로 명함을 공유할 수 있습니다."
            >
              {/* 링크 복사 입력창, QR 코드 */}
              <div className="flex flex-col w-full gap-4 items-center justify-center">
                <div 
                  className={`flex w-full h-10 items-center justify-between px-4 rounded-ml border border-primary ${
                    isCopied ? "bg-focus" : "bg-white"
                  }`}
                >
                  <p className="break-all text-body-02 font-semibold text-ink">{shareLink || "공유 링크를 생성하는 중…"}</p>
                  <button
                    type="button"
                    aria-label="링크 복사"
                    onClick={async () => {
                      if (!shareLink) return;
                      await navigator.clipboard.writeText(shareLink);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 1500);
                    }}
                  >
                    <LinkIcon className="size-5" />
                  </button>
                </div>
              </div>
            </Modal>
          ) : null}
        </div>
      ) : null}
      <Footer />
    </div>
  )
}
