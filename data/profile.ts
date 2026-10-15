export type NavItem = { label: string; href: string; id: string };

export const profile = {
  /** Wordmark shown in the navigation bar and footer mark. */
  brandName: "Roldan Jr.",
  logo: "/images/logo.png",
  logoAlt: "Roldan Jr. logo",
  firstLine: "Roldan Jr.",
  lastLine: "Delarmente",
  fullName: "Roldan Jr. Delarmente",
  role: "Aspiring Web & App Developer",
  heroGreeting: "HELLO, I'M",
  heroDescription:
    "I'm passionate about building modern websites and applications that combine clean design, useful functionality, and great user experiences. Always learning, always building.",
  /**
   * Informational only. Change the text yourself if/when you are available
   * for paid work — the site never claims this on its own.
   */
  status: "Open to Learning & Collaboration",
  /**
   * Path to your photo inside /public (e.g. "/images/profile.jpg"),
   * or null to show the designed placeholder.
   */
  photo: "/images/roldan-delarmente.png",
  photoAlt: "Portrait of Roldan Jr. Delarmente",
  /** Path to downloadable CV in /public */
  cvUrl: "/cv.pdf",
  cvFileName: "Roldan_Delarmente_CV.pdf",
  /** Initials used by the placeholder portrait. */
  initials: "RJ",
};

export const siteMeta = {
  title: "Roldan Jr. Delarmente | Aspiring Web & App Developer",
  description:
    "Explore the portfolio, projects, and technology stack of Roldan Jr. Delarmente, an aspiring Web and App Developer.",
};

export const navItems: NavItem[] = [
  { label: "Home", href: "#home", id: "home" },
  { label: "About", href: "#about", id: "about" },
  { label: "Tech Stack", href: "#tech-stack", id: "tech-stack" },
  { label: "Projects", href: "#projects", id: "projects" },
  { label: "Contact", href: "#contact", id: "contact" },
];

export const personalDetails = {
  phone: "+63 9062755301",
  phoneHref: "tel:+639062755301",
  email: "rdelarmente0@gmail.com",
  emailHref: "mailto:rdelarmente0@gmail.com",
  education: "Cebu Eastern College",
  program: "Bachelor of Science in Information Technology",
  address: "Cebu City, Philippines",
  // Legacy aliases for compatibility
  fullName: "Roldan Jr. Delarmente",
  location: "Cebu City, Philippines",
};

export const personalInfo = personalDetails;

export const whatIDo = [
  "UI/UX Design",
  "Web Development",
  "App Development",
  "IoT Projects",
  "AI Integration",
] as const;

export const about = {
  heading: "About Me",
  tagline: "Aspiring Web & App Developer · 3rd-Year BSIT Student",
  intro:
    "I’ve always enjoyed bringing my ideas to life through technology, whether it’s building websites for fun, turning personal interests into projects, or experimenting with new tools. I love the process of creating something from scratch, exploring new possibilities with AI, and making digital experiences that are both useful and meaningful.",
  paragraphs: [
    "I’ve always enjoyed bringing my ideas to life through technology, whether it’s building websites for fun, turning personal interests into projects, or experimenting with new tools. I love the process of creating something from scratch, exploring new possibilities with AI, and making digital experiences that are both useful and meaningful.",
  ],
  cards: [
    {
      icon: "globe",
      title: "Web Development",
      description:
        "Building responsive websites with modern frontend technologies and reliable backend integrations.",
    },
    {
      icon: "smartphone",
      title: "App Development",
      description:
        "Exploring application development and creating useful digital experiences across different devices.",
    },
    {
      icon: "sprout",
      title: "Continuous Learning",
      description:
        "Improving my programming skills through experimentation, personal projects, and practical learning.",
    },
  ] as const,
};

export const philosophy = {
  heading: "Good design makes technology feel effortless.",
  text: "I believe useful software should be functional, intuitive, accessible, and thoughtfully designed.",
};

export const contact = {
  heading: "Get in Touch",
  text: "I'm always interested in learning, sharing ideas, and connecting with people who enjoy building useful things with technology.",
};
