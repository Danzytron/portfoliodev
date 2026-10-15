import { ArrowUp } from "lucide-react";
import Image from "next/image";
import { profile } from "@/data/profile";
import { CurrentYear } from "@/components/current-year";
import { SocialIcons } from "@/components/social-icons";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <div className="container-x flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="relative size-8 shrink-0 overflow-hidden rounded-full border border-line bg-card shadow-sm">
              <Image
                src={profile.logo}
                alt={profile.logoAlt}
                width={32}
                height={32}
                className="size-full object-contain"
              />
            </div>
            <p className="text-lg font-semibold tracking-tight">{profile.fullName}</p>
          </div>
          <p className="mt-1 text-sm text-muted">Designed and built with curiosity.</p>
          <p className="mt-4 text-xs text-muted">
            © <CurrentYear /> {profile.fullName}. All rights reserved.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 sm:gap-5 md:justify-end">
          <SocialIcons />
          <a
            href="#home"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-medium text-muted transition-all duration-300 hover:-translate-y-px hover:border-fg/25 hover:text-fg"
          >
            Back to Top
            <ArrowUp className="size-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
