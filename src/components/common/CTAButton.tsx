import type { ButtonHTMLAttributes, ReactNode } from "react";

interface CTAButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function CTAButton({
  children,
  className='',
  disabled = false,
  ...props
}: CTAButtonProps) {

  return (
    <button
      type="button"
      disabled={disabled}
      className={`
        flex w-50 h-10 items-center justify-center border rounded-ml
        ${disabled ? 'bg-white border-placeholder text-placeholder font-regular': 'bg-primary border-focus text-white font-bold'}
        ${className}
      `}
      {...props}
    >
      <span className='whitespace-nowrap text-body-02'>
        {children}
      </span>
      
    </button>
  )
}