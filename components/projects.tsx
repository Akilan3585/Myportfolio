import { projects } from "@/content/resume";
import { ProjectCard } from "./project-card";
import { Section } from "./section";

export function Projects() {
  return (
    <Section
      id="projects"
      index="03"
      eyebrow="Work"
      title="Built, containerised, deployed."
      lede="Three products, each with the pipeline that gets it to users. Open a case study for the problem, the solution and how the pieces connect."
    >
      <div className="space-y-24 sm:space-y-32">
        {projects.map((p, i) => (
          <ProjectCard key={p.slug} project={p} flip={i % 2 === 1} />
        ))}
      </div>
    </Section>
  );
}
