import { useEffect, useState } from "preact/hooks";
import css from "./index.module.css";
import { cn } from "@utils/style";
import SearchEngine from "@components/SearchEngine";
// 创建一个格式化日期的函数
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(date);
};

const formatTime = (date: Date) => {
  return new Intl.DateTimeFormat("zh-CN", {
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(date);
};

export default function Index() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 清除定时器
    return () => clearTimeout(timer);
  }, [currentTime]);

  return (
    <div className={'h-full w-full'}>

      <div>
        {/* Desktop Layout */}
        <div
          className={
            "hidden sm:flex max-w-4xl mx-auto mt-20"  // Changed w-[800px] to max-w-4xl mx-auto, mt-[100px] to mt-20
          }
        >
          <div className={"flex justify-center items-center w-full"}> {/* Added w-full for flex children to work as expected */}
            <div className={'font-bold w-3/5 pr-6 text-center'}> {/* Changed w-[600px] to w-3/5 pr-6 */}
              <h1>krismile🥤</h1>
              <div className={cn('text-xl text-center py-3')}>
                <p>今日江头两三春，</p>
                <p>可怜和叶度残春。</p>
              </div>

            </div>
            <div className={'w-2/5 pl-6 text-center'}> {/* Changed w-[500px] pl-[100px] to w-2/5 pl-6 */}
              <h1 className={'font-bold'}>{formatTime(currentTime)}</h1>
              <div className={'font-bold'}>{formatDate(currentTime)}</div>
              {/* Removed pl-[100px], added justify-center. text-blue-600 is likely overridden. */}
              <div className={'flex flex-wrap gap-5 justify-center'}>
                <a href="/" data-astro-prefetch className={cn("text-2xl ", css['box-border'])}>
                  首页
                </a>
                <a href="/blog" data-astro-prefetch className={cn("text-2xl ", css['box-border'])}>
                  博客
                </a>
                <a href="/tags" data-astro-prefetch className={cn("text-2xl ", css['box-border'])}>
                  标签
                </a>
                <a href="/about" data-astro-prefetch className={cn("text-2xl ", css['box-border'])}>
                  关于
                </a>
              </div>
            </div>
          </div>

        </div>

        <div className={'hidden sm:flex justify-center items-center mt-10'}>
          <SearchEngine />
        </div>


        {/* 移动端样式 */}
        <div className={"flex flex-col sm:hidden pt-16"}> {/* Added pt-16 */}

          <div className={'flex flex-col justify-center items-center'}>
            <h1 className={'font-bold mb-6'}>{formatTime(currentTime)}</h1> {/* Added mb-6 */}
            <div className={'font-bold mb-8'}>{formatDate(currentTime)}</div> {/* Added mb-8 */}
            <div className={'flex justify-center items-center mt-8'}> {/* Changed mt-10 to mt-8 */}
              <SearchEngine />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
