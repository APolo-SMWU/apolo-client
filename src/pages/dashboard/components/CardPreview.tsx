import type { ReactNode } from "react"

type CardPreviewProps = {
  title?: string;
  onOpen: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onShare: () => void;
  children: ReactNode;
}
export default function CardPreview({
  title = '',
  onOpen,
  onDelete,
  onEdit,
  onShare,
  children,
}: CardPreviewProps) {
  return (
    <section className='w-full max-w-[424px] overflow-hidden rounded-lg border border-focus bg-white'>
      <div className='flex h-[30px] items-center gap-4 px-4 bg-surface border-b border-focus'>
        <div className='flex gap-[6px] items-center justify-center'>
          <button type="button" aria-label="명함 삭제" onClick={onDelete}>
            <span className='block size-[15px] rounded-full bg-danger' />
          </button>

          <button type="button" aria-label="명함 수정" onClick={onEdit}>
            <span className='block size-[15px] rounded-full bg-warn' />
          </button>

          <button type="button" aria-label="명함 공유" onClick={onShare}>
            <span className='block size-[15px] rounded-full bg-success' />
          </button>
        </div>

        {title && (
          <div className='flex px-4 items-center justify-center border-l border-focus'>
            <span className='text-body-02 font-semibold text-placeholder leading-none'>
              {title}
            </span>
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="flex w-full flex-col items-center justify-center p-4"
      >
        {children}
      </button>      
    </section>
  )
}
