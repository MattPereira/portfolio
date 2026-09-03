import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseHackathons } from "@/lib/hackathons";

const readme = readFileSync(new URL("../__fixtures__/profile-readme.md", import.meta.url), "utf8");

describe("parseHackathons", () => {
  it("parses every entry in the real README, in README order", () => {
    expect(parseHackathons(readme).map(entry => entry.title)).toEqual([
      "ETH Denver Bounty Winner",
      "Lukso Hackathon Bounty Winner",
    ]);
  });

  it("reads the title, every labelled link, and the trailing date", () => {
    const [first] = parseHackathons(readme);

    expect(first).toEqual({
      title: "ETH Denver Bounty Winner",
      date: "Feb 2024",
      links: [
        { label: "Github", url: "https://github.com/MattPereira/FundGuys" },
        {
          label: "NFT",
          url: "https://opensea.io/item/arbitrum/0x93fd88df3e2a377c0f23bf22c1cfd87047818d20/126",
        },
        { label: "Devfolio", url: "https://devfolio.co/projects/fundguys-9ed9" },
      ],
    });
  });

  it("keeps every proof link rather than only the first", () => {
    for (const entry of parseHackathons(readme)) {
      expect(entry.links).toHaveLength(3);
    }
  });

  it("returns nothing when the Hackathons section is missing", () => {
    expect(parseHackathons("### 🎥 Videos\n\n- [A](https://example.com) – B")).toEqual([]);
  });

  it("skips a line with no links rather than inventing an entry", () => {
    expect(parseHackathons("### Hackathons\n\n- Just a note | Feb 2024")).toEqual([]);
  });
});
