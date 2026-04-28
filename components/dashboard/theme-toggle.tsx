"use client";

import {Moon, Sun} from "lucide-react";
import {useEffect, useState} from "react";
import {Button} from "@/components/ui/button";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = window.localStorage.getItem("dashboard-theme");
  if (stored === "light" || stored === "dark") return stored;

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem("dashboard-theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  return (
      <Button
          aria-label={isDark ? "Use light theme" : "Use dark theme"}
          onClick={() => setTheme(isDark ? "light" : "dark")}
          size="icon"
          suppressHydrationWarning
          title={isDark ? "Use light theme" : "Use dark theme"}
          variant="secondary"
      >
        {isDark ? <Sun aria-hidden="true" size={17}/> : <Moon aria-hidden="true" size={17}/>}
      </Button>
  );
}
