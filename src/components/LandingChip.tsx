type ChipProps = {
  active?: boolean
  children: string
  className?: string
}

export default function LandingChip({ active = false, children, className = '' }: ChipProps) {
  return (
    <div
      className={`flex h-[30px] items-center border border-ink px-3 font-bold ${
        active ? 'bg-primary text-white' : 'bg-white text-ink'
      } ${className}`}
    >
      {children}
    </div>
  )
}