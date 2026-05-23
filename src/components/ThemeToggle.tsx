import { useEffect, useState } from "preact/hooks";

const getInitialTheme = () => {
  if (typeof window !== "undefined") {
    if (localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      return "dark";
    }
  }
  return "dark";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string | null>(null);
  const [followSystem, setFollowSystem] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const localTheme = localStorage.getItem("theme");
    if (localTheme) {
      setTheme(localTheme);
      setFollowSystem(false);
      document.documentElement.setAttribute("data-theme", "manual");
    } else {
      setTheme(getInitialTheme() || "dark");
      setFollowSystem(true);
      document.documentElement.removeAttribute("data-theme");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !theme) return;
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    }
    if (!followSystem) {
      window.localStorage.setItem("theme", theme);
      document.documentElement.setAttribute("data-theme", "manual");
    }
    if (followSystem) {
      document.documentElement.removeAttribute("data-theme");
      window.localStorage.removeItem("theme");
    }
  }, [theme, followSystem]);

  useEffect(() => {
    if (!followSystem || typeof window === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setTheme(mql.matches ? "dark" : "light");
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [followSystem]);

  const toggle = () => {
    setFollowSystem(false);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      class="theme-toggle"
      aria-label={`switch to ${isDark ? "light" : "dark"} mode`}
      title={`switch to ${isDark ? "light" : "dark"} mode`}
    >
      <span class="bracket">[</span>
      <span class="label">{isDark ? "dark" : "lite"}</span>
      <span class="bracket">]</span>
      <style>{`
        .theme-toggle {
          font-family: inherit;
          font-size: 0.9375rem;
          background: transparent;
          color: var(--text-muted);
          border: 1px dashed transparent;
          border-radius: 2px;
          padding: 0.375rem 0.75rem;
          cursor: pointer;
          transition: color 150ms ease, border-color 150ms ease, background 150ms ease;
          letter-spacing: 0.02em;
        }
        .theme-toggle:hover {
          color: var(--accent);
          border-color: var(--accent-dim);
          background: var(--surface);
        }
        .bracket { color: var(--text-faint); }
        .theme-toggle:hover .bracket { color: var(--accent-dim); }
        .label { margin: 0 0.125rem; }
      `}</style>
    </button>
  );
}
