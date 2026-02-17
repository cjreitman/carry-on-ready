import { useState, useCallback, useMemo } from 'react';

const DEFAULT_VOLUME = 0.20;

function uid() {
  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function useChecklist(initialItems) {
  const [items, setItems] = useState(() =>
    initialItems ? initialItems.map((item) => ({ ...item })) : []
  );

  const totalVolume = useMemo(
    () =>
      +items
        .reduce(
          (sum, item) => {
            const count = item.count ?? 1;
            const effectiveCount = item.wearOne ? Math.max(0, count - 1) : count;
            return sum + (item.volumeEachLiters != null ? item.volumeEachLiters : 0) * effectiveCount;
          },
          0
        )
        .toFixed(1),
    [items]
  );

  const togglePacked = useCallback((id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, packed: !item.packed } : item
      )
    );
  }, []);

  const editLabel = useCallback((id, newLabel) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, label: newLabel } : item
      )
    );
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addItem = useCallback((section, label) => {
    setItems((prev) => [
      ...prev,
      {
        id: uid(),
        section,
        label,
        count: 1,
        packed: false,
        isUserAdded: true,
        volumeEachLiters: DEFAULT_VOLUME,
        volumeSource: 'DEFAULT_UNKNOWN_ITEM',
      },
    ]);
  }, []);

  const setCount = useCallback((id, count) => {
    const next = Math.max(0, Math.round(count));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count: next } : item))
    );
  }, []);

  const addFullItem = useCallback((item) => {
    setItems((prev) => [...prev, { ...item, packed: false, isUserAdded: true }]);
  }, []);

  const editVolume = useCallback((id, newVolume) => {
    // empty string → null (unknown), NaN → cancel (no-op)
    if (newVolume === '') {
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, volumeEachLiters: null, volumeSource: 'user' } : item
        )
      );
      return;
    }
    const parsed = parseFloat(newVolume);
    if (Number.isNaN(parsed)) return; // cancel
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, volumeEachLiters: +parsed.toFixed(2), volumeSource: 'user' } : item
      )
    );
  }, []);

  return { items, togglePacked, editLabel, removeItem, addItem, addFullItem, setCount, editVolume, totalVolume };
}
