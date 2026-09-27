import Button from "@/components/common/Button";

type UpdateButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function UpdateButton({ onClick, disabled }: UpdateButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="w-50"
    >
      UPDATE CONTENT
    </Button>
  )
}
