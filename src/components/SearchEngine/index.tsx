import { useRef, useState } from "preact/hooks";
import css from './index.module.css';
import { cn } from "@utils/style";
import baidu from '@assets/svg/baidu.svg';
import bing from '@assets/svg/bing.svg';
import google from '@assets/svg/google.svg';

const LIST = [
    {
        name: '百度',
        url: 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&rsv_idx=1&tn=baidu&wd=',
        img: baidu
    },
    {
        name: '必应',
        url: 'https://cn.bing.com/search?q=',
        img: bing
    },
    {
        name: '谷歌',
        url: 'https://www.google.com/search?q=',
        img: google
    }
]
const Index = () => {
    const ref = useRef<HTMLInputElement>(null);
    const [data, setData] = useState<{ name: string, url: string }>({ name: '必应', url: 'https://cn.bing.com/search?q=' });
    const submit = () => {
        const value = ref.current?.value;
        window.open(data.url + value);
    }
    return (
        <div className={'w-full sm:mx-[100px]'}>
            <div className={'flex justify-center items-center'}>
                <input className={cn(css.input, 'w-full')} ref={ref}
                    placeholder={'正在使用' + data.name + '搜索引'}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            submit();
                        }
                    }

                    } />
                <button className={cn(css.button, 'w-[150px] sm:w-[200px]')} type="button" onClick={submit}>{data.name + '搜索'}</button>

            </div>
            <div className={css.box}>
                {LIST.map((item) => {
                    return (
                        <div key={item.name} className={css.item} onClick={() => {
                            setData({ name: item.name, url: item.url });
                        }}>
                            <img src={item.img.src} alt={item.name} className={css.img} />
                        </div>
                    )
                })}
            </div>

        </div>
    );
}

export default Index;