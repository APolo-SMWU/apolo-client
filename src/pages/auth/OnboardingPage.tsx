import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProfileFormCard, {
  type ProfileFormField,
} from "@/components/common/ProfileFormCard";
import { useState, type ChangeEvent, type FormEvent } from "react";

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

const onboardingFields: ProfileFormField[] = [
  {
    label: "Phone",
    required: true,
    type: "tel",
    name: "phone",
    inputMode: "numeric",
    maxLength: 13,
    pattern: "\\d{3}-\\d{4}-\\d{4}",
    placeholder: "010-1234-5678",
  },
  {
    label: "Address",
    name: "address",
    placeholder: "회사 주소를 입력해주세요",
  },
  {
    label: "GitHub",
    required: true,
    name: "github",
    placeholder: "GitHub 주소를 입력해주세요",
  },
  {
    label: "Notion",
    name: "notion",
    placeholder: "노션 페이지 링크를 입력해주세요",
  },
];

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

        <ProfileFormCard
          className="relative z-10"
          title={<>Fill in your<br />information</>}
          description="AI가 웹사이트를 만들기 위해서는 아래의 정보가 필요해요"
          fields={onboardingFields}
          values={form}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          submitDisabled={!isPhoneValid}
        />
      </main>
      <Footer/>
    </div>
  )
}
