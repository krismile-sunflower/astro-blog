import { useEffect, useState } from "preact/hooks";
import css from "./index.module.css";
import { cn } from "@utils/style";
import LevitationMenu from "@components/LevitationMenu";
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
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      console.log("🚀 ~ useEffect ~ geolocation:", navigator.geolocation)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 清除定时器
    return () => clearTimeout(timer);
  }, [currentTime]);

  const password = import.meta.env.PUBLIC_SECRET_PASSWORD;

  return (
    <div className={'h-full w-full'}>

      <div>
        <div
          className={
            "hidden sm:flex w-[1000px] mt-[100px]"
          }
        >
          <div className={"flex justify-center items-center "}>
            <div className={'font-bold w-[500px] text-center'}>
              <h1>krismile🥤</h1>
              <div className={cn('text-xl text-center py-3')}>
                <p>今日江头两三春，</p>
                <p>可怜和叶度残春。</p>
              </div>
            </div>
            <div className={'w-[500px] pl-[100px] text-center'}>
              <h1 className={'font-bold'}>{formatTime(currentTime)}</h1>
              <div className={'font-bold'}>{formatDate(currentTime)}</div>
              <div className={'flex flex-wrap gap-5 pl-[100px] text-blue-600'}>
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
        <div className={"flex flex-col sm:hidden"}>

          <div className={'flex flex-col justify-center items-center'}>
            <h1 className={'font-bold'}>{formatTime(currentTime)}</h1>
            <div className={'font-bold'}>{formatDate(currentTime)}</div>
            <div className={'flex justify-center items-center mt-10'}>
              <SearchEngine />
            </div>
          </div>

          {/* <div>
          {location?.latitude} / {location?.longitude}
          <p>{password}</p>
        </div> */}



        </div>



      </div>




    </div>
  );
}
