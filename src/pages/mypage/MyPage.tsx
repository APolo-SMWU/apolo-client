import { useState, type ChangeEvent, type FormEvent } from "react";
import AppWindow from "@/components/AppWindow";
import ProfileFormCard, {
  type ProfileFormField,
} from "@/components/common/ProfileFormCard";
import { formatPhoneNumber } from "@/components/common/profileForm";
import Button from "@/components/common/Button";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

type Profile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  github: string;
};

const initialProfile: Profile = {
  name: "홍길동",
  email: "test@gmail.com",
  phone: "010-1234-5678",
  address: "서울 용산구 청파로 47길 100",
  github: "https://github.com/canofmato",
};

const profileFields: ProfileFormField[] = [
  { label: "Name", name: "name", required: true, placeholder: "이름을 입력해주세요" },
  {
    label: "Phone",
    name: "phone",
    required: true,
    type: "tel",
    inputMode: "numeric",
    maxLength: 13,
    pattern: "\\d{3}-\\d{4}-\\d{4}",
    placeholder: "010-1234-5678",
  },
  { label: "Address", name: "address", placeholder: "주소를 입력해주세요" },
  {
    label: "GitHub",
    name: "github",
    required: true,
    placeholder: "GitHub 주소를 입력해주세요",
  },
];

export default function MyPage() {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [form, setForm] = useState({
    name: initialProfile.name,
    phone: initialProfile.phone,
    address: initialProfile.address,
    github: initialProfile.github,
  });
  const [isEditing, setIsEditing] = useState(false);

  const isPhoneValid = /^\d{3}-\d{4}-\d{4}$/.test(form.phone);

  function handleEditStart() {
    setForm({
      name: profile.name,
      phone: profile.phone,
      address: profile.address,
      github: profile.github,
    });
    setIsEditing(true);
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;
    const nextValue = name === "phone" ? formatPhoneNumber(value) : value;

    setForm((currentForm) => ({ ...currentForm, [name]: nextValue }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProfile((currentProfile) => ({ ...currentProfile, ...form }));
    setIsEditing(false);
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden p-16">
        {isEditing ? (
          <ProfileFormCard
            className="relative z-10"
            windowTitle="Edit Profile"
            fields={profileFields}
            values={form}
            onFieldChange={handleChange}
            onSubmit={handleSubmit}
            submitLabel="수정하기"
            submitDisabled={!isPhoneValid}
          />
        ) : (
          <AppWindow className="relative z-10 w-[500px]" title="Profile">
            <h1 className="text-heading-03 font-bold text-ink">{profile.name}</h1>

            <div className="flex w-full flex-col items-start gap-3">
              {[
                ["Email", profile.email],
                ["Phone", profile.phone],
                ["Address", profile.address],
                ["GitHub", profile.github],
              ].map(([label, value]) => (
                <div
                  className="flex w-full items-center justify-start gap-4 text-start text-body-02 leading-none text-ink"
                  key={label}
                >
                  <div className="flex w-16 gap-1 border-r border-primary">
                    <p>{label}</p>
                  </div>
                  <p>{value}</p>
                </div>
              ))}
            </div>

            <div className="flex w-full items-center justify-between">
              <Button onClick={handleEditStart}>프로필 수정</Button>
              <Button>로그아웃</Button>
            </div>
          </AppWindow>
        )}
      </main>
      <Footer />
    </div>
  );
}
