import { about, personalDetails, whatIDo } from "@/data/profile";
import { SectionHeading } from "@/components/section-heading";
import { cn } from "@/lib/cn";

const floatingWaveConfig = [
  {
    label: whatIDo[0], // UI/UX Design
    waveOffset: "lg:-translate-y-3",
    animationClass: "animate-float-wave-1",
  },
  {
    label: whatIDo[1], // Web Development
    waveOffset: "lg:translate-y-4",
    animationClass: "animate-float-wave-2",
  },
  {
    label: whatIDo[2], // App Development
    waveOffset: "lg:-translate-y-4",
    animationClass: "animate-float-wave-3",
  },
  {
    label: whatIDo[3], // IoT Projects
    waveOffset: "lg:translate-y-3",
    animationClass: "animate-float-wave-4",
  },
  {
    label: whatIDo[4], // AI Integration
    waveOffset: "lg:-translate-y-2",
    animationClass: "animate-float-wave-5",
  },
] as const;

export function AboutSection() {
  return (
    <section id="about" aria-labelledby="about-title" className="section-pad border-t border-line">
      <div className="container-x">
        {/* Top: Section Heading and Intro Bio */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <SectionHeading
            id="about-title"
            eyebrow="About"
            title={about.heading}
            subtitle={about.tagline}
            className="lg:col-span-6"
          />
          <div className="text-base leading-relaxed text-muted text-pretty md:text-lg lg:col-span-6 lg:pt-10">
            <p data-reveal style={{ "--d": "160ms" } as React.CSSProperties}>
              {about.paragraphs[0]}
            </p>
          </div>
        </div>

        {/* ── What I Do (Floating Wave Section) ── */}
        <div
          data-reveal
          style={{ "--d": "220ms" } as React.CSSProperties}
          className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-line/50"
        >
          {/* Section Heading with subtle accent */}
          <div className="flex items-center gap-3 mb-8 sm:mb-10">
            <span
              className="h-6 sm:h-7 w-[3px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)] shrink-0"
              aria-hidden="true"
            />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              What I Do
            </h3>
          </div>

          {/* Floating Wave Arrangement */}
          <div className="relative py-4 sm:py-6 overflow-visible">
            <div className="flex flex-wrap items-center justify-center sm:justify-between gap-3.5 sm:gap-4 lg:gap-5 max-w-5xl mx-auto">
              {floatingWaveConfig.map((item) => (
                <div
                  key={item.label}
                  className={cn(
                    "relative group cursor-default select-none transition-transform will-change-transform",
                    item.waveOffset,
                    item.animationClass
                  )}
                >
                  <div className="relative inline-flex items-center rounded-full border border-line/80 bg-surface/60 backdrop-blur-md px-5 py-2.5 sm:px-6 sm:py-3 transition-all duration-300 ease-out group-hover:-translate-y-1.5 group-hover:border-accent/70 group-hover:bg-surface/90 group-hover:shadow-[0_0_24px_rgba(99,102,241,0.28),0_10px_20px_-5px_rgba(14,165,233,0.18)]">
                    {/* Inner subtle glow highlight */}
                    <span
                      className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-r from-accent/0 via-accent/10 to-accent-2/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      aria-hidden="true"
                    />
                    <span className="relative text-sm sm:text-base font-normal tracking-wide text-fg/90 transition-colors duration-300 group-hover:text-fg">
                      {item.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Personal Details (Positioned below, portfolio font, unbolded) ── */}
        <div
          data-reveal
          style={{ "--d": "280ms" } as React.CSSProperties}
          className="mt-14 sm:mt-18 pt-8 sm:pt-10 border-t border-line/50"
        >
          {/* Header with vertical accent line */}
          <div className="flex items-center gap-3 mb-6 sm:mb-8">
            <span
              className="h-6 sm:h-7 w-[3px] rounded-full bg-accent shadow-[0_0_8px_var(--accent)] shrink-0"
              aria-hidden="true"
            />
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              Personal Details
            </h3>
          </div>

          {/* Minimal 2-Column Grid */}
          <div className="grid grid-cols-1 gap-y-7 sm:gap-y-8 gap-x-12 sm:grid-cols-2 lg:max-w-4xl lg:gap-x-20">
            {/* Left Column: PHONE & EMAIL */}
            <div className="space-y-7 sm:space-y-8">
              <div>
                <span className="block text-[11px] sm:text-xs font-normal uppercase tracking-[0.14em] text-muted mb-1.5">
                  PHONE
                </span>
                <a
                  href={personalDetails.phoneHref}
                  className="text-base sm:text-[17px] font-normal text-fg hover:text-accent transition-colors"
                >
                  {personalDetails.phone}
                </a>
              </div>

              <div>
                <span className="block text-[11px] sm:text-xs font-normal uppercase tracking-[0.14em] text-muted mb-1.5">
                  EMAIL
                </span>
                <a
                  href={personalDetails.emailHref}
                  className="text-base sm:text-[17px] font-normal text-fg hover:text-accent transition-colors break-all sm:break-normal"
                >
                  {personalDetails.email}
                </a>
              </div>
            </div>

            {/* Right Column: EDUCATION, PROGRAM & ADDRESS */}
            <div className="space-y-7 sm:space-y-8">
              <div>
                <span className="block text-[11px] sm:text-xs font-normal uppercase tracking-[0.14em] text-muted mb-1.5">
                  EDUCATION
                </span>
                <span className="block text-base sm:text-[17px] font-normal text-fg leading-snug">
                  {personalDetails.education}
                </span>
              </div>

              <div>
                <span className="block text-[11px] sm:text-xs font-normal uppercase tracking-[0.14em] text-muted mb-1.5">
                  PROGRAM
                </span>
                <span className="block text-base sm:text-[17px] font-normal text-fg leading-snug">
                  {personalDetails.program}
                </span>
              </div>

              <div>
                <span className="block text-[11px] sm:text-xs font-normal uppercase tracking-[0.14em] text-muted mb-1.5">
                  ADDRESS
                </span>
                <span className="block text-base sm:text-[17px] font-normal text-fg leading-snug">
                  {personalDetails.address}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
