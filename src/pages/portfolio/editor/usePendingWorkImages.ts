import { useEffect, useRef, useState } from "react";
import { validateWorkImage } from "./workImageUtils";

export function usePendingWorkImages() {
  const [files, setFiles] = useState<Record<string, File>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const previewsRef = useRef(previews);

  useEffect(() => {
    previewsRef.current = previews;
  }, [previews]);

  useEffect(() => {
    return () => {
      Object.values(previewsRef.current).forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  function select(itemId: string, file: File) {
    const validationError = validateWorkImage(file);
    if (validationError) return validationError;

    setPreviews((current) => {
      const previousPreview = current[itemId];
      if (previousPreview) URL.revokeObjectURL(previousPreview);
      return { ...current, [itemId]: URL.createObjectURL(file) };
    });
    setFiles((current) => ({ ...current, [itemId]: file }));
    return null;
  }

  function remove(itemId: string) {
    setPreviews((current) => {
      const preview = current[itemId];
      if (preview) URL.revokeObjectURL(preview);
      const next = { ...current };
      delete next[itemId];
      return next;
    });
    setFiles((current) => {
      const next = { ...current };
      delete next[itemId];
      return next;
    });
  }

  return { files, previews, select, remove };
}
