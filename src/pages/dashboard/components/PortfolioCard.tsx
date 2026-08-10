import Button from "@/components/common/Button";

type PortfolioCardProps = {
  id: number;
  title: string;
  updatedAt: string;
  isPublic: boolean;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

export default function PortfolioCard({
  id,
  title,
  updatedAt,
  isPublic,
}: PortfolioCardProps) {
  return (
    <section className="group relative z-10 w-[360px] overflow-hidden border border-ink bg-white">
      <header className="flex h-[30px] items-center justify-between border-b border-ink bg-ink px-4 text-caption-02 font-bold text-white transition-colors group-hover:bg-primary">
        <span>C://PORTFOLIO_{id}</span>
        <span className="flex gap-[6px]" aria-hidden="true">
          <i className="block h-3 w-3 border border-current"/>
          <i className="block h-3 w-3 border border-current"/>
          <i className="block h-3 w-3 border border-current"/>
        </span>
      </header>
      <div className="flex flex-col gap-3 px-4 py-3">
        <div className="w-full border border-ink bg-surface" />

        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col gap-1 items-start">
            <h3 className="text-body-01 font-bold text-ink leading-none">{title}</h3>
            <p className="text-caption-02 text-placeholder">수정일 {formatDate(updatedAt)} · 공개 {isPublic ? "ON" : "OFF"}</p>
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
      </div>
    </section>
  )
}