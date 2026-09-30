import AppWindow from "../AppWindow";
import type { ReactNode } from 'react'

export type ModalProps =  {
  title: string;
  description?: string;
  children?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  cancelLabel?: string;
  confirmLabel?: string;
}
export default function Modal({
  title= '',
  description= '',
  children,
  onCancel,
  onConfirm,
  cancelLabel = "아니요",
  confirmLabel = "네",
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
          <p className="whitespace-pre-line text-body-02 text-placeholder leading-[1.2]">{description}</p>
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
            {cancelLabel}
          </button>
          <button
            type="button"
            className="flex h-10 w-50 items-center justify-center rounded-ml border border-primary bg-white text-body-02 font-bold text-placeholder hover:bg-primary hover:text-white"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      ) : null}
    </AppWindow>
  )
}
