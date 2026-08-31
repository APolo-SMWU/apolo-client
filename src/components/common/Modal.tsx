import AppWindow from "../AppWindow";
import type { ReactNode } from 'react'

export type ModalProps =  {
  title: string;
  description?: string;
  children?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
}
export default function Modal({
  title= '',
  description= '',
  children,
  onCancel,
  onConfirm,
}: ModalProps) {
  return (
    <AppWindow
      className="relative z-10 w-[500px]"
    >
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-heading-03 font-bold text-ink leading-[1.2]">
          {title}
        </h1>
        {description ? (
          <p className="text-body-02 text-placeholder leading-[1.2]">{description}</p>
        ) : null}
      </div>
      
      {children}

      {onCancel && onConfirm ? (
        <div className="flex w-full items-center justify-between">
          <button
            type="button"
            className="flex h-10 w-50 items-center justify-center rounded-ml border border-danger bg-white text-body-02 font-bold text-placeholder hover:bg-danger hover:text-white"
            onClick={onCancel}
          >
            아니요
          </button>
          <button
            type="button"
            className="flex h-10 w-50 items-center justify-center rounded-ml border border-primary bg-white text-body-02 font-bold text-placeholder hover:bg-primary hover:text-white"
            onClick={onConfirm}
          >
            네
          </button>
        </div>
      ) : null}
    </AppWindow>
  )
}
