import { ArrowDownRight, Download } from "lucide-react";
import { profile } from "@/data/profile";
import { LinkButton } from "@/components/button";
import { ProfileCard } from "@/components/profile-card";
import { SocialIcons } from "@/components/social-icons";
import { RoleTypewriter } from "@/components/role-typewriter";

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;

export function HeroSection() {
  return (
    <section
      id="home"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center overflow-hidden pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-20 lg:pb-14"
    >
      <div className="hero-glow" aria-hidden="true" />

      {/* Subtle cosmic aura behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-gradient-to-tr from-accent/15 via-sky-500/10 to-indigo-500/10 blur-3xl opacity-60"
      />

      <div className="container-x relative grid items-center gap-8 sm:gap-12 lg:grid-cols-[1.22fr_0.78fr] lg:gap-10 xl:gap-14">
        <div className="min-w-0">
          <p
            className="hero-rise mb-3 sm:mb-4 font-mono text-xs font-medium tracking-[0.22em] text-muted"
            style={delay(0)}
          >
            {profile.heroGreeting}
          </p>

          <h1
            id="hero-title"
            className="text-[clamp(2.15rem,4.5vw,3.75rem)] leading-[1.04] font-bold tracking-[-0.04em] text-balance"
          >
            <span className="hero-rise block" style={delay(80)}>
              {profile.firstLine}
            </span>
            <span className="hero-rise block" style={delay(180)}>
              {profile.lastLine}
            </span>
          </h1>

          <p
            className="hero-rise mt-4 sm:mt-5 inline-block border-b border-accent/40 pb-1.5 text-base font-medium tracking-tight text-accent sm:text-lg md:text-xl"
            style={delay(300)}
          >
            <RoleTypewriter text={profile.role} />
          </p>

          <p
            className="hero-rise mt-4 sm:mt-5 max-w-lg text-sm sm:text-base leading-relaxed text-muted text-pretty md:text-[15.5px]"
            style={delay(400)}
          >
            {profile.heroDescription}
          </p>

          <div
            className="hero-rise mt-6 sm:mt-7 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
            style={delay(500)}
          >
            <LinkButton
              href="#projects"
              variant="primary"
              className="w-full sm:w-auto shadow-[0_0_20px_-5px_rgba(99,102,241,0.35)] hover:shadow-[0_0_25px_rgba(99,102,241,0.55)] transition-all"
            >
              Explore My Work
              <ArrowDownRight className="size-4" aria-hidden="true" />
            </LinkButton>
            <LinkButton
              href={profile.cvUrl}
              variant="secondary"
              download={profile.cvFileName}
              className="w-full sm:w-auto hover:border-accent/40 hover:shadow-[0_0_20px_-5px_rgba(56,189,248,0.25)] transition-all"
            >
              <Download className="size-4" aria-hidden="true" />
              Download CV
            </LinkButton>
          </div>

          <div className="hero-rise mt-6 sm:mt-7" style={delay(600)}>
            <SocialIcons />
          </div>
        </div>

        <div className="hero-rise min-w-0" style={delay(350)}>
          <ProfileCard />
        </div>
      </div>
    </section>
  );
}
