import type { ReactNode } from 'react'

type WindowCardProps = {
  label: string
  variant?: 'blue' | 'black'
  className?: string
  bodyClassName?: string
  children: ReactNode
}

const variantClasses = {
  blue: 'bg-primary',
  black: 'bg-ink',
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
      className={`flex flex-col overflow-hidden border border-ink bg-white ${className}`}
    >
      <header
        className={`flex h-[30px] items-center justify-between border-b border-ink px-4 text-caption-02 font-bold text-white ${variantClasses[variant]}`}
      >
        <span>C://{label}</span>
        <span className="flex gap-[6px]" aria-hidden="true">
          <i className="block h-3 w-3 border border-current" />
          <i className="block h-3 w-3 border border-current" />
          <i className="block h-3 w-3 border border-current" />
        </span>
      </header>
      <div className={`min-h-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  )
}
