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
        flex items-center justify-center border border-ink
        ${disabled ? 'bg-white text-placeholder font-regular': 'bg-primary text-white font-bold'}
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