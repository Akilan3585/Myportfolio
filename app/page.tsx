import { Achievements } from "@/components/achievements";
import { Architecture } from "@/components/architecture";
import { Contact } from "@/components/contact";
import { GitHubActivity } from "@/components/github-activity";
import { Hero } from "@/components/hero";
import { Projects } from "@/components/projects";
import { Stack } from "@/components/stack";
import { System } from "@/components/system";
import { Timeline } from "@/components/timeline";
import { builtAt } from "@/lib/build";
import { getGitHubData } from "@/lib/github";

export default async function Home() {
  const github = await getGitHubData();
  return (
    <main id="main" className="flex-1">
      <Hero />
      <System githubLive={github !== null} builtAt={builtAt} />
      <Stack />
      <Architecture />
      <Projects />
      <Timeline />
      <Achievements />
      <GitHubActivity data={github} />
      <Contact />
    </main>
  );
}
