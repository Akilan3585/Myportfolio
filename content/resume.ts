export type Link = { label: string; href: string };

export type Hue = "blue" | "mint" | "amber" | "rose" | "violet";

export const hueVar: Record<Hue, string> = {
  blue: "var(--hue-blue)",
  mint: "var(--hue-mint)",
  amber: "var(--hue-amber)",
  rose: "var(--hue-rose)",
  violet: "var(--hue-violet)",
};

export type PipelineStep = { label: string; detail: string };

export type ServiceStatus = "live" | "source";

export type Project = {
  slug: string;
  number: string;
  title: string;
  /** kubernetes-style service name shown in the deployed-systems cards */
  service: string;
  status: ServiceStatus;
  type: string;
  io: { input: string; process: string; output: string };
  kind: string;
  year: string;
  hue: Hue;
  metric: string;
  metricLabel: string;
  problem: string;
  solution: string;
  keyFeature: string;
  pipeline: PipelineStep[];
  stack: string[];
  links: Link[];
  /** GitHub repository name, used to match repository highlights. */
  repo?: string;
};

export type TimelineItem = {
  year: string;
  title: string;
  org: string;
  kind: "education" | "certification" | "internship" | "project" | "hackathon" | "award" | "now";
  detail?: string;
  href?: string;
};

export const site = {
  url: "https://akilan-portfolio.vercel.app",
  version: "1.0.0",
};

export const person = {
  name: "Akilan B",
  initials: "AB",
  role: "DevOps and Full-Stack Engineer",
  badge: "DevOps • Cloud • Full-Stack",
  headline: "Building systems from commit → container → cluster → product.",
  subhead:
    "Containerised MERN and Next.js products, deployed to Kubernetes on AWS through GitLab CI and ArgoCD, and watched with Prometheus and Grafana. Third-year B.E. CSE (AI & ML) at Sri Eshwar College of Engineering, graduating 2027.",
  availability: "Open to DevOps and full-stack internships",
  email: "akilan.b2023aiml@sece.ac.in",
  phone: "+91 63835 65590",
  phoneHref: "tel:+916383565590",
  github: "https://github.com/Akilan3585/",
  githubUser: "Akilan3585",
  linkedin: "https://www.linkedin.com/in/akilan-balraman-392a1228b/",
  leetcode: "https://leetcode.com/u/akilanb2005/",
  resumePdf: "/akilan-b-resume.pdf",
  location: "Coimbatore, Tamil Nadu, India",
};

export const about = {
  statement: [
    { text: "I care about the whole path from " },
    { text: "git push", highlight: true },
    { text: " to a healthy pod. I write the " },
    { text: "React and Next.js", highlight: true },
    { text: " apps, containerise them, wire the " },
    { text: "CI/CD and GitOps", highlight: true },
    { text: " that deploy them to " },
    { text: "Kubernetes on AWS", highlight: true },
    { text: ", and put dashboards on top so I know they are still up." },
  ],
  facts: [
    { label: "Focus", value: "CI/CD, Kubernetes, AWS, observability" },
    { label: "Ships with", value: "Docker, ArgoCD, React, Node, Next.js" },
    { label: "Status", value: "B.E. CSE (AI & ML), class of 2027" },
  ],
};

export const nav = [
  { id: "system", label: "System" },
  { id: "stack", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "source", label: "Source" },
  { id: "contact", label: "Contact" },
] as const;

export const projects: Project[] = [
  {
    slug: "foodieshare",
    number: "01",
    title: "FoodieShare",
    service: "foodieshare",
    status: "source",
    type: "Recipe sharing platform · MERN on AWS EKS",
    io: {
      input: "Recipes, photos and community posts",
      process: "React UI → Express API → MongoDB, shipped by CI/CD and ArgoCD to EKS",
      output: "A monitored, GitOps-managed recipe community",
    },
    kind: "Recipe sharing platform · MERN on AWS EKS",
    year: "2025",
    hue: "blue",
    metric: "GitOps",
    metricLabel: "ArgoCD-driven deploys to Kubernetes on AWS",
    problem:
      "A community recipe app is easy to build and hard to keep running. Manual deploys, unscanned images and no monitoring turn every release into a risk.",
    solution:
      "A MERN recipe-sharing platform deployed on AWS with Kubernetes (EKS). Automated CI/CD pipelines build and security-scan Docker images, infrastructure is automated, and ArgoCD applies GitOps so the cluster always matches the repository. Monitoring and logging give visibility into performance and reliability.",
    keyFeature:
      "DevSecOps pipeline: every commit is built, scanned and containerised, then ArgoCD syncs the declared state to EKS. No hand-run deploys.",
    pipeline: [
      { label: "Commit", detail: "MERN app in Git" },
      { label: "CI build + scan", detail: "Security scanning" },
      { label: "Docker image", detail: "Containerised services" },
      { label: "ArgoCD sync", detail: "GitOps to EKS" },
      { label: "Observe", detail: "Monitoring and logs" },
    ],
    stack: ["React.js", "Node.js", "Express.js", "MongoDB", "AWS EKS", "Kubernetes", "Docker", "CI/CD", "ArgoCD"],
    links: [{ label: "Source", href: "https://github.com/Akilan3585/FoodieShare" }],
    repo: "FoodieShare",
  },
  {
    slug: "aventra-ai",
    number: "02",
    title: "Aventra AI",
    service: "aventra-ai",
    status: "live",
    type: "Smart campus management platform · Next.js",
    io: {
      input: "Students, staff, classrooms, equipment and maintenance records",
      process: "Clerk auth → role-based modules → Supabase with audit logs → AI recommendations",
      output: "One secure operations console for a campus",
    },
    kind: "Smart campus management platform · Next.js",
    year: "2025",
    hue: "violet",
    metric: "10",
    metricLabel: "operational modules behind role-based access",
    problem:
      "Campus operations are scattered across attendance sheets, timetables, equipment logs and maintenance requests, with no single place that respects who is allowed to see what.",
    solution:
      "A secure AI-powered campus management platform covering academic operations and facilities. Modules for student onboarding, attendance, assignments, scheduling, performance tracking, classrooms, equipment, maintenance, reports and notifications sit behind role-based access with audit logs and evidence-based AI recommendations.",
    keyFeature:
      "Role-based access with audit logs on every module, and AI recommendations that cite the records they are based on.",
    pipeline: [
      { label: "Sign in", detail: "Clerk authentication" },
      { label: "Roles", detail: "Role-based access" },
      { label: "Modules", detail: "Academics and facilities" },
      { label: "Supabase", detail: "Data and audit logs" },
      { label: "Insights", detail: "Evidence-based AI" },
    ],
    stack: ["Next.js", "TypeScript", "Tailwind CSS", "Clerk", "Supabase", "Vercel"],
    links: [{ label: "Live app", href: "https://aventra-ai.vercel.app/" }],
  },
  {
    slug: "ecommerce",
    number: "03",
    title: "E-commerce Website",
    service: "ecommerce-web",
    status: "source",
    type: "Full-stack storefront · MERN + REST",
    io: {
      input: "Products, carts, wishlists and orders",
      process: "React storefront → REST API with auth and RBAC → MongoDB",
      output: "A storefront where customers shop and admins manage the catalogue",
    },
    kind: "Full-stack storefront · MERN + REST",
    year: "2025",
    hue: "amber",
    metric: "RBAC",
    metricLabel: "user and admin roles over cart, wishlist and orders",
    problem:
      "A storefront needs customers and administrators in the same app without letting a customer touch product management or another user's orders.",
    solution:
      "A full-stack MERN e-commerce application with secure user authentication, product management, cart, wishlist and order flows over REST APIs and MongoDB. Role-Based Access Control separates user and admin privileges so administrative operations stay protected.",
    keyFeature: "RBAC enforced at the API layer, so admin routes for product management are unreachable with a customer session.",
    pipeline: [
      { label: "React UI", detail: "Responsive storefront" },
      { label: "REST API", detail: "Express routes" },
      { label: "Auth + RBAC", detail: "User and admin roles" },
      { label: "MongoDB", detail: "Products, carts, orders" },
      { label: "Checkout", detail: "Cart to order" },
    ],
    stack: ["MongoDB", "Express.js", "React.js", "Node.js", "REST API"],
    links: [{ label: "Source", href: "https://github.com/Akilan3585/eccomerce-website" }],
    repo: "eccomerce-website",
  },
];

export const internship = {
  title: "DevOps Intern",
  org: "Vsphere Technologies",
  year: "2025",
  href: "https://drive.google.com/file/d/1Z9c_TWYuj4sheiRq2JOQTlW6njF3fSDw/view?usp=sharing",
  detail:
    "Automated CI/CD pipelines using GitLab and ArgoCD to deploy 5+ containerised services on Kubernetes, reducing manual deployment effort by 60% and improving deployment reliability with Prometheus and Grafana. Hands-on with AWS, Linux system administration, Docker and Kubernetes while supporting the deployment and monitoring of cloud-native applications.",
};

export const timeline: TimelineItem[] = [
  {
    year: "2020 – 2021",
    title: "SSLC",
    org: "Sri Kanna Matriculation Higher Secondary School, Ramanathapuram",
    kind: "education",
  },
  {
    year: "2022 – 2023",
    title: "Higher Secondary, 87.67%",
    org: "Sri Kanna Matriculation Higher Secondary School, Ramanathapuram",
    kind: "education",
  },
  {
    year: "2023",
    title: "B.E. Computer Science and Engineering (AI & ML)",
    org: "Sri Eshwar College of Engineering, Coimbatore · CGPA 7.82 so far",
    kind: "education",
  },
  {
    year: "2024",
    title: "Top 50, Smart India Hackathon internal round",
    org: "Sri Eshwar College of Engineering",
    kind: "hackathon",
  },
  {
    year: "2025",
    title: "DevOps Intern",
    org: "Vsphere Technologies",
    kind: "internship",
    detail: internship.detail,
    href: internship.href,
  },
  {
    year: "2025",
    title: "Networking Basics",
    org: "Cisco",
    kind: "certification",
    href: "https://drive.google.com/file/d/1uw4ZsrJkMK82N1k8e8Qo7HZRyQystbap/view?usp=drive_link",
  },
  {
    year: "2025",
    title: "Third prize, Freshathon project expo",
    org: "Sri Eshwar College of Engineering",
    kind: "award",
  },
  {
    year: "2025",
    title: "Top 10, SAP Hackfest (internal)",
    org: "Sri Eshwar College of Engineering",
    kind: "hackathon",
  },
  {
    year: "2026",
    title: "AWS Certified Cloud Practitioner, 914 / 1000",
    org: "Amazon Web Services",
    kind: "certification",
    href: "https://drive.google.com/file/d/13KMFZO7bXItgqIbpDLKxd0bkPbEf0Fuq/view?usp=drive_link",
  },
  {
    year: "Now",
    title: "Shipping containerised apps with GitOps",
    org: "Graduating 2027",
    kind: "now",
  },
];

export const counters: { value: number; prefix?: string; suffix?: string; label: string }[] = [
  { value: 914, suffix: " / 1000", label: "AWS Certified Cloud Practitioner score" },
  { value: 60, suffix: "%", label: "less manual deployment effort after automating CI/CD" },
  { value: 5, suffix: "+", label: "containerised services deployed on Kubernetes" },
  { value: 3, label: "hackathon and expo placements" },
];

export const certifications: { name: string; issuer: string; year: string; href: string; detail?: string }[] = [
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    year: "2026",
    detail: "Score 914 / 1000",
    href: "https://drive.google.com/file/d/13KMFZO7bXItgqIbpDLKxd0bkPbEf0Fuq/view?usp=drive_link",
  },
  {
    name: "Networking Basics",
    issuer: "Cisco",
    year: "2025",
    href: "https://drive.google.com/file/d/1uw4ZsrJkMK82N1k8e8Qo7HZRyQystbap/view?usp=drive_link",
  },
];

export const achievements: { title: string; org: string; year: string; hue: Hue }[] = [
  { title: "Top 10, SAP Hackfest (internal)", org: "Sri Eshwar College of Engineering", year: "2025", hue: "amber" },
  { title: "Third prize, Freshathon project expo", org: "Sri Eshwar College of Engineering", year: "2025", hue: "rose" },
  { title: "Top 50, SIH internal hackathon", org: "Smart India Hackathon, college round", year: "2024", hue: "blue" },
];

export const profiles: (Link & { detail: string })[] = [
  { label: "GitHub", href: person.github, detail: "Source for every project" },
  { label: "LinkedIn", href: person.linkedin, detail: "Akilan Balraman" },
  { label: "LeetCode", href: person.leetcode, detail: "akilanb2005" },
];

/** Layered infrastructure map. Every "used for" entry comes from the résumé. */
export type StackNode = { name: string; usedFor: string[]; logo?: string };

/** Logos live in public/logos. Only the four supplied files are wired here. */
export const logos = {
  aws: "/logos/aws.png",
  kubernetes: "/logos/kubernetes.png",
  argocd: "/logos/argocd.png",
  docker: "/logos/docker.png",
} as const;

export const runsOn: { name: string; logo: string }[] = [
  { name: "AWS", logo: logos.aws },
  { name: "Kubernetes", logo: logos.kubernetes },
  { name: "ArgoCD", logo: logos.argocd },
  { name: "Docker", logo: logos.docker },
];
export type StackLayer = { id: string; name: string; hue: Hue; nodes: StackNode[] };

export const stackLayers: StackLayer[] = [
  {
    id: "application",
    name: "Application",
    hue: "blue",
    nodes: [
      { name: "React", usedFor: ["FoodieShare UI", "E-commerce storefront", "Responsive product interfaces"] },
      { name: "Next.js", usedFor: ["Aventra AI campus platform", "This portfolio"] },
      { name: "TypeScript", usedFor: ["Aventra AI", "This portfolio"] },
      { name: "Tailwind CSS", usedFor: ["Aventra AI", "This portfolio"] },
    ],
  },
  {
    id: "services",
    name: "Services",
    hue: "violet",
    nodes: [
      { name: "Node.js", usedFor: ["FoodieShare API", "E-commerce API"] },
      { name: "Express", usedFor: ["REST APIs for FoodieShare and E-commerce", "Auth and RBAC middleware"] },
      { name: "REST APIs", usedFor: ["Product, cart, wishlist and order endpoints", "Recipe endpoints"] },
      { name: "Clerk", usedFor: ["Authentication for Aventra AI"] },
    ],
  },
  {
    id: "data",
    name: "Data",
    hue: "amber",
    nodes: [
      { name: "MongoDB", usedFor: ["FoodieShare", "E-commerce catalogue, carts and orders"] },
      { name: "PostgreSQL", usedFor: ["Aventra AI through Supabase"] },
      { name: "Supabase", usedFor: ["Aventra AI data and audit logs"] },
      { name: "MySQL", usedFor: ["Relational database work and practice"] },
    ],
  },
  {
    id: "delivery",
    name: "Delivery",
    hue: "mint",
    nodes: [
      { name: "Docker", logo: logos.docker, usedFor: ["Containerised FoodieShare services", "5+ services at Vsphere Technologies"] },
      { name: "Kubernetes", logo: logos.kubernetes, usedFor: ["FoodieShare on AWS EKS", "Deployments at Vsphere Technologies"] },
      { name: "ArgoCD", logo: logos.argocd, usedFor: ["GitOps sync for FoodieShare", "GitOps deployments at Vsphere Technologies"] },
      { name: "GitLab CI", usedFor: ["Automated pipelines at Vsphere Technologies"] },
      { name: "Jenkins", usedFor: ["CI/CD pipelines"] },
      { name: "Maven", usedFor: ["Build automation"] },
      { name: "SonarQube", usedFor: ["Code quality gates in pipelines"] },
    ],
  },
  {
    id: "platform",
    name: "Cloud & platform",
    hue: "blue",
    nodes: [
      { name: "AWS", logo: logos.aws, usedFor: ["EKS for FoodieShare", "Cloud services during the internship", "Certified Cloud Practitioner, 914 / 1000"] },
      { name: "Vercel", usedFor: ["Aventra AI hosting", "This portfolio"] },
      { name: "Upstash", usedFor: ["Serverless Redis in the platform stack"] },
      { name: "Resend", usedFor: ["Transactional email in the platform stack"] },
      { name: "Linux", usedFor: ["System administration at Vsphere Technologies"] },
    ],
  },
  {
    id: "observability",
    name: "Observability",
    hue: "amber",
    nodes: [
      { name: "Prometheus", usedFor: ["Metrics for services at Vsphere Technologies", "FoodieShare monitoring"] },
      { name: "Grafana", usedFor: ["Dashboards for deployment reliability"] },
    ],
  },
  {
    id: "source",
    name: "Source control",
    hue: "violet",
    nodes: [
      { name: "Git", usedFor: ["Every project"] },
      { name: "GitHub", usedFor: ["FoodieShare, E-commerce and the rest of the public repositories"] },
    ],
  },
];

/** Runtime topology used in the System Architecture section. Purpose and tech are factual. */
export type ArchNode = {
  id: string;
  label: string;
  purpose: string;
  tech: string;
  seenIn: string[];
};

export const architecture: ArchNode[] = [
  { id: "user", label: "USER", purpose: "Browser traffic over HTTPS.", tech: "Any modern browser", seenIn: ["All projects"] },
  {
    id: "frontend",
    label: "FRONTEND",
    purpose: "Serves the interface and talks to the API.",
    tech: "React · Next.js · Tailwind CSS",
    seenIn: ["FoodieShare", "Aventra AI", "E-commerce"],
  },
  {
    id: "auth",
    label: "AUTH",
    purpose: "Signs users in and enforces role-based access.",
    tech: "Clerk · RBAC middleware",
    seenIn: ["Aventra AI", "E-commerce"],
  },
  {
    id: "api",
    label: "API",
    purpose: "Handles application requests and business rules.",
    tech: "Node.js · Express · REST",
    seenIn: ["FoodieShare", "E-commerce"],
  },
  {
    id: "database",
    label: "DATABASE",
    purpose: "Stores products, recipes, users and audit logs.",
    tech: "MongoDB · PostgreSQL (Supabase)",
    seenIn: ["FoodieShare", "Aventra AI", "E-commerce"],
  },
  {
    id: "cluster",
    label: "CLUSTER",
    purpose: "Runs the containerised services, synced by GitOps.",
    tech: "Docker · Kubernetes on AWS EKS · ArgoCD",
    seenIn: ["FoodieShare", "Vsphere Technologies"],
  },
  {
    id: "observe",
    label: "OBSERVE",
    purpose: "Metrics and dashboards for reliability.",
    tech: "Prometheus · Grafana",
    seenIn: ["FoodieShare", "Vsphere Technologies"],
  },
];

export const terminal = {
  whoami: [
    { cmd: "whoami", out: ["akilan-b"] },
    { cmd: "role", out: ["DevOps and Full-Stack Engineer"] },
    { cmd: "focus", out: ["CI/CD and GitOps", "Kubernetes on AWS", "React, Next.js and Node services", "Observability"] },
    { cmd: "status", out: ["OPEN TO DEVOPS AND FULL-STACK INTERNSHIPS"] },
  ],
};

export const systemEvents: { label: string; detail: string; year: string }[] = [
  { label: "Certification issued", detail: "AWS Certified Cloud Practitioner, 914 / 1000", year: "2026" },
  { label: "Internship completed", detail: "DevOps Intern, Vsphere Technologies", year: "2025" },
  { label: "Hackathon placement", detail: "Top 10, SAP Hackfest (internal)", year: "2025" },
  { label: "Award received", detail: "Third prize, Freshathon project expo", year: "2025" },
  { label: "Certification issued", detail: "Networking Basics, Cisco", year: "2025" },
  { label: "Hackathon placement", detail: "Top 50, SIH internal hackathon", year: "2024" },
  { label: "Enrolled", detail: "B.E. CSE (AI & ML), Sri Eshwar College of Engineering", year: "2023" },
];
