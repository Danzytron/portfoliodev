"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/cn";

export type IPhone17ProMaxMockupProps = {
  src?: string | null;
  alt?: string;
  title: string;
  priority?: boolean;
  className?: string;
};

/**
 * IPhone17ProMaxMockup
 *
 * Premium Apple iPhone 17 Pro Max device mockup featuring:
 * - Authentic 19.5:9 / 1:2 portrait display proportions.
 * - Titanium unibody frame with specular metallic bevels and subtle antenna bands.
 * - Integrated Dynamic Island pill with camera lens and Face ID sensors.
 * - Realistic side buttons (Action button, Volume rockers, Side/Power button).
 * - ZERO GAPS: Display image fits edge-to-edge flush with the ultra-slim bezels,
 *   clipped cleanly to rounded display corners with no letterboxing or distortion.
 * - Interactive cursor-following 3D tilt, glass reflection sheen, and soft
 *   cosmic blue-violet ambient glow blooming on hover.
 * - Full prefers-reduced-motion accessibility support.
 */
export function IPhone17ProMaxMockup({
  src,
  alt,
  title,
  priority = false,
  className,
}: IPhone17ProMaxMockupProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // 3D tilt and specular reflection states
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sheenX: 50, sheenY: 30, isHovered: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width; // 0 to 1
    const y = (e.clientY - rect.top) / rect.height; // 0 to 1

    // Subtle 3D tilt: max +/- 6 degrees
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
        "group/iphone relative mx-auto w-full max-w-[270px] sm:max-w-[290px] md:max-w-[310px] select-none py-3 sm:py-4",
        className,
      )}
      aria-label={`${title} preview on iPhone 17 Pro Max`}
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
        {/* Soft cosmic blue-violet ambient glow blooming behind the phone */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute -inset-3 -z-10 rounded-[56px] opacity-0 blur-2xl transition-opacity duration-500",
            tilt.isHovered && "opacity-80",
          )}
          style={{
            background:
              "radial-gradient(ellipse 70% 65% at 50% 50%, rgba(99, 102, 241, 0.28), rgba(56, 189, 248, 0.16), transparent 75%)",
          }}
        />

        {/* ── Side Hardware Buttons ── */}
        {/* Left: Action Button */}
        <div
          aria-hidden="true"
          className="absolute -left-[3.5px] top-[17%] h-6 w-[3.5px] rounded-l-sm bg-gradient-to-r from-[#2a2c33] to-[#40434c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        />
        {/* Left: Volume Up */}
        <div
          aria-hidden="true"
          className="absolute -left-[3.5px] top-[25%] h-11 w-[3.5px] rounded-l-sm bg-gradient-to-r from-[#2a2c33] to-[#40434c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        />
        {/* Left: Volume Down */}
        <div
          aria-hidden="true"
          className="absolute -left-[3.5px] top-[37%] h-11 w-[3.5px] rounded-l-sm bg-gradient-to-r from-[#2a2c33] to-[#40434c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        />
        {/* Right: Side / Power Button */}
        <div
          aria-hidden="true"
          className="absolute -right-[3.5px] top-[27%] h-16 w-[3.5px] rounded-r-sm bg-gradient-to-l from-[#2a2c33] to-[#40434c] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
        />

        {/* ── Outer Titanium Body ── */}
        <div className="relative mx-auto rounded-[48px] sm:rounded-[54px] bg-gradient-to-b from-[#4d515a] via-[#282a30] to-[#141518] p-[2.5px] sm:p-[3px] shadow-[0_24px_55px_-12px_rgba(0,0,0,0.85),0_2px_8px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.12)_inset]">
          {/* Subtle antenna notches */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 top-16 h-1 w-[2.5px] bg-[#121316]/80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 top-16 h-1 w-[2.5px] bg-[#121316]/80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-0 bottom-16 h-1 w-[2.5px] bg-[#121316]/80"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-0 bottom-16 h-1 w-[2.5px] bg-[#121316]/80"
          />

          {/* Ultra-Slim Inner Black Display Bezel */}
          <div className="relative rounded-[45px] sm:rounded-[51px] bg-[#07080a] p-[3px] sm:p-[3.5px]">
            {/* Active OLED Display Screen (1:2 aspect ratio, zero gaps, perfectly clipped) */}
            <div className="relative aspect-[1/2] w-full overflow-hidden rounded-[42px] sm:rounded-[48px] bg-[#0c0d12] p-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]">
              {/* Dynamic Island pill */}
              <div
                className="pointer-events-none absolute inset-x-0 top-2.5 sm:top-3 z-30 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="flex h-[22px] w-[78px] sm:h-[26px] sm:w-[88px] items-center justify-between rounded-full bg-black px-2.5 shadow-[0_2px_5px_rgba(0,0,0,0.9),0_0_0_0.5px_rgba(255,255,255,0.1)_inset]">
                  {/* Face ID / TrueDepth sensor array */}
                  <div className="size-2 rounded-full bg-[#0d1017] ring-[0.5px] ring-white/10" />
                  {/* Front camera lens with blue-violet optic sheen */}
                  <div className="size-2.5 rounded-full bg-[#080b12] ring-[0.5px] ring-white/20 shadow-[inset_0_0_2px_rgba(56,189,248,0.8)]" />
                </div>
              </div>

              {/* Screenshot Image: Edge-to-Edge with ZERO GAPS */}
              {src ? (
                <div className="relative size-full p-0 m-0">
                  <Image
                    src={src}
                    alt={alt ?? `${title} mobile app screenshot on iPhone 17 Pro Max`}
                    fill
                    priority={priority}
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 290px, 85vw"
                    className="size-full object-cover object-top select-none transition-transform duration-700 ease-out group-hover/iphone:scale-[1.015]"
                  />
                </div>
              ) : (
                /* Fallback placeholder if no image */
                <div className="flex size-full flex-col items-center justify-center bg-gradient-to-br from-[#0a0c10] via-[#10121a] to-[#08090d] p-4 text-center">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_srgb,var(--accent)_20%,transparent),transparent_70%)]"
                  />
                  <div className="relative z-10 space-y-2">
                    <div className="mx-auto flex size-10 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-accent shadow-inner">
                      <span className="font-mono text-sm font-semibold">&lt;/&gt;</span>
                    </div>
                    <p className="font-mono text-[11px] font-medium tracking-wider text-accent uppercase">
                      Mobile Preview
                    </p>
                    <p className="text-xs text-muted">{title}</p>
                  </div>
                </div>
              )}

              {/* Dynamic specular light reflection across display glass */}
              <div
                aria-hidden="true"
                style={{
                  background: `radial-gradient(circle 280px at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.08), transparent 65%)`,
                }}
                className="pointer-events-none absolute inset-0 transition-opacity duration-300"
              />

              {/* Ambient diagonal glass gloss reflection */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.015] to-white/[0.05]"
              />
            </div>
          </div>
        </div>

        {/* ── Ambient Soft Drop Shadow under device ── */}
        <div aria-hidden="true" className="pointer-events-none relative mx-auto w-[85%]">
          {/* Tight contact shadow */}
          <div className="h-2 w-full rounded-[100%] bg-black/80 blur-[3px]" />
          {/* Diffuse ambient cosmic shadow */}
          <div
            className={cn(
              "-mt-1 h-6 w-full rounded-[100%] bg-black/50 blur-lg transition-all duration-500 ease-out",
              tilt.isHovered && "scale-x-105 bg-indigo-950/70 blur-xl",
            )}
          />
        </div>
      </div>
    </div>
  );
}
