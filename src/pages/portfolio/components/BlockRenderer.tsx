import type { ReactNode } from "react";
import type { ContentBlock } from "@/types/portfolio";

function Section({
  title,
  children,
  titleClassName = "text-title-01",
}: {
  title: string;
  children: ReactNode;
  titleClassName?: string;
}) {
  return (
    <section className="flex w-full flex-col gap-2 px-4 py-4 text-ink">
      <h2 className={`font-bold ${titleClassName}`}>{title}</h2>
      <div className="border-b border-placeholder" />
      <div>{children}</div>
    </section>
  );
}

function AboutContent({ block }: { block: Extract<ContentBlock, { type: "about" }> }) {
  return (
    <p className="text-body-01 leading-normal">{block.body}</p>
  );
}

function TimelineContent({ block }: { block: Extract<ContentBlock, { type: "education" | "experience" | "activities" | "awards" | "certification" }> }) {
  return (
    <div className="flex flex-col gap-4">
      {block.items.map((item) => (
        <article
          key={item.id}
          className="grid gap-2 px-4 sm:grid-cols-[150px_1fr]"
        >
          <p className="text-body-01">
            {item.startDate}
            {item.endDate ? ` - ${item.endDate}` : ""}
          </p>
          <div>
            <h3 className="font-bold">{item.organization}</h3>
            {item.role && (
              <p className={block.type === "education" ? "text-body-02" : "text-body-01"}>
                {item.role}
              </p>
            )}
            {item.description && (
              <p className="mt-1 text-body-01">{item.description}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function WorksContent({
  block,
}: {
  block: Extract<ContentBlock, { type: "works" }>;
}) {
  return (
    <div className="flex flex-col gap-3">
      {block.items.map((item) => (
        <article key={item.id} className="flex gap-4 px-4">
          {item.imageUrl && (
            <div className="size-[145px] shrink-0 overflow-hidden rounded-md border border-placeholder bg-focus">
              <img className="size-full object-cover" src={item.imageUrl} alt="" />
            </div>
          )}
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2">
              {item.title && <h3 className="font-bold">{item.title}</h3>}
            </div>
            {item.role && <p className="text-body-01">{item.role}</p>}
            {item.skills && item.skills.length > 0 && (
              <div className="my-2 flex flex-wrap gap-2">
                {item.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-sm bg-focus px-2 py-1 text-caption-01 text-primary"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {item.description && <p className="text-body-02">{item.description}</p>}
            {item.links.some((link) => link.href) && (
              <div className="mt-2 flex gap-3">
                {item.links.filter((link) => link.href).map((link) => (
                <a
                  key={link.href}
                  className="text-body-02 font-semibold text-primary"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  [{link.label}]
                </a>
                ))}
              </div>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function SkillsContent({ block }: { block: Extract<ContentBlock, { type: "skills" }> }) {
  return (
    <div className="flex flex-col gap-3">
      {block.categories.map((category) => (
        <div
          key={category.category}
          className="grid gap-2 px-4 sm:grid-cols-[130px_1fr]"
        >
          <p className="font-medium">{category.category}</p>
          <div className="flex flex-wrap gap-2">
            {category.items.map((item) => (
              <span
                key={item}
                className="rounded-sm bg-focus px-2 py-1 text-caption-01 text-primary"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function BlockRenderer({
  block,
}: {
  block: ContentBlock;
}) {
  if (!block.visible) return null;

  switch (block.type) {
    case "about":
      return (
        <Section title="About">
          <AboutContent block={block} />
        </Section>
      );
    case "education":
    case "experience":
    case "activities":
    case "awards":
    case "certification":
      return (
        <Section title={block.type[0].toUpperCase() + block.type.slice(1)}>
          <TimelineContent block={block} />
        </Section>
      );
    case "works":
      return (
        <Section title="Projects">
          <WorksContent block={block} />
        </Section>
      );
    case "skills":
      return (
        <Section title="Skills">
          <SkillsContent block={block} />
        </Section>
      );
  }
}
