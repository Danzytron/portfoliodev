import { ArrowUpRight } from "lucide-react";
import { projects, type Project } from "@/data/projects";
import { socialHref } from "@/data/social-links";
import { LinkButton } from "@/components/button";
import { GithubIcon } from "@/components/brand-icons";
import { SectionHeading } from "@/components/section-heading";
import { MacBookAirM2Mockup } from "@/components/macbook-air-m2-mockup";
import { IPhone17ProMaxMockup } from "@/components/iphone-17-pro-max-mockup";
import { cn } from "@/lib/cn";

function ProjectCard({ project, featured, index }: { project: Project; featured: boolean; index: number }) {
  const hasGithub = !!project.githubUrl?.trim();
  const hasLive = !!project.liveUrl?.trim();
  const isIPhone = project.deviceType === "iphone";

  return (
    <li
      data-reveal
      style={{ "--d": `${index * 90}ms` } as React.CSSProperties}
      className={cn(featured && "lg:col-span-2")}
    >
      <article
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-line bg-card/90 backdrop-blur-sm shadow-[var(--shadow-card)] transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent/35 hover:shadow-[0_24px_50px_-20px_rgba(99,102,241,0.25)]",
          featured && "lg:grid lg:grid-cols-12",
        )}
      >
        {/* Showcase Stage Area with MacBook Air M2 or iPhone 17 Pro Max Mockup */}
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden border-b border-line bg-gradient-to-b from-surface/90 via-surface/30 to-surface/90 px-4 pt-8 pb-7 sm:px-8 sm:pt-10 sm:pb-9 md:px-10 md:pt-12 md:pb-10",
            featured && "lg:col-span-5 lg:border-b-0 lg:border-r lg:p-8 xl:p-10",
          )}
        >
          {/* Subtle cosmic studio spotlight illumination behind the device */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-500 group-hover:opacity-100"
            style={{
              background:
                "radial-gradient(ellipse 70% 55% at 50% 50%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 75%)",
            }}
          />

          {isIPhone ? (
            <IPhone17ProMaxMockup
              src={project.image}
              alt={project.imageAlt ?? `${project.title} screenshot on iPhone 17 Pro Max`}
              title={project.title}
              priority={index < 2}
            />
          ) : (
            <MacBookAirM2Mockup
              src={project.image}
              alt={project.imageAlt ?? `${project.title} website screenshot on MacBook Air M2`}
              title={project.title}
              priority={index < 2}
              previewStyle={project.previewStyle}
            />
          )}
        </div>

        <div
          className={cn(
            "flex flex-1 flex-col p-5 sm:p-7 md:p-8",
            featured && "lg:col-span-7 lg:p-8 xl:p-10",
          )}
        >
          {project.statusLabel && (
            <p className="mb-3 font-mono text-[11px] tracking-[0.18em] text-accent uppercase flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-accent animate-pulse" aria-hidden="true" />
              {project.statusLabel}
            </p>
          )}
          <h3 className="text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem] transition-colors group-hover:text-fg">
            {project.title}
          </h3>
          <p className="mt-3 leading-relaxed text-muted text-pretty">
            {project.description}
          </p>

          {/* Key Features for featured mobile projects */}
          {project.features && project.features.length > 0 && (
            <div className="mt-5 space-y-2.5">
              <p className="font-mono text-xs uppercase tracking-wider text-fg/80 font-medium">
                Key Features
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted">
                {project.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-accent/80 shrink-0" aria-hidden="true" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {project.technologies.length > 0 && (
            <ul className="mt-5 flex flex-wrap gap-2" aria-label={`${project.title} technologies`}>
              {project.technologies.map((t) => (
                <li
                  key={t}
                  className="rounded-full border border-line bg-fg/[0.04] px-3 py-1 text-xs font-medium text-muted transition-colors hover:border-accent/30 hover:text-fg"
                >
                  {t}
                </li>
              ))}
            </ul>
          )}

          {/* Links area: only render when valid URLs exist, never render a fake or disabled live demo */}
          {(hasGithub || hasLive) && (
            <div className="mt-auto flex flex-wrap gap-2.5 pt-7">
              {hasGithub && (
                <LinkButton href={project.githubUrl} external variant="secondary" aria-label={`${project.title} on GitHub`}>
                  <GithubIcon className="size-4" />
                  GitHub
                </LinkButton>
              )}
              {hasLive && (
                <LinkButton href={project.liveUrl} external variant="primary" aria-label={`${project.title} live demo`}>
                  Live Demo
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </LinkButton>
              )}
            </div>
          )}
        </div>
      </article>
    </li>
  );
}

export function ProjectsSection() {
  const githubHref = socialHref("github");
  return (
    <section id="projects" aria-labelledby="projects-title" className="section-pad border-t border-line">
      <div className="container-x">
        <SectionHeading
          id="projects-title"
          eyebrow="Projects"
          title="Things I've Been Building"
          subtitle="A selection of projects, experiments, and ideas."
        />

        <ul className="mt-12 grid gap-5 md:mt-16 lg:grid-cols-2">
          {projects.map((project, i) => (
            <ProjectCard
              key={project.slug}
              project={project}
              featured={project.featured ?? false}
              index={i}
            />
          ))}
        </ul>

        <div className="mt-12 flex justify-center" data-reveal>
          <LinkButton
            href={githubHref}
            external
            variant="secondary"
            disabledHint="Add your GitHub URL in data/social-links.ts to enable this button"
          >
            <GithubIcon className="size-4" />
            View All Projects
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
