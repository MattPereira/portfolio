import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseVideos } from "@/lib/videos";

const readme = readFileSync(new URL("../__fixtures__/profile-readme.md", import.meta.url), "utf8");

describe("parseVideos", () => {
  it("parses every video in the real README", () => {
    expect(parseVideos(readme)).toHaveLength(4);
  });

  it("extracts the youtube id from a watch URL that also carries a playlist", () => {
    const [first] = parseVideos(readme);

    expect(first).toEqual({
      title: "Intro to Scaffold Balancer",
      description:
        "Tour of the starter kit: deploy scripts, local fork, and pool operations playground",
      url: "https://www.youtube.com/watch?v=m6q5M34ZdXw&list=PLFKRKS7Isj-LPvafy-qMuRSlnIFYxHNJw",
      youtubeId: "m6q5M34ZdXw",
      thumbnailUrl: "https://i.ytimg.com/vi/m6q5M34ZdXw/hqdefault.jpg",
    });
  });

  it("derives every thumbnail from the video id rather than the README", () => {
    for (const video of parseVideos(readme)) {
      expect(video.thumbnailUrl).toContain(video.youtubeId);
      expect(readme).not.toContain(video.thumbnailUrl);
    }
  });

  it("returns nothing when the Videos section is missing", () => {
    expect(parseVideos("### Projects\n\n- [A](https://example.com) – B")).toEqual([]);
  });

  it("drops lines whose link is not a recognisable youtube video", () => {
    const videos = parseVideos("### 🎥 Videos\n\n- [Not a video](https://example.com) – nope");

    expect(videos).toEqual([]);
  });
});
