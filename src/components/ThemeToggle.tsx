import { useEffect, useState } from "preact/hooks";

export default function ThemeToggle() {
    const state = (() => {
        if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
          return localStorage.getItem("theme");
        }
        if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          return "dark";
        }
        return "light";
      })();
    const [theme, setTheme] = useState(state ?? "light");

    const handleClick = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
        // document.documentElement.style.backgroundImage = `url(${theme === "light" ? '/bg03.jpg' : '/bg00.jpg'})`;
    }, [theme]);

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return <div></div>; // or null;
    }


    return (
        <button onClick={handleClick}>{theme !== "light" ? "🌙" : "🌞"}</button>
    );
}