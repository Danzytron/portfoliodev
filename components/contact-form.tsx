"use client";

import { useId, useState } from "react";
import { AlertCircle, CheckCircle2, LoaderCircle, Mail, Send } from "lucide-react";
import { validateContact, type ContactErrors, type ContactValues } from "@/lib/validation";
import { cn } from "@/lib/cn";

type FormStatus = "idle" | "loading" | "success" | "error" | "unconfigured";

const initialValues: ContactValues = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const inputClass =
  "w-full rounded-2xl border bg-surface/60 px-4 py-3 text-base text-fg placeholder:text-muted/70 transition-colors duration-200 hover:border-fg/25 focus:border-accent focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-accent/30";

function buildMailtoHref(recipient: string, values: ContactValues): string {
  const cleanRecipient = recipient.trim() || "rdelarmente0@gmail.com";
  const cleanSubject = values.subject.trim() || "Portfolio Contact Inquiry";

  const bodyParts: string[] = [];
  if (values.message.trim()) {
    bodyParts.push(values.message.trim());
    bodyParts.push("");
  }
  bodyParts.push("---");
  bodyParts.push(`Sender: ${values.name.trim() || "Visitor"}`);
  if (values.email.trim()) {
    bodyParts.push(`Email: ${values.email.trim()}`);
  }

  const cleanBody = bodyParts.join("\n");

  return `mailto:${encodeURIComponent(cleanRecipient)}?subject=${encodeURIComponent(cleanSubject)}&body=${encodeURIComponent(cleanBody)}`;
}

export function ContactForm({ fallbackEmail = "rdelarmente0@gmail.com" }: { fallbackEmail?: string }) {
  const uid = useId();
  const [values, setValues] = useState<ContactValues>(initialValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactValues, boolean>>>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");

  function updateField(field: keyof ContactValues, value: string) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateContact(next)[field] }));
    }
  }

  function handleBlur(field: keyof ContactValues) {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateContact(values)[field] }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    // Validate fields
    const validationErrors = validateContact(values);
    setErrors(validationErrors);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(validationErrors).length > 0) {
      const firstInvalidField = (["name", "email", "subject", "message"] as const).find(
        (key) => validationErrors[key],
      );
      if (firstInvalidField) {
        document.getElementById(`${uid}-${firstInvalidField}`)?.focus();
      }
      return;
    }

    setStatus("loading");
    setServerMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        message?: string;
        errors?: ContactErrors;
      };

      if (response.ok && data.ok) {
        setStatus("success");
        setServerMessage(
          data.message || "Your message has been submitted successfully. Thank you for reaching out!",
        );
        setValues(initialValues);
        setTouched({});
        setErrors({});
        return;
      }

      // If backend reports email service is not yet configured (503)
      if (response.status === 503 && data.error === "unconfigured") {
        setStatus("unconfigured");
        setServerMessage(
          "Direct message delivery is currently undergoing setup. Please use the button below to send your message directly via your email app.",
        );
        return;
      }

      // Validation error from server
      if (response.status === 400 && data.errors) {
        setErrors(data.errors);
        setStatus("idle");
        return;
      }

      // General delivery failure: preserve entered values and show friendly message
      setStatus("error");
      setServerMessage(
        data.message || "We couldn't send your message right now. Please try again in a moment.",
      );
    } catch {
      setStatus("error");
      setServerMessage("We couldn't send your message right now. Please try again in a moment.");
    }
  }

  const mailtoHref = buildMailtoHref(fallbackEmail, values);

  // Success view
  if (status === "success") {
    return (
      <div
        role="status"
        className="flex min-h-[26rem] flex-col items-center justify-center rounded-3xl border border-line bg-card/85 backdrop-blur-sm p-8 text-center shadow-[var(--shadow-card)]"
      >
        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
          <CheckCircle2 className="size-8" aria-hidden="true" strokeWidth={2} />
        </div>
        <h3 className="text-2xl font-bold tracking-tight text-fg">Message Submitted</h3>
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
          {serverMessage || "Your message has been submitted successfully. Thank you for reaching out!"}
        </p>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setServerMessage("");
          }}
          className="mt-8 min-h-11 rounded-full border border-line bg-surface/80 px-6 text-sm font-medium text-fg transition-all duration-200 hover:border-accent/40 hover:bg-surface hover:text-accent"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  const renderField = (
    name: keyof ContactValues,
    label: string,
    props: React.InputHTMLAttributes<HTMLInputElement> = {},
  ) => {
    const fieldId = `${uid}-${name}`;
    const err = errors[name];
    return (
      <div>
        <label htmlFor={fieldId} className="mb-2 block text-sm font-medium text-fg">
          {label} <span className="text-accent" aria-hidden="true">*</span>
        </label>
        <input
          id={fieldId}
          name={name}
          value={values[name]}
          onChange={(e) => updateField(name, e.target.value)}
          onBlur={() => handleBlur(name)}
          required
          aria-required="true"
          aria-invalid={err ? true : undefined}
          aria-describedby={err ? `${fieldId}-error` : undefined}
          className={cn(inputClass, err ? "border-red-400/80 focus:ring-red-400/30" : "border-line")}
          {...props}
        />
        {err && (
          <p id={`${fieldId}-error`} role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-300">
            {err}
          </p>
        )}
      </div>
    );
  };

  const messageFieldId = `${uid}-message`;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-5 rounded-3xl border border-line bg-card/85 backdrop-blur-sm p-6 shadow-[var(--shadow-card)] sm:p-8"
      aria-label="Contact form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {renderField("name", "Name", {
          type: "text",
          autoComplete: "name",
          maxLength: 100,
          placeholder: "Your name",
        })}
        {renderField("email", "Email", {
          type: "email",
          autoComplete: "email",
          inputMode: "email",
          placeholder: "you@example.com",
        })}
      </div>

      {renderField("subject", "Subject", {
        type: "text",
        maxLength: 150,
        placeholder: "What's this about?",
      })}

      <div>
        <label htmlFor={messageFieldId} className="mb-2 block text-sm font-medium text-fg">
          Message <span className="text-accent" aria-hidden="true">*</span>
        </label>
        <textarea
          id={messageFieldId}
          name="message"
          rows={5}
          value={values.message}
          onChange={(e) => updateField("message", e.target.value)}
          onBlur={() => handleBlur("message")}
          required
          aria-required="true"
          maxLength={5000}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? `${messageFieldId}-error` : undefined}
          placeholder="Tell me a little about your project or idea…"
          className={cn(
            inputClass,
            "resize-y min-h-[120px]",
            errors.message ? "border-red-400/80 focus:ring-red-400/30" : "border-line",
          )}
        />
        {errors.message && (
          <p id={`${messageFieldId}-error`} role="alert" className="mt-1.5 text-xs text-red-500 dark:text-red-300">
            {errors.message}
          </p>
        )}
      </div>

      {/* Honeypot: hidden from visitors, bots fill it */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      {/* Status Notifications */}
      <div aria-live="polite">
        {status === "error" && (
          <div
            className="flex flex-col gap-3.5 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm leading-relaxed"
            role="alert"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-4.5 shrink-0 text-red-500 dark:text-red-300" aria-hidden="true" />
              <p className="text-fg">{serverMessage || "We couldn't send your message right now. Please try again in a moment."}</p>
            </div>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <a
                href={mailtoHref}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-card px-4 text-xs font-semibold text-fg transition-all hover:border-accent/40 hover:bg-surface hover:text-accent shadow-sm"
              >
                <Mail className="size-3.5 text-accent" aria-hidden="true" />
                Open Email App
              </a>
              <span className="text-xs text-muted">Send your entered message directly via your email client.</span>
            </div>
          </div>
        )}

        {status === "unconfigured" && (
          <div
            className="flex flex-col gap-3.5 rounded-2xl border border-line bg-surface/80 p-4 text-sm leading-relaxed"
            role="status"
          >
            <p className="text-fg font-medium">Direct message delivery is currently unavailable.</p>
            <p className="text-xs text-muted">
              You can send your message directly to <strong className="text-fg">{fallbackEmail}</strong> using your email app:
            </p>
            <div>
              <a
                href={mailtoHref}
                className="inline-flex min-h-10 items-center gap-2 rounded-full border border-accent/40 bg-accent/10 px-5 text-xs font-semibold text-accent transition-colors hover:bg-accent/20"
              >
                <Mail className="size-3.5" aria-hidden="true" />
                Open Email App
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Submit Button & Direct Email Fallback */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-fg px-7 text-[15px] font-semibold text-bg transition-all duration-300 hover:-translate-y-px hover:opacity-90 disabled:cursor-wait disabled:opacity-70 disabled:hover:translate-y-0"
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

        {/* Functional Email Fallback link always accessible */}
        <div className="text-center sm:text-right">
          <a
            href={mailtoHref}
            className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent transition-colors py-1"
            title="Open your default email client with your message pre-filled"
          >
            <Mail className="size-3.5" aria-hidden="true" />
            <span>Open Email App</span>
          </a>
        </div>
      </div>
    </form>
  );
}
