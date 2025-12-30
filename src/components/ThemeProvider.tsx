"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  /** User selection */
  theme: Theme;
  /** The effective theme after resolving "system" */
  resolvedTheme: Exclude<Theme, "system">;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({ children, defaultTheme = "system", storageKey = "theme", ...props }: ThemeProviderProps) {
  const getSystemTheme = (): Exclude<Theme, "system"> => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  };

  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<Exclude<Theme, "system">>(getSystemTheme());

  // Load persisted theme selection
  useEffect(() => {
    const savedTheme = localStorage.getItem(storageKey) as Theme | null;
    if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
      setThemeState(savedTheme);
      return;
    }

    setThemeState(defaultTheme);
  }, [defaultTheme, storageKey]);

  // Track OS theme changes (only relevant when theme === "system")
  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return;

    const update = () => setResolvedTheme(media.matches ? "dark" : "light");
    update();

    // Safari < 14 support
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  // Apply theme class to <html>
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    const effectiveTheme = theme === "system" ? resolvedTheme : theme;
    root.classList.add(effectiveTheme);
  }, [resolvedTheme, theme]);

  const value: ThemeProviderState = {
    theme,
    resolvedTheme: theme === "system" ? resolvedTheme : theme,
    setTheme: (nextTheme: Theme) => {
      localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};
