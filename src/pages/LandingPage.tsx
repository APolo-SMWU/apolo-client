import Header from '@/components/layout/Header'
import { WindowCard } from '@/components/WindowCard'
import LandingChip from '@/components/LandingChip'
import Footer from '../components/layout/Footer';
import { useNavigate } from 'react-router-dom';

function ListRow({ active = false, children }: { active?: boolean; children: string }) {
  return (
    <div
      className={`flex h-12 items-center border border-ink px-4 text-body-02 ${
        active ? 'bg-primary font-bold text-white' : 'bg-white font-medium text-ink'
      }`}
    >
      {children}
    </div>
  )
}

export function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <Header />
      <main className="flex-1 overflow-visible px-8 py-4">
        <section className="relative mx-auto min-h-[840px] w-full max-w-[1440px] overflow-visible">
          <div className="pointer-events-none absolute inset-0 z-0 select-none">
            <p className="absolute left-[92px] top-[20px] text-[120px] text-ink">
              AI PORTFOLIO
            </p>
            <p className="absolute left-[360px] top-[160px] text-[120px] text-ink">
              GENERATOR
            </p>
            <p className="absolute left-[110px] top-[310px] text-[100px] text-[rgba(17,17,17,0.05)]">
              BLOCK EDITOR
            </p>
          </div>

            <WindowCard
              label="APOLO_INTRO"
              variant="black"
              className="absolute left-[80px] top-[100px] w-[400px]"
              bodyClassName="flex flex-col gap-3 p-6 items-start justify-center"
            >
              <h2 className="text-heading-03 font-bold text-ink leading-[1.2]">
                AI가 포트폴리오 초안을 설계하고,<br />
                사용자는 블록 단위로 편집합니다.
              </h2>
              <p className="text-body-02 text-placeholder leading-[1.5]">
                직무별 컴포넌트와 검증된 레이아웃 구조로
                <br />
                포트폴리오를 빠르게 만들 수 있습니다.
              </p>
              <LandingChip 
                onClick={() => navigate(`/signup`)}
                active
                className="w-[120px] h-[36px] text-body-02 transition-transform duration-100 active:scale-90"
              >
                시작하기
              </LandingChip>
            </WindowCard>

            <WindowCard
              label="JOB_SELECT"
              className="absolute left-[550px] top-[10px] w-[320px]"
              bodyClassName="flex flex-col gap-3 px-6 py-4 items-start justify-center"
            >
              <div className='flex flex-col items-start gap-1'>
                <h3 className="text-heading-03 font-bold text-ink leading-none">무엇을 만들까요?</h3>
                <p className="text-body-02 leading-[1.4] text-placeholder">
                  선택한 직무에 맞는 블록이 추천됩니다.
                </p>
              </div>
              
              <div className="flex items-center justify-center gap-[10px]">
                <LandingChip active className='text-caption-01'>개발자</LandingChip>
                <LandingChip className='text-caption-01'>디자이너</LandingChip>
                <LandingChip className='text-caption-01'>대학원 CV</LandingChip>
              </div>
              <p className="text-caption-01 text-placeholder leading-[1.4]">더 다양한 직무도 가능합니다.</p>
            </WindowCard>

            <WindowCard
              label="CAREER_LEVEL"
              className="absolute left-[940px] top-[140px] w-[314px]"
              bodyClassName="flex flex-col gap-3 p-4"
            >
              <h3 className="text-title-01 font-bold text-ink">경력 수준</h3>
              <div className="flex flex-wrap gap-[10px]">
                <LandingChip active className='text-body-02 w-20'>Entry</LandingChip>
                <LandingChip className='text-body-02'>3+ years</LandingChip>
                <LandingChip className='text-body-02'>5+ years</LandingChip>
                <LandingChip className='text-body-02 w-[100px]'>10+ years</LandingChip>
              </div>
            </WindowCard>

            <WindowCard
              label="PROMPT"
              className="absolute left-[300px] top-[360px] w-[470px]"
              bodyClassName="flex flex-col gap-2 p-4"
            >
              <h3 className="text-title-01 font-bold text-ink">원하는 포트폴리오 설명해주세요.</h3>
              <div className="h-18 border border-ink p-4 text-body-02 text-ink">
                특별히 요청하고 싶은 점이 있다면, 작성할 수 있습니다.
              </div>
              <p className="text-right text-caption-01 text-placeholder">31 / 2000</p>
              <div className='flex justify-end'>
                <LandingChip active className="w-[200px] text-body-02">
                  GENERATE PORTFOLIO
                </LandingChip>
              </div>
            </WindowCard>

            <WindowCard
              label="GENERATED_PORTFOLIO"
              variant="black"
              className="absolute left-[900px] top-[350px] w-[428px]"
              bodyClassName="flex flex-col gap-3 p-5"
            >
              <div className='flex flex-col gap-1'>
                <h3 className="text-title-01 font-bold text-ink">Generated Layout</h3>
                <p className="text-body-02 text-placeholder leading-[1.4]">
                  검증된 블록 구조가 즉시 미리보기로 연결됩니다.
                </p>
              </div>
              <div className="space-y-3">
                <ListRow>01 Hero / Profile</ListRow>
                <ListRow>02 Project / Troubleshooting</ListRow>
                <ListRow active>03 Skills / Links</ListRow>
              </div>
            </WindowCard>

            <WindowCard
              label="APOLO_INTRO"
              variant="black"
              className="absolute left-[90px] top-[630px] w-[330px]"
              bodyClassName="flex flex-col gap-3 p-4"
            >
              <div className='flex flex-col gap-1 items-start'>
                <p className="text-body-01 text-ink leading-[1.2]">
                  AI가 사용자의 직무, 경력, 요청사항을 해석해 포트폴리오 구조를 생성합니다.
                </p>
                <p className="text-body-02 font-medium text-primary leading-[1.5]">
                  {'{ portfolioTemplate + portfolioContent }'}
                </p>
              </div>
              <div className='flex justify-end'>
                <LandingChip className='text-body-02'>START</LandingChip>
              </div>
              
            </WindowCard>

            <WindowCard
              label="BLOCK_EDITOR"
              className="absolute left-[500px] top-[670px] w-[540px]"
              bodyClassName="flex flex-col p-4 gap-4"
            >
              <div className="flex items-center gap-2">
                <h3 className="mr-4 text-title-02 font-bold text-ink">편집 모드</h3>
                <LandingChip className='text-body-02'>+ BLOCK</LandingChip>
                <LandingChip className='text-body-02'>DELETE</LandingChip>
                <LandingChip className='text-body-02'>PREVIEW</LandingChip>
                <LandingChip active className='text-body-02'>SHARE</LandingChip>
              </div>
              <p className="text-caption-01 text-placeholder">
                생성된 포트폴리오를 블록 단위로 추가, 삭제, 수정할 수 있습니다.
              </p>
            </WindowCard>

          <WindowCard
            label="SHARE"
            variant="black"
            className="absolute left-[1120px] top-[700px] w-[170px]"
            bodyClassName="flex flex-col gap-2 px-4 py-2"
          >
            <div className='flex flex-col gap-1 items-start'>
              <p className="text-caption-01 text-ink leading-[1.4]">Portfolio sharing page</p>
              <p className="text-caption-02 text-placeholder leading-[1.4]">URL copy / public view</p>
            </div>
            <div className='flex justify-end'>
              <LandingChip className='text-caption-01'>OPEN</LandingChip>
            </div>
          </WindowCard>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default LandingPage
