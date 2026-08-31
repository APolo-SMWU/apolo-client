import GoIcon from "@/assets/Goto.svg?react";

export type PersonalCardProps = {
  name: string;
  job: string;
  email: string;
  phone: string;
  web: string;
  address: string;
}
export default function PersonalCard({
  name = '',
  job='',
  email = '',
  phone = '',
  web = '',
  address = '',
}: PersonalCardProps) {
  return (
    <div className="flex h-[200px] w-full max-w-[390px] flex-col gap-3 rounded-xl border border-ink p-3 md:h-[230px] md:gap-6 md:p-5">
      <div className="flex flex-col w-full items-end justify-center">
        <GoIcon className="size-4 md:size-5"/>
        <p className="text-caption-01 text-ink leading-[1.2] md:text-body-02">{job}</p>
        <h1 className="text-heading-03 font-semibold leading-none text-ink md:text-display-02">{name}</h1>
      </div>

      <div className="flex w-full border-b border-ink"/>

      <div className="flex flex-col w-full items-start justify-center gap-2 md:gap-3">
        <div className="flex w-full items-start justify-start gap-4 md:gap-[50px]">
          {/* contact */}
          <div className="flex w-[calc((100%-1rem)/2)] flex-col items-start justify-center gap-1 md:w-[110px]">
            <span className="text-mini-01 font-bold text-ink leading-[1.2]">CONTACT</span>
            <p className="break-words text-mini-01 leading-[1.2] text-ink">{email}</p>
          </div>
          {/* phone */}
          <div className="flex w-[calc((100%-1rem)/2)] flex-col items-start justify-center gap-1 md:w-[110px]">
            <span className="text-mini-01 font-bold text-ink leading-[1.2]">PHONE</span>
            <p className="text-mini-01 text-ink leading-[1.2]">{phone}</p>
          </div>
        </div>

        <div className="flex w-full items-start justify-start gap-4 md:gap-[50px]">
          {/* web site */}
          <div className="flex w-[calc((100%-1rem)/2)] flex-col items-start justify-center gap-1 md:w-[110px]">
            <span className="text-mini-01 font-bold text-ink leading-[1.2]">WEB SITE</span>
            <p className="break-words text-mini-01 leading-[1.2] text-ink">{web}</p>
          </div>

          {/* address */}
          <div className="flex w-[calc((100%-1rem)/2)] flex-col items-start justify-center gap-1 md:w-[110px]">
            <span className="text-mini-01 font-bold text-ink leading-[1.2]">ADDRESS</span>
            <p className="break-words text-mini-01 leading-[1.2] text-ink">{address}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
