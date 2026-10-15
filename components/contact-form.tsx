"use client";

import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Send } from "lucide-react";
import { validateContact, type ContactErrors, type ContactValues } from "@/lib/validation";
import { cn } from "@/lib/cn";

type Status = "idle" | "loading" | "success" | "activation" | "error" | "unconfigured";

const empty: ContactValues = { name: "", email: "", subject: "", message: "" };

const inputClass =
  "w-full rounded-2xl border bg-surface/60 px-4 py-3 text-base text-fg placeholder:text-muted/70 transition-colors duration-200 hover:border-fg/25 focus:border-accent focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-accent/30";

export function ContactForm({ fallbackEmail }: { fallbackEmail: string }) {
  const uid = useId();
  const [values, setValues] = useState<ContactValues>(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  function update(field: keyof ContactValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validateContact(next)[field] }));
  }

  function blur(field: keyof ContactValues) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateContact(values)[field] }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    const found = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, subject: true, message: true });
    if (Object.keys(found).length > 0) {
      const first = (["name", "email", "subject", "message"] as const).find((k) => found[k]);
      if (first) document.getElementById(`${uid}-${first}`)?.focus();
      return;
    }

    setStatus("loading");
    setServerMessage("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        errors?: ContactErrors;
        pendingActivation?: boolean;
      };

      if (res.ok) {
        if (data.pendingActivation) {
          setStatus("activation");
          setServerMessage(
            data.message ||
              `A one-time activation link was sent to ${fallbackEmail}. Please click 'Activate Form' in your inbox.`,
          );
          return;
        }
        setStatus("success");
        setValues(empty);
        setTouched({});
        setErrors({});
        return;
      }
      if (res.status === 503 && data.error === "not_configured") {
        setStatus("unconfigured");
        return;
      }
      if (res.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }
      setServerMessage(data.message || "Something went wrong while sending your message.");
      setStatus("error");
    } catch {
      setServerMessage("Could not reach the server. Check your connection and try again.");
      setStatus("error");
    }
  }

  const mailtoHref = fallbackEmail
    ? `mailto:${fallbackEmail}?subject=${encodeURIComponent(values.subject || "Hello from your portfolio")}&body=${encodeURIComponent(
        `${values.message}\n\n— ${values.name}${values.email ? ` (${values.email})` : ""}`,
      )}`
    : null;

  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[26rem] flex-col items-center justify-center rounded-3xl border border-line bg-card p-8 text-center shadow-[var(--shadow-card)]"
      >
        <CheckCircle2 className="mb-5 size-11 text-accent-2" aria-hidden="true" strokeWidth={1.5} />
        <h3 className="text-2xl font-semibold tracking-tight">Message sent</h3>
        <p className="mt-2 max-w-sm text-muted">Thanks for reaching out — I&apos;ll get back to you as soon as I can.</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-7 min-h-11 rounded-full border border-line px-5 text-sm font-medium transition-colors hover:bg-fg/[0.06]"
        >
          Send another message
        </button>
      </div>
    );
  }

  const field = (
    name: keyof ContactValues,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => {
    const id = `${uid}-${name}`;
    const err = errors[name];
    return (
      <div>
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          {label} <span className="text-muted" aria-hidden="true">*</span>
        </label>
        <input
          id={id}
          name={name}
          value={values[name]}
          onChange={(e) => update(name, e.target.value)}
          onBlur={() => blur(name)}
          required
          aria-required="true"
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${id}-error` : undefined}
          className={cn(inputClass, err ? "border-red-400/70" : "border-line")}
          {...props}
        />
        {err && (
          <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-500 dark:text-red-300">
            {err}
          </p>
        )}
      </div>
    );
  };

  const msgId = `${uid}-message`;

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="space-y-5 rounded-3xl border border-line bg-card p-6 shadow-[var(--shadow-card)] sm:p-8"
      aria-label="Contact form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {field("name", "Name", { type: "text", autoComplete: "name", maxLength: 100, placeholder: "Your name" })}
        {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email", placeholder: "you@example.com" })}
      </div>
      {field("subject", "Subject", { type: "text", maxLength: 150, placeholder: "What's this about?" })}

      <div>
        <label htmlFor={msgId} className="mb-2 block text-sm font-medium">
          Message <span className="text-muted" aria-hidden="true">*</span>
        </label>
        <textarea
          id={msgId}
          name="message"
          rows={6}
          value={values.message}
          onChange={(e) => update("message", e.target.value)}
          onBlur={() => blur("message")}
          required
          aria-required="true"
          maxLength={5000}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${msgId}-error` : undefined}
          placeholder="Tell me a little about your idea…"
          className={cn(inputClass, "resize-y", errors.message ? "border-red-400/70" : "border-line")}
        />
        {errors.message && (
          <p id={`${msgId}-error`} role="alert" className="mt-1.5 text-sm text-red-500 dark:text-red-300">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div aria-live="polite">
        {status === "activation" && (
          <div className="rounded-2xl border border-accent/40 bg-accent/10 p-5 text-sm leading-relaxed" role="status">
            <p className="font-semibold text-fg">One-Time Activation Required</p>
            <p className="mt-1 text-muted">
              {serverMessage || `A confirmation email was sent to ${fallbackEmail}. Please open your inbox and click "Activate Form" once to enable direct inbox delivery.`}
            </p>
            {mailtoHref && (
              <div className="mt-3">
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-11 items-center rounded-full border border-line bg-card px-4 font-medium transition-colors hover:bg-fg/[0.07]"
                >
                  Send this message via email app
                </a>
              </div>
            )}
          </div>
        )}
        {status === "error" && (
          <div className="flex flex-col gap-3 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm" role="alert">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-4 shrink-0 text-red-500 dark:text-red-300" aria-hidden="true" />
              <p>{serverMessage}</p>
            </div>
            {mailtoHref && (
              <div>
                <a
                  href={mailtoHref}
                  className="inline-flex min-h-10 items-center rounded-full border border-line bg-card px-4 text-xs font-medium transition-colors hover:bg-fg/[0.07]"
                >
                  Send using your email app instead
                </a>
              </div>
            )}
          </div>
        )}
        {status === "unconfigured" && (
          <div className="rounded-2xl border border-line bg-fg/[0.04] p-4 text-sm leading-relaxed" role="status">
            <p className="font-medium">The contact form isn&apos;t connected to an email service yet.</p>
            <p className="mt-1 text-muted">
              {mailtoHref
                ? "Your message has not been sent. You can send it from your own email app instead:"
                : "Your message has not been sent. Please use one of the direct contact links instead."}
            </p>
            {mailtoHref && (
              <a
                href={mailtoHref}
                className="mt-3 inline-flex min-h-11 items-center rounded-full border border-line px-4 font-medium transition-colors hover:bg-fg/[0.07]"
              >
                Open in my email app
              </a>
            )}
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-fg px-6 text-[15px] font-medium text-bg transition-all duration-300 hover:-translate-y-px hover:opacity-90 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0 sm:w-auto"
      >
        {status === "loading" ? (
          <>
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <Send className="size-4" aria-hidden="true" />
          </>
        )}
      </button>
    </form>
  );
}
