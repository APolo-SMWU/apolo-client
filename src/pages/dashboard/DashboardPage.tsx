import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CTAButton from "@/components/common/CTAButton";
import EmptyCard from "@/components/common/EmptyCard";
import FilterChip from "./components/FilterChip";
import { useState } from "react";

export default function DashboardPage() {
  const [selected, setSelected] = useState<string | null>(null);

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
          <CTAButton type="button" className="w-[140px] h-9">
            + 새로 만들기
          </CTAButton>
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

        {/* 포폴 그리드 */}
        <section className="flex w-full pt-[30px]">
          <EmptyCard/>
        </section>
      </main>
      <Footer />
    </div>
  )
}