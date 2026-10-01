import Header from "@/components/layout/Header";
import { useEffect, useState, type MouseEvent } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { LoaderCircle } from "lucide-react";
import PersonalCard from "@/pages/home/components/PersonalCard";
import ProfileBlock from "@/pages/portfolio/components/ProfileBlock";
import BlockRenderer from "@/pages/portfolio/components/BlockRenderer";
import CardSideNavigation from "@/pages/portfolio/components/CardSideNavigation";
import ModeButton from "@/pages/portfolio/components/ModeButton";
import ShareButton from "@/pages/portfolio/components/ShareButton";
import UpdateButton from "@/pages/portfolio/components/UpdateButton";
import Modal from "@/components/common/Modal";
import type { PortfolioDocument } from "@/types/portfolio";
import type { ApiErrorResponse } from "@/api/api";
import { exportPortfolioFrontImage, generatePortfolioCv, getPortfolio, getPortfolioCvStatus, getSharedPortfolio, updatePortfolioContent } from "@/api/portfolio";
import type { PortfolioCvStatus } from "@/api/portfolio";
import { normalizePortfolioDocument } from "@/api/portfolioMapper";
import { getCardField, getCardJob, getCardName } from "./cardData";

const blockNavigationLabels: Record<PortfolioDocument["blocks"][number]["type"], string> = {
  about: "About",
  education: "Education",
  experience: "Experiences",
  activities: "Activities",
  awards: "Awards",
  certification: "Certification",
  works: "Projects",
  skills: "Skills",
};

export default function PreviewPage() {
  const location = useLocation();
  const { shareId } = useParams();
  const locationState = (location.state as {
    document?: PortfolioDocument;
    portfolioId?: number | string;
    side?: "front" | "back";
  } | null) ?? null;
  const hasDocumentSource = Boolean(
    locationState?.document || locationState?.portfolioId !== undefined || shareId,
  );
  if (!hasDocumentSource) return <Navigate to="/home" replace />;

  return <PreviewContent locationState={locationState} shareId={shareId} />;
}

function PreviewContent({
  locationState,
  shareId,
}: {
  locationState: {
    document?: PortfolioDocument;
    portfolioId?: number | string;
    side?: "front" | "back";
  } | null;
  shareId?: string;
}) {
  const navigate = useNavigate();
  const [side, setSide] = useState<"front" | "back">(locationState?.side ?? "front");
  const [document, setDocument] = useState<PortfolioDocument | null>(
    locationState?.document ? normalizePortfolioDocument(locationState.document) : null,
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [isCardFlipping, setIsCardFlipping] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractError, setExtractError] = useState("");
  const [cvStatus, setCvStatus] = useState<PortfolioCvStatus | null>(null);
  const [isGeneratingCv, setIsGeneratingCv] = useState(false);
  const [cvError, setCvError] = useState("");

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

  useEffect(() => {
    if (shareId || !document?.id) return;
    void getPortfolioCvStatus(document.id)
      .then(setCvStatus)
      .catch(() => setCvStatus(null));
  }, [document?.id, shareId]);

  if (!document) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white text-body-01 text-placeholder" role="status">
        불러오는 중...
      </div>
    );
  }
  const currentDocument = document;

  async function handleUpdateContent() {
    if (typeof currentDocument.id !== "number") return;
    setIsUpdating(true);
    try {
      setDocument(await updatePortfolioContent(currentDocument.id));
    } finally {
      setIsUpdating(false);
    }
  }

  async function handleExtract() {
    setIsShareModalOpen(true);
    setExtractError("");
  }

  async function handleDownloadImages() {
    if (typeof currentDocument.id !== "number" && typeof currentDocument.id !== "string") return;
    setIsExtracting(true);
    setExtractError("");
    try {
      const imageBlob = await exportPortfolioFrontImage(currentDocument.id);
      const imageUrl = URL.createObjectURL(imageBlob);
      const link = window.document.createElement("a");
      link.href = imageUrl;
      link.download = `${currentDocument.profile.name || "online-card"}-front.png`;
      link.style.display = "none";
      window.document.body.appendChild(link);
      link.click();
      window.setTimeout(() => {
        link.remove();
        URL.revokeObjectURL(imageUrl);
      }, 100);
      setIsShareModalOpen(false);
    } catch {
      setExtractError("명함 앞면 이미지를 생성하지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsExtracting(false);
    }
  }

  async function handleCvClick() {
    if (isGeneratingCv) return;
    setIsGeneratingCv(true);
    setCvError("");
    try {
      const cv = await generatePortfolioCv(currentDocument.id);
      setCvStatus({ exists: true, stale: false, generatedAt: cv.generatedAt });
      window.open(cv.url, "_blank", "noopener,noreferrer");
    } catch (error) {
      const apiError = error as Partial<ApiErrorResponse>;
      const messages: Record<string, string> = {
        PORTFOLIO_NOT_FOUND: "포트폴리오를 찾을 수 없어요.",
        CV_KG_NOT_READY: "포트폴리오를 먼저 생성해주세요.",
        CV_EMPTY: "CV에 넣을 항목이 없어요.",
        CV_REGENERATE_TOO_SOON: "최신 CV는 1분 이내에 다시 생성할 수 없어요.",
        CV_PDF_GENERATION_FAILED: "PDF를 생성하지 못했어요. 잠시 후 다시 시도해주세요.",
        CV_S3_SAVE_FAILED: "PDF를 저장하지 못했어요. 잠시 후 다시 시도해주세요.",
        AI_SERVER_ERROR: "AI 서버 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
        AI_TIMEOUT: "AI 응답 시간이 초과됐어요. 잠시 후 다시 시도해주세요.",
      };
      setCvError(messages[apiError.code ?? ""] ?? "CV를 준비하지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsGeneratingCv(false);
    }
  }

  function handleBlockNavigation(event: MouseEvent<HTMLAnchorElement>, blockType: string) {
    if (shareId) return;
    event.preventDefault();
    window.document.getElementById(blockType)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const cardRole = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";
  const portfolioHeader = side === "back" ? (
    <header
      className={`z-20 flex shrink-0 items-center justify-between border-b border-ink bg-white px-7 py-4 text-body-01 text-ink ${shareId ? "fixed inset-x-0 top-0" : "relative"}`}
    >
      <strong>{document.profile.name}</strong>
      <nav className="flex items-center gap-8" aria-label="Website navigation">
        {document.blocks
          .filter((block) => block.visible)
          .map((block) => (
            <a
              href={`#${block.type}`}
              key={block.id}
              onClick={(event) => handleBlockNavigation(event, block.type)}
            >
              {blockNavigationLabels[block.type]}
            </a>
          ))}
        {shareId ? (
          <a href="#cv">CV</a>
        ) : (
          <button
            type="button"
            onClick={() => void handleCvClick()}
            disabled={isGeneratingCv}
            aria-label={cvStatus?.exists && !cvStatus.stale ? "CV 열기" : "CV 생성 및 열기"}
            className="disabled:cursor-wait disabled:opacity-50"
                  >
                    {isGeneratingCv ? (
                      <>
                        <LoaderCircle className="animate-spin" size={18} aria-hidden="true" />
                        <span className="sr-only">CV 생성 중</span>
                      </>
                    ) : "CV"}
                  </button>
        )}
      </nav>
      {!shareId && cvError && <p className="absolute right-7 top-full mt-2 text-caption-01 text-danger" role="alert">{cvError}</p>}
    </header>
  ) : null;

  return (
    <div className="flex min-h-dvh flex-col bg-white">
      {!shareId && <Header />}
      {portfolioHeader}
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
          <>
            <div className={`flex w-full min-w-0 flex-1 items-start justify-between gap-8 p-4 ${shareId ? "pt-[72px]" : ""}`}>
              <ProfileBlock profile={document.profile} userType={document.userType} />
              <div className="flex min-w-0 flex-1 flex-col">
                {document.blocks.map((block) => (
                  <div id={block.type} className="scroll-mt-16" key={block.id}>
                    <BlockRenderer block={block} themeId={document.siteDesignId} />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="relative sticky bottom-0 z-10 mx-auto flex w-full max-w-[1200px] items-center justify-center bg-transparent px-4 py-2">
          <div className="flex items-center justify-center gap-4">
            <CardSideNavigation side={side} onSideChange={setSide} />
            {!shareId && (
              <>
                <UpdateButton onClick={() => void handleUpdateContent()} disabled={isUpdating || typeof document.id !== "number"} />
                <ModeButton
                  mode="preview"
                  onClick={() => navigate("/editor", { state: { document, side } })}
                />
                <ShareButton onClick={() => void handleExtract()} />
              </>
            )}
          </div>
        </div>
      </main>
      {isShareModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) setIsShareModalOpen(false);
          }}
        >
          <Modal
            title="명함 이미지를 저장할까요?"
            description={"실제 명함 발주 시 앞면은 이 명함 이미지로 사용해주세요.\n뒷면 QR 이미지는 QR 저장 기능에서 따로 저장할 수 있어요."}
            onCancel={() => setIsShareModalOpen(false)}
            onConfirm={() => void handleDownloadImages()}
            cancelLabel="취소"
            confirmLabel={isExtracting ? "저장 중…" : "이미지 저장"}
          >
            <div className="flex w-full flex-col items-center justify-center gap-4">
              {isExtracting && <p className="text-caption-01 text-placeholder">명함 앞면 이미지를 준비하는 중…</p>}
              {extractError && <p className="text-body-02 text-danger" role="alert">{extractError}</p>}
            </div>
          </Modal>
        </div>
      )}
    </div>
  )
}
