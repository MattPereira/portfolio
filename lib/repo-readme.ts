/**
 * Reading a linked repo's own README, so a project thumbnail never has to be
 * maintained anywhere: it is an image that repo already shows near the top.
 */

export interface RepoRef {
  owner: string;
  repo: string;
}

export interface RepoReadme {
  markdown: string;
  /** The branch the markdown came from — a repo's own images hang off it. */
  branch: string;
}

/** Tried in order; a repo that predates the rename still resolves. */
const BRANCHES = ["main", "master"];

/** Roughly hourly, matching the profile README: edits appear without a redeploy. */
const REVALIDATE_SECONDS = 3600;

function isAbsolute(src: string): boolean {
  return /^https?:\/\//.test(src);
}

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
 * GitHub minted when it was pasted in. Preferred over a repo's own images,
 * which are as often a deep interior screenshot as a hero, so picking them
 * first made one card look unlike the rest.
 */
export function findThumbnailUrl(markdown: string): string | null {
  return findImageSrcs(markdown).find(isAbsolute) ?? null;
}

/** An image committed in the repo, resolved against the branch it was read from. */
export function resolveImageUrl(src: string, { owner, repo }: RepoRef, branch: string): string {
  const path = src.replace(/^\.?\//, "");

  return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
}

/**
 * The repo's README from the first branch that has one, or null. A missing
 * README is a normal state for a linked repo; it just means no thumbnail.
 */
export async function fetchRepoReadme({ owner, repo }: RepoRef): Promise<RepoReadme | null> {
  for (const branch of BRANCHES) {
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/README.md`;

    try {
      const response = await fetch(url, { next: { revalidate: REVALIDATE_SECONDS } });

      if (response.ok) return { markdown: await response.text(), branch };
    } catch (error) {
      console.error(`[readme] failed to fetch ${url}`, error);
    }
  }

  console.error(`[readme] no README found for ${owner}/${repo} on ${BRANCHES.join(" or ")}`);
  return null;
}

/**
 * The repo's thumbnail: its hero if it has one, otherwise its first committed
 * image rather than nothing — some repos host every image in the repo itself.
 */
export async function fetchRepoThumbnail(ref: RepoRef): Promise<string | null> {
  const readme = await fetchRepoReadme(ref);

  if (readme === null) return null;

  const hero = findThumbnailUrl(readme.markdown);

  if (hero !== null) return hero;

  const [own] = findImageSrcs(readme.markdown);

  return own === undefined ? null : resolveImageUrl(own, ref, readme.branch);
}
