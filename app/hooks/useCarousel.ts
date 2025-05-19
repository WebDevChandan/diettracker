"use client";

import { useState, useEffect } from 'react';

export function useCarousel(items: string[], interval: number = 5000) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [items.length, interval]);

  return {
    currentIndex,
    currentItem: items[currentIndex],
  };
}