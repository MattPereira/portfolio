/**
 * Shared parsing for the GitHub profile README, which is the single source of
 * truth for the README-sourced sections. Pure functions: fetching lives in
 * `lib/github.ts` so these stay testable against a committed snapshot.
 */

export interface LinkedListItem {
  title: string;
  url: string;
  description: string;
}

/** Markdown headings of any level, capturing the heading text. */
const HEADING = /^#{1,6}\s+(.*)$/;

/** `- [Title](url) – Description`, accepting an en dash or a hyphen separator. */
const LINKED_LIST_ITEM = /^-\s+\[([^\]]+)\]\(([^)]+)\)\s*[–-]\s*(.+)$/;

/**
 * Heading text is compared on its letters only, so the emoji the README puts in
 * every heading (and any spacing around it) never has to be spelled out here.
 */
function headingKey(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * The lines under `heading`, up to the next heading of any level.
 * An absent heading yields empty content rather than throwing — a section with
 * nothing to show is a normal state, but see the callers: it is logged.
 */
export function findSection(markdown: string, heading: string): string {
  const lines = markdown.split("\n");
  const start = lines.findIndex(line => {
    const match = line.match(HEADING);
    return match !== null && headingKey(match[1]) === headingKey(heading);
  });

  if (start === -1) return "";

  const rest = lines.slice(start + 1);
  const end = rest.findIndex(line => HEADING.test(line));

  return (end === -1 ? rest : rest.slice(0, end)).join("\n").trim();
}

/** Every `- [Title](url) – Description` line in `section`, in README order. */
export function parseLinkedListItems(section: string): LinkedListItem[] {
  return section
    .split("\n")
    .map(line => line.trim())
    .filter(line => line !== "")
    .flatMap(line => {
      const match = line.match(LINKED_LIST_ITEM);

      if (match === null) {
        // A bullet that nearly matches is a typo in the README, not prose: say so.
        if (line.startsWith("-") && line.includes("](")) {
          console.error(`[readme] could not parse list item: ${line}`);
        }
        return [];
      }

      const [, title, url, description] = match;
      return [{ title: title.trim(), url: url.trim(), description: description.trim() }];
    });
}
