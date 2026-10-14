"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun01Icon, Moon01Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="size-9 rounded-md text-muted-foreground"
        aria-label="Toggle theme"
      >
        <span className="size-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="size-9 rounded-md text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <Sun01Icon className="size-4.5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon01Icon className="size-4.5 text-foreground transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
}
