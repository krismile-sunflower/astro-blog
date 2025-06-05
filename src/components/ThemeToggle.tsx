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
  const [theme, setTheme] = useState<string | null>(null);
  const [followSystem, setFollowSystem] = useState(true);

  // 初始化：优先本地存储，否则跟随系统
  useEffect(() => {
    if (typeof window !== "undefined") {
      const localTheme = localStorage.getItem("theme");
      if (localTheme) {
        setTheme(localTheme);
        setFollowSystem(false);
        document.documentElement.setAttribute('data-theme', 'manual');
      } else {
        setTheme(getInitialTheme() || "light");
        setFollowSystem(true);
        document.documentElement.removeAttribute('data-theme');
      }
    }
  }, []);

  // 主题切换响应
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (theme) {
        if (theme === "dark") {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
        } else {
          document.documentElement.classList.remove("dark");
          document.documentElement.classList.add("light");
        }
        if (!followSystem) {
          window.localStorage.setItem("theme", theme);
          document.documentElement.setAttribute('data-theme', 'manual');
        }
      }
      if (followSystem) {
        document.documentElement.removeAttribute('data-theme');
        document.documentElement.classList.remove("dark", "light");
        window.localStorage.removeItem("theme");
      }
    }
  }, [theme, followSystem]);

  // 跟随系统主题变化
  useEffect(() => {
    if (!followSystem) return;
    if (typeof window !== "undefined") {
      const mql = window.matchMedia("(prefers-color-scheme: dark)");
      const systemChange = () => setTheme(mql.matches ? "dark" : "light");
      mql.addEventListener("change", systemChange);
      return () => mql.removeEventListener("change", systemChange);
    }
  }, [followSystem]);

  const toggleTheme = () => {
    setFollowSystem(false);
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };


  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleTheme}
        className="transition-colors duration-500 rounded-full p-2 text-2xl bg-white/70 dark:bg-black/70 shadow hover:scale-110"
        aria-label="切换主题"
        title="切换主题"
      >
        {theme === "dark" ? "🌞" : "🌙"}
      </button>
    </div>
  );
}