"use client";

import { useEffect, useState } from "react";

/** Renders the build-time year first (no hydration mismatch), then the live year. */
export function CurrentYear() {
  const [year, setYear] = useState(() => new Date().getFullYear());
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <span suppressHydrationWarning>{year}</span>;
}
