"use client";

import {Moon, Sun} from "lucide-react";
import {useEffect, useSyncExternalStore} from "react";
import {Button} from "@/components/ui/button";

type Theme = "light" | "dark";
const themeStorageKey = "dashboard-theme";
const themeChangeEvent = "dashboard-theme-change";

function getStoredTheme(): Theme {
  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function getServerTheme(): Theme {
  return "light";
}

function subscribeToThemeChanges(onStoreChange: () => void) {
  const colorSchemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  window.addEventListener("storage", onStoreChange);
  window.addEventListener(themeChangeEvent, onStoreChange);
  colorSchemeQuery.addEventListener("change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(themeChangeEvent, onStoreChange);
    colorSchemeQuery.removeEventListener("change", onStoreChange);
  };
}

function persistTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

/** Persisted light/dark theme toggle used in the dashboard header. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToThemeChanges, getStoredTheme, getServerTheme);

  // The layout script handles first paint; this keeps later browser changes in sync.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const isDark = theme === "dark";

  return (
    <Button
      aria-label={isDark ? "Use light theme" : "Use dark theme"}
      onClick={() => persistTheme(isDark ? "light" : "dark")}
      size="icon"
      title={isDark ? "Use light theme" : "Use dark theme"}
      variant="secondary"
    >
      {isDark ? <Sun aria-hidden="true" size={17}/> : <Moon aria-hidden="true" size={17}/>}
    </Button>
  );
}
