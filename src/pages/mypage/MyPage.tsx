import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import AppWindow from "@/components/AppWindow";
import ProfileFormCard, {
  type ProfileFormField,
} from "@/components/common/ProfileFormCard";
import { areRequiredProfileFieldsComplete, formatPhoneNumber } from "@/components/common/profileForm";
import ProfileRoleSelector from "@/components/common/ProfileRoleSelector";
import { roleFields, type Role } from "@/components/common/profileRoles";
import Button from "@/components/common/Button";
import Modal from "@/components/common/Modal";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { useNavigate } from "react-router-dom";
import { logout } from "@/api/auth";
import { getUserProfile, updateProfile, type UserProfile } from "@/api/user";

const emptyRoleValues = {
  company: "",
  jobTitle: "",
  tel: "",
  university: "",
  department: "",
  major: "",
};

type Profile = {
  id: number;
  email: string;
  name: string;
  onboardingCompleted: boolean;
  role: Role;
  phone: string;
  github: string;
  company: string;
  jobTitle: string;
  tel: string;
  university: string;
  department: string;
  major: string;
};

function toProfile(user: UserProfile): Profile {
  return {
    ...user,
    role: user.role ?? "Professional",
    phone: user.phone ?? "",
    github: user.github ?? "",
    company: user.company ?? "",
    jobTitle: user.jobTitle ?? "",
    tel: user.tel ?? "",
    university: user.university ?? "",
    department: user.department ?? "",
    major: user.major ?? "",
  };
}

export default function MyPage() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    getUserProfile().then((response) => {
      const nextProfile = toProfile(response.user);
      setProfile(nextProfile);
      setForm(nextProfile);
    });
  }, []);

  if (!profile || !form) {
    return <div className="flex min-h-dvh items-center justify-center bg-apolo">불러오는 중...</div>;
  }

  const isPhoneValid = /^\d{3}-\d{4}-\d{4}$/.test(form.phone);

  const profileFields: ProfileFormField[] = [
    { label: "Name", name: "name", required: true, placeholder: "이름을 입력해주세요." },
    {
      label: "Mobile",
      name: "phone",
      required: true,
      type: "tel",
      inputMode: "numeric" as const,
      maxLength: 13,
      pattern: "\\d{3}-\\d{4}-\\d{4}",
      placeholder: "010-0000-0000",
    },
    ...roleFields[form.role],
    { label: "GitHub", name: "github", placeholder: "GitHub 프로필 URL을 입력해주세요." },
  ].map((field) => ({ ...field, className: "w-full!" }));
  const formValues = {
    name: form.name,
    phone: form.phone,
    github: form.github,
    company: form.company,
    jobTitle: form.jobTitle,
    tel: form.tel,
    university: form.university,
    department: form.department,
    major: form.major,
  };
  const canSave = isPhoneValid && areRequiredProfileFieldsComplete(profileFields, formValues);
  const profileDetails = [
    ["Email", profile.email],
    ["Mobile", profile.phone],
    ...(profile.role === "Professional"
      ? [["Company", profile.company], ["Tel", profile.tel]]
      : profile.role === "Professor"
        ? [["University", profile.university], ["Tel", profile.tel]]
        : [["University", profile.university], ["Major", profile.major]]),
    ["GitHub", profile.github],
  ];

  function handleEditStart() {
    setForm(profile);
    setIsEditing(true);
  }

  function handleRoleChange(role: Role) {
    setForm((currentForm) => {
      if (!currentForm || currentForm.role === role) return currentForm;
      return { ...currentForm, ...emptyRoleValues, role };
    });
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? formatPhoneNumber(value) : value;

    setForm((currentForm) => currentForm
      ? { ...currentForm, [name]: nextValue }
      : currentForm);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form || !canSave) return;

    const response = await updateProfile(form);
    const nextProfile = toProfile(response.user);
    setProfile(nextProfile);
    setForm(nextProfile);
    setIsEditing(false);
  }

  async function handleLogout() {
    await logout();
    localStorage.removeItem("accessToken");
    navigate("/login", { replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className={`relative flex flex-1 justify-center overflow-hidden py-10 ${isEditing ? "items-start" : "items-center"}`}>
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-surface/65">
          <p className="text-[80px]">MANAGE</p>
          <p className="ml-44 text-[70px]">INFORMATION</p>
        </div>

        {isEditing ? (
          <ProfileFormCard
            className="relative z-10 w-[510px] max-w-[calc(100%-2rem)] shrink-0"
            title={<>Fill in your<br />information</>}
            description="AI가 웹사이트를 만들기 위해서는 아래의 정보가 필요해요."
            animateFieldChanges
            photoUploader={<ProfileRoleSelector role={form.role} onRoleChange={handleRoleChange} />}
            fields={profileFields}
            values={formValues}
            onFieldChange={handleChange}
            onSubmit={handleSubmit}
            submitDisabled={!canSave}
          />
        ) : (
          <AppWindow className="relative z-10 w-[500px] max-w-[calc(100%-2rem)]" title="Profile">
            <h1 className="text-heading-03 font-bold text-ink">{profile.name}</h1>

            <div className="flex w-full flex-col items-start gap-3">
              {profileDetails.map(([label, value]) => (
                <div
                  className="flex w-full items-center justify-start gap-4 text-start text-body-02 leading-none text-ink"
                  key={label}
                >
                  <div className="flex w-22 shrink-0 gap-1 border-r border-primary">
                    <p>{label}</p>
                  </div>
                  <p className="min-w-0 break-all">{value || "-"}</p>
                </div>
              ))}
            </div>

            <div className="flex w-full items-center justify-between">
              <Button onClick={handleEditStart}>프로필 수정</Button>
              <Button onClick={() => setIsLogoutModalOpen(true)}>로그아웃</Button>
            </div>
          </AppWindow>
        )}
      </main>
      {isLogoutModalOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setIsLogoutModalOpen(false);
            }
          }}
        >
          <Modal
            title="로그아웃하시겠습니까?"
            description="로그아웃 후 다시 로그인이 가능합니다."
            onCancel={() => setIsLogoutModalOpen(false)}
            onConfirm={handleLogout}
          />
        </div>
      ) : null}
      <Footer />
    </div>
  );
}
