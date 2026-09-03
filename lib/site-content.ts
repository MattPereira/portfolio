/**
 * Hand-written site content, seeded from the resume document.
 * Deliberately static: no runtime fetching, no environment variables.
 */

export interface SectionLink {
  /** Anchor id rendered by the corresponding section element. */
  id: string;
  label: string;
}

export type SocialId = "github" | "linkedin" | "twitter" | "telegram";

export interface SocialLink {
  id: SocialId;
  label: string;
  href: string;
}

export const siteUrl = "https://matt-pereira.vercel.app";

export const owner = {
  name: "Matt Pereira",
  role: "Software Engineer",
  tagline:
    "Full stack web3 developer specializing in decentralized finance integrations, developer tooling, and user interfaces.",
  photo: "/pfp.png",
} as const;

export const resumeUrl =
  "https://docs.google.com/document/d/1GAvP7iTx6E8Cr7cIe9kg5amQnEYF6r8WjV8-FUUTBrk/edit?usp=sharing";

export const sections: SectionLink[] = [
  { id: "landing", label: "Home" },
  { id: "experience", label: "Experience" },
  { id: "videos", label: "Videos" },
  { id: "projects", label: "Projects" },
  { id: "hackathons", label: "Hackathons" },
];

export const socials: SocialLink[] = [
  { id: "github", label: "GitHub", href: "https://github.com/MattPereira" },
  { id: "twitter", label: "Twitter", href: "https://x.com/ghostinthemiata" },
  { id: "telegram", label: "Telegram", href: "https://t.me/mattpereira" },
  { id: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/-matt-pereira-/" },
];

export const siteMetadata = {
  title: `${owner.name} | ${owner.role}`,
  description: owner.tagline,
  ogImage: "/thumbnail.jpg",
} as const;
