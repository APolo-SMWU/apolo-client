import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppWindow from "@/components/AppWindow";
import PersonalCard, { type PersonalCardProps } from "../home/components/PersonalCard";
import CTAButton from "@/components/common/CTAButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import sampleLogo from "@/assets/Logo.png";

const sampleProfile: PersonalCardProps = {
  role: "Professional",
  name: "아폴로",
  job: "Developer",
  logoUrl: sampleLogo,
  tel: "02-123-4567",
  phone: "010-1234-5678",
  email: "apolo@gmail.com",
  address: "서울 용산구 청파로47길 100",
};

export default function SelectPage() {
  const navigate = useNavigate();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const designs = [
    { id: "default", label: "기본 디자인", design: "default" as const },
    { id: "bold", label: "볼드 디자인", design: "bold" as const },
  ];

  function handleNext() {
    if (!selectedDesign) return;

    navigate("/create", {
      state: { cardDesignId: selectedDesign },
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-4 py-10">
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-placeholder/65">
          <p className="text-[80px]">SELECT</p>
          <p className="ml-44 text-[70px]">CARD DESIGN</p>
        </div>

        <AppWindow className="relative z-10 w-[734px] max-w-full" title="Select">
          <div className="flex w-full flex-col gap-5">
            <div>
              <h1 className="text-heading-01 font-bold leading-[1.1] text-ink">Select card design</h1>
              <p className="mt-2 text-body-02 text-placeholder">원하는 명함 디자인을 선택해주세요.</p>
            </div>

            <div className="flex w-full flex-wrap items-start justify-between gap-4">
              {designs.map((option) => {
                const isSelected = selectedDesign === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-label={`${option.label} ${isSelected ? "선택됨" : "선택"}`}
                    aria-pressed={isSelected}
                    onClick={() => setSelectedDesign((current) => current === option.id ? null : option.id)}
                    className="h-[178px] w-[320px] max-w-full rounded-xl text-left outline-none"
                  >
                    <div className="h-[217px] w-[390px] origin-top-left scale-[0.82]">
                      <PersonalCard
                        {...sampleProfile}
                        name={option.design === "bold" ? "A-Polo" : "아폴로"}
                        design={option.design}
                        isSelected={isSelected}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex w-full justify-end">
              <CTAButton disabled={!selectedDesign} onClick={handleNext}>
                선택하기
              </CTAButton>
            </div>
          </div>
        </AppWindow>
      </main>
      <Footer />
    </div>
  )
}
