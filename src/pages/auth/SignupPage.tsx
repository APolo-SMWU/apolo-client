import { useNavigate } from "react-router-dom";
import Input from "@/components/Input";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AppWindow from "@/components/AppWindow";
import CTAButton from "@/components/common/CTAButton";
import {
  mapServerErrors,
  type ApiErrorResponse,
} from '@/api/api';
import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import { type SignupRequest, signup } from "@/api/auth";

type SignupErrors = Partial<
  Record<"name" | "email" | "password" | "passwordCheck", string>
>;

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<SignupRequest>({
    name: "",
    email: "",
    password: "",
    passwordCheck: "",
  });

  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function validate(values: SignupRequest): SignupErrors {
    const nextErrors: SignupErrors = {};

    const nameError = validateField("name", values.name);
    const emailError = validateField("email", values.email);
    const passwordError = validateField("password", values.password);
    const passwordCheckError = validateField("passwordCheck", values.passwordCheck);

    if (nameError) nextErrors.name = nameError;
    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;
    if (passwordCheckError) nextErrors.passwordCheck = passwordCheckError;

    return nextErrors;
  }

  function validateField(name: keyof SignupRequest, value: string) {
    switch (name) {
      case "name":
        if (!value.trim()) return "이름을 입력해주세요.";
        return "";

      case "email":
        if (!value.trim()) return "이메일을 입력해주세요.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return "올바른 이메일 형식이 아닙니다.";
        }
        return "";

      case "password":
        if (!value) return "비밀번호를 입력해주세요.";
        if (value.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
        return "";

      case "passwordCheck":
        if (!value) return "비밀번호 확인을 입력해주세요.";
        if (value !== form.password) return "비밀번호가 일치하지 않습니다.";
        return "";

      default:
        return "";
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof SignupRequest, value),
    }));
  }

  const isFormComplete =
    form.name.trim() !== "" &&
    form.email.trim() !== "" &&
    form.password.trim() !== "" &&
    form.passwordCheck.trim() !== "";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate(form);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrors({});

      await signup(form);

      navigate("/login");
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      if (apiError.errors?.length) {
        setErrors(mapServerErrors(apiError.errors) as SignupErrors);
        return;
      }

      if (apiError.status === 409) {
        setErrors({
          email: apiError.message || "이미 사용 중인 이메일입니다.",
        });
        return;
      }

      setErrors({
        email: apiError.message || "회원가입 중 오류가 발생했습니다.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header/>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-surface/65">
          <p className="text-[80px]">WELCOME</p>
          <p className="ml-44 text-[70px]">SIGN IN</p>
        </div>

        <AppWindow
          className="relative z-10"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-heading-01 font-bold text-ink leading-[1.0]">
              Create your<br />
              account
            </h1>
            <p className="text-body-02 text-placeholder">
              흩어진 기록을 모아, 나를 보여주는 모든 페이지를 최신으로 관리해보세요.
            </p>
          </div>

          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
            <Input
              label="이름"
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.name}
              placeholder="이름을 입력해주세요"
            />
            <Input
              label="이메일"
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.email}
              placeholder="email@example.com"
            />
            <Input
              label="비밀번호"
              required
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.password}
              placeholder="8자 이상 입력해주세요"
            />
            <Input
              label="비밀번호 확인"
              required
              type="password"
              name="passwordCheck"
              value={form.passwordCheck}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={errors.passwordCheck}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            <div className="flex w-full mt-3 items-center justify-between">
              <div className="flex items-center justify-center gap-[10px]">
                <p className="text-caption-01 text-placeholder leading-none">
                  이미 계정이 있으신가요?
                </p>
                <span 
                  className="text-caption-01 font-bold text-placeholder leading-none"
                  onClick={() => navigate(`/login`)}
                >
                  로그인
                </span>
              </div>

              <CTAButton
                type="submit"
                disabled={!isFormComplete || isSubmitting}
              >
                {isSubmitting ? "가입 중..." : "회원가입"}
              </CTAButton>
            </div>
          </form>
        </AppWindow>
      </main>
      <Footer/>
    </div>
  )
}
