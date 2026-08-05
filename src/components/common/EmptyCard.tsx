import { useNavigate } from "react-router-dom"

export default function EmptyCard() {
  const navigate = useNavigate();
  return (
    <section className="overflow-hidden w-[360px] border border-placeholder bg-white">
      <header className="flex h-[30px] items-center justify-between bg-placeholder/50 border-b border-placeholder px-4 text-caption-02 font-bold text-white">
        <span>C://DASHBOARD</span>
        <span className="flex gap-[6px]" aria-hidden="true">
          <i className="block h-3 w-3 border border-white" />
          <i className="block h-3 w-3 border border-white" />
          <i className="block h-3 w-3 border border-white" />
        </span>
      </header>
      <div className="flex flex-col items-start justify-center gap-5 px-5 pt-[30px] pb-5">
        <div className="flex flex-col items-start gap-3">
          <h3 className="text-title-01 font-bold text-placeholder leading-none">아직 만들어진 포트폴리오가 없어요.</h3>
          <p className="text-body-02 text-placeholder leading-none">나만의 포트폴리오를 만들어보세요</p>
        </div>
        <div className="flex w-full justify-end">
          <button
            type="button"
            onClick={() => navigate(`/prompt`)}
            className="
              flex w-[140px] h-9 items-center justify-center bg-white border border-placeholder text-body-02 font-regular text-placeholder leading-none 
              hover:bg-primary hover:border-ink hover:text-white hover:font-bold"
          >
            포트폴리오 만들기
          </button>
        </div>
        
      </div>
    </section>
  )
}