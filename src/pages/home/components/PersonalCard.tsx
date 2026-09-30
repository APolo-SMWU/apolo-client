import GoIcon from "@/assets/Goto.svg?react";
import type { Role } from "@/components/common/profileRoles";
import { useLayoutEffect, useRef, useState } from "react";

export type PersonalCardDesign = "default" | "bold";

export type PersonalCardProps = {
  name: string;
  job: string;
  logoUrl?: string | null;
  phone: string;
  email: string;
  /** 회사명 또는 학교명으로 조회해 저장된 주소 */
  address: string;
  onGoto?: () => void;
  design?: PersonalCardDesign;
  isSelected?: boolean;
} & (
  | { role: "Student"; tel?: string }
  | { role: Exclude<Role, "Student">; tel: string }
);

function GotoButton({ onGoto }: { onGoto?: () => void }) {
  if (!onGoto) return <GoIcon className="size-4 md:size-5" />;

  return (
    <button
      type="button"
      className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-ink md:size-5"
      onClick={onGoto}
      aria-label="웹사이트 보기"
    >
      <GoIcon className="size-full" />
    </button>
  );
}

function FitName({ value }: { value: string }) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const [fontSize, setFontSize] = useState(64);

  useLayoutEffect(() => {
    const name = nameRef.current;
    const container = name?.parentElement;
    if (!name || !container) return;

    const fitName = () => {
      name.style.fontSize = "64px";
      const availableWidth = container.clientWidth;
      const measuredWidth = name.scrollWidth;
      setFontSize(
        availableWidth > 0 && measuredWidth > availableWidth
          ? (64 * availableWidth) / measuredWidth
          : 64,
      );
    };

    fitName();
    const observer = new ResizeObserver(fitName);
    observer.observe(container);
    return () => observer.disconnect();
  }, [value]);

  return (
    <h1
      ref={nameRef}
      className="w-full whitespace-nowrap text-left font-bold leading-none text-ink"
      style={{ fontSize }}
    >
      {value}
    </h1>
  );
}

function BoldPersonalCard({
  role,
  name = "",
  job = "",
  logoUrl = "",
  tel = "",
  phone = "",
  email = "",
  address = "",
  onGoto,
  isSelected = false,
}: PersonalCardProps) {
  return (
    <div className={`relative flex h-[217px] w-[390px] max-w-[calc(100vw-2rem)] flex-col rounded-xl bg-white p-5 text-ink transition-transform motion-reduce:transition-none ${isSelected ? "scale-[1.02] border-2 border-primary" : "border border-ink"}`}>
      <div className="flex h-[100px] w-full flex-col justify-start gap-1">
        <div className="flex items-start justify-between">
          <p className="text-body-02 leading-[1.2]">{job}</p>
          <GotoButton onGoto={onGoto} />
        </div>
        <FitName value={name} />
      </div>
      <div className="flex w-full border-b border-ink" />
      <div className="grid flex-1 grid-cols-[120px_minmax(0,1fr)] gap-y-3 pt-5 text-left text-caption-02 leading-[1.2]">
        {role !== "Student" && (
          <div className="col-start-1 row-start-1">
            <p className="font-bold">Tel.</p>
            <p className="w-fit whitespace-nowrap">{tel}</p>
          </div>
        )}
        <div className="col-start-2 row-start-1">
          <p className="font-bold">E-mail.</p>
          <p className="break-all">{email}</p>
        </div>
        <div className={role !== "Student" ? "col-start-1 row-start-2" : "col-start-1 row-start-1"}>
          <p className="font-bold">Mobile.</p>
          <p className="w-fit whitespace-nowrap">{phone}</p>
        </div>
        <div className="col-start-2 row-start-2 pr-20">
          <p className="font-bold">ADDRESS</p>
          <p className="break-words">{address}</p>
        </div>
      </div>
      {logoUrl ? (
        <img
          src={logoUrl}
          alt=""
          width={50}
          height={50}
          className="absolute bottom-5 right-5 size-[50px] object-contain"
        />
      ) : null}
    </div>
  );
}

function DefaultPersonalCard({
  role,
  name = '',
  job='',
  logoUrl = '',
  tel= '',
  phone = '',
  email = '',
  address = '',
  onGoto,
  isSelected = false,
}: PersonalCardProps) {
  return (
    <div className={`relative flex h-[217px] w-[390px] max-w-[calc(100vw-2rem)] flex-col rounded-xl bg-white p-5 transition-transform motion-reduce:transition-none ${isSelected ? "scale-[1.02] border-2 border-primary" : "border border-ink"}`}>
      <div className="flex h-[100px] w-full items-start justify-between">
        <div className="flex size-[80px] shrink-0 items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img src={logoUrl} alt="" width={80} height={80} className="size-[80px] object-contain" />
          ) : null}
        </div>
        <div className="flex flex-col items-end justify-start gap-2">
          <GotoButton onGoto={onGoto} />
          <p className="text-caption-01 text-ink leading-[1.2] md:text-body-02">{job}</p>
          <h1 className="text-heading-03 font-semibold leading-none text-ink md:text-display-02">{name}</h1>
        </div>
      </div>

      <div className="flex w-full border-b border-ink"/>

      <div className="flex w-full flex-1 flex-col items-start justify-start gap-2 pt-3">
        {/* tel */}
        {role !== "Student" && tel && (
          <div className="flex w-full items-start justify-start gap-1">
            <span className="text-caption-02 w-16 shrink-0 font-bold text-ink leading-[1.2] text-start">Tel.</span>
            <p className="min-w-0 break-words text-caption-02 leading-[1.2] text-ink">{tel}</p>
          </div>
        )}
        {/* mobile */}
        <div className="flex items-center justify-start gap-1">
          <span className="text-caption-02 w-16 shrink-0 font-bold text-ink leading-[1.2] text-start">Mobile.</span>
          <p className="text-caption-02 text-ink leading-[1.2]">{phone}</p>
        </div>
        {/* email */}
        <div className="flex w-full items-start justify-start gap-1">
          <span className="text-caption-02 w-16 shrink-0 font-bold text-ink leading-[1.2] text-start">E-mail.</span>
          <p className="min-w-0 break-all text-caption-02 leading-[1.2] text-ink">{email}</p>
        </div>
        {/* address */}
        {address && (
          <div className="flex items-center justify-start gap-1">
            <p className="break-words text-caption-02 leading-[1.2] text-ink">{address}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function PersonalCard(props: PersonalCardProps) {
  if (props.design === "bold") return <BoldPersonalCard {...props} />;
  return <DefaultPersonalCard {...props} />;
}
