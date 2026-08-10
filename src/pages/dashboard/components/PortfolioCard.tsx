import Button from "@/components/common/Button";
import { WindowCard } from "@/components/WindowCard";

type PortfolioCardProps = {
  title: string;
  updatedAt: string;
  isPublic: boolean;
}

export default function PortfolioCard({
  title,
  updatedAt,
  isPublic,
}: PortfolioCardProps) {
  return (
    <WindowCard 
      label={`PORTFOLIO_`}
      variant="black"
      className="relative z-10 w-[360px]"
      bodyClassName="flex flex-col gap-3 px-4 py-3"
    >
      <div className="w-full border border-ink bg-surface" />
      <div className="flex w-full items-center justify-between">
        <div className="flex flex-col gap-1 items-start">
          <h3 className="text-body-01 font-bold text-ink leading-none">{title}</h3>
          <p className="text-caption-02 text-placeholder">수정일 {updatedAt} · 공개  {isPublic ? "ON" : "OFF"}</p>
        </div>

        <div className="flex gap-1 items-center">
          <Button className="flex w-12 h-7 items-center justify-center text-body-02 text-ink">
            편집
          </Button>
          <Button className="flex w-12 h-7 items-center justify-center text-body-02 text-ink">
            보기
          </Button>
        </div>

      </div>
    </WindowCard>
  )
}