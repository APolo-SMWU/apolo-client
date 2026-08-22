// ============================================================
// APolo Portfolio - FieldRenderer
// field.input 타입에 따라 알맞은 입력 컴포넌트를 렌더링
// ============================================================

import React, { useState } from "react";
import type { BlockField, FieldOption } from "../types/block.types";

const INPUT_CLASS = "w-full border border-ink bg-surface px-3 py-2 text-body-02 text-ink outline-none transition-colors placeholder:text-placeholder focus:border-primary focus:ring-2 focus:ring-focus disabled:cursor-not-allowed disabled:opacity-40";

// ─────────────────────────────────────────
// Props
// ─────────────────────────────────────────

interface FieldRendererProps {
  field: BlockField;
  value: unknown;
  onChange: (key: string, value: unknown) => void;
  disabled?: boolean;
  readOnly?: boolean;
  contextValue?: Record<string, unknown>;
}

// ─────────────────────────────────────────
// 공통 wrapper / label
// ─────────────────────────────────────────

function FieldWrapper({
  field,
  children,
}: {
  field: BlockField;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-2" data-field-key={field.key}>
      {field.label && (
        <label className="text-body-02 font-medium text-ink" htmlFor={field.key}>
          {field.label}
          {field.validation?.required && (
            <span className="text-danger" aria-hidden>
              {" "}
              *
            </span>
          )}
        </label>
      )}
      {children}
      {field.helperText && (
        <p className="text-caption-01 leading-5 text-placeholder">{field.helperText}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────
// 개별 입력 컴포넌트들
// ─────────────────────────────────────────

function TextInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <input
      id={field.key}
      type="text"
      className={INPUT_CLASS}
      value={value ?? ""}
      placeholder={field.placeholder}
      disabled={disabled || field.disabled}
      maxLength={field.validation?.maxLength}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function TextareaInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <textarea
      id={field.key}
      className={`${INPUT_CLASS} min-h-20 resize-y leading-6`}
      value={value ?? ""}
      placeholder={field.placeholder}
      disabled={disabled || field.disabled}
      maxLength={field.validation?.maxLength}
      rows={4}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}

function SelectInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <select
      id={field.key}
      className={`${INPUT_CLASS} cursor-pointer`}
      value={value ?? ""}
      disabled={disabled || field.disabled}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{field.placeholder ?? "선택하세요"}</option>
      {field.options?.map((opt: FieldOption) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function MultiSelectInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  const selected = value ?? [];

  const toggle = (val: string) => {
    onChange(
      selected.includes(val)
        ? selected.filter((v) => v !== val)
        : [...selected, val]
    );
  };

  return (
    <div className="flex flex-wrap gap-2" id={field.key}>
      {field.options?.map((opt) => (
        <button
          key={opt.value}
          type="button"
          className={`border px-3 py-1 text-body-02 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selected.includes(opt.value) ? "border-primary bg-focus text-primary" : "border-ink bg-surface text-placeholder hover:border-primary hover:text-primary"}`}
          disabled={disabled || field.disabled}
          onClick={() => toggle(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function SwitchInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center">
      <button
        id={field.key}
        type="button"
        role="switch"
        aria-checked={!!value}
        className={`relative h-[22px] w-10 rounded-full border transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${value ? "border-primary bg-primary" : "border-ink bg-surface"}`}
        disabled={disabled || field.disabled}
        onClick={() => onChange(!value)}
      >
        <span className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${value ? "translate-x-[18px]" : "translate-x-0.5 bg-placeholder"}`} />
      </button>
    </div>
  );
}

function DateRangeInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: { start?: string; end?: string; isCurrent?: boolean };
  onChange: (v: { start?: string; end?: string; isCurrent?: boolean }) => void;
  disabled?: boolean;
}) {
  const val = value ?? {};

  return (
    <div className="flex flex-wrap items-center gap-2">
      <input
        type="month"
        className={`${INPUT_CLASS} min-w-[120px] flex-1`}
        value={val.start ?? ""}
        placeholder="시작"
        disabled={disabled || field.disabled}
        onChange={(e) => onChange({ ...val, start: e.target.value })}
      />
      <span className="text-body-02 text-placeholder">~</span>
      <input
        type="month"
        className={`${INPUT_CLASS} min-w-[120px] flex-1`}
        value={val.end ?? ""}
        placeholder="종료"
        disabled={disabled || field.disabled || val.isCurrent}
        onChange={(e) => onChange({ ...val, end: e.target.value })}
      />
      <label className="flex cursor-pointer items-center gap-1 text-body-02 text-placeholder">
        <input
          type="checkbox"
          checked={!!val.isCurrent}
          disabled={disabled || field.disabled}
          onChange={(e) =>
            onChange({ ...val, isCurrent: e.target.checked, end: undefined })
          }
        />
        현재
      </label>
    </div>
  );
}

function TagInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  const [input, setInput] = useState("");
  const tags = value ?? [];

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput("");
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((t) => t !== tag));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 border border-ink bg-surface px-2 py-0.5 text-caption-01 text-placeholder">
            {tag}
            <button
              type="button"
              className="px-0.5 text-caption-01 leading-none text-placeholder hover:text-danger"
              disabled={disabled || field.disabled}
              onClick={() => removeTag(tag)}
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          className={INPUT_CLASS}
          value={input}
          placeholder={field.placeholder ?? "태그 입력 후 Enter"}
          disabled={disabled || field.disabled}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addTag();
            }
          }}
        />
        <button
          type="button"
          className="shrink-0 border border-ink bg-surface px-3 py-2 text-body-02 text-placeholder transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          disabled={disabled || field.disabled || !input.trim()}
          onClick={addTag}
        >
          추가
        </button>
      </div>
    </div>
  );
}

// 미리 정의된 태그 옵션을 토글하거나 커스텀 입력 가능
const PRESET_TAGS: Record<string, string[]> = {
  default: [
    "React", "TypeScript", "JavaScript", "Next.js", "Vue", "Angular",
    "Node.js", "Python", "Java", "Spring", "Django", "FastAPI",
    "TailwindCSS", "CSS", "HTML", "Figma", "Git", "Docker",
  ],
  developer: [
    "React", "TypeScript", "JavaScript", "Next.js", "Vue", "Node.js",
    "Python", "Java", "Spring", "Django", "FastAPI", "MySQL",
    "PostgreSQL", "MongoDB", "Redis", "Docker", "AWS", "Git",
  ],
  designer: [
    "Figma", "Photoshop", "Illustrator", "InDesign", "After Effects",
    "Premiere Pro", "Blender", "Framer", "Webflow", "Brand Identity",
    "UI Design", "UX Research", "Wireframing", "Prototyping",
    "Design System", "Typography", "Layout", "Graphic Design",
    "Visual Storytelling", "Presentation Design",
  ],
  research: [
    "Literature Review", "Research Design", "Data Analysis", "Python",
    "R", "SPSS", "LaTeX", "Academic Writing", "Survey Design",
    "Experiment Design", "Statistics", "Machine Learning",
  ],
};

function inferTagPreset(
  field: BlockField,
  contextValue?: Record<string, unknown>
): keyof typeof PRESET_TAGS {
  if (field.preset && PRESET_TAGS[field.preset]) return field.preset;

  const contextText = [
    contextValue?.category,
    contextValue?.role,
    contextValue?.title,
    contextValue?.summary,
    contextValue?.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (
    contextText.includes("design") ||
    contextText.includes("designer") ||
    contextText.includes("visual") ||
    contextText.includes("brand") ||
    contextText.includes("graphic") ||
    contextText.includes("figma") ||
    contextText.includes("ui") ||
    contextText.includes("ux")
  ) {
    return "designer";
  }
  if (
    contextText.includes("research") ||
    contextText.includes("paper") ||
    contextText.includes("academic") ||
    contextText.includes("cv")
  ) {
    return "research";
  }
  if (
    contextText.includes("frontend") ||
    contextText.includes("backend") ||
    contextText.includes("developer") ||
    contextText.includes("server") ||
    contextText.includes("api") ||
    contextText.includes("stack") ||
    contextText.includes("tech")
  ) {
    return "developer";
  }
  if (field.key === "techStack") return "developer";

  return "default";
}

function ToggleTagSelectorInput({
  field,
  value,
  onChange,
  disabled,
  contextValue,
}: {
  field: BlockField;
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
  contextValue?: Record<string, unknown>;
}) {
  const [customInput, setCustomInput] = useState("");
  const selected = value ?? [];
  const presets = PRESET_TAGS[inferTagPreset(field, contextValue)];

  const toggle = (tag: string) => {
    onChange(
      selected.includes(tag)
        ? selected.filter((t) => t !== tag)
        : [...selected, tag]
    );
  };

  const addCustom = () => {
    const trimmed = customInput.trim();
    if (trimmed && !selected.includes(trimmed)) {
      onChange([...selected, trimmed]);
    }
    setCustomInput("");
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {presets.map((tag) => (
          <button
            key={tag}
            type="button"
            className={`border px-3 py-1 text-caption-01 transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${selected.includes(tag) ? "border-primary bg-focus text-primary" : "border-ink bg-surface text-placeholder hover:border-primary hover:text-primary"}`}
            disabled={disabled || field.disabled}
            onClick={() => toggle(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {field.allowCustom && (
        <div className="flex gap-2">
          <input
            className={INPUT_CLASS}
            value={customInput}
            placeholder="직접 입력"
            disabled={disabled || field.disabled}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <button
            type="button"
            className="shrink-0 border border-ink bg-surface px-3 py-2 text-body-02 text-placeholder transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
            disabled={disabled || field.disabled || !customInput.trim()}
            onClick={addCustom}
          >
            추가
          </button>
        </div>
      )}
      {selected.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border border-ink bg-white px-3 py-2">
          <span className="text-caption-01 text-placeholder">선택됨:</span>
          {selected.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 border border-primary bg-focus px-2 py-0.5 text-caption-01 text-primary">
              {tag}
              <button
                type="button"
                className="px-0.5 text-caption-01 leading-none text-primary hover:text-danger"
                disabled={disabled || field.disabled}
                onClick={() => toggle(tag)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function LinkInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: { label?: string; url: string; target?: string } | null;
  onChange: (v: { label?: string; url: string; target?: string } | null) => void;
  disabled?: boolean;
}) {
  const val = value ?? { url: "" };

  return (
    <div className="flex flex-col gap-2">
      <input
        className={INPUT_CLASS}
        type="url"
        value={val.url ?? ""}
        placeholder="https://..."
        disabled={disabled || field.disabled}
        onChange={(e) => onChange({ ...val, url: e.target.value })}
      />
      <input
        className={`${INPUT_CLASS} text-body-02`}
        type="text"
        value={val.label ?? ""}
        placeholder="링크 텍스트 (선택)"
        disabled={disabled || field.disabled}
        onChange={(e) => onChange({ ...val, label: e.target.value })}
      />
    </div>
  );
}

function LinkListInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: Array<{ label?: string; url: string; target?: string }>;
  onChange: (
    v: Array<{ label?: string; url: string; target?: string }>
  ) => void;
  disabled?: boolean;
}) {
  const links = value ?? [];

  const update = (
    idx: number,
    updated: { label?: string; url: string; target?: string }
  ) => {
    const next = [...links];
    next[idx] = updated;
    onChange(next);
  };

  const remove = (idx: number) => {
    onChange(links.filter((_, i) => i !== idx));
  };

  const add = () => {
    onChange([...links, { url: "", label: "" }]);
  };

  return (
    <div className="flex flex-col gap-2">
      {links.map((link, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <input
            className={INPUT_CLASS}
            type="url"
            value={link.url ?? ""}
            placeholder="https://..."
            disabled={disabled || field.disabled}
            onChange={(e) => update(idx, { ...link, url: e.target.value })}
          />
          <input
            className={`${INPUT_CLASS} text-body-02`}
            type="text"
            value={link.label ?? ""}
            placeholder="링크 텍스트"
            disabled={disabled || field.disabled}
            onChange={(e) => update(idx, { ...link, label: e.target.value })}
          />
          <button
            type="button"
            className="flex size-7 shrink-0 items-center justify-center text-title-02 text-placeholder hover:bg-focus hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled || field.disabled}
            onClick={() => remove(idx)}
          >
            ×
          </button>
        </div>
      ))}
      <button
        type="button"
        className="inline-flex w-full items-center justify-center border border-dashed border-ink px-3 py-2 text-body-02 text-placeholder transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
        disabled={disabled || field.disabled}
        onClick={add}
      >
        + 링크 추가
      </button>
    </div>
  );
}

function ImageUploadInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string; // URL or base64
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChange(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full">
      {value && (
        <div className="relative inline-block">
          <img src={value} alt="preview" className="block max-h-[200px] w-full object-cover" />
          <button
            type="button"
            className="absolute top-2 right-2 border border-ink bg-white/90 px-2 py-1 text-caption-01 text-ink hover:bg-focus hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
            disabled={disabled || field.disabled}
            onClick={() => onChange("")}
          >
            제거
          </button>
        </div>
      )}
      {!value && (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 border-2 border-dashed border-ink px-8 py-10 transition-colors ${disabled || field.disabled ? "cursor-not-allowed opacity-40" : "hover:border-primary hover:bg-focus"}`}
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            disabled={disabled || field.disabled}
            onChange={handleFile}
          />
          <span className="text-heading-03">🖼</span>
          <span className="text-body-02 text-placeholder">클릭하여 이미지 업로드</span>
        </label>
      )}
    </div>
  );
}

function ImageListInput({
  field,
  value,
  onChange,
  disabled,
}: {
  field: BlockField;
  value: string[];
  onChange: (v: string[]) => void;
  disabled?: boolean;
}) {
  const images = value ?? [];

  const readFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    Promise.all(
      Array.from(files).map(
        (file) =>
          new Promise<string | null>((resolve) => {
            const reader = new FileReader();
            reader.onload = () =>
              resolve(typeof reader.result === "string" ? reader.result : null);
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(file);
          })
      )
    ).then((results) => {
      const next = results.filter((item): item is string => Boolean(item));
      if (next.length > 0) onChange([...images, ...next]);
    });
  };

  const remove = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-3">
      {images.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3">
          {images.map((image, index) => (
            <div key={`${image}-${index}`} className="relative overflow-hidden border border-ink bg-white">
              <img
                src={image}
                alt={`gallery ${index + 1}`}
                className="block aspect-[4/3] w-full object-cover"
              />
              <button
                type="button"
                className="absolute top-1 right-1 border border-ink bg-white/90 px-2 py-0.5 text-caption-01 text-ink hover:bg-focus hover:text-danger disabled:cursor-not-allowed disabled:opacity-40"
                disabled={disabled || field.disabled}
                onClick={() => remove(index)}
              >
                제거
              </button>
            </div>
          ))}
        </div>
      )}
      <label
        className={`inline-flex min-h-[42px] items-center justify-center border border-dashed border-ink text-body-02 text-placeholder transition-colors ${disabled || field.disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer hover:border-primary hover:bg-focus hover:text-primary"}`}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          disabled={disabled || field.disabled}
          onChange={(e) => {
            readFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
        + 이미지 추가
      </label>
    </div>
  );
}

// ─────────────────────────────────────────
// FieldRenderer (메인 분기)
// ─────────────────────────────────────────

export function FieldRenderer({
  field,
  value,
  onChange,
  disabled,
  readOnly,
  contextValue,
}: FieldRendererProps) {
  if (field.visible === false) return null;

  const handleChange = (v: unknown) => {
    if (!readOnly) onChange(field.key, v);
  };

  const renderInput = () => {
    switch (field.input) {
      case "text":
        return (
          <TextInput
            field={field}
            value={value as string}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "textarea":
        return (
          <TextareaInput
            field={field}
            value={value as string}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "select":
        return (
          <SelectInput
            field={field}
            value={value as string}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "multiSelect":
        return (
          <MultiSelectInput
            field={field}
            value={value as string[]}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "switch":
        return (
          <SwitchInput
            field={field}
            value={value as boolean}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "dateRange":
        return (
          <DateRangeInput
            field={field}
            value={value as { start?: string; end?: string; isCurrent?: boolean }}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "tagInput":
        return (
          <TagInput
            field={field}
            value={value as string[]}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "toggleTagSelector":
        return (
          <ToggleTagSelectorInput
            field={field}
            value={value as string[]}
            onChange={handleChange}
            disabled={disabled || readOnly}
            contextValue={contextValue}
          />
        );

      case "link":
        return (
          <LinkInput
            field={field}
            value={value as { label?: string; url: string } | null}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "linkList":
        return (
          <LinkListInput
            field={field}
            value={value as Array<{ label?: string; url: string }>}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "imageUpload":
        return (
          <ImageUploadInput
            field={field}
            value={value as string}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      case "imageList":
        return (
          <ImageListInput
            field={field}
            value={value as string[]}
            onChange={handleChange}
            disabled={disabled || readOnly}
          />
        );

      default:
        return (
          <p className="text-body-02 italic text-placeholder">
            미지원 입력 타입: {field.input}
          </p>
        );
    }
  };

  return <FieldWrapper field={field}>{renderInput()}</FieldWrapper>;
}

export default FieldRenderer;
