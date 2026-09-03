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
  /** Month the role started, as `YYYY-MM`. */
  start: string;
  /** Month the role ended, as `YYYY-MM`. `null` only for a role still held. */
  end: string | null;
  logo: RoleLogo;
  accomplishments: string[];
}

/** Resume order: by start date, most recent first. */
export const roles: Role[] = [
  {
    employer: "Balancer Labs",
    title: "Software Engineer",
    start: "2024-06",
    end: "2026-04",
    logo: { src: "/balancer.svg", alt: "Balancer Labs logo" },
    accomplishments: [
      "Built liquidity pool creation UI abstracting complex pool configuration parameters into a simple multi-step form",
      "Created a Scaffold-ETH starter kit for prototyping custom pools and hooks on Balancer V3 (100+ GitHub stars)",
      "Implemented pool creation and liquidity operation features with unit and integration tests for the Balancer SDK",
      "Strengthened reliability of the frontend monorepo CI pipeline by improving unit, integration, and E2E test coverage",
      "Produced developer documentation and an educational video series covering how to build on Balancer's stack",
      "Reviewed ERC-4626 and rate provider smart contracts to ensure compatibility with the Balancer V3 vault",
    ],
  },
  {
    employer: "Buidl Guidl",
    title: "Full Stack Web3 Developer",
    start: "2023-11",
    end: "2024-07",
    logo: { src: "/buidlguidl.svg", alt: "Buidl Guidl logo" },
    accomplishments: [
      "Built an interactive Scaffold-ETH tutorial dapp teaching Chainlink price feed, VRF, and automation integrations",
      "Used the Ponder framework to query on-chain data and aggregate member funding stream totals for frontend display",
      "Mentored community members through technical blockers in smart contracts and dapp architecture",
    ],
  },
  {
    employer: "Hack For LA",
    title: "Full Stack Web Developer",
    start: "2022-12",
    end: "2023-11",
    logo: { src: "/hfla.png", alt: "Hack For LA logo" },
    accomplishments: [
      "Implemented Figma designs using React, TypeScript, and Sass for a volunteer matching platform",
      "Built front-end forms and fixed Express server bugs for a volunteer relationship management system",
    ],
  },
  {
    employer: "Tabernacle School",
    title: "IT Specialist",
    start: "2020-12",
    end: "2024-06",
    logo: { src: "/tabernacle.svg", alt: "Tabernacle School logo" },
    accomplishments: [
      "Rebuilt the school website from scratch using Next.js and Tailwind, replacing a legacy WordPress site with improved UX",
      "Managed student account permissions, device networking, and local server administration across computer labs",
    ],
  },
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Formats `YYYY-MM` without going through Date, which would shift across timezones. */
function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  return `${months[Number(month) - 1]} ${year}`;
}

export function formatRoleDates(role: Role): string {
  return `${formatMonth(role.start)} – ${role.end ? formatMonth(role.end) : "Present"}`;
}
