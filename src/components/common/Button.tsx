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
        flex w-50 h-10 rounded-ml items-center justify-center border border-placeholder bg-white text-placeholder font-bold
        hover:border-focus hover:bg-primary hover:text-white
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