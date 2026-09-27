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
import { deletePortfolio, getPortfolio, getPortfolios, sharePortfolio, updatePortfolio } from "@/api/portfolio";
import type { PortfolioDocument } from "@/types/portfolio";
import { getCardField, getCardJob, getCardName } from "@/pages/portfolio/cardData";
import { normalizePortfolioTitle } from "./homeTitle";
import ShareQrCode from "./components/ShareQrCode";

type ActiveModal = {
  type: "delete" | "share";
  portfolioId: number | string;
} | {
  type: "edit";
  document: PortfolioDocument;
} | null;

export default function HomePage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [portfolios, setPortfolios] = useState<PortfolioDocument[]>([]);
  const [shareLink, setShareLink] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [titleDraft, setTitleDraft] = useState("");
  const [isSavingTitle, setIsSavingTitle] = useState(false);
  const [titleError, setTitleError] = useState("");
  const canCopyShareLink = shareLink.startsWith("http");

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
    return {
      role,
      name: getCardName(document),
      job: getCardJob(document),
      logoUrl: document.card.logoUrl,
      tel: getCardField(document, "tel"),
      phone: getCardField(document, "phone"),
      email: getCardField(document, "email"),
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

  async function handleTitleUpdate() {
    if (isSavingTitle || activeModal?.type !== "edit") return;
    const title = normalizePortfolioTitle(titleDraft);
    if (!title) {
      setTitleError("제목을 입력해주세요.");
      return;
    }

    setIsSavingTitle(true);
    setTitleError("");
    try {
      const savedDocument = await updatePortfolio(activeModal.document.id, { title });
      setPortfolios((current) => current.map((document) => (
        document.id === savedDocument.id ? savedDocument : document
      )));
      setActiveModal(null);
    } catch {
      setTitleError("제목을 수정하지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSavingTitle(false);
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
                onEdit={() => {
                  setTitleDraft(document.title);
                  setTitleError("");
                  setActiveModal({ type: "edit", document });
                }}
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
          {activeModal.type === "edit" ? (
            <Modal
              title="명함 제목 수정"
              description="명함에 표시할 제목을 입력해주세요."
              onCancel={() => setActiveModal(null)}
              onConfirm={() => void handleTitleUpdate()}
            >
              <div className="flex w-full flex-col gap-2">
                <label htmlFor="portfolio-title" className="text-body-02 text-ink">title</label>
                <input
                  id="portfolio-title"
                  type="text"
                  value={titleDraft}
                  onChange={(event) => {
                    setTitleDraft(event.target.value);
                    setTitleError("");
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      void handleTitleUpdate();
                    }
                  }}
                  disabled={isSavingTitle}
                  className="min-h-11 w-full rounded-ml border border-placeholder bg-transparent px-4 text-body-02 outline-none focus:border-primary"
                />
                {titleError ? <p role="alert" className="text-caption-01 text-danger">{titleError}</p> : null}
                {isSavingTitle ? <p role="status" className="text-caption-01 text-placeholder">저장 중…</p> : null}
              </div>
            </Modal>
          ) : activeModal.type === "delete" ? (
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
              <div className="flex w-full flex-col items-center justify-center gap-4">
                <div className={`flex min-h-12 w-full min-w-0 items-center gap-3 rounded-ml border border-primary px-3 ${isCopied ? "bg-focus" : "bg-white"}`}>
                  <p
                    className="min-w-0 flex-1 truncate text-caption-01 text-ink"
                    title={shareLink || undefined}
                    aria-live="polite"
                  >
                    {shareLink || "공유 링크를 생성하는 중…"}
                  </p>
                  <button
                    type="button"
                    aria-label={isCopied ? "링크 복사됨" : "링크 복사"}
                    disabled={!canCopyShareLink}
                    onClick={async () => {
                      if (!canCopyShareLink) return;
                      await navigator.clipboard.writeText(shareLink);
                      setIsCopied(true);
                      setTimeout(() => setIsCopied(false), 1500);
                    }}
                    className="flex h-8 shrink-0 items-center justify-center rounded-md bg-transparent px-2 text-ink transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-default disabled:opacity-40 disabled:hover:text-ink"
                  >
                    <LinkIcon className="size-5" />
                  </button>
                </div>
                <ShareQrCode value={shareLink.startsWith("http") ? shareLink : ""} />
              </div>
            </Modal>
          ) : null}
        </div>
      ) : null}
      <Footer />
    </div>
  )
}
