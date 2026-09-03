"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { resumeUrl, sections } from "@/lib/site-content";

/** Matches the sheet's close transition so scrolling starts after the scroll lock lifts. */
const CLOSE_DURATION_MS = 200;

export function MobileNav() {
  const [open, setOpen] = useState(false);

  function goToSection(id: string) {
    setOpen(false);
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, CLOSE_DURATION_MS);
  }

  const linkClassName =
    "block py-2 font-heading text-2xl text-left hover:text-primary";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" aria-label="Open menu" />}
        className="lg:hidden"
      >
        <Menu className="size-6" />
      </SheetTrigger>

      <SheetContent side="left" className="w-3/4 sm:max-w-xs">
        <SheetHeader>
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Image src="/logo.svg" alt="" width={36} height={36} className="size-9 dark:invert" />
        </SheetHeader>

        <nav aria-label="Sections" className="px-4">
          <ul>
            {sections.map(({ id, label }) => (
              <li key={id}>
                <button
                  type="button"
                  className={`${linkClassName} w-full`}
                  onClick={() => goToSection(id)}
                >
                  {label}
                </button>
              </li>
            ))}
            <li>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className={linkClassName}
                onClick={() => setOpen(false)}
              >
                Resume
              </a>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
