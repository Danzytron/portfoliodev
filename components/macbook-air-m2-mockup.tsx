"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type MacBookAirM2MockupProps = {
  src?: string | null;
  alt?: string;
  title: string;
  priority?: boolean;
  previewStyle?: "web" | "mobile";
  fit?: "cover" | "contain";
  className?: string;
};

/**
 * MacBookAirM2Mockup
 *
 * Interactive Apple MacBook Air M2 design featuring:
 * - Subtle cursor-tracking 3D tilt with smooth spring-back physics.
 * - Dynamic moving glass reflection sheen across the display.
 * - Soft cosmic violet/cyan ambient underglow blooming on hover.
 * - ZERO GAPS: Website screenshot fills the screen edge-to-edge flush with the
 *   inner bezel, with zero margins, padding, or letterboxing gaps.
 * - Authentic M2 camera notch integrated directly into the top of the display.
 * - Flat unibody aluminum chassis, recessed hinge, and chamfered lower base.
 */
export function MacBookAirM2Mockup({
  src,
  alt,
  title,
  priority = false,
  previewStyle = "web",
  fit = "cover",
  className,
}: MacBookAirM2MockupProps) {
  const isMobilePlaceholder = previewStyle === "mobile";
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 3D tilt and specular reflection states
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sheenX: 50, sheenY: 30, isHovered: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Subtle 3D tilt: max +/- 5 degrees
    const rx = -(y - 0.5) * 8;
    const ry = (x - 0.5) * 8;

    setTilt({
      rx,
      ry,
      sheenX: Math.round(x * 100),
      sheenY: Math.round(y * 100),
      isHovered: true,
    });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, sheenX: 50, sheenY: 30, isHovered: false });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: "1200px",
      }}
      className={cn(
        "group/macbook relative mx-auto w-full max-w-[34rem] select-none py-2",
        className,
      )}
      aria-label={`${title} preview on MacBook Air M2`}
    >
      {/* 3D tiltable enclosure */}
      <div
        style={{
          transform: tilt.isHovered
            ? `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-6px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px)",
          transformStyle: "preserve-3d",
        }}
        className="transition-transform duration-300 ease-out will-change-transform"
      >
        {/* Ambient cosmic edge highlight behind the laptop */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-2 -z-10 rounded-[2rem] opacity-0 blur-xl transition-opacity duration-500",
            tilt.isHovered && "opacity-75",
          )}
          style={{
            background:
              "radial-gradient(ellipse 65% 55% at 50% 40%, rgba(99, 102, 241, 0.22), rgba(56, 189, 248, 0.12), transparent 70%)",
          }}
        />

        {/* ── 1. Display Lid Enclosure (M2 Flat Profile) ── */}
        <div className="relative mx-auto w-[93%] rounded-t-[16px] sm:rounded-t-[20px] md:rounded-t-[24px] rounded-b-[2px] bg-gradient-to-b from-[#34363d] via-[#1f2025] to-[#131417] p-[1.5px] shadow-[0_14px_34px_-8px_rgba(0,0,0,0.7),0_2px_6px_rgba(0,0,0,0.45)] ring-1 ring-white/15 dark:ring-white/10">
          {/* Uniform Slim Black Display Bezel */}
          <div className="relative rounded-t-[14px] sm:rounded-t-[18px] md:rounded-t-[22px] rounded-b-[1px] bg-[#08090b] p-[5px] sm:p-[6px] md:p-[7px]">
            {/* Active Display Screen (16:10 Ratio, Zero Gaps, Edge-to-Edge) */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-t-[10px] sm:rounded-t-[13px] md:rounded-t-[16px] rounded-b-[2px] bg-[#0c0d12] p-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              {/* M2 Camera Notch: hangs down from top bezel into the display */}
              <div
                className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-center"
                aria-hidden="true"
              >
                <div className="flex h-2.5 w-14 items-center justify-center rounded-b-[5px] bg-[#08090b] shadow-[0_1px_2px_rgba(0,0,0,0.9)] sm:h-3 sm:w-18 sm:rounded-b-[6px] md:h-3.5 md:w-20 md:rounded-b-[7px]">
                  {/* Camera lens & sensor indicator */}
                  <div className="flex items-center gap-1.5">
                    <div className="size-1 rounded-full bg-[#0a0f18] ring-[0.5px] ring-white/15 shadow-[inset_0_0_1px_rgba(56,189,248,0.7)] sm:size-1.5" />
                    <div className="size-[2px] rounded-full bg-emerald-500/50 opacity-0 transition-opacity group-hover/macbook:opacity-90" />
                  </div>
                </div>
              </div>

              {/* Website Screenshot: Fitted edge-to-edge with ZERO GAPS */}
              {src ? (
                <div className="relative size-full p-0 m-0">
                  <Image
                    src={src}
                    alt={alt ?? `${title} website screenshot on MacBook Air M2`}
                    fill
                    priority={priority}
                    sizes="(min-width: 1280px) 32rem, (min-width: 768px) 45vw, 92vw"
                    className={cn(
                      "size-full transition-transform duration-700 ease-out group-hover/macbook:scale-[1.015]",
                      fit === "contain"
                        ? "object-contain object-top"
                        : "object-cover object-top",
                    )}
                  />
                </div>
              ) : (
                /* Designed in-development placeholder screen */
                <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-[#0a0c10] via-[#10121a] to-[#08090d] p-4 text-center">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_70%)]"
                  />
                  {isMobilePlaceholder ? (
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="flex h-20 w-11 flex-col items-center justify-between rounded-xl border border-white/20 bg-card/85 p-1.5 shadow-md">
                        <div className="h-0.5 w-3 rounded-full bg-fg/20" />
                        <div className="size-6 rounded-lg bg-accent/20" />
                        <div className="h-0.5 w-2 rounded-full bg-fg/20" />
                      </div>
                      <p className="font-mono text-[11px] font-medium tracking-wider text-accent uppercase">
                        Mobile App In Development
                      </p>
                      <p className="max-w-[14rem] text-[11px] text-muted">
                        Flutter &amp; Dart interface in progress
                      </p>
                    </div>
                  ) : (
                    <div className="relative z-10 space-y-2">
                      <div className="mx-auto flex size-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-accent shadow-inner">
                        <span className="font-mono text-sm font-semibold">&lt;/&gt;</span>
                      </div>
                      <p className="font-mono text-[11px] font-medium tracking-wider text-accent uppercase">
                        Preview Coming Soon
                      </p>
                      <p className="text-xs text-muted">{title}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Dynamic cursor-following specular screen reflection sheen */}
              <div
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle 320px at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.09), transparent 60%)`,
                }}
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              />

              {/* Ambient diagonal screen glass gloss */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.05]"
              />
            </div>
          </div>
        </div>

        {/* ── 2. Seamless Recessed Hinge / Clutch ── */}
        <div
          aria-hidden="true"
          className="relative mx-auto -mt-[1px] h-[3px] w-[34%] rounded-b-[2px] bg-gradient-to-b from-[#090a0c] to-[#040405] shadow-[inset_0_1px_2px_rgba(0,0,0,0.9)] sm:h-[4px]"
        />

        {/* ── 3. MacBook Air M2 Flat Lower Chassis Base ── */}
        <div
          aria-hidden="true"
          className="relative z-10 mx-auto -mt-[2px] w-full"
        >
          {/* Aluminum top lip with crisp specular chamfer highlight */}
          <div className="relative h-[6px] w-full rounded-t-[3px] bg-gradient-to-b from-[#3a3c42] via-[#222429] to-[#141518] shadow-[0_1px_0_rgba(255,255,255,0.2)_inset] sm:h-[7px] md:h-[8px]">
            {/* Center thumb opener cutout (groove for lifting display) */}
            <div className="absolute inset-x-0 top-0 mx-auto h-[3px] w-14 rounded-b-[3px] bg-[#07080a] shadow-[inset_0_1px_1px_rgba(0,0,0,0.85),0_0.5px_0_rgba(255,255,255,0.12)] sm:h-[3.5px] sm:w-20 md:w-24" />
          </div>

          {/* Thin bottom base edge with rounded bottom corners (M2 flat unibody) */}
          <div className="mx-[1%] h-[4px] rounded-b-[5px] bg-gradient-to-b from-[#131416] to-[#08090b] shadow-[0_2px_4px_rgba(0,0,0,0.55)] ring-1 ring-white/5 sm:h-[5px] sm:rounded-b-[6px] md:h-[6px]" />
        </div>

        {/* ── 4. Ground Contact & Ambient Soft Drop Shadows ── */}
        <div aria-hidden="true" className="pointer-events-none relative mx-auto w-[96%]">
          {/* Tight contact shadow under chassis */}
          <div className="h-2 w-full rounded-[100%] bg-black/75 blur-[3px] sm:h-2.5 sm:blur-[4px]" />
          {/* Diffuse ambient cosmic shadow that deepens on hover */}
          <div
            className={cn(
              "-mt-1 h-5 w-[88%] mx-auto rounded-[100%] bg-black/45 blur-md transition-all duration-500 ease-out sm:h-7 sm:blur-lg",
              tilt.isHovered && "scale-x-105 bg-indigo-950/60 blur-xl",
            )}
          />
        </div>
      </div>
    </div>
  );
}
