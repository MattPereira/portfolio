import { readFileSync } from "node:fs";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchRepoReadme,
  findThumbnailUrl,
  parseRepoRef,
  resolveImageUrl,
} from "@/lib/repo-readme";

/** Committed snapshots of the real linked repos, so tests break when their shape drifts. */
function fixture(name: string): string {
  return readFileSync(new URL(`../__fixtures__/repos/${name}.md`, import.meta.url), "utf8");
}

describe("parseRepoRef", () => {
  it("reads owner and repo from a github URL", () => {
    expect(parseRepoRef("https://github.com/MattPereira/open-caddie")).toEqual({
      owner: "MattPereira",
      repo: "open-caddie",
    });
  });

  it("reads a repo owned by an organisation", () => {
    expect(parseRepoRef("https://github.com/balancer/scaffold-balancer-v3")).toEqual({
      owner: "balancer",
      repo: "scaffold-balancer-v3",
    });
  });

  it("ignores trailing paths and slashes", () => {
    expect(parseRepoRef("https://github.com/MattPereira/holdsight/tree/main")).toEqual({
      owner: "MattPereira",
      repo: "holdsight",
    });
  });

  it("returns null for a non-github URL", () => {
    expect(parseRepoRef("https://example.com/MattPereira/open-caddie")).toBeNull();
  });
});

describe("findThumbnailUrl", () => {
  it("reads a raw HTML image tag", () => {
    expect(findThumbnailUrl(fixture("open-caddie"))).toBe(
      "https://github.com/user-attachments/assets/7849fec4-f2cc-44e6-964b-372c134c9007",
    );
  });

  it("reads markdown image syntax", () => {
    expect(findThumbnailUrl(fixture("scaffold-balancer-v3"))).toBe(
      "https://github.com/user-attachments/assets/2f7538cf-d252-43be-9a9a-c8b84a37349c",
    );
  });

  it("takes the hero of a README whose later images are committed screenshots", () => {
    expect(findThumbnailUrl(fixture("open-caddie"))).not.toContain("public/screenshots");
    expect(findThumbnailUrl(fixture("holdsight"))).toContain(
      "https://github.com/user-attachments/assets/",
    );
  });

  it("skips images committed in the repo and keeps looking", () => {
    const markdown = "![shot](public/screenshots/theses.png)\n\n![hero](https://example.com/a.png)";

    expect(findThumbnailUrl(markdown)).toBe("https://example.com/a.png");
  });

  it("returns null when every image lives inside the repo", () => {
    expect(findThumbnailUrl("![shot](docs/one.png)\n<img src='./two.png' />")).toBeNull();
  });

  it("holds no opinion about a README with only committed images", () => {
    expect(findThumbnailUrl(fixture("fundguys"))).toBeNull();
  });

  it("takes whichever syntax appears first", () => {
    const markdown = "<img src='https://example.com/first.png' />\n\n![alt](https://e.com/2.png)";

    expect(findThumbnailUrl(markdown)).toBe("https://example.com/first.png");
  });

  it("returns null for a README with no image", () => {
    expect(findThumbnailUrl("# Title\n\nProse and a [link](https://example.com).")).toBeNull();
  });
});

describe("resolveImageUrl", () => {
  const ref = { owner: "MattPereira", repo: "FundGuys" };

  it("resolves a relative path against the raw content host and branch", () => {
    expect(resolveImageUrl("./packages/nextjs/public/thumbnail.jpg", ref, "main")).toBe(
      "https://raw.githubusercontent.com/MattPereira/FundGuys/main/packages/nextjs/public/thumbnail.jpg",
    );
  });

  it("resolves against the branch the README came from", () => {
    expect(resolveImageUrl("assets/logo.svg", ref, "master")).toBe(
      "https://raw.githubusercontent.com/MattPereira/FundGuys/master/assets/logo.svg",
    );
  });

  it("drops a leading slash rather than doubling it", () => {
    expect(resolveImageUrl("/hero.png", ref, "main")).toBe(
      "https://raw.githubusercontent.com/MattPereira/FundGuys/main/hero.png",
    );
  });
});

describe("fetchRepoReadme", () => {
  /** Answers 200 for the listed branches and 404 for the rest. */
  function stubBranches(...found: string[]) {
    const fetched: string[] = [];

    vi.stubGlobal("fetch", async (url: string) => {
      fetched.push(url);
      const branch = found.find(candidate => url.includes(`/${candidate}/`));

      return branch === undefined
        ? new Response("404: Not Found", { status: 404 })
        : new Response(`# On ${branch}`);
    });

    return fetched;
  }

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reads main without asking for master", async () => {
    const fetched = stubBranches("main");

    expect(await fetchRepoReadme({ owner: "MattPereira", repo: "holdsight" })).toEqual({
      markdown: "# On main",
      branch: "main",
    });
    expect(fetched).toEqual([
      "https://raw.githubusercontent.com/MattPereira/holdsight/main/README.md",
    ]);
  });

  it("falls back to master when there is no main", async () => {
    stubBranches("master");

    expect(await fetchRepoReadme({ owner: "MattPereira", repo: "old-repo" })).toEqual({
      markdown: "# On master",
      branch: "master",
    });
  });

  it("returns null when neither branch has a README", async () => {
    stubBranches();

    expect(await fetchRepoReadme({ owner: "MattPereira", repo: "no-readme" })).toBeNull();
  });
});
