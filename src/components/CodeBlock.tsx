import type React from "preact/compat";
import { useEffect, useState } from "preact/compat";
import { codeToHtml } from 'shiki'

type Props = {
  code: string;
  language: string;
  children?: React.ReactNode;
}

const CodeBlock = (props: Props) => {
  const { code, language } = props;

  const [html, setHtml] = useState('');
  const [isTip, setIsTip] = useState(false);

  useEffect(() => {
    const fetchHtml = async () => {
      
      const html = await codeToHtml(code, {
        lang: language,
        theme: 'dracula',
        decorations: [
          {
            start: { line: 1, character: 0 },
            end: { line: 1, character: 11 },
            properties: { class: 'highlighted-word' },
            alwaysWrap: true
          }
        ]
      });
      setHtml(html);
    };
    fetchHtml();
  }, [code, language]); // 添加依赖项

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setIsTip(true);
      setTimeout(() => setIsTip(false), 2000);
    });
  };

  return (
    <div className="relative cursor-pointer" onClick={() => copyToClipboard(code)} >
      <button className="absolute font-thin right-5 top-2 text-sm">
        复制
      </button>
      {isTip && <span className="absolute right-5 top-10 text-sm text-green-500">已复制!</span>}
      <pre className="whitespace-pre-wrap break-words">
        <code className="whitespace-pre-wrap break-words" dangerouslySetInnerHTML={{ __html: html }}>
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;