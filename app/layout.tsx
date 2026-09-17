import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono } from "next/font/google";
import { Background } from "@/components/background";
import { Cursor } from "@/components/cursor";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";
import { Providers } from "@/components/providers";
import { ScrollProgress } from "@/components/scroll-progress";
import { person, site } from "@/content/resume";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz", "wdth"],
});

const title = `${person.name} · ${person.role}`;
const description =
  "DevOps and full-stack engineer. MERN and Next.js apps deployed to Kubernetes on AWS with GitLab CI and ArgoCD, monitored with Prometheus and Grafana. AWS Certified Cloud Practitioner.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s · ${person.name}`,
  },
  description,
  keywords: ["DevOps", "Kubernetes", "AWS", "ArgoCD", "GitLab CI", "Next.js", "React", "MERN", "Coimbatore", person.name],
  authors: [{ name: person.name, url: site.url }],
  creator: person.name,
  openGraph: {
    type: "website",
    url: site.url,
    title,
    description,
    siteName: person.name,
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#06080f",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  url: site.url,
  email: `mailto:${person.email}`,
  telephone: person.phone,
  jobTitle: person.role,
  address: { "@type": "PostalAddress", addressLocality: "Coimbatore", addressRegion: "Tamil Nadu", addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: "Sri Eshwar College of Engineering" },
  sameAs: [person.github, person.linkedin, person.leetcode],
  knowsAbout: ["DevOps", "Kubernetes", "AWS", "Docker", "ArgoCD", "GitLab CI", "React", "Next.js", "Node.js", "MongoDB"],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${bricolage.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[80] focus:rounded-full focus:bg-text focus:px-4 focus:py-2 focus:text-bg"
        >
          Skip to content
        </a>
        <Providers>
          <Background />
          <ScrollProgress />
          <Nav />
          <Cursor />
          {children}
          <Footer />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
