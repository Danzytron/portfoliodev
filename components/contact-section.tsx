"use client";

import { useState } from "react";
import { Check, Copy, Mail, MapPin, ArrowUpRight } from "lucide-react";
import { contact, personalInfo } from "@/data/profile";
import { socialLinks } from "@/data/social-links";
import { GithubIcon } from "@/components/brand-icons";
import { ContactForm } from "@/components/contact-form";
import { SectionHeading } from "@/components/section-heading";

export function ContactSection() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  }

  const hasGithub = Boolean(socialLinks.github && socialLinks.github.trim());

  return (
    <section id="contact" aria-labelledby="contact-title" className="section-pad border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionHeading
            id="contact-title"
            eyebrow="Contact"
            title={contact.heading}
            subtitle={contact.text}
          />

          <div className="mt-10 space-y-3" data-reveal>
            {/* 1. Primary Clickable Email Card with Copy Action */}
            <div className="group relative flex items-center justify-between rounded-2xl border border-line bg-card/85 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-px hover:border-accent/40 hover:shadow-[0_10px_25px_-10px_rgba(99,102,241,0.25)]">
              <a
                href={`mailto:${personalInfo.email}`}
                className="flex min-w-0 flex-1 items-center gap-3.5"
                aria-label={`Send email to ${personalInfo.email}`}
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-fg/[0.04] text-accent transition-colors group-hover:bg-accent/10">
                  <Mail className="size-5" aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-mono text-muted uppercase tracking-wider">Email</span>
                  <span className="block truncate font-medium text-fg text-[15px] group-hover:text-accent transition-colors">
                    {personalInfo.email}
                  </span>
                </span>
              </a>

              {/* Copy Email Button */}
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                title={copied ? "Copied!" : "Copy email address"}
                className="ml-2 flex size-9 shrink-0 items-center justify-center rounded-lg border border-line bg-fg/[0.04] text-muted transition-all duration-200 hover:border-accent/30 hover:bg-fg/[0.08] hover:text-fg active:scale-95"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-400 animate-in zoom-in-75" aria-hidden="true" />
                ) : (
                  <Copy className="size-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* 2. Location Card */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-line bg-card/85 backdrop-blur-sm p-4 transition-all duration-300 hover:border-accent/30">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-fg/[0.04] text-accent">
                <MapPin className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <span className="block text-xs font-mono text-muted uppercase tracking-wider">Location</span>
                <span className="block truncate font-medium text-fg text-[15px]">
                  {personalInfo.location}
                </span>
              </div>
            </div>

            {/* 3. GitHub Link (Valid Social Profile) */}
            {hasGithub && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-2xl border border-line bg-card/85 backdrop-blur-sm p-4 transition-all duration-300 hover:-translate-y-px hover:border-accent/40 hover:shadow-[0_10px_25px_-10px_rgba(99,102,241,0.25)]"
                aria-label="Visit GitHub Profile (opens in new tab)"
              >
                <div className="flex min-w-0 items-center gap-3.5">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-line bg-fg/[0.04] text-accent transition-colors group-hover:bg-accent/10">
                    <GithubIcon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-xs font-mono text-muted uppercase tracking-wider">GitHub</span>
                    <span className="block truncate font-medium text-fg text-[15px] group-hover:text-accent transition-colors">
                      {socialLinks.github.replace(/^https?:\/\/(www\.)?/, "")}
                    </span>
                  </div>
                </div>
                <ArrowUpRight className="size-4 text-muted transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div className="lg:col-span-7" data-reveal style={{ "--d": "100ms" } as React.CSSProperties}>
          <ContactForm fallbackEmail={personalInfo.email} />
        </div>
      </div>
    </section>
  );
}
