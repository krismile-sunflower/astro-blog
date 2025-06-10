import { cn } from "@utils/style";
import { useRef, useState } from "preact/hooks";

export default function LevitationMenu() {
    const [menuText, setMenuText] = useState<string>('+');
    const [currentLink, setCurrentLink] = useState<string>("/");
    const menuRef = useRef<HTMLDivElement>(null);
    const currentUrl = () => {
        if (typeof window !== "undefined") {
            return window.location.pathname
        }
    };
    const toNav = (e: string) => {
        setCurrentLink(e);
        document.documentElement.classList.remove("animate-bg");
        const aTag = document.createElement("a");
        aTag.href = e; // 设置跳转的 URL
        aTag.textContent = "Go"; // 设置链接文本，可根据需要调整
        aTag.style.display = "none"; // 隐藏这个 <a> 标签，因为我们不需要显示它
        // 将 <a> 标签添加到 body 中（或其他元素中）
        document.body.appendChild(aTag);
        // 模拟点击 <a> 标签进行跳转
        aTag.click();
        // 可选：之后从 DOM 中移除这个 <a> 标签
        document.body.removeChild(aTag);
    };
    const handleClick = () => {
        setMenuText('x');
        const menuElement = menuRef.current;
        if (menuElement) {
            menuElement.classList.remove("hidden"); // Use remove instead of toggle if we always want to show on click
            menuElement.classList.add(
                "flex",
                "absolute",
                "top-0",
                "left-0",
                "w-full",
                "h-screen",
                "z-10",
                "shadow-lg",
                "bg-black/50" // Added semi-transparent overlay
            );

            const links = menuElement.querySelectorAll("p[v-data]"); // More specific selector
            links.forEach((link) => {
                // Remove potentially existing color/font weight classes to reset state
                link.classList.remove("text-yellow-500", "text-white", "font-bold", "text-secondary-500", "dark:text-secondary-400");

                const isSelect =  link.getAttribute("v-data") === currentUrl();
                if (isSelect) {
                    link.classList.add("text-secondary-500", "dark:text-secondary-400", "font-bold");
                }
                // Base classes are now applied directly in JSX: text-neutraltext dark:text-darktext etc.
                // link.style.textDecoration = "none"; // This should be handled by Tailwind classes if needed e.g. `no-underline`

                // Ensure event listeners are not duplicated if handleClick can be called multiple times
                // A simple way is to replace the element or manage listeners carefully.
                // For now, assuming this click handler setup is okay.
                link.addEventListener("click", () => {
                    const vData = link.getAttribute("v-data");
                    toNav(vData ?? "/");
                    menuElement.classList.add("hidden");
                });
                // 可以添加更多样式
            });
        }
    };

    const close = () => {
        setMenuText('+');
        const menuElement = menuRef.current;
        if (menuElement) {
            menuElement.classList.add("hidden");
        }
    };

    return (
        <>
            <button
                onClick={handleClick}
                class={cn("mr-4", "block sm:hidden")} // Ensure no extra spaces if not needed
            >
                {/* Trigger button: Changed bg, text color, padding. Removed inner p. */}
                <div className={"flex flex-col bg-primary-500 text-white font-bold rounded-md px-3 py-2"}>
                    {menuText}
                </div>
            </button>

            <div className={"hidden"} id="menu" ref={menuRef}>
                {/* Inner Content Div: Changed bg, width, height (via padding). Added dark mode styles. */}
                <div className={cn("flex flex-col w-32 py-2 text-sm p-2 animate-wiggle bg-neutralbg dark:bg-darkbg fixed bottom-20 right-2 rounded-md shadow-xl")}>
                    {/* Menu Links: Added base classes and cursor-pointer. JS will toggle selected state. */}
                    <p v-data="/" class="mb-2 text-center text-neutraltext dark:text-darktext hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer no-underline">首页</p>
                    <p v-data="/blog" class="mb-2 text-center text-neutraltext dark:text-darktext hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer no-underline">博客</p>
                    <p v-data="/tags" class="mb-2 text-center text-neutraltext dark:text-darktext hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer no-underline">标签</p>
                    <p v-data="/about" class="mb-2 text-center text-neutraltext dark:text-darktext hover:text-primary-500 dark:hover:text-primary-400 cursor-pointer no-underline">关于</p>
                </div>
                {/* This div is for closing the menu when clicking outside the content area */}
                <div className={"flex-grow h-full"} onClick={() => close()}></div>
            </div>
        </>
    );
}
