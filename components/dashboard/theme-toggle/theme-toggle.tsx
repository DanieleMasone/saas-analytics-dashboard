"use client";

import {Moon, Sun} from "lucide-react";
import {useEffect, useSyncExternalStore} from "react";
import {Button} from "@/components/ui/button/button";

type Theme = "light" | "dark";
const themeDatasetKey = "dashboardTheme";
const themeStorageKey = "dashboard-theme";
const themeChangeEvent = "dashboard-theme-change";

function isTheme(value: string | undefined | null): value is Theme {
  return value === "light" || value === "dark";
}

function getDomTheme(): Theme | null {
  const datasetTheme = document.documentElement.dataset[themeDatasetKey];
  if (isTheme(datasetTheme)) return datasetTheme;
  if (document.documentElement.classList.contains("dark")) return "dark";

  return null;
}

function getBrowserTheme(): Theme {
  const domTheme = getDomTheme();
  if (domTheme) return domTheme;

  const stored = window.localStorage.getItem(themeStorageKey);
  if (isTheme(stored)) return stored;

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

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.dataset[themeDatasetKey] = theme;
}

function persistTheme(theme: Theme) {
  applyTheme(theme);
  window.localStorage.setItem(themeStorageKey, theme);
  window.dispatchEvent(new Event(themeChangeEvent));
}

/** Persisted light/dark theme toggle used in the dashboard header. */
export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToThemeChanges, getBrowserTheme, getServerTheme);

  // The layout script handles first paint; this keeps later browser changes in sync.
  useEffect(() => {
    applyTheme(theme);
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
