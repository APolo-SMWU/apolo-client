import GoIcon from "@/assets/Goto.svg?react";
import PersonalCard from "@/pages/home/components/PersonalCard";
import type { PortfolioDocument, ProfileFieldKind } from "@/types/portfolio";
import { getCardJob, getCardName } from "../cardData";
import { HugInput } from "./EditorShared";
import { getField, inputClass } from "./editorUtils";

export function EditableFrontCard({ document, onProfileChange, onChange, onAddressChange }: { document: PortfolioDocument; onProfileChange: (key: "name" | "title", value: string) => void; onChange: (kind: ProfileFieldKind, value: string) => void; onAddressChange: (value: string) => void }) {
  const role = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";
  const isBold = document.cardDesignId === "bold";

  return (
    <div className="relative flex h-[230px] w-[390px] max-w-[calc(100vw-2rem)] shrink-0 flex-col rounded-xl border border-ink bg-white p-5 text-ink">
      {isBold ? (
        <div className="flex h-[100px] w-full flex-col justify-start gap-1">
          <div className="flex items-start justify-between">
            <HugInput
              className={`${inputClass} !box-border !h-[1.2em] min-w-25 !rounded-sm !px-0 !py-0 !leading-[1.2] text-body-02`}
              value={document.profile.title}
              onChange={(event) => onProfileChange("title", event.target.value)}
              aria-label="직함"
            />
            <GoIcon className="size-4 md:size-5" aria-hidden="true" />
          </div>
          <HugInput
            className={`${inputClass} !box-border !h-[64px] min-w-25 !rounded-sm !px-0 !py-0 !leading-none text-[64px] font-bold text-left`}
            value={document.profile.name}
            onChange={(event) => onProfileChange("name", event.target.value)}
            aria-label="이름"
            autoFocus
          />
        </div>
      ) : (
        <div className="flex h-[100px] w-full items-start justify-between">
          <div className="flex size-[70px] shrink-0 items-center justify-center overflow-hidden">
            {document.card.logoUrl ? (
              <img src={document.card.logoUrl} alt="" width={70} height={70} className="size-[70px] object-contain" />
            ) : null}
          </div>
          <div className="flex flex-col items-end justify-start gap-2">
            <GoIcon className="size-4 md:size-5" aria-hidden="true" />
            <HugInput
              className={`${inputClass} !box-border !h-[1.2em] min-w-25 !rounded-sm !px-0 !py-0 !leading-[1.2] text-caption-01 text-right md:text-body-02`}
              value={document.profile.title}
              onChange={(event) => onProfileChange("title", event.target.value)}
              aria-label="직함"
            />
            <HugInput
              className={`${inputClass} !box-border !h-[1em] min-w-25 !rounded-sm !px-0 !py-0 !leading-none text-heading-03 font-semibold text-right md:text-display-02`}
              value={document.profile.name}
              onChange={(event) => onProfileChange("name", event.target.value)}
              aria-label="이름"
              autoFocus
            />
          </div>
        </div>
      )}
      <div className="flex w-full border-b border-ink" />
      {isBold ? (
        <div className="grid flex-1 grid-cols-[120px_minmax(0,1fr)] gap-y-3 pt-5 text-caption-02 leading-[1.2]">
          {role !== "Student" && (
            <label className="col-start-1 row-start-1 flex flex-col font-bold">
              <span>Tel.</span>
              <HugInput
                className={`${inputClass} h-fit w-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 font-normal leading-[1.2]`}
                value={getField(document, "tel")}
                onChange={(event) => onChange("tel", event.target.value)}
              />
            </label>
          )}
          <label className="col-start-2 row-start-1 flex flex-col font-bold">
            <span>E-mail.</span>
            <HugInput
              className={`${inputClass} h-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 font-normal leading-[1.2]`}
              value={getField(document, "email")}
              onChange={(event) => onChange("email", event.target.value)}
            />
          </label>
          <label className={role !== "Student" ? "col-start-1 row-start-2 flex flex-col font-bold" : "col-start-1 row-start-1 flex flex-col font-bold"}>
            <span>Mobile.</span>
            <HugInput
              className={`${inputClass} h-fit w-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 font-normal leading-[1.2]`}
              value={getField(document, "phone")}
              onChange={(event) => onChange("phone", event.target.value)}
            />
          </label>
          <label className="col-start-2 row-start-2 flex flex-col font-bold">
            <span>ADDRESS</span>
            <HugInput
              className={`${inputClass} h-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 font-normal leading-[1.2]`}
              value={document.card.organizationAddress ?? ""}
              onChange={(event) => onAddressChange(event.target.value)}
              aria-label="주소"
            />
          </label>
        </div>
      ) : (
        <div className="flex w-full flex-1 flex-col items-start justify-start gap-2 pt-3">
          {[
            ...(role === "Student" ? [] : [["Tel.", "tel"]]),
            ["Mobile.", "phone"],
            ["E-mail.", "email"],
          ].map(([label, kind]) => (
            <label key={kind} className="flex w-full items-center gap-1 text-caption-02 font-bold leading-[1.2]">
              <span className="w-16 shrink-0">{label}</span>
              <HugInput
                className={`${inputClass} h-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 font-normal leading-[1.2]`}
                value={getField(document, kind as ProfileFieldKind)}
                onChange={(event) => onChange(kind as ProfileFieldKind, event.target.value)}
              />
            </label>
          ))}
          <HugInput
            className={`${inputClass} h-fit min-w-25 !rounded-sm !px-0 !py-0 text-caption-02 leading-[1.2]`}
            value={document.card.organizationAddress ?? ""}
            onChange={(event) => onAddressChange(event.target.value)}
            aria-label="주소"
          />
        </div>
      )}
      {isBold && document.card.logoUrl ? (
        <img src={document.card.logoUrl} alt="" width={50} height={50} className="absolute bottom-5 right-5 size-[50px] object-contain" />
      ) : null}
    </div>
  );
}

export function ProfilePreviewCard({ document }: { document: PortfolioDocument }) {
  const role = document.userType === "student" ? "Student" : document.userType === "professor" ? "Professor" : "Professional";

  return (
    <PersonalCard
      role={role}
      name={document.profile.name || getCardName(document)}
      job={document.profile.title || getCardJob(document)}
      logoUrl={document.card.logoUrl}
      tel={getField(document, "tel")}
      phone={getField(document, "phone")}
      email={getField(document, "email")}
      address={document.card.organizationAddress ?? ""}
      design={document.cardDesignId === "bold" ? "bold" : "default"}
    />
  );
}
