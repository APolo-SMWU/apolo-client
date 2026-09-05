import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import AppWindow from "@/components/AppWindow";
import CTAButton from "@/components/common/CTAButton";
import PlusIcon from "@/assets/Plus.svg?react";
import XIcon from "@/assets/X.svg?react";

const themes = [
  { id: "blue", label: "블루", colors: ["#F2F4F7", "#DCEBFF", "#245BFF", "#667085", "#111111"] },
  { id: "mono", label: "모노", colors: ["#FFFFFF", "#ECEEEF", "#222222", "#888888", "#111111"] },
  { id: "orange", label: "오렌지", colors: ["#F8F4EF", "#FFF0CC", "#FFAD20", "#827563", "#111111"] },
  { id: "purple", label: "퍼플", colors: ["#F5F1FA", "#F1DCFF", "#A020F0", "#796484", "#111111"] },
  { id: "green", label: "그린", colors: ["#F4F7EF", "#F0FFDD", "#80DB37", "#768063", "#111111"] },
] as const;

type Theme = (typeof themes)[number]["id"];
export type CreateCardRequest = {
  theme: Theme;
  externalLinks: string[];
  requirements: string;
  attachments: File[];
};

type CreatePageProps = {
  onCreate?: (request: CreateCardRequest) => void | Promise<void>;
};

function normalizeLink(value: string) {
  const text = value.trim();
  if (!text || /\s/.test(text)) return null;
  try {
    const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(text) ? text : `https://${text}`);
    return ["http:", "https:"].includes(url.protocol) && url.hostname.includes(".")
      ? url.href
      : null;
  } catch {
    return null;
  }
}

export default function CreatePage({ onCreate }: CreatePageProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const [links, setLinks] = useState<string[]>([]);
  const [linkInput, setLinkInput] = useState("");
  const [linkError, setLinkError] = useState("");
  const [requirements, setRequirements] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [attachmentError, setAttachmentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pendingLink = normalizeLink(linkInput);
  const isFormComplete = theme !== null
    && (links.length > 0 || pendingLink !== null)
    && (!linkInput.trim() || pendingLink !== null);

  function commitLink() {
    if (!linkInput.trim()) {
      setLinkInput("");
      return links;
    }
    const link = normalizeLink(linkInput);
    if (!link) {
      setLinkError("올바른 웹 페이지 주소를 입력해주세요.");
      return null;
    }
    const nextLinks = links.includes(link) ? links : [...links, link];
    setLinks(nextLinks);
    setLinkInput("");
    setLinkError("");
    return nextLinks;
  }

  function handleAttachments(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const validFiles = files.filter((file) => /\.(pdf|jpe?g|png)$/i.test(file.name));
    setAttachmentError(files.length === validFiles.length ? "" : "PDF, JPG, PNG 파일을 첨부해주세요.");
    setAttachments((current) => {
      const next = [...current];
      for (const file of validFiles) {
        if (!next.some((existing) => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) {
          next.push(file);
        }
      }
      return next;
    });
    event.target.value = "";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting || !theme) return;
    const externalLinks = commitLink();
    if (!externalLinks?.length) return;
    const request: CreateCardRequest = { theme, externalLinks, requirements: requirements.trim(), attachments };
    if (!onCreate) {
      setSubmitMessage("명함 생성 기능은 준비 중이에요. 입력한 내용은 이 화면에 유지됩니다.");
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage("");
    try {
      await onCreate(request);
    } catch {
      setSubmitMessage("생성 요청을 보내지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-apolo">
      <Header />
      <main className="relative flex flex-1 items-start justify-center overflow-hidden py-10">
        <div className="pointer-events-none absolute left-20 top-10 z-0 select-none leading-none text-surface/65">
          <p className="text-[80px]">CREATE</p>
          <p className="ml-44 text-[70px]">ONLINE CARD</p>
        </div>

        <AppWindow className="relative z-10 w-[734px] max-w-[calc(100%-2rem)] sm:[&>div:last-child]:p-10" title="Create">
          <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
            <fieldset disabled={isSubmitting}>
              <legend className="mb-2 text-body-02">색상 테마 <span className="text-danger">*</span></legend>
              <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {themes.map((option) => (
                  <label key={option.id} className="relative cursor-pointer">
                    <input
                      className="peer sr-only"
                      type="radio"
                      name="theme"
                      value={option.id}
                      checked={theme === option.id}
                      onChange={() => setTheme(option.id)}
                      aria-label={`${option.label} 테마`}
                      required
                    />
                    <span className="flex h-11 sm:h-14 overflow-hidden rounded-ml border border-placeholder transition-shadow peer-checked:ring-2 peer-checked:ring-primary peer-checked:ring-offset-2 peer-focus-visible:outline-2 peer-focus-visible:outline-offset-4 peer-focus-visible:outline-primary motion-reduce:transition-none">
                      {option.colors.map((color, index) => <span key={index} className="h-full flex-1" style={{ backgroundColor: color }} />)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-col gap-2">
              <label htmlFor="external-links" className="text-body-02">외부 페이지 링크 <span className="text-danger">*</span></label>
              <div className={`flex min-h-11 sm:min-h-14 flex-wrap items-center gap-2 rounded-ml border px-4 py-2 focus-within:border-primary ${linkError ? "border-danger" : "border-placeholder"}`}>
                {links.map((link) => (
                  <span key={link} className="group relative flex max-w-full items-center rounded-lg bg-focus px-2 py-1 text-body-02 text-primary transition-colors hover:bg-danger/70 hover:text-white focus-within:bg-danger focus-within:text-white motion-reduce:transition-none">
                    <span className="min-w-0 break-all">{link}</span>
                    <button type="button" disabled={isSubmitting} className="pointer-events-none absolute -right-1.5 -top-1.5 z-10 flex size-4 items-center justify-center rounded-full bg-danger text-white opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 focus-visible:outline-2 motion-reduce:transition-none" aria-label={`${link} 삭제`} onClick={() => setLinks((current) => current.filter((item) => item !== link))}>
                      <XIcon className="size-3" />
                    </button>
                  </span>
                ))}
                <input
                  id="external-links"
                  name="externalLinks"
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  aria-required="true"
                  aria-invalid={!!linkError}
                  aria-describedby={linkError ? "external-links-error" : undefined}
                  disabled={isSubmitting}
                  value={linkInput}
                  onChange={(event) => { setLinkInput(event.target.value); setLinkError(""); }}
                  onBlur={() => commitLink()}
                  onKeyDown={(event) => {
                    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      commitLink();
                    }
                  }}
                  className="min-w-0 flex-[1_1_180px] bg-transparent text-body-02 outline-none placeholder:text-placeholder"
                  placeholder={links.length ? "" : "추가적인 링크가 있다면 첨부해주세요."}
                />
              </div>
              {linkError && <p id="external-links-error" role="alert" className="text-caption-01 text-danger">{linkError}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="requirements" className="text-body-02">요구사항</label>
              <div className="flex min-h-[120px] flex-col gap-3 rounded-ml border border-placeholder px-4 py-3 focus-within:border-primary">
                <textarea
                  id="requirements"
                  name="requirements"
                  value={requirements}
                  onChange={(event) => setRequirements(event.target.value)}
                  maxLength={2000}
                  disabled={isSubmitting}
                  className="min-h-12 w-full flex-1 resize-y bg-transparent text-body-02 outline-none placeholder:text-placeholder"
                  placeholder="추가적인 정보나 pdf, jpg, png 등이 있다면 첨부해주세요."
                />
                {attachments.length > 0 && <ul className="flex flex-wrap gap-2">
                  {attachments.map((file, index) => (
                    <li key={`${file.name}-${file.size}-${file.lastModified}`} className="flex max-w-full items-center gap-1 rounded-md bg-surface px-2 py-1 text-caption-01 text-placeholder">
                      <span className="min-w-0 break-all">{file.name}</span>
                      <button type="button" disabled={isSubmitting} aria-label={`${file.name} 첨부 삭제`} onClick={() => setAttachments((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="shrink-0 p-0.5"><XIcon className="size-3" /></button>
                    </li>
                  ))}
                </ul>}
                <div className="flex items-center justify-between">
                  <input ref={fileInputRef} type="file" accept=".pdf,.jpg,.jpeg,.png" multiple className="hidden" onChange={handleAttachments} />
                  <button type="button" disabled={isSubmitting} onClick={() => fileInputRef.current?.click()} aria-label="파일 첨부" className="rounded-sm text-placeholder focus-visible:outline-2 focus-visible:outline-primary"><PlusIcon className="size-5" /></button>
                  <span className="text-caption-01 text-placeholder">{requirements.length} / 2000</span>
                </div>
              </div>
              {attachmentError && <p role="alert" className="text-caption-01 text-danger">{attachmentError}</p>}
            </div>
            <div className="mt-2 flex w-full justify-end">
              <CTAButton type="submit" disabled={!isFormComplete || isSubmitting}>{isSubmitting ? "요청 중…" : "만들기"}</CTAButton>
            </div>
            {submitMessage && <p role="status" className="text-body-02 text-placeholder">{submitMessage}</p>}
          </form>
        </AppWindow>
      </main>
      <Footer />
    </div>
  );
}
