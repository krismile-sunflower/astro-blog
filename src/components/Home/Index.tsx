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
    <div className={'w-full pt-20 pb-8'}>
      <div className="glass cyber-border rounded-3xl p-8 md:p-12 max-w-5xl mx-auto float-animation scan-line relative overflow-hidden">
        {/* 添加网格背景 */}
        <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none"></div>

        {/* Desktop Layout */}
        <div className="hidden sm:flex relative z-10">
          <div className="flex justify-center items-center w-full">
            <div className={'font-heading w-3/5 pr-6 text-center'}>
              <h1 className="text-7xl font-bold gradient-text mb-6 neon-text">krismile🥤</h1>
              <div className={cn('text-xl text-center py-6 text-gray-300 dark:text-gray-200')}>
                <p className="mb-2 font-tech tracking-wider">今日江头两三春，</p>
                <p className="font-tech tracking-wider">可怜和叶度残春。</p>
              </div>
            </div>
            <div className={'w-2/5 pl-6 text-center'}>
              <div className={cn('font-tech text-3xl mb-4 pulse-glow rounded-xl p-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white cyber-border')}>{formatTime(currentTime)}</div>
              <div className={'font-heading font-bold text-lg mb-6 text-gray-300 dark:text-gray-200'}>{formatDate(currentTime)}</div>
              <div className={'flex flex-wrap gap-4 justify-center'}>
                <a href="/" data-astro-prefetch className={cn("text-xl font-heading hover:text-blue-400 transition-colors", css['tech-link'])}>
                  首页
                </a>
                <a href="/blog" data-astro-prefetch className={cn("text-xl font-heading hover:text-purple-400 transition-colors", css['tech-link'])}>
                  博客
                </a>
                <a href="/tags" data-astro-prefetch className={cn("text-xl font-heading hover:text-pink-400 transition-colors", css['tech-link'])}>
                  标签
                </a>
                <a href="/about" data-astro-prefetch className={cn("text-xl font-heading hover:text-cyan-400 transition-colors", css['tech-link'])}>
                  关于
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={'hidden sm:flex justify-center items-center mt-10 relative z-10'}>
          <SearchEngine />
        </div>

        {/* 移动端样式 */}
        <div className={"flex flex-col sm:hidden relative z-10"}>
          <div className={'flex flex-col justify-center items-center'}>
            <h1 className={'text-6xl font-heading font-bold gradient-text mb-6 neon-text'}>krismile🥤</h1>
            <div className={cn('font-tech text-2xl mb-4 pulse-glow rounded-xl p-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white cyber-border')}>{formatTime(currentTime)}</div>
            <div className={'font-heading font-bold text-lg mb-6 text-gray-300 dark:text-gray-200'}>{formatDate(currentTime)}</div>
            <div className={'flex justify-center items-center mb-8'}>
              <SearchEngine />
            </div>
            <div className={'text-lg text-gray-300 dark:text-gray-200 text-center mb-8'}>
              <p className="mb-2 font-tech tracking-wider">今日江头两三春，</p>
              <p className="font-tech tracking-wider">可怜和叶度残春。</p>
            </div>
            <div className={'flex flex-col gap-4 w-full max-w-xs'}>
              <a href="/" data-astro-prefetch className={cn("text-lg text-center font-heading hover:text-blue-400 transition-colors", css['tech-link-mobile'])}>
                首页
              </a>
              <a href="/blog" data-astro-prefetch className={cn("text-lg text-center font-heading hover:text-purple-400 transition-colors", css['tech-link-mobile'])}>
                博客
              </a>
              <a href="/tags" data-astro-prefetch className={cn("text-lg text-center font-heading hover:text-pink-400 transition-colors", css['tech-link-mobile'])}>
                标签
              </a>
              <a href="/about" data-astro-prefetch className={cn("text-lg text-center font-heading hover:text-cyan-400 transition-colors", css['tech-link-mobile'])}>
                关于
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
