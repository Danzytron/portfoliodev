import type { TechKey } from "@/components/tech-icon";

export type Technology = { name: string; icon: TechKey };
export type TechCategory = { title: string; technologies: Technology[] };

/**
 * Tools and technologies organized into Frontend, Backend, Database, and Mobile Development.
 */
export const techCategories: TechCategory[] = [
  {
    title: "Frontend Development",
    technologies: [
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "nextjs" },
    ],
  },
  {
    title: "Backend Development",
    technologies: [
      { name: "PHP", icon: "php" },
      { name: "Python", icon: "python" },
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cpp" },
    ],
  },
  {
    title: "Database",
    technologies: [
      { name: "MySQL", icon: "mysql" },
      { name: "PostgreSQL", icon: "postgresql" },
    ],
  },
  {
    title: "Mobile Development",
    technologies: [
      { name: "Flutter", icon: "flutter" },
      { name: "Dart", icon: "dart" },
    ],
  },
];
