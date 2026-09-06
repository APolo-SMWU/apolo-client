import ProfileRoleSelector from "@/components/common/ProfileRoleSelector";
import { roleFields, type Role } from "@/components/common/profileRoles";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProfileFormCard, {
  type ProfileFormField,
} from "@/components/common/ProfileFormCard";
import { formatPhoneNumber } from "@/components/common/profileForm";
import { getMe } from "@/api/auth";
import { markOnboardingCompleted } from "@/utils/onboarding";
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role | null>(null);
  const [form, setForm] = useState({
    phone: "",
    github: "",
    company: "",
    jobTitle: "",
    tel: "",
    university: "",
    department: "",
    major: "",
  });
  const onboardingFields: ProfileFormField[] = [
    {
      label: "Mobile",
      required: true,
      type: "tel",
      name: "phone",
      inputMode: "numeric" as const,
      maxLength: 13,
      pattern: "\\d{3}-\\d{4}-\\d{4}",
      placeholder: "010-0000-0000",
    },
    ...(role ? roleFields[role] : []),
    {
      label: "GitHub",
      name: "github",
      placeholder: role ? "GitHub 프로필 URL을 입력해주세요." : "GitHub 주소를 입력해주세요.",
    },
  ].map((field) => ({ ...field, className: "w-full!" }));

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
    getMe().then((me) => {
      markOnboardingCompleted(me.email);
      navigate("/home", { replace: true });
    });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header/>
      <main className="relative flex flex-1 items-start justify-center overflow-hidden py-10">
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-surface/65">
          <p className="text-[80px]">SET UP YOUR</p>
          <p className="ml-44 text-[70px]">PROFILE</p>
        </div>

        <ProfileFormCard
          className="relative z-10 w-[510px] max-w-[calc(100%-2rem)] shrink-0"
          animateFieldChanges
          title={<>Fill in your<br />information</>}
          description="AI가 웹사이트를 만들기 위해서는 아래의 정보가 필요해요."
          fields={onboardingFields}
          values={form}
          onFieldChange={handleChange}
          onSubmit={handleSubmit}
          submitDisabled={!role || !isPhoneValid}
          photoUploader={
            <ProfileRoleSelector role={role} onRoleChange={setRole} />
          }
        />
      </main>
      <Footer/>
    </div>
  )
}
