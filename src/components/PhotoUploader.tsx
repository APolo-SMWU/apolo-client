import { useEffect, useRef, useState, type ChangeEvent } from "react";
import PlusIcon from "@/assets/Plus.svg?react";
import XIcon from "@/assets/X.svg?react";

interface PhotoUploaderProps {
  className?: string;
  disabled?: boolean;
  onChange?: (file: File | null) => void;
}

export default function PhotoUploader({
  className = "",
  disabled = false,
  onChange,
}: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file || !file.type.startsWith("image/")) return;

    setPreviewUrl(URL.createObjectURL(file));
    onChange?.(file);
  }

  function handleRemove() {
    setPreviewUrl(null);

    if (inputRef.current) inputRef.current.value = "";

    onChange?.(null);
  }

  return (
    <div className={`size-[100px] ${className}`}>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/*"
        disabled={disabled}
        onChange={handleFileChange}
      />

      {previewUrl ? (
        <div className="group relative size-full overflow-hidden rounded-full border border-placeholder">
          <img
            className="size-full object-cover"
            src={previewUrl}
            alt="업로드한 사진 미리보기"
          />
          <button
            className="absolute inset-0 flex items-center justify-center bg-danger/60 opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 disabled:cursor-not-allowed"
            type="button"
            disabled={disabled}
            onClick={handleRemove}
            aria-label="사진 삭제"
          >
            <XIcon className="size-8" />
          </button>
        </div>
      ) : (
        <button
          className="flex size-full items-center justify-center rounded-full border border-placeholder disabled:cursor-not-allowed disabled:opacity-50"
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          aria-label="사진 업로드"
        >
          <PlusIcon className="size-6" />
        </button>
      )}
    </div>
  );
}
