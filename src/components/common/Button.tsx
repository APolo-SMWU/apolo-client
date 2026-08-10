import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({
  children,
  className='',
  ...props
}: ButtonProps) {

  return (
    <button
      type="button"
      className={`
        flex items-center justify-center border border-ink bg-white text-ink font-bold
        hover:bg-primary hover:text-white
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