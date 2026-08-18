import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import EmptyCard from "@/components/common/EmptyCard";
import FilterChip from "./components/FilterChip";
import { useEffect, useState } from "react";
import { getPortfolios, type Portfolio } from "@/api/portfolios";
import PortfolioCard from "./components/PortfolioCard";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
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
      <main className="relative flex flex-1 flex-col items-start overflow-hidden p-16 gap-9">
        {/* ⬇️ 테스트 후 w-[1200px]로 바꿀지 결정 */}
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start justify-center gap-2">
            <h1 className="text-display-01 font-bold text-ink leading-none ">내 포트폴리오</h1>
            <p className="text-body-02 text-placeholder leading-none">최근 작업, 공유 상태, 공개 여부를 한 화면에서 관리해요.</p>
          </div>
          <Button 
            type="button"
            className="w-[140px] h-9"
            onClick={() => navigate(`/prompt`)}
          >
            + 새로 만들기
          </Button>
        </div>

        <div className="flex items-center justify-center gap-4">
          <FilterChip 
            label="최근 본 포폴"
            selected={selected === "최근 본 포폴"}
            onClick={() =>
              setSelected((prev) =>
                prev === "최근 본 포폴" ? null : "최근 본 포폴"
              )
            }
          />
          <FilterChip 
            label="공유된 포폴"
            selected={selected === "공유된 포폴"}
            onClick={() =>
            setSelected((prev) =>
              prev === "공유된 포폴" ? null : "공유된 포폴"
            )
          }
          />
          <FilterChip 
            label="공개된 포폴"
            selected={selected === "공개된 포폴"}
            onClick={() =>
              setSelected((prev) =>
                prev === "공개된 포폴" ? null : "공개된 포폴"
              )
            }
          />
        </div>

        {isLoading ? (
          <section className="flex w-full pt-[30px]">
            <p>불러오는 중...</p>
          </section>
        ) : error ? (
          <section className="flex w-full pt-[30px]">
            <p>{error}</p>
          </section>
        ) : portfolios.length === 0 ? (
          <section className="flex w-full pt-[30px]">
            <EmptyCard />
          </section>
        ) : (
          <div className="grid w-[1200px] grid-cols-3 gap-20">
            {portfolios.map((portfolio) => (
              <PortfolioCard 
                key={portfolio.id}
                id={portfolio.id}
                title={portfolio.title}
                updatedAt={portfolio.updatedAt}
                isPublic={portfolio.isPublic}
              />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}