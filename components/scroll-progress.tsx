"use client";

import { useEffect, useState } from "react";

export function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;

    function onScroll() {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (totalHeight > 0) {
            setProgress(Math.min(1, Math.max(0, window.scrollY / totalHeight)));
          }
          ticking = false;
        });
        ticking = true;
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-accent via-sky-400 to-indigo-500 shadow-[0_0_8px_rgba(125,211,252,0.8)] transition-transform duration-100 ease-out will-change-transform"
        style={{
          transform: `scaleX(${progress})`,
          transformOrigin: "left",
        }}
      />
    </div>
  );
}
