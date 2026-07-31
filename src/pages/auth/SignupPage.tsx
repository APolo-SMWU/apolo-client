import { useNavigate } from "react-router-dom";
import AuthInput from "../../components/auth/AuthInput";
import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { WindowCard } from "../../components/WindowCard";
import CTAButton from "../../components/common/CTAButton";

export default function SignupPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col">
      <Header/>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-ink/6">
          <p className="text-[80px]">WELCOME</p>
          <p className="ml-44 text-[70px]">SIGN IN</p>
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
              저장, 공유, 커뮤니티 기능을 사용하려면 계정이 필요합니다.
            </p>
          </div>

          <form className="flex flex-col w-full gap-3">
            <AuthInput
              label="닉네임"
              placeholder="닉네임을 입력해주세요"
              className="w-full"
            />
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
            <AuthInput
              label="비밀번호 확인"
              type="password"
              placeholder="비밀번호를 다시 입력해주세요"
              className="w-full"
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
                className="w-[210px] h-10"
              >
                회원가입
              </CTAButton>
            </div>
          </form>
        </WindowCard>
      </main>
      <Footer/>
    </div>
  )
}