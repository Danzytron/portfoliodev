/**
 * Central place for every contact / social link.
 *
 * Leave a value as an empty string until you have the real URL.
 * Empty links are rendered as visibly disabled (never as dead links),
 * and are hidden from places where a disabled state would look odd.
 */
export const socialLinks = {
  /** e.g. "https://github.com/your-username" */
  github: "https://github.com/Danzytron",
  /** e.g. "https://www.linkedin.com/in/your-handle" */
  linkedin: "",
  /** e.g. "you@example.com" */
  email: "rdelarmente0@gmail.com",
};

export type SocialKey = keyof typeof socialLinks;

export function socialHref(key: SocialKey): string | null {
  const value = socialLinks[key].trim();
  if (!value) return null;
  return key === "email" ? `mailto:${value}` : value;
}
