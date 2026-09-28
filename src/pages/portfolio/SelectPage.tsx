import Header from "@/components/layout/Header";
import PersonalCard,  { type PersonalCardProps } from "../home/components/PersonalCard";
import UncheckedIcon from '@/assets/Unchecked.svg?react';
import CheckedIcon from '@/assets/Checked.svg?react';
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
      <main className="relative flex flex-1 flex-col items-center justify-center gap-16 overflow-hidden px-4 py-10">
        <h1 className="text-display-01 font-bold text-focus leading-[1.2]">원하는 디자인을 선택해주세요.</h1>
        <div className="flex w-full max-w-[1040px] flex-wrap items-start justify-center gap-12 lg:gap-24">
            {designs.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-label={`${option.label} ${selectedDesign === option.id ? "선택됨" : "선택"}`}
                aria-pressed={selectedDesign === option.id}
                onClick={() => setSelectedDesign((current) => current === option.id ? null : option.id)}
                className="flex flex-col items-center gap-6 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span className={`flex items-center justify-center rounded-lg p-2 ${selectedDesign === option.id ? "bg-primary" : ""}`}>
                  <PersonalCard
                    {...sampleProfile}
                    name={option.design === "bold" ? "A-Polo" : "아폴로"}
                    design={option.design}
                  />
                </span>
                <span className="text-body-02 font-bold text-focus">{option.label}</span>
                {selectedDesign === option.id ? <CheckedIcon className="size-10" /> : <UncheckedIcon className="size-10" />}
              </button>
            ))}
        </div>
        <CTAButton disabled={!selectedDesign} onClick={handleNext}>
          선택 완료
        </CTAButton>
      </main>
    </div>
  )
}
