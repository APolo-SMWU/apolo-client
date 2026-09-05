import PhotoUploader from "@/components/PhotoUploader";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import ProfileFormCard, {
  type ProfileFormField,
} from "@/components/common/ProfileFormCard";
import { formatPhoneNumber } from "@/components/common/profileForm";
import { useState, type ChangeEvent, type FormEvent } from "react";

const roles = ["Professional", "Professor", "Student"] as const;
type Role = (typeof roles)[number];

const roleFields: Record<Role, ProfileFormField[]> = {
  Professional: [
    { name: "company", label: "Company", placeholder: "회사명을 입력해주세요.", required: true, halfWidth: true },
    { name: "jobTitle", label: "Job Title", placeholder: "직함을 입력해주세요.", required: true, halfWidth: true },
    { name: "tel", label: "Tel", type: "tel", placeholder: "회사 전화번호를 입력해주세요.", required: true },
  ],
  Professor: [
    { name: "university", label: "University", placeholder: "학교명을 입력해주세요.", required: true, halfWidth: true },
    { name: "department", label: "Department", placeholder: "소속 학과를 입력해주세요.", required: true, halfWidth: true },
    { name: "tel", label: "Tel", type: "tel", placeholder: "학교 또는 연구실 전화번호를 입력해주세요.", required: true },
  ],
  Student: [
    { name: "university", label: "University", placeholder: "학교명을 입력해주세요.", required: true, halfWidth: true },
    { name: "major", label: "Major", placeholder: "전공을 입력해주세요.", required: true, halfWidth: true },
  ],
};

export default function OnboardingPage() {
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
            <div className="mb-1 flex flex-wrap items-end justify-between gap-4">
              <PhotoUploader className="size-20! shrink-0" />
              <fieldset className="min-w-0 flex-1 basis-[310px] sm:w-[312px] sm:flex-none">
                <legend className="mb-2 text-caption-01 text-ink">
                  Role <span className="text-danger">*</span>
                </legend>
                <div className="flex gap-2">
                  {roles.map((option) => (
                    <button
                      key={option}
                      type="button"
                      aria-pressed={role === option}
                      onClick={() => setRole(option)}
                      className={`h-10 min-w-0 flex-1 rounded-ml border px-2 text-body-02 transition-colors duration-150 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                        role === option
                          ? "border-focus bg-primary text-white"
                          : "border-placeholder bg-white text-placeholder"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          }
        />
      </main>
      <Footer/>
    </div>
  )
}
