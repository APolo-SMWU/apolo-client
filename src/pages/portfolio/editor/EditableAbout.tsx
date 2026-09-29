import { useLayoutEffect, useRef } from "react";
import type { ContentBlock } from "@/types/portfolio";
import { inputClass } from "./editorUtils";

export function EditableAbout({ block, onChange }: { block: Extract<ContentBlock, { type: "about" }>; onChange: (value: string) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useLayoutEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  }, [block.description]);

  return (
    <textarea
      ref={textareaRef}
      className={`${inputClass} min-h-28 resize-none overflow-hidden leading-normal`}
      value={block.description}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}
