import { useState, useCallback } from 'react';

export function useToggle(init: boolean): any {
  const [isOpen, setOpen] = useState(init);

  const open = useCallback(() => {
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
  }, []);

  const toggle = useCallback(() => {
    setOpen(!isOpen);
  }, [isOpen]);

  return { isOpen, open, close, toggle };
}
