import { useState, useCallback } from "react";

interface UseSortableBlocksOptions {
  onReorder?: (newOrderIds: string[]) => void;
}

export function useSortableBlocks({
  onReorder,
}: UseSortableBlocksOptions) {
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null);

  const handleReorder = useCallback(
    (newOrderIds: string[]) => {
      onReorder?.(newOrderIds);
    },
    [onReorder]
  );

  return {
    activeBlockId,
    onDragStart: setActiveBlockId,
    onDragEnd: () => setActiveBlockId(null),
    onReorder: handleReorder,
  };
}
