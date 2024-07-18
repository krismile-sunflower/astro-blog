import { useEffect } from "preact/hooks";

export default function Home() {
  useEffect(() => {
    document.documentElement.classList.add("animate-bg");
  }, []);
  const handle = () => {
    document.documentElement.classList.remove("animate-bg");

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

    toNav("/blog");
  };
  
  return (
    <div
      className={
        "flex items-center justify-center h-full cursor-pointer gap-5"
      }
      onClick={() => handle()}
    >
      <h1 className={"w-12 leading-relaxed italic font-bold"} style={{ fontFamily: "'Kalam', cursive"}}>今日江头两三树</h1>
      <h1 className={"w-12 leading-relaxed italic font-bold"} style={{ fontFamily: "'Kalam', cursive"}}>可怜和叶度残春</h1>
    </div>
  );
}
