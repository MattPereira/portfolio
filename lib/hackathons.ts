import { fetchProfileReadme } from "@/lib/profile-readme";
import { requireSection } from "@/lib/readme";
import { fetchRepoThumbnail, parseRepoRef, type RepoRef } from "@/lib/repo-readme";

export interface ProofLink {
  label: string;
  url: string;
}

export interface HackathonSource {
  title: string;
  links: ProofLink[];
  date: string;
}

export interface Hackathon extends HackathonSource {
  /** Null when no proof link is a repo, or that repo's README has no image. */
  thumbnailUrl: string | null;
  /** The linked repo's name, or null when no proof link is a repo. */
  projectName: string | null;
}

const HACKATHONS_HEADING = "Hackathons";

/** `- Title | [Label](url) | ... | Date`: plain title, any number of links, trailing date. */
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

function parseEntry(line: string): HackathonSource | null {
  const parts = line
    .replace(/^-\s+/, "")
    .split("|")
    .map(part => part.trim())
    .filter(part => part !== "");

  if (parts.length < 3) return null;

  const [title, ...rest] = parts;
  const links = rest.flatMap(part => {
    const match = part.match(LINK);

    return match === null ? [] : [{ label: match[1], url: match[2] }];
  });
  const date = rest[rest.length - 1];

  // The date is the one trailing part that is not a link; without links there is
  // nothing to verify the claim with, so the entry is a README typo.
  if (links.length === 0 || LINK.test(date)) return null;

  return { title, links, date };
}

export function parseHackathons(readme: string): HackathonSource[] {
  const section = requireSection(readme, HACKATHONS_HEADING);

  if (section === "") return [];

  return section
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.startsWith("-"))
    .flatMap(line => {
      const entry = parseEntry(line);

      if (entry === null) {
        console.error(`[readme] could not parse hackathon: ${line}`);
        return [];
      }

      return [entry];
    });
}

export async function getHackathons(): Promise<Hackathon[]> {
  const entries = parseHackathons(await fetchProfileReadme());

  return Promise.all(
    entries.map(async entry => {
      // The proof links are a mixed bag — code, writeup, on-chain artifact — so
      // the thumbnail comes from whichever one is a repo, if any is.
      const repo: RepoRef | undefined = entry.links
        .map(link => parseRepoRef(link.url))
        .find(ref => ref !== null);

      return {
        ...entry,
        thumbnailUrl: repo === undefined ? null : await fetchRepoThumbnail(repo),
        projectName: repo?.repo ?? null,
      };
    }),
  );
}
