import Footer from '../components/layout/Footer'
import Header from '../components/layout/Header'
import { WindowCard } from '../components/WindowCard'

type ChipProps = {
  active?: boolean
  children: string
  className?: string
}

function Chip({ active = false, children, className = '' }: ChipProps) {
  return (
    <span
      className={`inline-flex h-[30px] items-center border border-[var(--color-ink)] px-3 text-[12px] leading-none ${
        active ? 'bg-[var(--color-primary)] font-bold text-white' : 'bg-white font-medium text-[var(--color-ink)]'
      } ${className}`}
    >
      {children}
    </span>
  )
}

type ActionButtonProps = {
  inverted?: boolean
  children: string
  className?: string
}

function ActionButton({ inverted = false, children, className = '' }: ActionButtonProps) {
  return (
    <button
      type="button"
      className={`inline-flex h-[30px] items-center justify-center border border-[var(--color-ink)] px-4 text-[13px] font-bold ${
        inverted ? 'bg-white text-[var(--color-ink)]' : 'bg-[var(--color-primary)] text-white'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function ListRow({ active = false, children }: { active?: boolean; children: string }) {
  return (
    <div
      className={`flex h-12 items-center border border-[var(--color-ink)] px-4 text-[13px] ${
        active ? 'bg-[var(--color-primary)] font-bold text-white' : 'bg-white font-medium text-[var(--color-ink)]'
      }`}
    >
      {children}
    </div>
  )
}

export function LandingPage() {
  return (
    <main className='w-full min-h-screen mx-auto flex flex-col items-center justify-center'>
      <Header/>
      <section className="mx-auto flex min-h-screen min-w-[1440px] items-center justify-center bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_100%)] px-8 py-10">
        <div className="relative h-[842px] w-[1440px] overflow-hidden bg-white">
          <div className="pointer-events-none absolute inset-0 z-0 select-none">
            <p className="absolute left-[92px] top-[134px] text-[126px] font-normal uppercase leading-[0.92] tracking-[-0.07em] text-[rgba(17,17,17,0.08)]">
              AI PORTFOLIO
            </p>
            <p className="absolute left-[382px] top-[262px] text-[118px] font-normal uppercase leading-[0.92] tracking-[-0.07em] text-[rgba(17,17,17,0.08)]">
              GENERATOR
            </p>
            <p className="absolute left-[112px] top-[390px] text-[108px] font-normal uppercase leading-[0.92] tracking-[-0.07em] text-[rgba(17,17,17,0.05)]">
              BLOCK EDITOR
            </p>
          </div>

          <div className="pointer-events-none absolute left-[416px] top-[236px] z-[1] h-px w-[58px] rotate-[23deg] bg-[var(--color-ink)]" />
          <div className="pointer-events-none absolute left-[772px] top-[204px] z-[1] h-px w-[164px] rotate-[-7deg] bg-[var(--color-ink)]" />
          <div className="pointer-events-none absolute left-[716px] top-[504px] z-[1] h-px w-[76px] bg-[var(--color-ink)]" />
          <div className="pointer-events-none absolute left-[421px] top-[701px] z-[1] h-px w-[82px] rotate-[-17deg] bg-[var(--color-ink)]" />

          <div className="relative z-10 h-full">
            <WindowCard
              label="C://APOLO_INTRO"
              variant="black"
              className="absolute left-[64px] top-[163px] w-[400px]"
              bodyClassName="px-[28px] pb-3 pt-[24px]"
            >
              <h2 className="text-[24px] font-bold leading-[1.28] text-[var(--color-ink)]">
                AI가 포트폴리오 초안을 설계하고,
                <br />
                사용자는 블록 단위로 편집합니다.
              </h2>
              <p className="mt-4 text-[14px] leading-[1.45] text-[#667085]">
                직무별 컴포넌트와 검증된 레이아웃 구조로
                <br />
                포트폴리오를 빠르게 만들 수 있습니다.
              </p>
              <ActionButton className="mt-5 h-[36px] w-[120px] justify-center px-0 text-[14px]">시작하기</ActionButton>
            </WindowCard>

            <WindowCard
              label="C://JOB_SELECT"
              className="absolute left-[518px] top-[109px] w-[320px]"
              bodyClassName="px-4 pb-4 pt-4"
            >
              <h3 className="text-[22px] font-bold leading-[1.2] text-[var(--color-ink)]">무엇을 만들까요?</h3>
              <p className="mt-2 text-[13px] leading-[1.4] text-[#667085]">
                선택한 직무에 맞는 블록이 추천됩니다.
              </p>
              <div className="mt-5 flex gap-[10px]">
                <Chip active className="w-[58px] justify-center px-0">
                  개발자
                </Chip>
                <Chip className="w-[74px] justify-center px-0">디자이너</Chip>
                <Chip className="w-[96px] justify-center px-0">대학원 CV</Chip>
              </div>
              <p className="mt-4 text-[13px] leading-[1.4] text-[#667085]">더 다양한 직무도 가능합니다.</p>
            </WindowCard>

            <WindowCard
              label="C://CAREER_LEVEL"
              className="absolute left-[936px] top-[168px] w-[314px]"
              bodyClassName="px-4 pb-4 pt-4"
            >
              <h3 className="text-[20px] font-bold text-[var(--color-ink)]">경력 수준</h3>
              <div className="mt-5 flex flex-wrap gap-[10px]">
                <Chip active className="w-[78px] justify-center px-0 text-[13px]">
                  Entry
                </Chip>
                <Chip className="w-[96px] justify-center px-0 text-[13px]">3+ years</Chip>
                <Chip className="w-[84px] justify-center px-0 text-[13px]">5+ years</Chip>
                <Chip className="w-[106px] justify-center px-0 text-[13px]">10+ years</Chip>
              </div>
            </WindowCard>

            <WindowCard
              label="C://PROMPT"
              className="absolute left-[246px] top-[399px] w-[470px]"
              bodyClassName="px-[18px] pb-4 pt-[18px]"
            >
              <h3 className="text-[19px] font-bold text-[var(--color-ink)]">원하는 포트폴리오 설명해주세요.</h3>
              <div className="mt-5 h-[76px] border border-[var(--color-ink)] px-4 py-4 text-[15px] leading-[1.45] text-[var(--color-ink)]">
                특별히 요청하고 싶은 점이 있다면, 작성할 수 있습니다.
              </div>
              <p className="mt-1 text-right text-[11px] text-[#667085]">31 / 2000</p>
              <ActionButton className="mt-4 ml-auto h-[28px] w-[200px] justify-center px-0 text-[14px]">
                GENERATE PORTFOLIO
              </ActionButton>
            </WindowCard>

            <WindowCard
              label="C://GENERATED_PORTFOLIO"
              variant="black"
              className="absolute left-[792px] top-[392px] w-[428px]"
              bodyClassName="px-5 pb-5 pt-[18px]"
            >
              <h3 className="text-[20px] font-bold text-[var(--color-ink)]">Generated Layout</h3>
              <p className="mt-2 text-[14px] leading-[1.4] text-[#667085]">
                검증된 블록 구조가 즉시 미리보기로 연결됩니다.
              </p>
              <div className="mt-5 space-y-3">
                <ListRow>01 Hero / Profile</ListRow>
                <ListRow>02 Project / Troubleshooting</ListRow>
                <ListRow active>03 Skills / Links</ListRow>
              </div>
            </WindowCard>

            <WindowCard
              label="C://APOLO_INTRO"
              variant="black"
              className="absolute left-[91px] top-[650px] w-[330px]"
              bodyClassName="px-[18px] pb-4 pt-[18px]"
            >
              <p className="text-[16px] leading-[1.45] text-[var(--color-ink)]">
                AI가 사용자의 직무, 경력, 요청사항을 해석해 포트폴리오 구조를 생성합니다.
              </p>
              <p className="mt-3 text-[13px] font-medium leading-[1.35] text-[var(--color-primary)]">
                {'{ portfolioTemplate + portfolioContent }'}
              </p>
              <ActionButton inverted className="mt-5 ml-auto h-[28px] w-[82px] justify-center px-0 text-[14px]">
                START
              </ActionButton>
            </WindowCard>

            <WindowCard
              label="C://BLOCK_EDITOR"
              className="absolute left-[498px] top-[682px] w-[560px]"
              bodyClassName="px-5 pb-4 pt-[18px]"
            >
              <div className="flex items-center gap-[10px]">
                <h3 className="mr-2 text-[18px] font-bold text-[var(--color-ink)]">편집 모드</h3>
                <ActionButton inverted className="h-[30px] px-3 text-[14px]">
                  + BLOCK
                </ActionButton>
                <ActionButton inverted className="h-[30px] px-3 text-[14px]">
                  DELETE
                </ActionButton>
                <ActionButton inverted className="h-[30px] px-3 text-[14px]">
                  PREVIEW
                </ActionButton>
                <ActionButton className="h-[30px] px-4 text-[14px]">SHARE</ActionButton>
              </div>
              <p className="mt-5 text-[13px] leading-[1.45] text-[#667085]">
                생성된 포트폴리오를 블록 단위로 추가, 삭제, 수정할 수 있습니다.
              </p>
            </WindowCard>

            <WindowCard
              label="C://SHARE"
              variant="black"
              className="absolute left-[1182px] top-[710px] w-[174px]"
              bodyClassName="px-3 pb-3 pt-3"
            >
              <p className="text-[11px] leading-[1.4] text-[var(--color-ink)]">Portfolio sharing page</p>
              <p className="mt-2 text-[10px] leading-[1.4] text-[#667085]">URL copy / public view</p>
              <ActionButton inverted className="mt-3 h-[20px] w-[44px] px-0 text-[12px]">
                OPEN
              </ActionButton>
            </WindowCard>
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  )
}

export default LandingPage
