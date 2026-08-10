import Button from "@/components/common/Button";
import PublicToggle from "@/components/common/PublicToggle";
import { FormatDate } from "@/types/formatDate";
import { useState } from "react";

type PortfolioListProps = {
  title: string;
  updatedAt: string;
  isPublic: boolean;
}

export default function PortfoliosList({
  title,
  updatedAt,
  isPublic: initialIsPublic,
}: PortfolioListProps) {
  const [isPublic, setIsPublic] = useState(initialIsPublic);

  return (
    <div className="w-full h-10 items-center justify-between px-5 py-[6px] bg-white border border-ink">
      <div className="flex items-center justify-center gap-5">
        <h3 className="text-body-02 font-medium text-ink leading-none">{title}</h3>
        <p className="text-caption-01 text-placeholder leading-none">{FormatDate(updatedAt)}</p>
      </div>

      <div className="flex items-center justify-center gap-5">
        <Button className="w-[54px] h-7">수정</Button>
        <Button className="w-[54px] h-7">삭제</Button>
        <PublicToggle isPublic={isPublic} onChange={setIsPublic}/>
      </div>
    </div>
  )
}