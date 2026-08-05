type ChipProps = {
  active?: boolean
  children: string
  className?: string
  onClick?: () => void;
}

export default function LandingChip({ active = false, children, className = '', onClick }: ChipProps) {
  return (
    <div
      onClick={onClick}
      className={`flex h-[30px] items-center border border-ink px-3 font-bold ${
        active ? 'bg-primary text-white' : 'bg-white text-ink'
      } ${className}`}
    >
      {children}
    </div>
  )
}