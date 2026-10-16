import { NextResponse } from "next/server";
import { validateContact, type ContactValues } from "@/lib/validation";
import { personalDetails } from "@/data/profile";

export const runtime = "nodejs";

/**
 * Contact Form API Route
 *
 * Secure server-side email delivery handler using Resend.
 * - Prevents email header injection by sanitizing headers.
 * - Validates input bounds and formats.
 * - Enforces server-side rate limiting per IP.
 * - Sets the visitor's address as reply-to so replies go directly to the visitor.
 * - Safely logs errors without leaking API keys or secrets.
 */

// In-memory rate limiting: max 5 requests per 10 minutes per IP
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_HITS;
}

/** Sanitize input strings for email headers to prevent header injection */
function sanitizeHeader(input: string): string {
  return input.replace(/[\r\n\t]/g, " ").trim();
}

/** HTML entity escaping to prevent XSS / markup injection */
function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}

export async function POST(request: Request) {
  let body: Partial<ContactValues> & { website?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "bad_request", message: "Invalid request payload." },
      { status: 400 },
    );
  }

  // Honeypot trap: if filled by a bot, silently return success so bots learn nothing
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true, message: "Your message has been submitted successfully. Thank you for reaching out!" });
  }

  // Extract and trim form values
  const values: ContactValues = {
    name: String(body.name ?? "").trim(),
    email: String(body.email ?? "").trim(),
    subject: String(body.subject ?? "").trim(),
    message: String(body.message ?? "").trim(),
  };

  // Validate form fields
  const validationErrors = validateContact(values);
  if (Object.keys(validationErrors).length > 0) {
    return NextResponse.json(
      { error: "validation", errors: validationErrors },
      { status: 400 },
    );
  }

  // Check rate limits
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      {
        error: "rate_limited",
        message: "Too many messages sent. Please wait a few minutes before trying again.",
      },
      { status: 429 },
    );
  }

  // Recipient is always Roldan Jr. Delarmente
  const recipientEmail = process.env.CONTACT_TO_EMAIL || personalDetails.email || "rdelarmente0@gmail.com";
  const apiKey = process.env.RESEND_API_KEY?.trim();

  // If no email delivery service key is configured, return a clear 503 so frontend displays fallback
  if (!apiKey) {
    return NextResponse.json(
      {
        error: "unconfigured",
        message: "Email delivery service is currently not configured. Please use your email app.",
      },
      { status: 503 },
    );
  }

  const senderName = sanitizeHeader(values.name);
  const senderEmail = sanitizeHeader(values.email);
  const cleanSubject = sanitizeHeader(values.subject);
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [recipientEmail],
        reply_to: senderEmail,
        subject: `[Portfolio Contact] ${cleanSubject}`,
        text: `New contact form submission from your portfolio website:\n\nName: ${senderName}\nEmail: ${senderEmail}\nSubject: ${cleanSubject}\n\nMessage:\n${values.message}`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #eaeaea; border-radius: 12px; background: #ffffff; color: #1a1a1a;">
            <h2 style="font-size: 20px; font-weight: 600; margin-bottom: 20px; color: #111111; border-bottom: 1px solid #f0f0f0; padding-bottom: 12px;">
              New Portfolio Contact Message
            </h2>
            <div style="margin-bottom: 16px;">
              <p style="margin: 4px 0; font-size: 14px; color: #666666;"><strong>From:</strong> ${escapeHtml(senderName)} (&lt;${escapeHtml(senderEmail)}&gt;)</p>
              <p style="margin: 4px 0; font-size: 14px; color: #666666;"><strong>Subject:</strong> ${escapeHtml(cleanSubject)}</p>
            </div>
            <div style="background: #f9f9fb; border-radius: 8px; padding: 16px; margin-top: 16px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.6; color: #222222; white-space: pre-wrap;">${escapeHtml(values.message)}</p>
            </div>
            <p style="margin-top: 24px; font-size: 12px; color: #999999; border-top: 1px solid #f0f0f0; padding-top: 12px;">
              You can reply directly to this email to respond to ${escapeHtml(senderName)} at ${escapeHtml(senderEmail)}.
            </p>
          </div>
        `,
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text().catch(() => "");
      console.error("[Contact API] Resend error status:", resendResponse.status, errorText);

      return NextResponse.json(
        {
          error: "send_failed",
          message: "We couldn't send your message right now. Please try again in a moment.",
        },
        { status: 502 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Your message has been submitted successfully. Thank you for reaching out!",
    });
  } catch (err) {
    console.error("[Contact API] Unexpected error delivering email:", err);
    return NextResponse.json(
      {
        error: "send_failed",
        message: "We couldn't send your message right now. Please try again in a moment.",
      },
      { status: 502 },
    );
  }
}
