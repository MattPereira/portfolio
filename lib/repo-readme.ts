/**
 * Reading a linked repo's own README, so a project thumbnail never has to be
 * maintained anywhere: it is an image that repo already shows near the top.
 */

export interface RepoRef {
  owner: string;
  repo: string;
}

/**
 * A repo hero is often a wordmark that only reads on one background, so a
 * README that ships both variants is carried through as both. `dark` equals
 * `light` when the README has only the one image.
 */
export interface Thumbnail {
  light: string;
  dark: string;
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

/** `<picture>` and its parts, for a README that ships a per-color-scheme hero. */
const PICTURE = /<picture\b[^>]*>([\s\S]*?)<\/picture>/gi;
const SOURCE = /<source\b[^>]*>/gi;
const IMG_SRC = /<img\b[^>]*?\bsrc\s*=\s*["']([^"']+)["']/i;
const SRCSET = /\bsrcset\s*=\s*["']([^"']+)["']/i;

/** The first candidate of a srcset, dropping any width or density descriptor. */
function firstSrc(srcset: string): string {
  return srcset.split(",")[0].trim().split(/\s+/)[0];
}

function findSchemeSrc(sources: string[], scheme: "light" | "dark"): string | null {
  const tag = sources.find(source =>
    new RegExp(`prefers-color-scheme:\\s*${scheme}`, "i").test(source),
  );
  const srcset = tag?.match(SRCSET)?.[1];

  return srcset === undefined ? null : firstSrc(srcset);
}

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

/**
 * The light and dark sources of every `<picture>` in the README, keyed by the
 * `<img>` src it falls back to — which is what the image scan already returns,
 * so a chosen thumbnail can be looked up here without parsing twice.
 */
export function findColorSchemeVariants(markdown: string): Map<string, Thumbnail> {
  const variants = new Map<string, Thumbnail>();

  for (const [, inner] of markdown.matchAll(PICTURE)) {
    const fallback = inner.match(IMG_SRC)?.[1]?.trim();

    if (fallback === undefined) continue;

    const sources = [...inner.matchAll(SOURCE)].map(match => match[0]);

    variants.set(fallback, {
      light: findSchemeSrc(sources, "light") ?? fallback,
      dark: findSchemeSrc(sources, "dark") ?? fallback,
    });
  }

  return variants;
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
      const response = await fetch(url, {
        next: { revalidate: REVALIDATE_SECONDS },
      });

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
export async function fetchRepoThumbnail(ref: RepoRef): Promise<Thumbnail | null> {
  const readme = await fetchRepoReadme(ref);

  if (readme === null) return null;

  const src = findThumbnailUrl(readme.markdown) ?? findImageSrcs(readme.markdown)[0];

  if (src === undefined) return null;

  const variants = findColorSchemeVariants(readme.markdown).get(src) ?? {
    light: src,
    dark: src,
  };
  const resolve = (candidate: string) =>
    isAbsolute(candidate) ? candidate : resolveImageUrl(candidate, ref, readme.branch);

  return { light: resolve(variants.light), dark: resolve(variants.dark) };
}
