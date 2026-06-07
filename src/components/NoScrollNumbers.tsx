'use client';

import { useEffect } from 'react';

/**
 * Prevents number inputs from changing their value when the user scrolls.
 * Mounted once globally in the layout.
 */
export default function NoScrollNumbers() {
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      const target = e.target as HTMLInputElement;
      if (target.tagName === 'INPUT' && target.type === 'number') {
        target.blur();
      }
    };
    document.addEventListener('wheel', handleWheel, { passive: true });
    return () => document.removeEventListener('wheel', handleWheel);
  }, []);

  return null;
}
