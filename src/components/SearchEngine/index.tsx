


const SearchEngine = () => {
    const searchList = [
        { name: 'Google', url: 'http://www.google.com/search', keyword: 'q' },
        { name: 'Baidu', url: 'http://www.baidu.com/baidu', keyword: 'word' },
    ]

    const svg = <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-arrow" data-v-2cf048fe=""><path d="M12.3458 5.84433C12.487 5.6224 12.3276 5.33203 12.0646 5.33203L3.94569 5.33203C3.68266 5.33203 3.52322 5.6224 3.66446 5.84433L7.72389 11.2235C7.85489 11.4293 8.15536 11.4293 8.28636 11.2235L12.3458 5.84433Z"></path></svg>;

    return (
        <div>
            <button>xx</button>
            <div className={'flex flex-col'}>
                {searchList.map((item, index) => {
                    return <button key={index} className={'bg-slate-900 px-3 py-3'}>
                        {item.name}
                    </button>
                })}
            </div>
            {/* <select id="mounth" className={'bg-slate-900 px-5 py-3'}>
                {searchList.map((item, index) => {
                    return <option key={index} value={item.name}>
                        {item.name}
                    </option>
                })}
            </select> */}

            {/* {searchList.map((item, index) => {
                return <div key={index}>
                    <span>{item.name}</span>
                    <form action={item.url} target="_blank">
                        <select id="mounth" className={'bg-slate-900'}>
                            <option value="hide">-- Month --</option>
                            <option value="january">January</option>
                        </select>
                        <input name={item.keyword} type="text" className={'bg-slate-500'} /> <input value={item.name} type="submit" />
                    </form>
                </div>
            })} */}
        </div>
    );
};

export default SearchEngine;