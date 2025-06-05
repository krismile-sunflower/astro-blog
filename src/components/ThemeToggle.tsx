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
  return "light";
};

export default function ThemeToggle() {
  const [theme, setTheme] = useState<string>("light");

  useEffect(() => {
    setTheme(getInitialTheme() || "light");
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      if (theme) {
        window.localStorage.setItem("theme", theme);
      }
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <button
      onClick={toggleTheme}
      className="transition-colors duration-500 rounded-full p-2 text-2xl bg-white/70 dark:bg-black/70 shadow hover:scale-110"
      aria-label="切换主题"
      title="切换主题"
    >
      {theme === "dark" ? "🌞" : "🌙"}
    </button>
  );
}