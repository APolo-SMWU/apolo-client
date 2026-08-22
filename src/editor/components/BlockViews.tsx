import { useState } from "react";

// ============================================================
// AI Portfolio - Block View Components (filled/preview mode)
// 각 블록 타입의 실제 렌더링 결과물 컴포넌트
// ============================================================

import type {
  HeroBlockValue,
  ProfileBlockValue,
  ProjectBlockValue,
  SkillsBlockValue,
  ExperienceBlockValue,
  ContactBlockValue,
  TextBlockValue,
  ImageBlockValue,
  PaperBlockValue,
  GalleryBlockValue,
  TroubleshootingBlockValue,
  ProcessBlockValue,
  ArchitectureBlockValue,
  MetricBlockValue,
  LinkItem,
  DateRange,
} from "../types/template-blocks.types";
import type {
  HeroBlockProps,
  ProfileBlockProps,
  ProjectBlockProps,
  ContactBlockProps,
  ImageBlockProps,
  PaperBlockProps,
  GalleryBlockProps,
  TroubleshootingBlockProps,
  ProcessBlockProps,
  ArchitectureBlockProps,
  MetricBlockProps,
} from "../types/template-blocks.types";

// ─────────────────────────────────────────
// 공통 유틸
// ─────────────────────────────────────────

function formatDateRange(range?: DateRange): string {
  if (!range) return "";
  const start = range.start
    ? new Date(range.start).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
      })
    : "";
  const end = range.isCurrent
    ? "현재"
    : range.end
    ? new Date(range.end).toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "short",
      })
    : "";
  return [start, end].filter(Boolean).join(" – ");
}

function ExternalLink({ item }: { item: LinkItem }) {
  return (
    <a
      href={item.url}
      target={item.target ?? "_blank"}
      rel="noopener noreferrer"
      className="text-body-02 text-primary underline"
    >
      {item.label}
    </a>
  );
}

// ─────────────────────────────────────────
// HeroBlockView
// ─────────────────────────────────────────

export function HeroBlockView({
  value,
  props,
}: {
  value: HeroBlockValue;
  props?: HeroBlockProps;
}) {
  const shouldShowImage = Boolean(value.heroImage);

  return (
    <div className="grid overflow-hidden border border-ink bg-white sm:grid-cols-2">
      {shouldShowImage && (
        <div>
          <img className="h-full w-full object-cover" src={value.heroImage} alt="hero" />
        </div>
      )}
      <div className="flex flex-col justify-center gap-4 p-5">
        {value.headline && (
          <h1 className="text-heading-02 font-bold text-ink">{value.headline}</h1>
        )}
        {value.subheadline && (
          <p className="text-body-02 text-placeholder">{value.subheadline}</p>
        )}
        {props?.showCta && value.ctaLabel && value.ctaLink && (
          <a
            href={value.ctaLink}
            className="w-fit border border-ink bg-primary px-4 py-2 text-body-02 font-bold text-white"
            target="_blank"
            rel="noopener noreferrer"
          >
            {value.ctaLabel}
          </a>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ProfileBlockView
// ─────────────────────────────────────────

export function ProfileBlockView({
  value,
  props,
}: {
  value: ProfileBlockValue;
  props?: ProfileBlockProps;
}) {
  return (
    <div className="flex gap-5 border border-ink bg-white p-5">
      {value.profileImage && (
        <img
          src={value.profileImage}
          alt={value.name ?? "profile"}
          className={`size-24 object-cover ${props?.imageShape === "square" ? "rounded-none" : props?.imageShape === "rounded" ? "rounded-lg" : "rounded-full"}`}
        />
      )}
      <div className="flex flex-col gap-2">
        {value.name && <h2 className="text-title-01 font-bold text-ink">{value.name}</h2>}
        {value.role && <p className="text-body-02 text-primary">{value.role}</p>}
        {props?.showLocation && value.location && (
          <p className="text-body-02 text-placeholder">📍 {value.location}</p>
        )}
        {value.intro && (
          <p className="text-body-02 leading-6 text-placeholder">{value.intro}</p>
        )}
        {props?.showLinks && value.links && value.links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {value.links.map((link, i) => (
              <ExternalLink key={i} item={link} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ProjectBlockView
// ─────────────────────────────────────────

export function ProjectBlockView({
  value,
  props,
}: {
  value: ProjectBlockValue;
  props?: ProjectBlockProps;
}) {
  return (
    <div className={`overflow-hidden border border-ink bg-white ${props?.display === "list" ? "flex gap-5" : ""}`}>
      {props?.showThumbnail !== false && value.thumbnail && (
        <div className="shrink-0">
          <img className="h-40 w-56 object-cover" src={value.thumbnail} alt={value.title || "프로젝트 썸네일"} />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {value.title && (
          <h3 className="text-title-01 font-bold text-ink">{value.title}</h3>
        )}
        {value.period && (
          <p className="text-caption-01 text-placeholder">
            {formatDateRange(value.period)}
          </p>
        )}
        {value.role && (
          <p className="text-body-02 text-primary">역할: {value.role}</p>
        )}
        {value.summary && (
          <p className="text-body-02 text-placeholder">{value.summary}</p>
        )}
        {value.techStack && value.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {value.techStack.map((tech) => (
              <span key={tech} className="bg-focus px-2 py-1 text-caption-01 text-ink">
                {tech}
              </span>
            ))}
          </div>
        )}
        {value.links && value.links.length > 0 && (
          <div className="flex flex-wrap gap-3">
            {value.links.map((link, i) => (
              <ExternalLink key={i} item={link} />
            ))}
          </div>
        )}
        {value.troubleshooting && value.troubleshooting.length > 0 && (
          <div className="mt-2 border-t border-ink pt-3">
            <p className="mb-2 text-caption-01 font-semibold uppercase tracking-wider text-primary">트러블슈팅</p>
            {value.troubleshooting.map((item, i) => (
              <div key={i} className="border-t border-ink py-3 first:border-t-0 first:pt-0">
                <p className="text-body-02 leading-6 text-placeholder">
                  <span className="mr-2 font-semibold text-ink">문제</span>
                  {item.problem}
                </p>
                <p className="mt-1 text-body-02 leading-6 text-placeholder">
                  <span className="mr-2 font-semibold text-ink">해결</span>
                  {item.solution}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// SkillsBlockView
// ─────────────────────────────────────────

export function SkillsBlockView({
  value,
}: {
  value: SkillsBlockValue;
}) {
  return (
    <div className="border border-ink bg-white p-5">
      {value.category && (
        <h4 className="mb-3 text-title-02 font-bold text-ink">{value.category}</h4>
      )}
      <div className="flex flex-wrap gap-2">
        {value.items.map((item) => (
          <span key={item} className="border border-ink px-2 py-1 text-caption-01 text-ink">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ExperienceBlockView
// ─────────────────────────────────────────

export function ExperienceBlockView({
  value,
}: {
  value: ExperienceBlockValue;
}) {
  return (
    <div className="border-b border-ink py-5 last:border-b-0">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-title-02 font-semibold text-ink">{value.organization}</h3>
          {value.role && (
            <p className="mt-0.5 text-body-02 text-placeholder">{value.role}</p>
          )}
        </div>
        {value.period && (
          <p className="shrink-0 whitespace-nowrap text-caption-01 text-placeholder">
            {formatDateRange(value.period)}
          </p>
        )}
      </div>
      {value.description && (
        <p className="text-body-02 leading-6 text-placeholder">{value.description}</p>
      )}
      {value.achievements && value.achievements.length > 0 && (
        <ul className="mt-3 flex list-disc flex-col gap-1 pl-5">
          {value.achievements.map((item, i) => (
            <li key={i} className="text-body-02 leading-6 text-placeholder">{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// ContactBlockView
// ─────────────────────────────────────────

const CONTACT_ICONS: Record<string, string> = {
  email: "✉️",
  phone: "📱",
  github: "💻",
  blog: "📝",
  notion: "📄",
};

export function ContactBlockView({
  value,
  props,
}: {
  value: ContactBlockValue;
  props?: ContactBlockProps;
}) {
  const items = [
    value.email && {
      key: "email",
      label: value.email,
      href: `mailto:${value.email}`,
    },
    value.phone && {
      key: "phone",
      label: value.phone,
      href: `tel:${value.phone}`,
    },
    value.github && {
      key: "github",
      label: value.github.label,
      href: value.github.url,
    },
    value.blog && {
      key: "blog",
      label: value.blog.label,
      href: value.blog.url,
    },
    value.notion && {
      key: "notion",
      label: value.notion.label,
      href: value.notion.url,
    },
  ].filter(Boolean) as { key: string; label: string; href: string }[];

  return (
    <div className={`flex flex-wrap gap-3 py-4 ${props?.display === "list" ? "flex-col gap-2" : ""}`}>
      {items.map((item) => (
        <a
          key={item.key}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 border border-ink bg-surface px-4 py-2 text-body-02 text-placeholder transition-colors hover:border-primary hover:text-primary"
        >
          <span className="text-body-02" aria-hidden="true">
            {CONTACT_ICONS[item.key] ?? "🔗"}
          </span>
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// TextBlockView
// ─────────────────────────────────────────

export function TextBlockView({ value }: { value: TextBlockValue }) {
  return (
    <div className="py-4">
      {value.title && <h3 className="mb-3 text-title-01 font-semibold text-ink">{value.title}</h3>}
      <p className="whitespace-pre-wrap text-body-01 leading-7 text-placeholder">{value.body}</p>
    </div>
  );
}

// ─────────────────────────────────────────
// ImageBlockView
// ─────────────────────────────────────────

export function ImageBlockView({
  value,
  props,
}: {
  value: ImageBlockValue;
  props?: ImageBlockProps;
}) {
  return (
    <div className="flex flex-col gap-2">
      <img
        src={value.image}
        alt={value.alt}
        className="block w-full rounded-[var(--radius-lg)]"
        style={{ objectFit: props?.objectFit ?? "cover" }}
      />
      {value.caption && (
        <p className="text-center text-caption-01 text-placeholder">{value.caption}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// PaperBlockView
// ─────────────────────────────────────────

export function PaperBlockView({
  value,
  props,
}: {
  value: PaperBlockValue;
  props?: PaperBlockProps;
}) {
  return (
    <article className="flex flex-col gap-3 border border-ink bg-surface p-5">
      <div>
        {value.title && <h3 className="text-title-01 font-semibold text-ink">{value.title}</h3>}
        {props?.showMeta !== false && (
          <p className="text-caption-01 text-placeholder">
            {[value.authors, value.venue, value.year].filter(Boolean).join(" · ")}
          </p>
        )}
      </div>
      {value.topic && <p className="text-caption-01 text-placeholder">Topic: {value.topic}</p>}
      {value.summary && (
        <p className="whitespace-pre-wrap text-body-02 leading-6 text-placeholder">
          <span className="mb-1 block text-caption-01 font-semibold uppercase tracking-wider text-primary">Summary</span>
          {value.summary}
        </p>
      )}
      {value.takeaway && (
        <p className="whitespace-pre-wrap text-body-02 leading-6 text-placeholder">
          <span className="mb-1 block text-caption-01 font-semibold uppercase tracking-wider text-primary">Takeaway</span>
          {value.takeaway}
        </p>
      )}
      {value.followUpQuestion && (
        <p className="whitespace-pre-wrap text-body-02 leading-6 text-placeholder">
          <span className="mb-1 block text-caption-01 font-semibold uppercase tracking-wider text-primary">Question</span>
          {value.followUpQuestion}
        </p>
      )}
      {value.link && value.link.url && (
        <div className="flex gap-3">
          <ExternalLink item={value.link} />
        </div>
      )}
    </article>
  );
}

// ─────────────────────────────────────────
// GalleryBlockView
// ─────────────────────────────────────────

export function GalleryBlockView({
  value,
  props,
}: {
  value: GalleryBlockValue;
  props?: GalleryBlockProps;
}) {
  const images =
    value.images && value.images.length > 0
      ? value.images
      : ([value.mainImage, value.subImage1, value.subImage2].filter(
          Boolean
        ) as string[]);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];
  const isCarousel = props?.layout === "carousel";

  const goTo = (index: number) => {
    if (images.length === 0) return;
    setActiveIndex((index + images.length) % images.length);
  };

  return (
    <div className="flex flex-col gap-4 border border-ink bg-surface p-5">
      <div>
        {value.title && <h3 className="text-title-01 font-semibold text-ink">{value.title}</h3>}
        {value.description && (
          <p className="mt-2 text-body-02 leading-6 text-placeholder">{value.description}</p>
        )}
      </div>
      {isCarousel && activeImage && (
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden border border-ink bg-white">
            <img
              src={activeImage}
              alt={value.alt || value.title || "gallery image"}
              className="block aspect-video max-h-[680px] w-full bg-white object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  className="absolute top-1/2 left-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink bg-white/90 text-heading-03 leading-none text-ink transition-colors hover:bg-primary hover:text-white"
                  aria-label="이전 이미지"
                  onClick={() => goTo(activeIndex - 1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="absolute top-1/2 right-3 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-full border border-ink bg-white/90 text-heading-03 leading-none text-ink transition-colors hover:bg-primary hover:text-white"
                  aria-label="다음 이미지"
                  onClick={() => goTo(activeIndex + 1)}
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex justify-center gap-2" aria-label="갤러리 이미지 선택">
              {images.map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  className={`h-2 rounded-full bg-placeholder transition-all ${activeIndex === index ? "w-6 bg-primary" : "w-2"}`}
                  aria-label={`${index + 1}번째 이미지 보기`}
                  onClick={() => goTo(index)}
                />
              ))}
            </div>
          )}
        </div>
      )}
      {!isCarousel && images.length > 0 && (
        <div className={`grid gap-3 ${props?.layout === "feature" ? "grid-cols-[2fr_1fr_1fr]" : "grid-cols-3"}`}>
          {images.map((image, index) => (
            <img
              key={`${image}-${index}`}
              src={image}
              alt={value.alt || value.title || "gallery image"}
              className="aspect-[4/3] w-full border border-ink object-cover"
            />
          ))}
        </div>
      )}
      {value.caption && (
        <p className="text-caption-01 text-placeholder">{value.caption}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// TroubleshootingBlockView
// ─────────────────────────────────────────

export function TroubleshootingBlockView({
  value,
  props,
}: {
  value: TroubleshootingBlockValue;
  props?: TroubleshootingBlockProps;
}) {
  const rows = [
    ["상황", value.context],
    ["문제", value.problem],
    ["원인", value.cause],
    ["해결", value.solution],
    ...(props?.showResult === false ? [] : [["결과", value.result] as const]),
  ].filter(([, body]) => body);

  return (
    <div className="border border-ink bg-surface p-5">
      {value.title && (
        <h3 className="mb-4 text-title-01 font-semibold text-ink">{value.title}</h3>
      )}
      <div className="flex flex-col gap-3">
        {rows.map(([label, body]) => (
          <div key={label} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3">
            <span className="text-caption-01 font-semibold text-primary">{label}</span>
            <p className="whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// ProcessBlockView
// ─────────────────────────────────────────

export function ProcessBlockView({
  value,
  props,
}: {
  value: ProcessBlockValue;
  props?: ProcessBlockProps;
}) {
  const steps = [
    ["Research", value.research],
    ["Direction", value.direction],
    ["Execution", value.execution],
    ["Outcome", value.outcome],
  ].filter(([, body]) => body);
  return (
    <section className="border border-ink bg-surface p-5">
      <div className="mb-5">
        {value.title && <h3 className="text-title-01 font-semibold text-ink">{value.title}</h3>}
        {value.overview && (
          <p className="mt-2 whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{value.overview}</p>
        )}
      </div>
      {steps.length > 0 && (
        <div className={`grid gap-3 ${props?.layout === "stack" ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"}`}>
          {steps.map(([label, body], index) => (
            <article key={label} className="flex min-w-0 gap-3 border border-ink bg-white p-4">
              <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-primary text-caption-01 font-semibold text-white">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h4 className="mb-1 text-body-02 font-semibold text-ink">{label}</h4>
                <p className="whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{body}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────
// ArchitectureBlockView
// ─────────────────────────────────────────

export function ArchitectureBlockView({
  value,
  props,
}: {
  value: ArchitectureBlockValue;
  props?: ArchitectureBlockProps;
}) {
  const layers = [
    ["Frontend", value.frontend],
    ["Backend", value.backend],
    ["Data", value.database],
    ["Deployment", value.deployment],
  ].filter(([, body]) => body);
  const shouldShowDiagram = props?.showDiagram !== false && value.diagramImage;

  return (
    <section className="flex flex-col gap-4 border border-ink bg-surface p-5">
      <div>
        {value.title && (
          <h3 className="text-title-01 font-semibold text-ink">{value.title}</h3>
        )}
        {value.summary && (
          <p className="mt-2 whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{value.summary}</p>
        )}
      </div>
      {shouldShowDiagram && (
        <img
          src={value.diagramImage}
          alt={value.title || "architecture diagram"}
          className="max-h-[520px] w-full border border-ink bg-white object-contain"
        />
      )}
      {layers.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {layers.map(([label, body]) => (
            <article key={label} className="min-w-0 border border-ink bg-white p-4">
              <h4 className="mb-2 text-body-02 font-semibold text-primary">{label}</h4>
              <p className="whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{body}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────
// MetricBlockView
// ─────────────────────────────────────────

export function MetricBlockView({
  value,
  props,
}: {
  value: MetricBlockValue;
  props?: MetricBlockProps;
}) {
  return (
    <section className={`grid items-center gap-5 border border-l-4 border-ink border-l-primary bg-white p-5 ${props?.emphasis === "compact" ? "grid-cols-1 gap-3" : "grid-cols-1 sm:grid-cols-[minmax(160px,0.35fr)_1fr]"}`}>
      <div className="flex flex-col gap-1">
        {value.value && <strong className="text-display-01 font-bold leading-none text-primary">{value.value}</strong>}
        {value.label && <span className="text-body-02 font-semibold text-placeholder">{value.label}</span>}
      </div>
      <div>
        {value.title && <h3 className="text-title-01 font-semibold text-ink">{value.title}</h3>}
        {value.description && (
          <p className="mt-2 whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{value.description}</p>
        )}
        {value.evidence && (
          <p className="mt-2 whitespace-pre-wrap text-body-02 leading-6 text-placeholder">{value.evidence}</p>
        )}
      </div>
    </section>
  );
}
