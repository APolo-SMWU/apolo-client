import Header from '@/components/layout/Header'
import AppWindow from '@/components/AppWindow';
import Button from '@/components/common/Button';
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header/>
      <main className="relative flex flex-1 items-center justify-center overflow-hidden">
        {/* 배경글씨 */}
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-surface/65">
          <p className="text-[80px]">
            AI PERSONAL
          </p>
          <p className="ml-44 text-[70px]">
            ONLINE LINK
          </p>
          <p className="ml-22 text-[70px]">
            ORGANIZER
          </p>
        </div>
        <AppWindow
          className="relative z-10 w-[500px]"
        >
          <div className='flex flex-col gap-2'>
            <h2 className="text-title-01 font-bold text-ink leading-[1.4]">
              흩어진 기록을 연결해, 나의 온라인명함을 만들어요.
            </h2>
            <p className="text-caption-01 text-placeholder leading-[1.4]">
              GitHub·Notion·블로그의 정보를 하나로 모아<br />
              명함부터 포트폴리오, CV까지 항상 최신으로 관리하세요.
            </p>
          </div>
          <div className='flex w-full items-center justify-end'>
            <Button 
              onClick={() => navigate(`/signup`)}
            >
              시작하기
            </Button>
          </div>
        </AppWindow>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
