import Button from "@/components/common/Button";

type ModeButtonProps = {
  mode: "preview" | "edit";
  onClick?: () => void;
  disabled?: boolean;
};

export default function ModeButton({ mode, onClick, disabled }: ModeButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-20"
    >
      {mode === "edit" ? "SAVE" : "EDIT"}
    </Button>
  )
}
