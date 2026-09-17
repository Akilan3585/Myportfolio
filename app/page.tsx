import { About } from "@/components/about";
import { Achievements } from "@/components/achievements";
import { Contact } from "@/components/contact";
import { GitHubActivity } from "@/components/github-activity";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Skills } from "@/components/skills";
import { Timeline } from "@/components/timeline";

export default function Home() {
  return (
    <main id="main" className="flex-1">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Timeline />
      <Achievements />
      <GitHubActivity />
      <Contact />
    </main>
  );
}
