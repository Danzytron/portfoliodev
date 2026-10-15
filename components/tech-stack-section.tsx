import { techCategories, type TechCategory } from "@/data/technologies";
import { SectionHeading } from "@/components/section-heading";
import { TechIcon } from "@/components/tech-icon";
import { cn } from "@/lib/cn";

function Panel({
  category,
  cols,
  delay,
  className,
}: {
  category: TechCategory;
  cols: string;
  delay: number;
  className?: string;
}) {
  const headingId = `tech-${category.title.toLowerCase().replace(/\W+/g, "-")}`;
  return (
    <section
      aria-labelledby={headingId}
      data-reveal
      style={{ "--d": `${delay}ms` } as React.CSSProperties}
      className={cn("rounded-3xl border border-line bg-surface/60 p-4 sm:p-6", className)}
    >
      <h3
        id={headingId}
        className="mb-4 font-mono text-xs font-medium tracking-[0.16em] text-muted uppercase"
      >
        {category.title}
      </h3>
      <ul className={cn("grid gap-3", cols)}>
        {category.technologies.map((tech) => (
          <li
            key={tech.name}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-line bg-card/80 backdrop-blur-sm px-2 py-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-[0_12px_24px_-10px_rgba(99,102,241,0.35)]"
          >
            <TechIcon
              name={tech.icon}
              className="size-8 transition-all duration-300 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(125,211,252,0.6)]"
            />
            <span className="text-[13px] font-medium tracking-tight sm:text-sm transition-colors group-hover:text-fg">{tech.name}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function TechStackSection() {
  const [frontend, backend, database, mobile] = techCategories;
  return (
    <section id="tech-stack" aria-labelledby="tech-title" className="section-pad border-t border-line">
      <div className="container-x">
        <SectionHeading
          id="tech-title"
          eyebrow="Tech Stack"
          title="My Tech Stack"
          subtitle="Tools and technologies I'm learning and working with."
        />

        <div className="mt-10 grid gap-4 sm:mt-12 md:mt-16 lg:grid-cols-12">
          {/* Frontend Development (6 tools) */}
          <Panel
            category={frontend}
            cols="grid-cols-2 min-[440px]:grid-cols-3"
            delay={0}
            className="lg:col-span-6"
          />

          {/* Backend, Database, Mobile */}
          <div className="grid content-start gap-4 lg:col-span-6">
            {/* Backend Development (4 tools) */}
            <Panel
              category={backend}
              cols="grid-cols-2 min-[440px]:grid-cols-4"
              delay={80}
            />

            {/* Database (2 tools) & Mobile Development (2 tools) */}
            <div className="grid gap-4 min-[380px]:grid-cols-2">
              <Panel category={database} cols="grid-cols-2" delay={140} />
              <Panel category={mobile} cols="grid-cols-2" delay={200} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
