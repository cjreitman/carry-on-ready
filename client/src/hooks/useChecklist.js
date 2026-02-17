import { useState, useCallback } from 'react';

function uid() {
  return `user-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function useChecklist(initialItems) {
  const [items, setItems] = useState(() =>
    initialItems ? initialItems.map((item) => ({ ...item })) : []
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
      },
    ]);
  }, []);

  const setCount = useCallback((id, count) => {
    const next = Math.max(0, Math.round(count));
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, count: next } : item))
    );
  }, []);

  return { items, togglePacked, editLabel, removeItem, addItem, setCount };
}
