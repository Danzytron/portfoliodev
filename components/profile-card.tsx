"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { profile } from "@/data/profile";

/**
 * Interactive ProfileCard.
 *
 * Features subtle mouse-reactive 3D perspective tilt, moving specular
 * light sheen across the portrait, and a deep-space cosmic glow backdrop.
 */
export function ProfileCard() {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, sheenX: 50, sheenY: 50, isHovered: false });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const rx = -(y - 0.5) * 10;
    const ry = (x - 0.5) * 10;

    setTilt({
      rx,
      ry,
      sheenX: Math.round(x * 100),
      sheenY: Math.round(y * 100),
      isHovered: true,
    });
  }

  function handleMouseLeave() {
    setTilt({ rx: 0, ry: 0, sheenX: 50, sheenY: 50, isHovered: false });
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "1000px" }}
      className="relative mx-auto w-full max-w-[16rem] min-[400px]:max-w-[17.5rem] sm:max-w-[18rem] lg:max-w-[18.5rem] lg:mx-0 lg:ml-auto"
    >
      <figure
        style={{
          transform: tilt.isHovered
            ? `rotateX(${tilt.rx.toFixed(2)}deg) rotateY(${tilt.ry.toFixed(2)}deg) translateY(-4px)`
            : "rotateX(0deg) rotateY(0deg) translateY(0px)",
          transformStyle: "preserve-3d",
        }}
        className="group relative rounded-[1.5rem] sm:rounded-[1.75rem] border border-line bg-card p-2.5 sm:p-3 shadow-[var(--shadow-card)] transition-transform duration-300 ease-out hover:border-fg/20"
        aria-label={`${profile.fullName} — profile card`}
      >
        {/* Soft cosmic nebula illumination behind the card */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 sm:-inset-8 -z-10 rounded-[2.5rem] opacity-75 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(60% 60% at 70% 20%, rgba(139, 92, 246, 0.22), transparent 70%), radial-gradient(50% 50% at 20% 85%, rgba(56, 189, 248, 0.18), transparent 70%)",
          }}
        />

        <div className="relative aspect-[4/4.3] overflow-hidden rounded-[1.25rem] sm:rounded-[1.35rem] bg-surface">
          {profile.photo ? (
            <Image
              src={profile.photo}
              alt={profile.photoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 19rem, 85vw"
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          ) : (
            <Placeholder />
          )}

          {/* Dynamic cursor-following specular sheen across photo */}
          <div
            aria-hidden="true"
            style={{
              background: `radial-gradient(circle 240px at ${tilt.sheenX}% ${tilt.sheenY}%, rgba(255, 255, 255, 0.12), transparent 70%)`,
            }}
            className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          />

          {/* Inner vignette for depth */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-[1.25rem] sm:rounded-[1.35rem] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06),inset_0_-80px_80px_-60px_rgba(0,0,0,0.4)]"
          />
        </div>

        <figcaption className="px-2.5 pt-3.5 pb-2">
          <p className="text-sm sm:text-[15px] font-semibold tracking-tight">{profile.fullName}</p>
          <p className="text-xs text-muted">{profile.role}</p>
          <p className="mt-2.5 inline-flex max-w-full items-center gap-1.5 rounded-full border border-line bg-fg/[0.03] px-2.5 py-1 text-[11px] font-medium text-muted">
            <span className="size-1.5 shrink-0 rounded-full bg-accent-2 animate-pulse" aria-hidden="true" />
            <span className="sr-only">Status: </span>
            <span className="truncate">{profile.status}</span>
          </p>
        </figcaption>
      </figure>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="absolute inset-0" role="img" aria-label={`${profile.fullName} portrait placeholder`}>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 55% at 50% 30%, color-mix(in srgb, var(--accent) 16%, transparent), transparent 70%), linear-gradient(180deg, var(--surface), var(--card))",
        }}
      />
      <svg
        aria-hidden="true"
        viewBox="0 0 400 460"
        className="absolute inset-0 size-full text-fg opacity-[0.12]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle cx="200" cy="200" r="70" />
        <circle cx="200" cy="200" r="120" />
        <circle cx="200" cy="200" r="170" />
        <circle cx="200" cy="200" r="220" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pb-6">
        <span className="bg-gradient-to-b from-fg to-fg/30 bg-clip-text text-[clamp(5rem,22vw,7.5rem)] leading-none font-semibold tracking-[-0.06em] text-transparent select-none">
          {profile.initials}
        </span>
        <span className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
          &lt;Developer /&gt;
        </span>
      </div>
    </div>
  );
}
