"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { navItems, profile } from "@/data/profile";
import { cn } from "@/lib/cn";
import { ThemeToggle } from "@/components/theme-toggle";
import { MobileNavigation } from "@/components/mobile-navigation";

export function Navbar() {
  const [activeId, setActiveId] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Active section: the one crossing the middle band of the viewport.
  useEffect(() => {
    const sections = navItems
      .map((n) => document.getElementById(n.id))
      .filter((el): el is HTMLElement => !!el);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const handler = () => mq.matches && setOpen(false);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled || open
          ? "border-line bg-bg/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between">
        <a
          href="#home"
          onClick={close}
          className="group flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-fg transition-opacity hover:opacity-90"
          aria-label={`${profile.brandName} — back to top`}
        >
          <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-line bg-card shadow-sm transition-transform duration-300 group-hover:scale-105">
            <Image
              src={profile.logo}
              alt={profile.logoAlt}
              width={32}
              height={32}
              priority
              className="size-full object-contain"
            />
          </div>
          <span>{profile.brandName}</span>
        </a>

        <div className="flex items-center gap-1">
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-1">
              {navItems.map((item) => {
                const active = activeId === item.id;
                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium transition-all duration-300",
                        active
                          ? "bg-fg/[0.08] text-fg shadow-[inset_0_0_0_1px_rgba(165,180,252,0.25)]"
                          : "text-muted hover:text-fg hover:bg-fg/[0.04]",
                      )}
                    >
                      {active && (
                        <span className="size-1 rounded-full bg-accent-2 shadow-[0_0_6px_var(--accent-2)]" aria-hidden="true" />
                      )}
                      <span>{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <span className="mx-1.5 hidden h-4 w-px bg-line md:block" aria-hidden="true" />
          <ThemeToggle />

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-fg/[0.07] hover:text-fg md:hidden"
          >
            {open ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
          </button>
        </div>
      </div>

      <MobileNavigation open={open} items={navItems} activeId={activeId} onClose={close} />
    </header>
  );
}
