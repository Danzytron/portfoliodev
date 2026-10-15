import { cn } from "@/lib/cn";

export type TechKey =
  | "html"
  | "css"
  | "javascript"
  | "typescript"
  | "php"
  | "dart"
  | "cpp"
  | "java"
  | "python"
  | "react"
  | "nextjs"
  | "mysql"
  | "postgresql"
  | "flutter";

type IconMeta = {
  src: string;
  alt: string;
};

/**
 * Exact, official logos for every programming language and technology.
 * Stored as pure vector SVGs directly from the official Devicon brand suite.
 */
const techIcons: Record<TechKey, IconMeta> = {
  html: { src: "/tech/html.svg", alt: "HTML5 official logo" },
  css: { src: "/tech/css.svg", alt: "CSS3 official logo" },
  javascript: { src: "/tech/javascript.svg", alt: "JavaScript official logo" },
  typescript: { src: "/tech/typescript.svg", alt: "TypeScript official logo" },
  php: { src: "/tech/php.svg", alt: "PHP official logo" },
  dart: { src: "/tech/dart.svg", alt: "Dart official logo" },
  cpp: { src: "/tech/cpp.svg", alt: "C++ official logo" },
  java: { src: "/tech/java.svg", alt: "Java official logo" },
  python: { src: "/tech/python.svg", alt: "Python official logo" },
  react: { src: "/tech/react.svg", alt: "React official logo" },
  nextjs: { src: "/tech/nextjs.svg", alt: "Next.js official logo" },
  mysql: { src: "/tech/mysql.svg", alt: "MySQL official logo" },
  postgresql: { src: "/tech/postgresql.svg", alt: "PostgreSQL official logo" },
  flutter: { src: "/tech/flutter.svg", alt: "Flutter official logo" },
};

export function TechIcon({ name, className }: { name: TechKey; className?: string }) {
  const icon = techIcons[name];
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={icon.src}
      alt={icon.alt}
      width={36}
      height={36}
      loading="lazy"
      decoding="async"
      className={cn("size-8 object-contain drop-shadow-[0_1px_2px_rgba(0,0,0,0.12)]", className)}
    />
  );
}
