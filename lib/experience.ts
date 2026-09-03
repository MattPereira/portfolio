/**
 * Work history, seeded by hand from the resume document.
 * Deliberately static: no runtime fetching, no environment variables.
 */

export interface RoleLogo {
  src: string;
  alt: string;
  /**
   * Optical size correction. A rotated mark's bounding box is larger than its
   * visual body, so object-contain renders it smaller than square marks beside it.
   */
  scale?: number;
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
      "Abstracted pool configuration into a multi-step UI, and shipped pool creation and liquidity operations in the SDK with unit and integration tests. Built a Scaffold-ETH starter kit for V3 pools and hooks (100+ stars), docs, and videos. Deepened monorepo CI coverage; reviewed ERC-4626 and rate provider contracts for vault compatibility.",
  },
  {
    employer: "Buidl Guidl",
    title: "Full Stack Developer",
    logo: { src: "/buidlguidl-icon.svg", alt: "Buidl Guidl logo" },
    summary:
      "Built an interactive Scaffold-ETH tutorial dapp teaching developers to integrate Chainlink price feeds, VRF, and automation into smart contracts. Used the Ponder framework to index on-chain data, aggregating funding stream totals for display on the frontend. Mentored community members through technical blockers spanning smart contracts and dapp architecture.",
  },
  {
    employer: "Hack For LA",
    title: "Full Stack Developer",
    logo: { src: "/hfla-icon.png", alt: "Hack For LA logo", scale: 1.25 },
    summary:
      "Implemented Figma designs in React, TypeScript, and Sass for a volunteer matching platform, turning design handoffs into the interfaces volunteers used. Built front-end forms and fixed Express server bugs for a separate volunteer relationship management system, working across both its client interface and its Node server.",
  },
];
