import { Mail } from "lucide-react";
import { socialHref, type SocialKey } from "@/data/social-links";
import { GithubIcon, LinkedinIcon } from "@/components/brand-icons";
import { cn } from "@/lib/cn";

const items: { key: SocialKey; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "github", label: "GitHub", Icon: GithubIcon },
  { key: "linkedin", label: "LinkedIn", Icon: LinkedinIcon },
  { key: "email", label: "Email", Icon: Mail },
];

export function SocialIcons({ className }: { className?: string }) {
  const activeItems = items.filter(({ key }) => Boolean(socialHref(key)));

  return (
    <ul className={cn("flex items-center gap-2.5", className)} aria-label="Social links">
      {activeItems.map(({ key, label, Icon }) => {
        const href = socialHref(key);
        if (!href) return null;
        const common =
          "flex size-11 items-center justify-center rounded-full border border-line text-muted transition-all duration-300";
        return (
          <li key={key}>
            <a
              href={href}
              aria-label={label}
              title={label}
              className={cn(common, "hover:-translate-y-px hover:border-fg/25 hover:bg-fg/[0.06] hover:text-fg")}
              {...(key !== "email" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <Icon className="size-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
