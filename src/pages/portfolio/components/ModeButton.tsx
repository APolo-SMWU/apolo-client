type ModeButtonProps = {
  mode: "preview" | "edit";
  onClick?: () => void;
  disabled?: boolean;
};

export default function ModeButton({ mode, onClick, disabled }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-10 w-20 items-center justify-center rounded-full border-2 border-primary bg-focus text-title-02 font-bold text-primary disabled:cursor-not-allowed disabled:opacity-50"
    >
      {mode === "edit" ? "SAVE" : "EDIT"}
    </button>
  )
}
