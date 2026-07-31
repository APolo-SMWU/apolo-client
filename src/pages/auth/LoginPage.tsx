import AuthInput from "../../components/auth/AuthInput";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { WindowCard } from "../../components/WindowCard";
import CTAButton from "../../components/common/CTAButton";
import Button from "@/components/common/Button";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-dvh flex-col">
      <Header/>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-ink/6">
          <p className="text-[80px]">WELCOME</p>
          <p className="ml-44 text-[70px]">LOGIN</p>
        </div>

        <WindowCard
          label="AUTH_SIGN_UP"
          variant="black"
          className="relative z-10 w-[530px]"
          bodyClassName="flex flex-col items-start justify-center p-[30px] gap-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-heading-01 font-bold text-ink leading-none">
              Create your<br />
              account
            </h1>
            <p className="text-body-02 text-placeholder leading-none">
              로그인하고 포트폴리오를 관리할 수 있습니다.
            </p>
          </div>

          <form className="flex flex-col w-full gap-3">
            <AuthInput
              label="이메일"
              type="email"
              placeholder="email@example.com"
              className="w-full"
            />
            <AuthInput
              label="비밀번호"
              type="password"
              placeholder="8자 이상 입력해주세요"
              className="w-full"
            />
            <div className="flex w-full mt-3 items-center justify-between">
              <Button
                className="w-[210px] h-10"
              >
                Google로 계속하기
              </Button>
              <CTAButton
                className="w-[210px] h-10"
              >
                로그인
              </CTAButton>
            </div>
          </form>
          <div className="flex w-full items-center justify-center gap-[10px] text-body-02 text-placeholder leading-none">
            <span onClick={() => navigate(`/signup`)}>회원가입</span>
            <div className="h-3 w-px bg-placeholder" />
            <span onClick={() => navigate(`/find-email`)}>이메일 찾기</span>
            <div className="h-3 w-px bg-placeholder" />
            <span onClick={() => navigate(`/find-password`)}>비밀번호 찾기</span>
          </div>
        </WindowCard>
      </main>
      <Footer/>
    </div>
  )
}