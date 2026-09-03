import { fetchProfileReadme } from "@/lib/profile-readme";
import { findSection, parseLinkedListItems, type LinkedListItem } from "@/lib/readme";

export interface Video extends LinkedListItem {
  youtubeId: string;
  thumbnailUrl: string;
}

const VIDEOS_HEADING = "Videos";

/** `watch?v=` and `youtu.be/` forms; any other query params, playlist included, are ignored. */
function extractYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?(?:.*&)?v=|youtu\.be\/)([\w-]{11})/);

  return match?.[1] ?? null;
}

export function parseVideos(readme: string): Video[] {
  const section = findSection(readme, VIDEOS_HEADING);

  if (section === "") {
    console.error(`[readme] no "${VIDEOS_HEADING}" section found in the profile README`);
    return [];
  }

  return parseLinkedListItems(section).flatMap(item => {
    const youtubeId = extractYouTubeId(item.url);

    if (youtubeId === null) {
      console.error(`[readme] video "${item.title}" has no youtube id in ${item.url}`);
      return [];
    }

    return [
      { ...item, youtubeId, thumbnailUrl: `https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg` },
    ];
  });
}

export async function getVideos(): Promise<Video[]> {
  return parseVideos(await fetchProfileReadme());
}
