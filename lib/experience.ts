/**
 * Work history, seeded by hand from the resume document.
 * Deliberately static: no runtime fetching, no environment variables.
 */

export interface RoleLogo {
  src: string;
  alt: string;
}

export interface Role {
  employer: string;
  title: string;
  logo: RoleLogo;
  summary: string;
}

/** The three most recent roles, newest first. */
export const roles: Role[] = [
  {
    employer: "Balancer Labs",
    title: "Software Engineer",
    logo: { src: "/balancer.svg", alt: "Balancer Labs logo" },
    summary:
      "Built the liquidity pool creation interface, abstracting Balancer V3's configuration parameters into a guided multi-step form, and shipped pool creation and liquidity operations through the Balancer SDK with unit and integration test coverage. Created a Scaffold-ETH starter kit for prototyping custom pools and hooks that earned over 100 GitHub stars, and produced the developer documentation and video series teaching the stack. Strengthened the frontend monorepo's CI pipeline, and reviewed ERC-4626 tokens and rate providers for compatibility with the V3 vault.",
  },
  {
    employer: "Buidl Guidl",
    title: "Full Stack Web3 Developer",
    logo: { src: "/buidlguidl.svg", alt: "Buidl Guidl logo" },
    summary:
      "Built Speedrun Chainlink, an interactive Scaffold-ETH tutorial dapp teaching developers to integrate Chainlink price feeds, VRF, and automation into their own smart contracts. Used the Ponder indexing framework to query on-chain data and aggregate member funding stream totals across cohort contracts, then surfaced the results in a paginated, sortable frontend. Mentored community members through technical blockers spanning smart contract design and dapp architecture, and contributed to the Sanctum cohort stream alongside other builders shipping open source Ethereum tooling.",
  },
  {
    employer: "Hack For LA",
    title: "Full Stack Web Developer",
    logo: { src: "/hfla.png", alt: "Hack For LA logo" },
    summary:
      "Volunteered as a software engineer on open source civic technology serving the greater Los Angeles community. Implemented Figma designs in React, TypeScript, and Sass for Civic Tech Jobs, a platform matching volunteers to projects, and built front-end forms and fixed Express server bugs for a volunteer relationship management system. Collaborated with other developers, designers, and project managers across both codebases, working within the code review and release process of a distributed, fully remote volunteer team.",
  },
];
