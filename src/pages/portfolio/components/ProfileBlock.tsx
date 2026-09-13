import {
  FileText,
  Link2,
  StickyNote,
  UserRound,
} from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import GithubIcon from "@/assets/portfolio/GitHub.svg?react";
import ScholarIcon from "@/assets/portfolio/Scholar.svg?react";
import CompanyIcon from "@/assets/portfolio/Company.svg?react";
import EmailIcon from "@/assets/portfolio/Email.svg?react";
import MobileIcon from "@/assets/portfolio/Mobile.svg?react";
import type { ProfileData, ProfileField, ProfileFieldKind } from "@/types/portfolio";

type ProfileIcon = ComponentType<SVGProps<SVGSVGElement>>;

const iconByKind: Record<ProfileFieldKind, ProfileIcon> = {
  email: EmailIcon,
  github: GithubIcon,
  company: CompanyIcon,
  scholar: ScholarIcon,
  university: ScholarIcon,
  notion: StickyNote,
  blog: FileText,
  linkedin: Link2,
  phone: MobileIcon,
};

function getHref(field: ProfileField) {
  if (field.kind === "email") return `mailto:${field.value}`;
  if (field.kind === "phone") return `tel:${field.value.replace(/[^\d+]/g, "")}`;
  if (["github", "scholar", "notion", "blog", "linkedin"].includes(field.kind)) {
    return /^[a-z][a-z\d+.-]*:/i.test(field.value) ? field.value : `https://${field.value}`;
  }
  return null;
}

export default function ProfileBlock({ profile }: { profile: ProfileData }) {
  return (
    <section className="flex w-[150px] max-w-[150px] shrink-0 flex-col items-start gap-5 px-0 py-8" aria-label="Profile">
      <div className="flex size-[150px] items-center justify-center overflow-hidden rounded-full bg-focus text-display-02 font-bold text-primary">
        {profile.avatarUrl ? (
          <img className="size-full object-cover" src={profile.avatarUrl} alt={`${profile.name} 프로필`} />
        ) : (
          <UserRound className="size-14" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-title-02 font-bold text-ink">{profile.name}</h1>
        <p className="text-body-01 text-ink">{profile.title}</p>
      </div>

      <ul className="flex w-full flex-col gap-3">
        {profile.fields.map((field) => {
          const Icon = iconByKind[field.kind];
          const href = getHref(field);
          const content = (
            <>
              <Icon className="size-5 shrink-0" aria-hidden="true" />
              <span className="min-w-0 truncate text-body-02">{field.label}</span>
            </>
          );

          return (
            <li key={field.kind}>
              {href ? (
                <a
                  className="flex items-center gap-3 text-ink transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  href={href}
                  target={field.kind === "email" || field.kind === "phone" ? undefined : "_blank"}
                  rel={field.kind === "email" || field.kind === "phone" ? undefined : "noreferrer"}
                >
                  {content}
                </a>
              ) : (
                <div className="flex items-center gap-2 text-ink">{content}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
