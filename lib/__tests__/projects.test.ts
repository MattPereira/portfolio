import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parseProjects } from "@/lib/projects";

const readme = readFileSync(new URL("../__fixtures__/profile-readme.md", import.meta.url), "utf8");

describe("parseProjects", () => {
  it("parses every project in the real README, in README order", () => {
    expect(parseProjects(readme).map(project => project.title)).toEqual([
      "Open Caddie",
      "Scaffold Balancer",
      "HoldSight",
    ]);
  });

  it("reads title, description, url and repo from one line", () => {
    const [first] = parseProjects(readme);

    expect(first).toEqual({
      title: "Open Caddie",
      description:
        "A modern golf score keeper for match play and tournament coordination",
      url: "https://github.com/MattPereira/open-caddie",
      repo: { owner: "MattPereira", repo: "open-caddie" },
    });
  });

  it("keeps a project owned by an organisation", () => {
    const [, second] = parseProjects(readme);

    expect(second.repo).toEqual({ owner: "balancer", repo: "scaffold-balancer-v3" });
  });

  it("returns nothing when the Projects section is missing", () => {
    expect(parseProjects("### 🎥 Videos\n\n- [A](https://example.com) – B")).toEqual([]);
  });

  it("drops a line that does not link to a github repo", () => {
    expect(parseProjects("### Projects\n\n- [Site](https://example.com) – Not a repo")).toEqual([]);
  });
});
