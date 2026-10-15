"use client";

import { useEffect, useRef } from "react";
import { Download } from "lucide-react";
import { cn } from "@/lib/cn";
import { profile, type NavItem } from "@/data/profile";

type Props = {
  open: boolean;
  items: NavItem[];
  activeId: string;
  onClose: () => void;
};

/** Dropdown panel under the header. Closed state is `invisible`, so links are unfocusable. */
export function MobileNavigation({ open, items, activeId, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <div
      id="mobile-menu"
      ref={panelRef}
      aria-hidden={!open}
      className={cn(
        "absolute inset-x-0 top-full origin-top border-b border-line bg-bg/95 shadow-[0_24px_40px_-24px_rgba(0,0,0,0.5)] backdrop-blur-xl transition-all duration-300 ease-out md:hidden",
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0",
      )}
    >
      <nav aria-label="Mobile" className="container-x py-3">
        <ul className="flex flex-col">
          {items.map((item) => {
            const active = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={onClose}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex min-h-12 items-center justify-between rounded-xl px-3 text-lg font-medium tracking-tight transition-colors",
                    active ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {item.label}
                  {active && <span className="size-1.5 rounded-full bg-accent" aria-hidden="true" />}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="mt-3 border-t border-line pt-3 pb-1">
          <a
            href={profile.cvUrl}
            download={profile.cvFileName}
            onClick={onClose}
            className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-fg px-4 text-sm font-medium text-bg transition-all hover:opacity-90 active:scale-[0.99]"
          >
            <Download className="size-4" aria-hidden="true" />
            Download CV
          </a>
        </div>
      </nav>
    </div>
  );
}
