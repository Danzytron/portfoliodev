import { cn } from "@/lib/cn";

type Props = {
  id?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center";
};

export function SectionHeading({ id, eyebrow, title, subtitle, className, align = "left" }: Props) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p
          data-reveal
          className="mb-4 font-mono text-xs font-medium tracking-[0.18em] text-accent uppercase"
        >
          {eyebrow}
        </p>
      )}
      <h2
        id={id}
        data-reveal
        style={{ "--d": "60ms" } as React.CSSProperties}
        className="text-[clamp(1.85rem,5vw,3.5rem)] leading-[1.08] font-semibold tracking-[-0.03em] text-balance"
      >
        {title}
      </h2>
      {subtitle && (
        <p
          data-reveal
          style={{ "--d": "120ms" } as React.CSSProperties}
          className="mt-4 text-lg leading-relaxed text-muted text-pretty md:text-xl"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
