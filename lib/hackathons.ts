import { fetchProfileReadme } from "@/lib/profile-readme";
import { requireSection } from "@/lib/readme";

export interface ProofLink {
  label: string;
  url: string;
}

export interface Hackathon {
  title: string;
  links: ProofLink[];
  date: string;
}

const HACKATHONS_HEADING = "Hackathons";

/** `- Title | [Label](url) | ... | Date`: plain title, any number of links, trailing date. */
const LINK = /^\[([^\]]+)\]\(([^)]+)\)$/;

function parseEntry(line: string): Hackathon | null {
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

export function parseHackathons(readme: string): Hackathon[] {
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
  return parseHackathons(await fetchProfileReadme());
}
