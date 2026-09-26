type UpdateButtonProps = {
  onClick?: () => void;
  disabled?: boolean;
};

export default function UpdateButton({ onClick, disabled }: UpdateButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex w-50 h-10 items-center justify-center rounded-full border-2 border-primary bg-focus text-title-02 font-bold text-primary leading-[1.2]"
    >
      UPDATE CONTENT
    </button>
  )
}
