// ============================================================
// APolo Portfolio - Setting Input Components
// NumberInput / RangeSlider / SegmentedControl / DatePicker
// 레이아웃·설정 패널에서 사용하는 독립 입력 컴포넌트
// ============================================================

import React from "react";

// ─────────────────────────────────────────
// NumberInput
// span, order, padding, gap 설정
// ─────────────────────────────────────────

interface NumberInputProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  disabled?: boolean;
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  label,
  unit,
  disabled,
}: NumberInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = Number(e.target.value);
    if (!Number.isNaN(parsed)) {
      onChange(Math.min(max, Math.max(min, parsed)));
    }
  };

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className="flex items-center border border-ink" aria-label={label}>
      <button
        type="button"
        className="flex size-8 items-center justify-center text-title-02 text-placeholder hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="감소"
      >
        −
      </button>
      <input
        type="number"
        className="min-w-0 flex-1 bg-white text-center text-body-02 text-ink outline-none"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={handleChange}
        aria-label={label}
      />
      {unit && <span className="px-1 text-caption-01 text-placeholder">{unit}</span>}
      <button
        type="button"
        className="flex size-8 items-center justify-center text-title-02 text-placeholder hover:bg-surface hover:text-ink disabled:cursor-not-allowed disabled:opacity-30"
        onClick={increment}
        disabled={disabled || value >= max}
        aria-label="증가"
      >
        +
      </button>
    </div>
  );
}

// ─────────────────────────────────────────
// RangeSlider
// 간격, 강조도, 크기 조절
// ─────────────────────────────────────────

interface RangeSliderProps {
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
  unit?: string;
  showValue?: boolean;
  disabled?: boolean;
}

export function RangeSlider({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  unit,
  showValue = true,
  disabled,
}: RangeSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="flex items-center gap-2" aria-label={label}>
      <div className="relative h-1 flex-1 bg-surface">
        <div
          className="absolute inset-y-0 left-0 bg-primary"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          className="absolute inset-0 h-1 w-full cursor-pointer appearance-none bg-transparent accent-primary"
          value={value}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
      </div>
      {showValue && (
        <span className="w-10 text-right text-caption-01 text-placeholder">
          {value}
          {unit}
        </span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// SegmentedControl
// 정렬, 방향, 스타일 분기 선택
// ─────────────────────────────────────────

interface SegmentedOption<T extends string> {
  value: T;
  label: string;
  icon?: React.ReactNode;
}

interface SegmentedControlProps<T extends string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (v: T) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "md";
  fullWidth?: boolean;
}

export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  disabled,
  size = "md",
  fullWidth = false,
}: SegmentedControlProps<T>) {
  return (
    <div
      className={`flex border border-ink ${fullWidth ? "w-full" : "w-fit"}`}
      role="group"
      aria-label={label}
    >
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="radio"
          aria-checked={value === opt.value}
          className={`flex items-center justify-center gap-1 ${size === "sm" ? "px-2 py-1 text-caption-01" : "px-3 py-2 text-body-02"} ${fullWidth ? "flex-1" : ""} ${value === opt.value ? "bg-primary text-white" : "text-placeholder hover:bg-surface"}`}
          disabled={disabled}
          onClick={() => onChange(opt.value)}
        >
          {opt.icon && (
            <span>{opt.icon}</span>
          )}
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// DatePicker
// 단일 날짜 입력
// ─────────────────────────────────────────

interface DatePickerProps {
  value: string; // ISO 날짜 문자열 (YYYY-MM-DD)
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

export function DatePicker({
  value,
  onChange,
  label,
  placeholder,
  min,
  max,
  disabled,
}: DatePickerProps) {
  return (
    <div aria-label={label}>
      <input
        type="date"
        className="w-full border border-ink bg-white px-3 py-2 text-body-02 text-ink outline-none focus:border-primary focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-40"
        value={value ?? ""}
        placeholder={placeholder}
        min={min}
        max={max}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    </div>
  );
}
