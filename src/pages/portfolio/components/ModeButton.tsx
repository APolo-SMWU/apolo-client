type ModeButtonProps = {
  mode: "preview" | "edit";
  onClick?: () => void;
};

export default function ModeButton({ mode, onClick }: ModeButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-20 h-10 items-center justify-center rounded-full border-2 border-primary bg-focus text-title-02 font-bold text-primary"
    >
      {mode === "edit" ? "SAVE" : "EDIT"}
    </button>
  )
}
