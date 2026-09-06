interface FilterChipProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
}
export default function FilterChip({ 
  label,
  selected = false,
  onClick,
}: FilterChipProps) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`
        flex w-[120px] h-9 border border-ink items-center justify-center outline-none
        ${selected ? "bg-primary text-white": "bg-white text-ink"}
      `}
    >
      <span className="text-body-02 leading-none">{label}</span>
    </button>
  )
}