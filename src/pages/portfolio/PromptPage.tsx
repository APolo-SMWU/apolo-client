import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WindowCard } from "@/components/WindowCard";
import CTAButton from "@/components/common/CTAButton";
import SingleSelectGroup from "@/components/common/SingleSelectGroup";
import {
  CAREER_LABEL,
  JOB_ROLE_LABEL,
  type CareerOption,
  type JobRoleOption,
} from "@/api/portfolios";
import { useState } from "react";

export default function PromptPage() {
  const [jobRole, setJobRole] = useState<JobRoleOption | null>(null);
  const [careerLevel, setCareerLevel] = useState<CareerOption | null>(null);

  const jobRoleOptions = Object.entries(JOB_ROLE_LABEL).map(([value, label]) => ({
    label,
    value: value as JobRoleOption,
  }));

  const careerOptions = Object.entries(CAREER_LABEL).map(([value, label]) => ({
    label,
    value: value as CareerOption,
  }));

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative flex flex-1 flex-col grid-cols-[minmax(160px,1fr)_760px_minmax(160px,1fr)] items-start overflow-hidden p-10">
        {/* 왼쪽 필드 */}
        <section className="flex flex-col items-start ">

        </section>
        {/* 중앙 prompt */}
        <section className="flex flex-col items-start gap-5">
          <div className="flex flex-col gap-2 items-start">
            <h1 className="text-display-01 font-bold text-ink leading-none">AI 포트폴리오 생성</h1>
            <p className="text-body-02 text-placeholder leading-none">직무, 경험, 프로젝트 정보를 입력하면 AI가 포트폴리오 초안을 생성해요.</p>
          </div>
          <WindowCard
            label="GENERATION_FORM"
            variant="blue"
            className="relative z-10 w-[760px]"
            bodyClassName="flex flex-col p-[30px] gap-7"
          >
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-title-02 font-bold text-ink leading-none">
                1. 직무 선택
              </h2>
              <SingleSelectGroup
                value={jobRole}
                onChange={setJobRole}
                options={jobRoleOptions}
                optionClassName="w-[154px] h-8"
              />
            </div>
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-title-02 font-bold text-ink leading-none">
                2. 경력 수준
              </h2>
              <SingleSelectGroup
                value={careerLevel}
                onChange={setCareerLevel}
                options={careerOptions}
                optionClassName="w-[154px] h-8"
              />
            </div>
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-title-02 font-bold text-ink leading-none">
                3. 외부 페이지 링크
              </h2>
              <div>

              </div>
            </div>
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-title-02 font-bold text-ink leading-none">
                4. 원하는 방향
              </h2>
              <div>

              </div>
            </div>
            <div className="w-full flex items-end">
              <CTAButton
                type="submit"
                className="w-[210px] h-10"
              >
                생성하기
              </CTAButton>
            </div>
          </WindowCard>

        </section>
        {/* 오른쪽 필드 */}
        <section>

        </section>
      </main>
      <Footer />
    </div>
  )
};
