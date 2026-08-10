import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EmptyCard from "@/components/common/EmptyCard";
import { WindowCard } from "@/components/WindowCard";
import Button from "@/components/common/Button";
import { useEffect, useState } from "react";
import { getPortfolios, type Portfolio } from "@/api/portfolios";
import PortfoliosList from "./components/PortfoliosList";

export default function MyPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const data = await getPortfolios();
        setPortfolios(data.portfolios);
      } catch {
        setError("포트폴리오를 불러오지 못했어요");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolios();
  }, []);

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col items-start overflow-hidden p-16 gap-10">
        <WindowCard
          label="PROFILE"
          variant="blue"
          className="relative z-10 w-full"
          bodyClassName="flex w-full items-center justify-between px-5 py-8"
        >
          <div className="flex item-center justify-center gap-8">
            {/* 프로필 사진 */}
            <div className="rounded-full border border-ink w-25 h-25"/>
            <div className="flex flex-col items-start justify-center gap-3 text-ink leading-none">
              <h2 className="text-heading-03 font-bold">홍길동</h2>
              <p className="text-body-02">test@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-col gap-5 items-center justify-center">
            <Button
              className="w-[120px] h-8"
            >
              프로필 수정
            </Button>
            <Button
              className="w-[120px] h-8"
            >
              로그아웃
            </Button>

          </div>
        </WindowCard>

        <WindowCard
          label="PORTFOLIOS"
          variant="black"
          className="relative z-10 w-full"
          bodyClassName="flex flex-col items-start justify-center px-5 py-8 gap-[30px]"
        >
          <h2 className="text-heading-03 font-bold text-ink leading-none">내 포트폴리오 목록</h2>
          {isLoading ? (
            <section className="flex w-full pt-[30px]">
              <p>불러오는 중...</p>
            </section>
          ) : error ? (
            <section className="flex w-full pt-[30px]">
              <p>{error}</p>
            </section>
          ) : portfolios.length === 0 ? (
              <EmptyCard />
          ) : (
            <div className="flex flex-col w-full gap-5">
              {portfolios.map((portfolio) => (
                <PortfoliosList
                  key={portfolio.id}
                  title={portfolio.title}
                  updatedAt={portfolio.updatedAt}
                  isPublic={portfolio.isPublic}
                />
              ))}
            </div>
          )}
        </WindowCard>
      </main>
      <Footer />
    </div>
  )
}