import type React from "preact/compat";
import { useEffect, useState } from "preact/compat";
import { codeToHtml } from 'shiki';

// 获取当前主题
function getCurrentTheme() {
  if (typeof window !== 'undefined') {
    if (window.localStorage.getItem('theme')) {
      return window.localStorage.getItem('theme');
    }
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
  }
  return 'light';
}

type Props = {
  code: string;
  language: string;
  children?: React.ReactNode;
};

const CodeBlock = (props: Props) => {
  const { code, language } = props;
  const [html, setHtml] = useState('');
  const [isTip, setIsTip] = useState(false);
  const [theme, setTheme] = useState('light');

  // 监听主题变化
  useEffect(() => {
    const updateTheme = () => setTheme(getCurrentTheme() || 'light');
    updateTheme();
    window.addEventListener('storage', updateTheme);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    mql.addEventListener('change', updateTheme);
    // 监听 class 变化（如 ThemeToggle 切换时）
    const observer = new MutationObserver(() => {
      updateTheme();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('storage', updateTheme);
      mql.removeEventListener('change', updateTheme);
      observer.disconnect();
    };
  }, []);

  // 根据主题渲染高亮
  useEffect(() => {
    const fetchHtml = async () => {
      const html = await codeToHtml(code, {
        lang: language,
        theme: theme === 'dark' ? 'dracula' : 'github-light',
      });
      setHtml(html);
    };
    fetchHtml();
  }, [code, language, theme]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsTip(true);
      setTimeout(() => setIsTip(false), 2000);
    });
  };

  console.log('theme', theme);
  return (
    <div
      className={`relative group rounded-xl overflow-auto border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white/90 to-gray-100/80 dark:from-zinc-900/90 dark:to-zinc-800/80 shadow-lg transition-all duration-500 my-6 hover:scale-[1.01]`}
      style={{ fontSize: '1em', boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)' }}
      onClick={() => copyToClipboard(code)}
    >
      <button
        className="absolute right-5 top-2 text-xs opacity-90 group-hover:opacity-100 bg-white/90 dark:bg-zinc-800 px-3 py-1 rounded-full shadow border border-gray-300 dark:border-zinc-700 transition-all hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-zinc-700 dark:hover:text-yellow-300 text-gray-700 dark:text-gray-200 font-semibold"
        style={{ zIndex: 2 }}
        type="button"
        tabIndex={-1}
        onClick={e => { e.stopPropagation(); copyToClipboard(code); }}
      >
        <span className="inline-block align-middle mr-1">📋</span>复制
      </button>
      {isTip && (
        <span className="absolute right-5 top-10 text-xs text-green-600 dark:text-green-400 opacity-90 bg-white/90 dark:bg-zinc-900/90 px-3 py-1 rounded-full shadow border border-green-200 dark:border-green-700 transition-all" style={{ zIndex: 2 }}>已复制!</span>
      )}
      <div
        className="whitespace-pre-wrap break-words px-5 py-4 overflow-x-auto font-mono text-[0.98em] leading-relaxed selection:bg-blue-200 dark:selection:bg-blue-900/60"
        style={{ minHeight: 40 }}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
};

export default CodeBlock;