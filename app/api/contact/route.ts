import { NextResponse } from "next/server";
import { validateContact, type ContactValues } from "@/lib/validation";
import { socialLinks } from "@/data/social-links";

export const runtime = "nodejs";

/**
 * Contact endpoint. Emails are delivered to the recipient address using
 * Resend (if RESEND_API_KEY is configured) or FormSubmit (free direct delivery).
 */

// Very small in-memory rate limit (per server instance) to blunt basic abuse.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function POST(request: Request) {
  let body: Partial<ContactValues> & { website?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "bad_request", message: "Invalid request." }, { status: 400 });
  }

  // Honeypot filled → silently accept so bots learn nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const values: ContactValues = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    subject: String(body.subject ?? ""),
    message: String(body.message ?? ""),
  };
  const errors = validateContact(values);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ error: "validation", errors }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL || socialLinks.email || "rdelarmente0@gmail.com";
  if (!to) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many messages. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const v = {
    name: values.name.trim(),
    email: values.email.trim(),
    subject: values.subject.trim(),
    message: values.message.trim(),
  };

  // If Resend API key is configured, use Resend
  if (apiKey) {
    try {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>",
          to: [to],
          reply_to: v.email,
          subject: `[Portfolio] ${v.subject}`,
          text: `From: ${v.name} <${v.email}>\n\n${v.message}`,
          html: `<p><strong>From:</strong> ${escapeHtml(v.name)} &lt;${escapeHtml(v.email)}&gt;</p><p style="white-space:pre-wrap">${escapeHtml(v.message)}</p>`,
        }),
      });
      if (!res.ok) {
        console.error("Resend error", res.status, await res.text().catch(() => ""));
        return NextResponse.json(
          { error: "send_failed", message: "The email service rejected the message. Please try again later." },
          { status: 502 },
        );
      }
      return NextResponse.json({ ok: true });
    } catch (err) {
      console.error("Contact send failed via Resend", err);
      return NextResponse.json(
        { error: "send_failed", message: "Could not send your message right now. Please try again later." },
        { status: 502 },
      );
    }
  }

  // Fallback: Deliver directly to user's inbox using FormSubmit
  try {
    const origin =
      request.headers.get("origin") || request.headers.get("referer") || "https://roldandelarmente.dev";
    const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(to)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Referer: origin,
      },
      body: JSON.stringify({
        name: v.name,
        email: v.email,
        _subject: `[Portfolio Contact] ${v.subject}`,
        message: v.message,
        _captcha: "false",
        _template: "table",
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: string | boolean;
      message?: string;
    };

    if (typeof data.message === "string" && data.message.toLowerCase().includes("activ")) {
      return NextResponse.json({
        ok: true,
        pendingActivation: true,
        message: `FormSubmit sent a one-time activation link to ${to}. Please click 'Activate Form' in your inbox to enable direct inbox delivery.`,
      });
    }

    if (data.success === "true" || data.success === true || res.ok) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { error: "send_failed", message: data.message || "Failed to deliver message. Please use your email app instead." },
      { status: 502 },
    );
  } catch (err) {
    console.error("Contact send failed via FormSubmit", err);
    return NextResponse.json(
      { error: "send_failed", message: "Could not deliver your message right now. Please use your email app instead." },
      { status: 502 },
    );
  }
}
