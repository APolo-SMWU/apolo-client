import Button from "./Button";

type SelectOption<T extends string> = {
  label: string;
  value: T;
  disabled?: boolean;
};

interface SingleSelectGroupProps<T extends string> {
  options: SelectOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  name?: string;
  className?: string;
  optionClassName?: string;
}

export default function SingleSelectGroup<T extends string>({
  options,
  value,
  onChange,
  name,
  className = "",
  optionClassName = "",
}: SingleSelectGroupProps<T>) {
  return (
    <div
      role="radiogroup"
      aria-label={name}
      className={`flex flex-wrap gap-6 ${className}`}
    >
      {options.map((option) => {
        const isSelected = option.value === value;

        return (
          <Button
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            aria-pressed={isSelected}
            disabled={option.disabled}
            onClick={() => onChange(option.value)}
            className={`
              w-[120px] h-[35px] border border-ink outline-none text-body-02
              ${isSelected ? "!bg-primary !text-white font-bold" : "!bg-white !text-ink font-regular"}
              ${optionClassName}
            `}
          >
            {option.label}
          </Button>
        );
      })}
    </div>
  );
}

export type { SelectOption, SingleSelectGroupProps };
