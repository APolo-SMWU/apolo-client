import { useState, type InputHTMLAttributes } from "react";
import EyeIcon from '@/assets/Eye.svg?react';
import EyeOffIcon from '@/assets/Eye-off.svg?react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  errorMessage?: string;
}

export default function Input({
  label,
  errorMessage,
  className='',
  type,
  required,
  ...props
}: InputProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label className="flex flex-col gap-2 items-start justify-center">
      <span className="flex text-caption-01 text-ink leading-none gap-1">
        {label}
        {required && <span className="text-caption-01 text-danger leading-none">*</span>}
      </span>
      <div className="relative w-full">
        <input
          type={isPassword && showPassword ? "text" : type}
          required={required}
          className={`flex w-[450px] h-11 px-4 rounded-ml border  text-body-02 text-ink placeholder:text-placeholder leading-none outline-none focus:border-primary ${
            errorMessage ? 'border-danger' : 'border-placeholder'
          } ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-placeholde"
          >
            {showPassword ? <EyeOffIcon className="size-6"/> : <EyeIcon className="size-6"/>}
          </button>
        )}
      </div>
      
      {errorMessage && (
        <span className="text-caption-01 text-danger leading-none tracking-[0.2px]">
          {errorMessage}
        </span>
      )}
    </label>
  )
}
