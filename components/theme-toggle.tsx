"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      {/* Both icons render server-side and are swapped by CSS, so the button never waits on hydration to show the right one. */}
      <Sun className="size-6 dark:hidden" />
      <Moon className="hidden size-6 dark:block" />
    </Button>
  );
}
