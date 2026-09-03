import { fetchProfileReadme } from "@/lib/profile-readme";
import { parseLinkedListItems, requireSection, type LinkedListItem } from "@/lib/readme";
import { fetchRepoThumbnail, parseRepoRef, type RepoRef, type Thumbnail } from "@/lib/repo-readme";

export interface ProjectSource extends LinkedListItem {
  repo: RepoRef;
}

export interface Project extends ProjectSource {
  /** Null when the linked repo's README has no image; the card renders without one. */
  thumbnail: Thumbnail | null;
}

const PROJECTS_HEADING = "Projects";

export function parseProjects(readme: string): ProjectSource[] {
  const section = requireSection(readme, PROJECTS_HEADING);

  if (section === "") return [];

  return parseLinkedListItems(section).flatMap(item => {
    const repo = parseRepoRef(item.url);

    if (repo === null) {
      console.error(`[readme] project "${item.title}" does not link to a github repo: ${item.url}`);
      return [];
    }

    return [{ ...item, repo }];
  });
}

export async function getProjects(): Promise<Project[]> {
  const projects = parseProjects(await fetchProfileReadme());

  return Promise.all(
    projects.map(async project => ({
      ...project,
      thumbnail: await fetchRepoThumbnail(project.repo),
    })),
  );
}
