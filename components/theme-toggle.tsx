"use client";

import { useLayoutEffect, useState } from "react";
import { Monitor, Moon, Sun } from "@/components/icons";

type ThemePreference = "system" | "light" | "dark";

const storageKey = "portfolio-theme-v1";
const order: ThemePreference[] = ["system", "light", "dark"];

function readPreference(): ThemePreference {
  const saved = window.localStorage.getItem(storageKey);
  return saved === "light" || saved === "dark" ? saved : "system";
}

function applyPreference(preference: ThemePreference) {
  const resolved =
    preference === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : preference;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  document.documentElement.style.colorScheme = resolved;
}

export function ThemeToggle() {
  const [preference, setPreference] = useState<ThemePreference>("system");

  useLayoutEffect(() => {
    const saved = readPreference();
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      if (readPreference() === "system") applyPreference("system");
    };

    setPreference(saved);
    applyPreference(saved);
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  const nextPreference = order[(order.indexOf(preference) + 1) % order.length];
  const label = preference[0].toUpperCase() + preference.slice(1);
  const nextLabel = nextPreference[0].toUpperCase() + nextPreference.slice(1);
  const Icon = preference === "light" ? Sun : preference === "dark" ? Moon : Monitor;

  function cycleTheme() {
    if (nextPreference === "system") window.localStorage.removeItem(storageKey);
    else window.localStorage.setItem(storageKey, nextPreference);
    setPreference(nextPreference);
    applyPreference(nextPreference);
  }

  return (
    <button
      className="themeToggle"
      type="button"
      onClick={cycleTheme}
      aria-label={`Theme: ${label}. Switch to ${nextLabel}`}
      title={`Theme: ${label}. Switch to ${nextLabel}`}
    >
      <Icon />
      <span>{label}</span>
    </button>
  );
}
