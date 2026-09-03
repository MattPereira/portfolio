/**
 * Reading a linked repo's own README, so a project thumbnail never has to be
 * maintained anywhere: it is whatever image that repo already shows first.
 */

export interface RepoRef {
  owner: string;
  repo: string;
}

export interface RepoReadme {
  markdown: string;
  /** The branch the markdown came from — relative image paths resolve against it. */
  branch: string;
}

/** Tried in order; a repo that predates the rename still resolves. */
const BRANCHES = ["main", "master"];

/** Roughly hourly, matching the profile README: edits appear without a redeploy. */
const REVALIDATE_SECONDS = 3600;

const REPO_URL = /^https?:\/\/(?:www\.)?github\.com\/([^/\s]+)\/([^/\s#?]+)/;
/** `![alt](src "title")`, tolerating the angle-bracket form of the source. */
const MARKDOWN_IMAGE = /!\[[^\]]*\]\(\s*<?([^)\s>]+)>?/;
const HTML_IMAGE = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/i;

export function parseRepoRef(url: string): RepoRef | null {
  const match = url.match(REPO_URL);

  if (match === null) return null;

  return { owner: match[1], repo: match[2].replace(/\.git$/, "") };
}

/** The source of whichever image — markdown or HTML — appears first in the README. */
export function findFirstImageSrc(markdown: string): string | null {
  const candidates = [markdown.match(MARKDOWN_IMAGE), markdown.match(HTML_IMAGE)]
    .filter(match => match !== null)
    .sort((a, b) => a.index! - b.index!);

  return candidates[0]?.[1].trim() ?? null;
}

/**
 * Absolute sources pass through untouched — in particular GitHub attachment
 * URLs, which are stable redirects to a presigned target that expires in five
 * minutes, so the redirecting URL is the only one worth storing.
 */
export function resolveImageUrl(src: string, { owner, repo }: RepoRef, branch: string): string {
  if (/^https?:\/\//.test(src)) return src;

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

/** The first image in the repo's README as an absolute URL, or null if it has none. */
export async function fetchRepoThumbnail(ref: RepoRef): Promise<string | null> {
  const readme = await fetchRepoReadme(ref);

  if (readme === null) return null;

  const src = findFirstImageSrc(readme.markdown);

  return src === null ? null : resolveImageUrl(src, ref, readme.branch);
}
