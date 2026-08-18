import Unchecked from "@/assets/Uncheck.svg?react";
import Checked from "@/assets/Check.svg?react";

export type StepItemProps = {
  label: string;
  checked: boolean;
};

export default function StepItem({ label, checked }: StepItemProps) {
  const StatusIcon = checked ? Checked : Unchecked;

  return (
    <div className="flex items-center gap-3">
      <StatusIcon className="w-5 h-4" />
      <p className="text-body-02 text-ink">{label}</p>
    </div>
  );
}