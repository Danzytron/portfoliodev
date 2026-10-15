export type ContactValues = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Shared by the browser form and the API route so both enforce the same rules. */
export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 100) errors.name = "Name must be 100 characters or fewer.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  else if (email.length > 254) errors.email = "That email address is too long.";

  if (!subject) errors.subject = "Please add a subject.";
  else if (subject.length > 150) errors.subject = "Subject must be 150 characters or fewer.";

  if (!message) errors.message = "Please write a message.";
  else if (message.length < 10) errors.message = "Your message should be at least 10 characters.";
  else if (message.length > 5000) errors.message = "Message must be 5000 characters or fewer.";

  return errors;
}
