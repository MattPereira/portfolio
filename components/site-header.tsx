import Image from "next/image";
import Link from "next/link";
import { resumeUrl, sections } from "@/lib/site-content";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";

export function SiteHeader() {
  const linkClassName = "font-heading text-2xl hover:text-primary";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <MobileNav />

        <Link href="#landing" aria-label="Back to top" className="hidden shrink-0 lg:block">
          <Image src="/logo.svg" alt="" width={36} height={36} className="size-9 dark:invert" />
        </Link>

        <nav aria-label="Sections" className="hidden lg:block">
          <ul className="flex items-center gap-6">
            {sections.map(({ id, label }) => (
              <li key={id}>
                <Link href={`#${id}`} className={linkClassName}>
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a href={resumeUrl} target="_blank" rel="noreferrer" className={linkClassName}>
                Resume
              </a>
            </li>
          </ul>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
