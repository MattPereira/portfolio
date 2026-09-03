import Image from "next/image";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { getProjects } from "@/lib/projects";

export async function Projects() {
  const projects = await getProjects();

  return (
    <Section id="projects" title="Projects">
      {projects.length === 0 ? (
        // The section keeps its heading and anchor even with nothing to show, so a
        // fetch or parse failure is visible here as well as in the server logs.
        <p className="text-center text-muted-foreground">Projects are temporarily unavailable.</p>
      ) : (
        <ul className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <li key={project.url}>
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="group block h-full rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Card className="h-full gap-0 overflow-hidden py-0 ring-2 ring-foreground/20">
                  {project.thumbnailUrl !== null && (
                    // Repo READMEs give no dimensions, so the image fills a fixed
                    // aspect box rather than driving the layout itself.
                    <div className="relative aspect-video w-full bg-muted">
                      <Image
                        src={project.thumbnailUrl}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 31vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <h3 className="text-xl font-bold leading-tight group-hover:text-primary">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-base text-muted-foreground">{project.description}</p>
                  </CardContent>
                </Card>
              </a>
            </li>
          ))}
        </ul>
      )}
    </Section>
  );
}
