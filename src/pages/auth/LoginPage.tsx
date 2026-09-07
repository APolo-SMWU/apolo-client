import Input from "@/components/Input";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import AppWindow from "@/components/AppWindow";
import CTAButton from "@/components/common/CTAButton";
import { useNavigate } from "react-router-dom";
import { useState, type ChangeEvent, type FocusEvent, type FormEvent } from "react";
import {
  mapServerErrors,
  type ApiErrorResponse,
} from '@/api/api';
import { getMe, type LoginRequest, login } from "@/api/auth";

type LoginErrors = Partial<
  Record<"email" | "password",string>
>;


export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginRequest>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginErrors>({});
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

  function validate(values: LoginRequest): LoginErrors {
    const nextErrors: LoginErrors = {};

    const emailError = validateField("email", values.email);
    const passwordError = validateField("password", values.password);

    if (emailError) nextErrors.email = emailError;
    if (passwordError) nextErrors.password = passwordError;

    return nextErrors;
  }

  function validateField(name: keyof LoginRequest, value: string) {
    switch (name) {
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

      default:
        return "";
    }
  }

  function handleBlur(event: FocusEvent<HTMLInputElement>) {
    const { name, value } = event.target;

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name as keyof LoginRequest, value),
    }));
  }

  const isFormComplete =
    form.email.trim() !== "" &&
    form.password.trim() !== "";

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

      const response = await login(form);
      localStorage.setItem("accessToken", response.accessToken);

      const me = await getMe();
      navigate(me.onboardingCompleted ? "/home" : "/onboarding");
    } catch (error) {
      const apiError = error as ApiErrorResponse;

      if (apiError.errors?.length) {
        setErrors(mapServerErrors(apiError.errors) as LoginErrors);
        return;
      }

      if (apiError.status === 401) {
        setErrors({
          email: apiError.message || "가입된 이메일이 아닙니다.",
        });
        return;
      }

      setErrors({
        email: apiError.message || "로그인 중 오류가 발생했습니다.",
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
          <p className="ml-44 text-[70px]">LOGIN</p>
        </div>

        <AppWindow
          className="relative z-10"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-heading-01 font-bold text-ink leading-[1.0]">
              Login your<br />
              account
            </h1>
            <p className="text-body-02 text-placeholder">
              연결해둔 기록과 포트폴리오를 이어서 관리해보세요.
            </p>
          </div>

          <form className="flex flex-col w-full gap-3" onSubmit={handleSubmit}>
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
            <div className="flex w-full mt-3 items-center justify-between">
              <div className="flex items-center justify-center gap-[10px] text-caption-01 text-placeholder leading-none">
                <span onClick={() => navigate(`/signup`)}>회원가입</span>
                <div className="h-3 w-px bg-placeholder" />
                <span onClick={() => navigate(`/find-password`)}>비밀번호 찾기</span>
              </div>
              <CTAButton
                type="submit"
                disabled={!isFormComplete || isSubmitting}
              >
                {isSubmitting ? "로그인 중..." : "로그인"}
              </CTAButton>
            </div>
          </form>
        </AppWindow>
      </main>
      <Footer/>
    </div>
  )
}
