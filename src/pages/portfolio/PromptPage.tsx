import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { WindowCard } from "@/components/WindowCard";
import Button from "@/components/common/Button";
import CTAButton from "@/components/common/CTAButton";
import SingleSelectGroup from "@/components/common/SingleSelectGroup";
import PlusIcon from "@/assets/Plus.svg?react";
import DeleteIcon from "@/assets/Delete.svg?react";
import {
  CAREER_LABEL,
  JOB_ROLE_LABEL,
  type CareerOption,
  type JobRoleOption,
} from "@/api/portfolios";

export default function PromptPage() {
  const navigate = useNavigate();
  const [jobRole, setJobRole] = useState<JobRoleOption | null>(null);
  const [careerLevel, setCareerLevel] = useState<CareerOption | null>(null);
  const [linkInput, setLinkInput] = useState("");
  const [externalLinks, setExternalLinks] = useState<string[]>([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const linkInputRef = useRef<HTMLInputElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const maxPromptLength = 2000;

  const jobRoleOptions = Object.entries(JOB_ROLE_LABEL).map(([value, label]) => ({
    label,
    value: value as JobRoleOption,
  }));

  const careerOptions = Object.entries(CAREER_LABEL).map(([value, label]) => ({
    label,
    value: value as CareerOption,
  }));

  const isSubmitDisabled = !jobRole || !careerLevel || !userPrompt.trim();

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const nextFiles = Array.from(event.target.files ?? []);

    if (nextFiles.length === 0) {
      return;
    }

    setAttachments((current) => [...current, ...nextFiles]);
    event.target.value = "";
  };

  const handleRemoveAttachment = (targetIndex: number) => {
    setAttachments((current) =>
      current.filter((_, index) => index !== targetIndex),
    );
  };

  const commitExternalLink = () => {
    const nextLink = linkInput.trim();

    if (!nextLink) {
      setLinkInput("");
      return;
    }

    setExternalLinks((current) =>
      current.includes(nextLink) ? current : [...current, nextLink],
    );
    setLinkInput("");
  };

  const handleRemoveExternalLink = (targetIndex: number) => {
    setExternalLinks((current) =>
      current.filter((_, index) => index !== targetIndex),
    );
  };

  const handleEditExternalLink = (targetIndex: number) => {
    setExternalLinks((current) => {
      const targetLink = current[targetIndex];

      if (!targetLink) {
        return current;
      }

      setLinkInput(targetLink);
      requestAnimationFrame(() => {
        const input = linkInputRef.current;
        input?.focus();
        if (input) {
          const cursorPosition = input.value.length;
          input.setSelectionRange(cursorPosition, cursorPosition);
        }
      });
      return current.filter((_, index) => index !== targetIndex);
    });
  };

  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="relative grid flex-1 grid-cols-[minmax(160px,1fr)_760px_minmax(160px,1fr)] items-start overflow-hidden p-10">

        {/* 왼쪽 필드 */}
        <section className="flex flex-col items-start gap-75 px-9 justify-self-end">
          <Button
            type="button"
            className="w-[140px] h-9"
            onClick={() => navigate(-1)}
          >
            뒤로가기
          </Button>
          <WindowCard
            label="LINK_PRECAUTION"
            variant="black"
            className="relative z-10"
            bodyClassName="flex flex-col p-4 gap-5"
          >
            <div className="flex flex-col gap-2 items-start">
              <h3 className="text-title-01 font-bold text-danger leading-none">링크 첨부 주의사항</h3>
              <p className="text-caption-01 text-placeholder leading-none">접근할 수 있는 페이지여야 해요.</p>
            </div>
            <ul className="list-disc pl-4 text-body-02 text-ink whitespace-nowrap">
              <li>Github - public으로 되어있나요?</li>
              <li>Notion - 외부 게시가 되어있나요?</li>
              <li>기타 - 접근 권한이 허용되어 있나요?</li>
            </ul>
          </WindowCard>
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
              <div className="flex min-h-11 w-full flex-wrap items-center gap-2 border border-ink bg-white px-4 py-2">
                {externalLinks.map((link, index) => (
                  <div
                    key={`${link}-${index}`}
                    className="flex max-w-full items-center gap-1 rounded-full bg-focus/70 px-2 py-1 text-body-02 text-placeholder"
                  >
                    <button
                      type="button"
                      className="max-w-[240px] truncate text-left"
                      onClick={() => handleEditExternalLink(index)}
                    >
                      {link}
                    </button>
                    <button
                      type="button"
                      className="shrink-0"
                      onClick={() => handleRemoveExternalLink(index)}
                      aria-label={`${link} 삭제`}
                    >
                      <DeleteIcon className="size-3" />
                    </button>
                  </div>
                ))}
                <input
                  ref={linkInputRef}
                  value={linkInput}
                  onChange={(event) => setLinkInput(event.target.value)}
                  onBlur={commitExternalLink}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      commitExternalLink();
                    }

                    if (
                      (event.key === "Backspace" || event.key === "Delete") &&
                      linkInput.length === 0 &&
                      externalLinks.length > 0
                    ) {
                      event.preventDefault();
                      handleRemoveExternalLink(externalLinks.length - 1);
                    }
                  }}
                  className="h-7 min-w-[240px] flex-1 bg-transparent outline-none caret-primary text-body-02 text-ink placeholder:text-placeholder leading-none"
                  placeholder={
                    externalLinks.length === 0
                      ? "GitHub, 배포 링크, Behance, 논문 정리 페이지 등의 링크를 넣어주세요."
                      : ""
                  }
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 items-start">
              <h2 className="text-title-02 font-bold text-ink leading-none">
                4. 원하는 방향
              </h2>
              <div className="flex w-full flex-col border border-ink bg-white px-4 py-3">
                <textarea
                  value={userPrompt}
                  onChange={(event) => setUserPrompt(event.target.value)}
                  maxLength={maxPromptLength}
                  className="min-h-[90px] w-full resize-none bg-transparent outline-none caret-primary text-body-02 text-ink placeholder:text-placeholder leading-[1.4]"
                  placeholder="예: 프로젝트마다 내가 맡은 역할과 트러블 슈팅이 잘 보이게 구성해줘."
                />
                <div className="flex items-center h-6 justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                      className="hidden"
                      onChange={handleAttachmentChange}
                    />
                    <button
                      type="button"
                      className="size-5 outline-none"
                      onClick={() => fileInputRef.current?.click()}
                      aria-label="사진이나 문서 첨부"
                    >
                      <PlusIcon className="size-5"/>
                    </button>
                    {attachments.length > 0 ? (
                      attachments.map((file, index) => (
                        <div
                          key={`${file.name}-${index}`}
                          className="flex max-w-[220px] items-center gap-1 bg-focus/80 rounded-full px-2 py-1 text-caption-01 text-placeholder"
                        >
                          <span className="truncate">{file.name}</span>
                          <button
                            type="button"
                            className="shrink-0"
                            onClick={() => handleRemoveAttachment(index)}
                            aria-label={`${file.name} 삭제`}
                          >
                            <DeleteIcon className="size-3" />
                          </button>
                        </div>
                      ))
                    ) : null}
                  </div>
                  <p className="text-caption-01 text-placeholder">
                    {userPrompt.length} / {maxPromptLength}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end">
              <CTAButton
                type="submit"
                disabled={isSubmitDisabled}
                className="w-[210px] h-10"
                onClick={() => navigate(`/generate-loading`)}
              >
                생성하기
              </CTAButton>
            </div>
          </WindowCard>
        </section>

        {/* 오른쪽 필드 */}
        <section className="flex flex-col items-start gap-30 px-9 justify-self-start">
          <WindowCard
            label="TIP"
            variant="black"
            className="relative z-10 w-[266px]"
            bodyClassName="p-4"
          >
            <p className=" text-body-02 text-ink">
              프로젝트 링크, 담당 역할,<br />
              원하는 블록을 함께 적으면 더 정확해요.
            </p>
          </WindowCard>
          <WindowCard
            label="PROMPT_GUIDE"
            variant="black"
            className="relative z-10 w-[266px]"
            bodyClassName="flex flex-col p-4 gap-5"
          >
            <div className="flex flex-col gap-2 items-start">
              <h3 className="text-title-01 font-bold text-ink leading-none">입력 가이드</h3>
              <p className="text-caption-01 text-placeholder leading-[1.4]">
                아래의 내용을 포함시키면<br/>
                더 좋은 결과물을 만들어낼 수 있어요.
              </p>
            </div>
            <ul className="list-disc pl-4 text-body-02 text-ink whitespace-nowrap">
              <li>프로젝트 개수</li>
              <li>원하는 분위기</li>
              <li>맡은 역할</li>
              <li>사용 기술/툴</li>
              <li>어려웠던 문제</li>
              <li>첨부 파일 (예: jpg, pdf, pptx)</li>
            </ul>
          </WindowCard>
        </section>
      </main>
      <Footer />
    </div>
  )
};
