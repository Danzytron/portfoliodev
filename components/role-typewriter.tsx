"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

type Props = {
  text: string;
  className?: string;
};

/**
 * Modern typewriter effect for the role title.
 * - Realistic keystroke intervals and natural pauses
 * - Thin, blinking cursor with Apple-inspired styling
 * - Layout-shift proof: reserves full dimensions using hidden anchor text
 * - Fully respects prefers-reduced-motion
 */
export function RoleTypewriter({ text, className }: Props) {
  const [displayText, setDisplayText] = useState("");
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      setIsReducedMotion(true);
      setDisplayText(text);
      return;
    }

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
      if (e.matches) {
        setDisplayText(text);
      }
    };

    mediaQuery.addEventListener("change", handleMotionChange);

    let currentIndex = 0;
    let isDeleting = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    // Fast, crisp typing cadence: 42ms - 62ms per character
    const getTypingSpeed = () => 42 + Math.floor(Math.random() * 20);
    const deletingSpeed = 22;
    const pauseAfterComplete = 2400; // Stay readable for 2.4s
    const pauseBeforeRestart = 400;  // Pause before re-typing

    const tick = () => {
      if (!isDeleting) {
        if (currentIndex < text.length) {
          currentIndex++;
          setDisplayText(text.slice(0, currentIndex));
          timeoutId = setTimeout(tick, getTypingSpeed());
        } else {
          isDeleting = true;
          timeoutId = setTimeout(tick, pauseAfterComplete);
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
          setDisplayText(text.slice(0, currentIndex));
          timeoutId = setTimeout(tick, deletingSpeed);
        } else {
          isDeleting = false;
          timeoutId = setTimeout(tick, pauseBeforeRestart);
        }
      }
    };

    // Initial delay so hero text entrance finishes cleanly
    timeoutId = setTimeout(tick, 300);

    return () => {
      clearTimeout(timeoutId);
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, [text]);

  if (isReducedMotion) {
    return <span>{text}</span>;
  }

  return (
    <span className={cn("relative inline-block align-baseline", className)} aria-label={text}>
      {/* Screen reader full text for SEO & accessibility */}
      <span className="sr-only">{text}</span>

      {/* Invisible anchor text to reserve exact layout width & height and prevent any layout shift */}
      <span className="invisible select-none opacity-0" aria-hidden="true">
        {text}
      </span>

      {/* Animated typing text with blinking cursor positioned on top of the reserved area */}
      <span className="absolute inset-0 top-0 left-0 flex items-center whitespace-nowrap" aria-hidden="true">
        <span>{displayText}</span>
        <span
          className="ml-1 inline-block h-[1.15em] w-[2px] rounded-full bg-accent align-middle typewriter-cursor"
          aria-hidden="true"
        />
      </span>
    </span>
  );
}
