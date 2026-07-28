import type { ReactNode } from 'react'

type WindowCardProps = {
  label: string
  variant?: 'blue' | 'black'
  className?: string
  bodyClassName?: string
  children: ReactNode
}

const variantClasses = {
  blue: 'bg-[var(--color-primary)] text-white',
  black: 'bg-[var(--color-ink)] text-white',
} as const

export function WindowCard({
  label,
  variant = 'blue',
  className = '',
  bodyClassName = '',
  children,
}: WindowCardProps) {
  return (
    <section
      className={`overflow-hidden border border-[var(--color-ink)] bg-white shadow-[4px_4px_0_rgba(17,17,17,0.08)] ${className}`}
    >
      <header
        className={`flex h-7 items-center justify-between border-b border-[var(--color-ink)] px-[10px] text-[10px] font-bold tracking-[0.02em] ${variantClasses[variant]}`}
      >
        <span>{label}</span>
        <span className="flex gap-[5px]" aria-hidden="true">
          <i className="block h-[10px] w-[10px] border border-current" />
          <i className="block h-[10px] w-[10px] border border-current" />
          <i className="block h-[10px] w-[10px] border border-current" />
        </span>
      </header>
      <div className={bodyClassName}>{children}</div>
    </section>
  )
}
