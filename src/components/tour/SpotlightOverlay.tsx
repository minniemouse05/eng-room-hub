'use client';

import { useEffect, useState, useCallback } from 'react';

interface SpotlightOverlayProps {
  targetSelector: string;
  padding?: number;
  onOverlayClick?: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function SpotlightOverlay({
  targetSelector,
  padding = 8,
  onOverlayClick,
}: SpotlightOverlayProps) {
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const updateTargetRect = useCallback(() => {
    const element = document.querySelector(targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Scroll element into view if needed
      const viewportHeight = window.innerHeight;
      const elementCenter = rect.top + rect.height / 2;

      if (elementCenter < 100 || elementCenter > viewportHeight - 100) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [targetSelector, padding]);

  useEffect(() => {
    // Initial calculation with delay for animations
    const initialTimeout = setTimeout(updateTargetRect, 100);

    // Update on scroll and resize
    window.addEventListener('scroll', updateTargetRect, true);
    window.addEventListener('resize', updateTargetRect);

    // Use ResizeObserver for element size changes
    const observer = new ResizeObserver(updateTargetRect);
    const element = document.querySelector(targetSelector);
    if (element) {
      observer.observe(element);
    }

    return () => {
      clearTimeout(initialTimeout);
      window.removeEventListener('scroll', updateTargetRect, true);
      window.removeEventListener('resize', updateTargetRect);
      observer.disconnect();
    };
  }, [targetSelector, updateTargetRect]);

  if (!targetRect) return null;

  // Create a mask with a hole for the target element
  const clipPath = `polygon(
    0% 0%,
    0% 100%,
    ${targetRect.left}px 100%,
    ${targetRect.left}px ${targetRect.top}px,
    ${targetRect.left + targetRect.width}px ${targetRect.top}px,
    ${targetRect.left + targetRect.width}px ${targetRect.top + targetRect.height}px,
    ${targetRect.left}px ${targetRect.top + targetRect.height}px,
    ${targetRect.left}px 100%,
    100% 100%,
    100% 0%
  )`;

  return (
    <>
      {/* Dark overlay with cutout */}
      <div
        className="fixed inset-0 z-[9998] pointer-events-auto bg-black/60 transition-all duration-300"
        style={{ clipPath }}
        onClick={onOverlayClick}
        aria-hidden="true"
      />

      {/* Highlight border around target */}
      <div
        className="fixed z-[9999] pointer-events-none rounded-lg transition-all duration-300"
        style={{
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          boxShadow: '0 0 0 2px rgba(57, 230, 255, 0.8), 0 0 20px rgba(57, 230, 255, 0.4)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
