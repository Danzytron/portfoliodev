import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { siteMeta } from "@/data/profile";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || undefined;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: siteMeta.title,
  description: siteMeta.description,
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
  openGraph: {
    title: siteMeta.title,
    description: siteMeta.description,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteMeta.title,
    description: siteMeta.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbfbfd" },
    { media: "(prefers-color-scheme: dark)", color: "#08090b" },
  ],
};

/**
 * Runs before first paint: applies the saved theme (default: dark) so the
 * page never flashes the wrong colours, and marks the document as JS-enabled
 * so scroll-reveal styles never hide content when scripts are unavailable.
 */
const themeScript = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')t='dark';d.classList.toggle('dark',t==='dark');d.style.colorScheme=t}catch(e){d.classList.add('dark')}d.classList.add('js')})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
