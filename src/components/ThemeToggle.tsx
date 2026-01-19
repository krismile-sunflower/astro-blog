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
        className="relative group transition-all duration-500 rounded-full p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 border border-blue-400/30 dark:border-blue-400/50 shadow-lg hover:shadow-cyan-500/50 hover:scale-110 hover:border-blue-400/60"
        aria-label="切换主题"
        title="切换主题"
      >
        {/* 太阳图标 - 浅色模式 */}
        <svg
          className={`w-6 h-6 transition-all duration-500 ${theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow-400`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>

        {/* 月亮图标 - 深色模式 */}
        <svg
          className={`w-6 h-6 transition-all duration-500 ${theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"} absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-300`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>

        {/* 发光效果 */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-md"></div>
      </button>
    </div>
  );
}