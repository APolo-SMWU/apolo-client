import GoIcon from "@/assets/Goto.svg?react";
import type { Role } from "@/components/common/profileRoles";

export type PersonalCardProps = {
  name: string;
  job: string;
  phone: string;
  email: string;
  /** 회사명 또는 학교명으로 조회해 저장된 주소 */
  address: string;
} & (
  | { role: "Student"; tel?: string }
  | { role: Exclude<Role, "Student">; tel: string }
);
export default function PersonalCard({
  role,
  name = '',
  job='',
  tel= '',
  phone = '',
  email = '',
  address = '',
}: PersonalCardProps) {
  return (
    <div className="flex min-h-[200px] w-[390px] max-w-[calc(100vw-2rem)] flex-col gap-6 rounded-xl border border-ink bg-white p-4 md:min-h-[230px] md:gap-6 md:p-5">
      <div className="flex flex-col w-full items-end justify-center">
        <GoIcon className="size-4 md:size-5"/>
        <p className="text-caption-01 text-ink leading-[1.2] md:text-body-02">{job}</p>
        <h1 className="text-heading-03 font-semibold leading-none text-ink md:text-display-02">{name}</h1>
      </div>

      <div className="flex w-full border-b border-ink"/>

      <div className="flex flex-col w-full items-start justify-start gap-2">
        {/* tel */}
        {role !== "Student" && (
          <div className="flex w-full items-start justify-start gap-1">
            <span className="text-caption-02 w-9 shrink-0 font-bold text-ink leading-[1.2] text-start">Tel.</span>
            <p className="min-w-0 break-words text-caption-02 leading-[1.2] text-ink">{tel}</p>
          </div>
        )}
        {/* mobile */}
        <div className="flex items-center justify-start gap-1">
          <span className="text-caption-02 w-9 shrink-0 font-bold text-ink leading-[1.2] text-start">Mobile.</span>
          <p className="text-caption-02 text-ink leading-[1.2]">{phone}</p>
        </div>
        {/* email */}
        <div className="flex w-full items-start justify-start gap-1">
          <span className="text-caption-02 w-9 shrink-0 font-bold text-ink leading-[1.2] text-start">E-mail.</span>
          <p className="min-w-0 break-all text-caption-02 leading-[1.2] text-ink">{email}</p>
        </div>
        {/* address */}
        <div className="flex items-center justify-start gap-1">
          <p className="break-words text-caption-02 leading-[1.2] text-ink">{address}</p>
        </div>
      </div>
    </div>
  )
}
