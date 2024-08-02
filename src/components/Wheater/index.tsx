import { useEffect, useState } from "preact/hooks";

type Props = {
    address: string
    temperature: string
    status: string
    weather: string
    text: string
    wind: string
    humidity: string
}
const index = () => {
    const [data, setData] = useState<Props>();

    const init = () => {
        fetch('/api/wheater.json').then(res => res.json()).then(data => {
            setData(data);
        });
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <div className={'h-[100px]'}>
            <div className={'flex justify-center gap-3 items-center my-3'}>
                <div>{data?.address}</div>
                <div>{data?.temperature}</div>
                <div>{data?.status}</div>
                <div>{data?.weather}</div>

            </div>
            <div className={'flex justify-center gap-3 items-center my-3'}>
               

                <div>{data?.wind}</div>
                <div>{data?.humidity}</div>
            </div>

            <div className={'font-black text-lg'}>{data?.text}</div>
        </div>
    )
};

export default index;