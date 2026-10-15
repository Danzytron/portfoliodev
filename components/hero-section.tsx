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
      className="relative flex min-h-svh items-center overflow-hidden pt-24 pb-14 sm:pt-28 sm:pb-16 md:pt-32 md:pb-20"
    >
      <div className="hero-glow" aria-hidden="true" />

      {/* Subtle cosmic aura behind the headline */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/4 left-0 -z-10 h-[30rem] w-[30rem] rounded-full bg-gradient-to-tr from-accent/15 via-sky-500/10 to-indigo-500/10 blur-3xl opacity-60"
      />

      <div className="container-x relative grid items-center gap-10 sm:gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="min-w-0">
          <p
            className="hero-rise mb-4 sm:mb-5 font-mono text-xs font-medium tracking-[0.22em] text-muted"
            style={delay(0)}
          >
            {profile.heroGreeting}
          </p>

          <h1
            id="hero-title"
            className="text-[clamp(2.35rem,8vw,5.5rem)] leading-[1.02] font-bold tracking-[-0.04em] text-balance"
          >
            <span className="hero-rise block" style={delay(80)}>
              {profile.firstLine}
            </span>
            <span className="hero-rise block" style={delay(180)}>
              {profile.lastLine}
            </span>
          </h1>

          <p
            className="hero-rise mt-5 sm:mt-6 inline-block border-b border-accent/40 pb-1.5 text-lg font-medium tracking-tight text-accent sm:text-xl md:text-2xl"
            style={delay(300)}
          >
            <RoleTypewriter text={profile.role} />
          </p>

          <p
            className="hero-rise mt-5 sm:mt-7 max-w-xl text-base leading-relaxed text-muted text-pretty md:text-lg"
            style={delay(400)}
          >
            {profile.heroDescription}
          </p>

          <div
            className="hero-rise mt-8 sm:mt-9 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3"
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

          <div className="hero-rise mt-9" style={delay(600)}>
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
