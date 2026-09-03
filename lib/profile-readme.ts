/**
 * One cached fetch of the profile README, shared by the README-sourced
 * sections. Next dedupes identical fetches, so several sections calling this
 * still hit GitHub once per revalidation window.
 */

const PROFILE_README_URL =
  "https://raw.githubusercontent.com/MattPereira/MattPereira/main/README.md";

/** Roughly hourly: README edits appear without a redeploy. */
const REVALIDATE_SECONDS = 3600;

/**
 * Returns empty markdown if GitHub is unreachable or answers with an error, so
 * one bad section can't take down the page — but logs loudly, because a section
 * that quietly renders nothing is the failure this pipeline replaced.
 */
export async function fetchProfileReadme(): Promise<string> {
  try {
    const response = await fetch(PROFILE_README_URL, {
      next: { revalidate: REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      console.error(
        `[readme] GitHub returned ${response.status} ${response.statusText} for ${PROFILE_README_URL}`,
      );
      return "";
    }

    return await response.text();
  } catch (error) {
    console.error(`[readme] failed to fetch ${PROFILE_README_URL}`, error);
    return "";
  }
}
