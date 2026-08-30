import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppWindow from "@/components/AppWindow";
import Button from "@/components/common/Button";

export default function MyPage() {

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden p-16 gap-10">
        <AppWindow
          className="relative z-10 w-[500px]"
        >
          <h1 className="text-heading-03 font-bold text-ink">홍길동</h1>

          <div className="flex flex-col w-full gap-3 items-start">
            <div className="flex w-full gap-4 items-center justify-start text-body-02 text-ink leading-none text-start">
              <div className="flex w-16 gap-1 border-r border-primary">
                <p>Email</p>
              </div>
              <p>test@gmail.com</p>
            </div>
            <div className="flex w-full gap-4 items-center justify-start text-body-02 text-ink leading-none text-start">
              <div className="flex w-16 gap-1 border-r border-primary">
                <p>Phone</p>
              </div>
              <p>010-1234-5678</p>
            </div>
            <div className="flex w-full gap-4 items-center justify-start text-body-02 text-ink leading-none text-start">
              <div className="flex w-16 gap-1 border-r border-primary">
                <p>Address</p>
              </div>
              <p>서울 용산구 청파로 47길 100</p>
            </div>
            <div className="flex w-full gap-4 items-center justify-start text-body-02 text-ink leading-none text-start">
              <div className="flex w-16 gap-1 border-r border-primary">
                <p>GitHub</p>
              </div>
              <p>https://github.com/canofmato</p>
            </div>

          </div>

          <div className="flex w-full items-center justify-between">
            <Button>
              프로필 수정
            </Button>
            <Button>
              로그아웃
            </Button>

          </div>
        </AppWindow>

        
      </main>
      <Footer />
    </div>
  )
}