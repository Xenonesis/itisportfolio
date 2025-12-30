"use client";

import { useTheme } from "@/components/ThemeProvider";
import { LaptopMinimal, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleTheme = () => {
    // Cycle through all supported modes: system → light → dark
    setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8"></div>;
  }

  const effectiveTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={toggleTheme}
      className="w-8 h-8 flex items-center justify-center rounded-md bg-transparent hover:bg-zinc-100 dark:hover:bg-muted transition-colors cursor-pointer"
      aria-label={`Theme: ${theme}. Click to change.`}
      title={`Theme: ${theme}`}
    >
      {theme === "system" ? (
        <LaptopMinimal className="w-4 h-4 text-zinc-900 dark:text-zinc-100" />
      ) : effectiveTheme === "dark" ? (
        <Sun className="w-4 h-4 text-zinc-100" />
      ) : (
        <Moon className="w-4 h-4 text-zinc-900" />
      )}
    </button>
  );
}
