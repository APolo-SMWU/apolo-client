import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Button from "@/components/common/Button";
import CreateModal from "./components/CreateModal";
import { useEffect, useState } from "react";
import { getPortfolios, type Portfolio } from "@/api/portfolios";
import PortfolioCard from "./components/PortfolioCard";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();
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
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 flex-col items-start overflow-hidden px-8 py-16 gap-16">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start justify-center gap-2">
            <h1 className="text-display-01 font-bold text-focus leading-none ">My Personal Card</h1>
            <p className="text-body-02 text-[#4DA3FF] leading-none">나의 온라인 명함을 관리할 수 있어요.</p>
            <div className="flex items-start justify-center gap-4">
              <div className="flex items-center justify-center gap-2">
                <div className="w-[10px] h-[10px] rounded-full bg-danger" />
                <p className="text-body-02 text-surface leading-none">Delete</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-[10px] h-[10px] rounded-full bg-warn" />
                <p className="text-body-02 text-surface leading-none">Edit</p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-[10px] h-[10px] rounded-full bg-success" />
                <p className="text-body-02 text-surface leading-none">Share</p>
              </div>
            </div>
          </div>
          <Button 
            type="button"
            className="w-[140px] h-9"
            onClick={() => navigate(`/prompt`)}
          >
            + 만들기
          </Button>
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
          <section className="flex w-full items-center justify-center">
            <CreateModal />
          </section>
        ) : (
          <div className="grid w-full grid-cols-3">
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