export type Project = {
  slug: string;
  title: string;
  category?: string;
  description: string;
  /** Only list technologies that are genuinely used in the project. */
  technologies: string[];
  features?: string[];
  /** Path inside /public, e.g. "/projects/school-portal.png". Null → designed placeholder. */
  image: string | null;
  imageAlt?: string;
  /** Device frame style: "macbook" or "iphone". Defaults to "macbook". */
  deviceType?: "macbook" | "iphone";
  /** Style of the designed placeholder shown while `image` is null. */
  previewStyle?: "web" | "mobile";
  /** Leave empty to hide the button (no invented links). */
  githubUrl?: string;
  liveUrl?: string;
  /** Small label shown on the card. Remove or edit once the project is final. */
  statusLabel?: string;
  /** Whether the project spans across both columns as a featured showcase. */
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "school-portal-system",
    title: "School Portal System",
    description:
      "A comprehensive academic school portal organizing student profiles, schedules, grade reports, and administrative workflows with modern accessibility.",
    technologies: ["Next.js", "React", "PHP", "MySQL"],
    image: "/projects/school-portal.png",
    imageAlt: "Cebu Eastern College School Portal System dashboard interface",
    githubUrl: "https://github.com/Danzytron/school-portal",
    liveUrl: "https://cebucecportal.site",
    statusLabel: "Live Project",
    deviceType: "macbook",
  },
  {
    slug: "printbai",
    title: "PrintBai",
    description:
      "A fast, affordable, and student-friendly printing service platform offering instant campus rate calculation, order placement, and an intuitive modern interface.",
    technologies: ["HTML", "CSS", "PyScript"],
    image: "/projects/printbai.png",
    imageAlt: "PrintBai student-friendly printing service platform interface",
    githubUrl: "https://github.com/Danzytron/printbai",
    liveUrl: "https://printbai.vercel.app",
    statusLabel: "Live Project",
    deviceType: "macbook",
  },
  {
    slug: "basketball-game",
    title: "Basketball Game",
    description:
      "An interactive 2D arcade basketball game featuring drag-to-aim shooting physics, swish point multipliers, dynamic court visuals, and real-time score tracking.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/basketball-game.png",
    imageAlt: "2D Arcade Basketball Game interface with shoot and score gameplay",
    githubUrl: "https://github.com/Danzytron/renegame",
    liveUrl: "https://renebasketball.vercel.app/",
    statusLabel: "Live Project",
    deviceType: "macbook",
  },
  {
    slug: "apex-invictus-esports",
    title: "Apex Invictus Esports",
    description:
      "An esports organization and team showcase website highlighting the Apex Invictus MLBB competitive roster, player profiles, championship history, and dynamic player cards.",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "/projects/apex-invictus.png",
    imageAlt: "Apex Invictus Esports MLBB team roster and organization website",
    githubUrl: "https://github.com/Danzytron/Apex-Invictus",
    liveUrl: "https://apexinvictus.site",
    statusLabel: "Live Project",
    deviceType: "macbook",
  },
  {
    slug: "gora-trip-scheduler",
    title: "Gora — Trip Scheduler",
    category: "Mobile Application",
    description:
      "Gora is a trip scheduler mobile application designed to help users plan trips, explore destinations, check weather conditions, manage travel schedules, and organize their travel experiences in one place.",
    technologies: ["Flutter", "Dart", "Weather API", "Mobile App"],
    features: [
      "Trip planning and scheduling",
      "Destination exploration",
      "Weather information",
      "Trip management and editing",
      "User account management",
    ],
    image: "/projects/gora.png",
    imageAlt: "Gora Trip Scheduler mobile application interface on iPhone 17 Pro Max",
    deviceType: "iphone",
    previewStyle: "mobile",
    statusLabel: "Mobile Application",
    featured: true,
  },
];

/** The "View All Projects" button uses socialLinks.github automatically. */
