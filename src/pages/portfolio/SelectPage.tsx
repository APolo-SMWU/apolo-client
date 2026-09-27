import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PersonalCard,  { type PersonalCardProps } from "../home/components/PersonalCard";
import UncheckedIcon from '@/assets/Unchecked.svg?react';
import CheckedIcon from '@/assets/Checked.svg?react';
import CTAButton from "@/components/common/CTAButton";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/api/user";
import { toPersonalCardProfile } from "./selectProfile";

export default function SelectPage() {
  const navigate = useNavigate();
  const [selectedDesign, setSelectedDesign] = useState<string | null>(null);
  const [profile, setProfile] = useState<PersonalCardProps | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    getUserProfile()
      .then(({ user }) => {
        if (!cancelled) setProfile(toPersonalCardProfile(user));
      })
      .catch(() => {
        if (!cancelled) setErrorMessage("프로필을 불러오지 못했어요. 잠시 후 다시 시도해주세요.");
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
        {errorMessage ? <p role="alert" className="text-body-02 text-danger">{errorMessage}</p> : profile ? (
          <div className="flex w-full max-w-[1040px] flex-wrap items-start justify-center gap-40">
            <button
              type="button"
              aria-label={`default 디자인 ${selectedDesign ? "선택됨" : "선택"}`}
              aria-pressed={selectedDesign === "default"}
              onClick={() => setSelectedDesign((current) => current === "default" ? null : "default")}
              className="flex flex-col items-center gap-10 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <span className={`flex items-center justify-center rounded-lg p-2 ${selectedDesign === "default" ? "bg-primary" : ""}`}>
                <PersonalCard {...profile} />
              </span>
              {selectedDesign === "default" ? <CheckedIcon className="size-10" /> : <UncheckedIcon className="size-10" />}
            </button>
          </div>
        ) : (
          <p role="status" className="text-body-02 text-placeholder">프로필을 불러오는 중…</p>
        )}
        <CTAButton disabled={!selectedDesign} onClick={handleNext}>
          선택 완료
        </CTAButton>
      </main>
      <Footer />
    </div>
  )
}
