import { sleep } from "@utils/common";
import { useEffect, useState } from "preact/hooks";

export default function Index() {
  const [dataList, setDataList] = useState<string[]>([]);

  const init = async () => {
    const response = await fetch("/api/home.json");
    const data = await response.json();
    console.log("🚀 ~ init ~ data:", data)
    const len = data.one.length;
    let oneStr = "";
    let twoStr = "";
    for (let i = 0; i < len; i++) {
      oneStr += data.one[i];
      twoStr += data.two[i];
      setDataList([oneStr, twoStr]);
      await sleep(250)
      
    }
    
    setDataList([data.one, data.two]);
  };
  useEffect(() => {
    document.documentElement.classList.add("animate-bg");
    init();
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
      <h1 className={"w-12 leading-relaxed italic font-bold h-[23ch]"} >
        {dataList.length > 0 && dataList[0]}
      </h1>
      <h1 className={"w-12 leading-relaxed italic font-bold h-[23ch]"} >
      {dataList.length > 0 && dataList[1]}
      </h1>
    </div>
  );
}
