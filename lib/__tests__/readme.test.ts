import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { findSection, parseLinkedListItems } from "@/lib/readme";

/** A committed snapshot of the real profile README, so tests break when its shape drifts. */
const readme = readFileSync(new URL("../__fixtures__/profile-readme.md", import.meta.url), "utf8");

describe("findSection", () => {
  it("finds a section whose heading carries an emoji", () => {
    expect(findSection(readme, "Videos")).toContain("Intro to Scaffold Balancer");
  });

  it("stops at the next heading", () => {
    const videos = findSection(readme, "Videos");

    expect(videos).not.toContain("Hackathons");
    expect(videos).not.toContain("Open Caddie");
  });

  it("returns empty content for an absent heading instead of throwing", () => {
    expect(findSection(readme, "Speaking")).toBe("");
  });
});

describe("parseLinkedListItems", () => {
  it("reads every video line as a linked title plus description", () => {
    const items = parseLinkedListItems(findSection(readme, "Videos"));

    expect(items).toHaveLength(4);
    expect(items[0]).toEqual({
      title: "Intro to Scaffold Balancer",
      url: "https://www.youtube.com/watch?v=m6q5M34ZdXw&list=PLFKRKS7Isj-LPvafy-qMuRSlnIFYxHNJw",
      description:
        "Tour of the starter kit: deploy scripts, local fork, and pool operations playground",
    });
  });

  it("preserves README order", () => {
    const titles = parseLinkedListItems(findSection(readme, "Videos")).map(item => item.title);

    expect(titles).toEqual([
      "Intro to Scaffold Balancer",
      "Create a Hook",
      "Create Custom AMMs",
      "Create a Router",
    ]);
  });

  it("accepts a hyphen separator as well as an en dash", () => {
    const items = parseLinkedListItems("- [Title](https://example.com) - A description");

    expect(items).toEqual([
      { title: "Title", url: "https://example.com", description: "A description" },
    ]);
  });

  it("keeps punctuation inside descriptions, including further dashes", () => {
    const items = parseLinkedListItems(
      "- [Title](https://example.com) – Does one thing – and, well, another: nicely",
    );

    expect(items[0].description).toBe("Does one thing – and, well, another: nicely");
  });

  it("ignores lines that are not linked list items", () => {
    expect(parseLinkedListItems(findSection(readme, "About"))).toEqual([]);
  });
});
