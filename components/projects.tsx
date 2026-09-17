import { projects } from "@/content/resume";
import { ProjectCard } from "./project-card";
import { Section } from "./section";

export function Projects() {
  const live = projects.filter((p) => p.status === "live").length;
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Deployed systems"
      title="Three services, each with the path that ships it."
      lede="Every card is a real project from the résumé: what goes in, what happens, what comes out, and the pipeline behind it. Open one for the full architecture."
      note={`${projects.length} services · ${live} live`}
    >
      <div className="space-y-6">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </Section>
  );
}
