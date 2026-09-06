import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import CreateModal from "./components/CreateModal";
import CardPreview from "./components/CardPreview";
import PersonalCard, { type PersonalCardProps } from "./components/PersonalCard";
import Modal from "@/components/common/Modal";
import LinkIcon from "@/assets/Link.svg?react";

const mockCards = [
  { id: 1, title: "학회 공유용" },
  { id: 2, title: "이력서용" },
  { id: 3, title: "이직용" },
];

const mockProfile: PersonalCardProps = {
  role: "Professional",
  name: "PARK DA-IN",
  job: "Developer",
  tel: "02-123-4567",
  phone: "010-1234-5678",
  email: "gunmannduu@gmail.com",
  address: "서울 용산구 청파로 47길 100",
};

type ActiveModal = {
  type: "delete" | "share";
  portfolioId: number;
} | null;

export default function HomePage() {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);
  const [isCopied, setIsCopied] = useState(false);
  const shareLink = "https://canofmato.com";

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
            onClick={() => navigate("/create")}
          >
            + 만들기
          </Button>
        </div>

        {mockCards.length === 0 ? (
          <CreateModal />
        ) : (
          <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-[repeat(2,minmax(0,424px))] md:justify-between xl:grid-cols-[repeat(3,minmax(0,424px))]">
            {mockCards.map((card) => (
              <CardPreview
                key={card.id}
                title={card.title}
                onDelete={() => setActiveModal({ type: "delete", portfolioId: card.id })}
                onShare={() => setActiveModal({ type: "share", portfolioId: card.id })}
              >
                <PersonalCard {...mockProfile} />
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
              onConfirm={() => {
                // 나중에 삭제 API 호출
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
                  <p className="text-body-02 font-semibold text-ink">{shareLink}</p>
                  <button
                    type="button"
                    aria-label="링크 복사"
                    onClick={async () => {
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
