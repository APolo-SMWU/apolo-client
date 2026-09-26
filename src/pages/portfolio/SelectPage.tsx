import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PersonalCard,  { type PersonalCardProps } from "../home/components/PersonalCard";
import UncheckedIcon from '@/assets/Unchecked.svg?react';
import CheckedIcon from '@/assets/Checked.svg?react';
import CTAButton from "@/components/common/CTAButton";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const mockProfile: PersonalCardProps = {
  role: "Professional",
  name: "PARK DA-IN",
  job: "Developer",
  tel: "02-123-4567",
  phone: "010-1234-5678",
  email: "gunmannduu@gmail.com",
  address: "서울 용산구 청파로 47길 100",
};

const designs = [
  { id: "default", profile: mockProfile },
] as const;

export default function SelectPage() {
  const navigate = useNavigate();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);

  function handleNext() {
    if (!selectedDesign) return;

    navigate("/create", {
      state: { designId: selectedDesign },
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center gap-16 overflow-hidden px-4 py-10">
        <h1 className="text-display-01 font-bold text-focus leading-[1.2]">원하는 디자인을 선택해주세요.</h1>
        <div className="flex w-full max-w-[1040px] flex-wrap items-start justify-center gap-40">
          {designs.map((design) => {
            const isSelected = selectedDesign === design.id;

            return (
              <button
                key={design.id}
                type="button"
                aria-label={`${design.id} 디자인 ${isSelected ? "선택됨" : "선택"}`}
                aria-pressed={isSelected}
                onClick={() => setSelectedDesign((current) => current === design.id ? null : design.id)}
                className="flex flex-col items-center gap-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <span className={`flex items-center justify-center rounded-lg p-2 ${isSelected ? "bg-primary" : ""}`}>
                  <PersonalCard {...design.profile} />
                </span>
                {isSelected ? <CheckedIcon className="size-10" /> : <UncheckedIcon className="size-10" />}
              </button>
            );
          })}
        </div>
        <CTAButton disabled={!selectedDesign} onClick={handleNext}>
          선택 완료
        </CTAButton>
      </main>
      <Footer />
    </div>
  )
}
