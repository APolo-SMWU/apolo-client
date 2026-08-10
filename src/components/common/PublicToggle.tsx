type ToggleProps = {
  isPublic: boolean;
  onChange: (next: boolean) => void;
}
export default function PublicToggle({
  isPublic,
  onChange,
}: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isPublic}
      onClick={() => onChange(!isPublic)}
      className={`
        relative flex w-11 h-6 rounded-full items-center border border-ink transition-colors
        ${isPublic ? "bg-success" : "bg-placeholder"}
      `}
    >
      <span 
        className={`
          absolute w-[18px] h-4 rounded-full bg-white transition-all
          ${isPublic ? "left-[22px]" : "left-1"}
        `}
      />
    </button>
  )
}