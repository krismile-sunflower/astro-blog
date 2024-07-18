import { cn } from "@utils/style";
import { useRef, useState } from "preact/hooks";

export default function Menu() {
  const menuRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<boolean>(true);
  const toNav = (e: string) => {       
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
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode);
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
        link.classList.add("text-2xl", "mb-4", "text-center");
        link.style.color = !isDarkMode ? "#000" : "#fff"; // 根据主题设置颜色
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
    const menuElement = menuRef.current;
    if (menuElement) {
      menuElement.classList.add("hidden");
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        class={cn("mr-4", "text-2xl block sm:hidden")}
      >
        <div className={"flex flex-col leading-none h-5 w-5"}>
          <p className={cn("p-0 leading-none h-2 w-full border-solid  border-b-2", 'border-gray-300')}></p>
          <p className={cn("p-0 leading-none h-2 w-full border-solid  border-b-2", 'border-gray-300')}></p>
          <p className={cn("p-0 leading-none h-2 w-full border-solid  border-b-2", 'border-gray-300')}></p>
        </div>
      </button>

      <div class="hidden sm:flex">
        <a href="/" data-astro-prefetch className={cn("mr-4 text-2xl ")}>
          首页
        </a>
        <a href="/blog" data-astro-prefetch className={cn("mr-4 text-2xl ")}>
          博客
        </a>
        <a href="/tags" data-astro-prefetch className={cn("mr-4 text-2xl ")}>
          标签
        </a>
        <a href="/about" data-astro-prefetch className={cn("mr-4 text-2xl ")}>
          关于
        </a>
      </div>

      <div className={"hidden"} id="menu" ref={menuRef}>
        <div className={cn("flex flex-col w-1/2 h-screen p-4 animate-wiggle", !theme ? "bg-white" : "bg-gray-800")}>
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
