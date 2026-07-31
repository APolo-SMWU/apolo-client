import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { WindowCard } from "../../components/WindowCard";

export default function SignupPage() {
  return (
    <div>
      <Header/>
      <div className="flex-1 overflow-y-hidden items-center justify-center">
        <WindowCard
          label="AUTH_SIGN_UP"
          variant="black"
          className="w-[530px]"
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

          <form className="flex flex-col gap-3">

          </form>

        </WindowCard>
      </div>
      <Footer/>
    </div>
  )
}