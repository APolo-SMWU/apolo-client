import AuthInput from "@/components/AuthInput";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AppWindow from "@/components/AppWindow";
import CTAButton from "@/components/common/CTAButton";
import { useState, type ChangeEvent, type FormEvent } from "react";
import PhotoUploader from "@/components/PhotoUploader";

type OnboardingForm = {
  phone: string;
  address: string;
  github: string;
  notion: string;
};

function formatPhoneNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);

  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

export default function  OnboardingPage() {
  const [form, setForm] = useState<OnboardingForm>({
    phone: "",
    address: "",
    github: "",
    notion: "",
  });

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? formatPhoneNumber(value) : value;

    setForm((prev) => ({
      ...prev,
      [name]: nextValue,
    }));
  }

  const isPhoneValid = /^\d{3}-\d{4}-\d{4}$/.test(form.phone);
  const isFormComplete = isPhoneValid && form.github.trim() !== "";

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header/>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-surface/65">
          <p className="text-[80px]">SET UP YOUR</p>
          <p className="ml-44 text-[70px]">PROFILE</p>
        </div>

        <AppWindow
          className="relative z-10"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-heading-01 font-bold text-ink leading-none">
              Fill in your<br />
              information
            </h1>
            <p className="text-body-02 text-placeholder leading-none">
              AI가 웹사이트를 만들기 위해서는 아래의 정보가 필요해요
            </p>
          </div>

          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
            {/* 프로필 사진 */}
            <PhotoUploader />
            <AuthInput
              label="Phone"
              required
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              inputMode="numeric"
              maxLength={13}
              pattern="\d{3}-\d{4}-\d{4}"
              placeholder="010-1234-5678"
            />
            <AuthInput
              label="Address"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="회사 주소를 입력해주세요"
            />
            <AuthInput
              label="GitHub"
              required
              name="github"
              value={form.github}
              onChange={handleChange}
              placeholder="GitHub 주소를 입력해주세요"
            />
            <AuthInput
              label="Notion"
              name="notion"
              value={form.notion}
              onChange={handleChange}
              placeholder="노션 페이지 링크를 입력해주세요"
            />
            <div className="flex w-full mt-3 items-center justify-end">
              <CTAButton
                type="submit"
                disabled={!isFormComplete}
              >
                저장하기
              </CTAButton>
            </div>
          </form>
        </AppWindow>
      </main>
      <Footer/>
    </div>
  )
}
