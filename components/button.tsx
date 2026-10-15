import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-medium tracking-tight whitespace-nowrap transition-all duration-300 ease-out select-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-bg shadow-[0_1px_2px_rgba(0,0,0,0.25)] hover:opacity-90 hover:-translate-y-px active:translate-y-0",
  secondary:
    "border border-line bg-fg/[0.03] text-fg hover:bg-fg/[0.07] hover:border-fg/25 hover:-translate-y-px active:translate-y-0",
  ghost: "text-muted hover:text-fg hover:bg-fg/[0.06]",
};

type ButtonProps = {
  variant?: Variant;
  className?: string;
  children: React.ReactNode;
  /** Missing href → rendered as a visibly disabled control, never a dead link. */
  href?: string | null;
  external?: boolean;
  disabledHint?: string;
} & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "children">;

export function LinkButton({
  variant = "secondary",
  className,
  children,
  href,
  external,
  disabledHint,
  ...rest
}: ButtonProps) {
  const classes = cn(base, variants[variant], className);

  if (!href) {
    return (
      <span
        role="link"
        aria-disabled="true"
        title={disabledHint ?? "Link not configured yet"}
        className={cn(classes, "cursor-not-allowed opacity-45 hover:translate-y-0 hover:bg-transparent")}
      >
        {children}
      </span>
    );
  }

  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
    </a>
  );
}
