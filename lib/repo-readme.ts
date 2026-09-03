/**
 * Reading a linked repo's own README, so a project thumbnail never has to be
 * maintained anywhere: it is an image that repo already shows near the top.
 */

export interface RepoRef {
  owner: string;
  repo: string;
}

/** Tried in order; a repo that predates the rename still resolves. */
const BRANCHES = ["main", "master"];

/** Roughly hourly, matching the profile README: edits appear without a redeploy. */
const REVALIDATE_SECONDS = 3600;

const REPO_URL = /^https?:\/\/(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)/;
/**
 * Markdown `![alt](src "title")` — tolerating the angle-bracket form of the
 * source — or an HTML `<img src>`. One pattern, so matches come back in the
 * order they appear rather than grouped by syntax.
 */
const IMAGE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?|<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/gi;

export function parseRepoRef(url: string): RepoRef | null {
  const match = url.match(REPO_URL);

  if (match === null) return null;

  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/** Every image source in the README, markdown and HTML alike, in document order. */
export function findImageSrcs(markdown: string): string[] {
  return [...markdown.matchAll(IMAGE)].map(match => (match[1] ?? match[2]).trim());
}

/**
 * The first image the README hosts at an absolute URL — in practice the hero
 * image GitHub minted when it was pasted in.
 *
 * Images committed inside the repo are skipped on purpose: they are as often a
 * deep interior screenshot as a hero, so honouring them made one card look
 * unlike the rest. A repo with no absolute image gets no thumbnail.
 */
export function findThumbnailUrl(markdown: string): string | null {
  return findImageSrcs(markdown).find(src => /^https?:\/\//.test(src)) ?? null;
}

/**
 * The repo's README from the first branch that has one, or null. A missing
 * README is a normal state for a linked repo; it just means no thumbnail.
 */
export async function fetchRepoReadme({ owner, repo }: RepoRef): Promise<string | null> {
  for (const branch of BRANCHES) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;

    try {
      const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

      if (response.ok) return await response.text();
    } catch (error) {
      console.error(`[readme] failed to fetch ${url}`, error);
    }
  }

  console.error(`[readme] no README found for ${owner}/${repo} on ${BRANCHES.join(" or ")}`);
  return null;
}

/** The repo's thumbnail image, or null if its README has none we can use. */
export async function fetchRepoThumbnail(ref: RepoRef): Promise<string | null> {
  const markdown = await fetchRepoReadme(ref);

  return markdown === null ? null : findThumbnailUrl(markdown);
}
