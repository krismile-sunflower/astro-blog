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
    console.log("🚀 ~ LevitationMenu ~ currentUrl:", currentUrl(), '/about' === currentUrl())
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
        // setTheme(!isDarkMode ? "bg-white" : "bg-gray-800");
        const menuElement = menuRef.current;
        if (menuElement) {
            menuElement.classList.toggle("hidden");

            menuElement.classList.add(
                "flex",
                "absolute",
                "top-0",
                "left-0",
                "w-full",
                "h-screen",
                "z-10",
                "shadow-lg"
            );

            const links = menuElement.querySelectorAll("p");
            links.forEach((link) => {
                const isSelect =  link.getAttribute("v-data") === currentUrl();
                link.classList.add("mb-4", "text-center", isSelect ? "text-yellow-500" : "text-white");
                link.style.textDecoration = "none"; // 示例：移除下划线
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
                class={cn("mr-4", " block sm:hidden")}
            >
                <div className={"flex flex-col px-2 bg-white rounded-md font-bold"}>
                    <p className={'text-black'}>{menuText}</p>
                </div>
            </button>

            <div className={"hidden"} id="menu" ref={menuRef}>
                <div className={cn("flex flex-col w-16 h-[150px] text-sm p-4 animate-wiggle bg-blue-400 fixed bottom-20 right-0 rounded")}>
                    <p v-data="/">首页</p>
                    <p v-data="/blog">博客</p>
                    <p v-data="/tags">标签</p>
                    <p v-data="/about">关于</p>
                </div>
                <div className={"w-1/2"} onClick={() => close()}></div>
            </div>
        </>
    );
}
