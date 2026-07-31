import Footer from "../../components/layout/Footer";
import Header from "../../components/layout/Header";
import { WindowCard } from "../../components/WindowCard";

export default function LoginPage() {
  return (
    <div>
      <Header/>
      <div className="flex-1 overflow-y-hidden items-center justify-center">
        <WindowCard
          label="AUTH_LOGIN"
          variant="black"
          className="w-[530px]"
          bodyClassName="flex flex-col items-start justify-center p-[30px] gap-6"
        >
          <div className="flex flex-col gap-2">
            <h1 className="text-heading-01 font-bold text-ink leading-none">
              Login your<br />
              account
            </h1>
            <p className="text-body-02 text-placeholder leading-none">
              로그인하고 포트폴리오를 관리할 수 있습니다.
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