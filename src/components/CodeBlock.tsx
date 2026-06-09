import { useEffect, useMemo, useRef, useState } from "preact/hooks";

type Props = {
  code: string;
  language: string;
};

function normalizeLanguage(language: string) {
  const normalized = language.trim().toLowerCase();
  const labels: Record<string, string> = {
    bash: "shell",
    shell: "shell",
    sh: "shell",
    shellsession: "shell",
    javascript: "js",
    typescript: "ts",
    jsx: "jsx",
    tsx: "tsx",
    plaintext: "text",
    text: "text",
  };

  return labels[normalized] || normalized || "text";
}

export default function CodeBlock({ code, language }: Props) {
  const source = useMemo(() => code.trimEnd(), [code]);
  const languageLabel = useMemo(() => normalizeLanguage(language), [language]);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number>();

  useEffect(() => {
    return () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1400);
    } catch {
      setCopied(false);
    }
  };

  return (
    <figure class="code-shell" data-click-effect="off" data-motion="block">
      <div class="code-titlebar">
        <span class="code-dots" aria-hidden="true">
          <span class="code-dot red" />
          <span class="code-dot yellow" />
          <span class="code-dot green" />
        </span>
        <figcaption class="code-title">
          <span class="prompt">~/blog</span>
          <span class="command"> run snippet</span>
        </figcaption>
        <span class="code-lang">{languageLabel}</span>
        <button
          class="copy-button"
          type="button"
          aria-label={copied ? "已复制代码" : "复制代码"}
          onClick={copyToClipboard}
        >
          {copied ? "已复制" : "复制"}
        </button>
      </div>

      <div class="code-body">
        <pre>
          <code>{source}</code>
        </pre>
      </div>

      <style>{`
        .code-shell {
          margin: 1.75rem 0;
          overflow: hidden;
          border: 1px solid var(--border-default);
          border-radius: 8px;
          color: var(--text-secondary);
          background:
            linear-gradient(180deg, rgba(var(--elevated-rgb), 0.62), rgba(var(--surface-rgb), 0.86)),
            linear-gradient(90deg, rgba(var(--accent-rgb), 0.055), transparent 44%);
          box-shadow: 0 14px 34px rgba(0, 0, 0, 0.2);
        }

        .code-titlebar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-height: 2.65rem;
          padding: 0.625rem 0.875rem;
          border-bottom: 1px solid var(--border-subtle);
          background:
            linear-gradient(180deg, rgba(var(--elevated-rgb), 0.9), rgba(var(--surface-rgb), 0.7)),
            repeating-linear-gradient(90deg, transparent 0 16px, rgba(var(--accent-rgb), 0.035) 16px 17px);
          color: var(--text-muted);
        }

        .code-dots {
          display: inline-flex;
          flex-shrink: 0;
          gap: 0.375rem;
        }

        .code-dot {
          width: 0.6875rem;
          height: 0.6875rem;
          border-radius: 999px;
          background: var(--border-strong);
          box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.22);
        }

        .code-dot.red { background: var(--rose); }
        .code-dot.yellow { background: var(--accent); }
        .code-dot.green { background: var(--green); }

        .code-title {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          min-width: 0;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 0.875rem;
        }

        .prompt {
          color: var(--accent);
        }

        .command {
          color: var(--text-secondary);
        }

        .code-lang {
          flex-shrink: 0;
          padding: 0.125rem 0.5rem;
          border: 1px solid var(--border-subtle);
          border-radius: 999px;
          color: var(--cyan);
          background: rgba(var(--surface-rgb), 0.42);
          font-size: 0.75rem;
          line-height: 1.45;
        }

        .copy-button {
          flex-shrink: 0;
          padding: 0.25rem 0.625rem;
          border: 1px solid var(--border-default);
          border-radius: 999px;
          background: rgba(var(--surface-rgb), 0.58);
          color: var(--text-muted);
          cursor: pointer;
          font: inherit;
          font-size: 0.8125rem;
          line-height: 1.45;
          transition:
            color 150ms ease,
            border-color 150ms ease,
            background 150ms ease,
            transform 150ms ease;
        }

        .copy-button:hover {
          color: var(--accent);
          border-color: var(--accent-dim);
          background: rgba(var(--elevated-rgb), 0.86);
        }

        .copy-button:active {
          transform: translateY(1px);
        }

        .code-body {
          position: relative;
          overflow-x: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--border-strong) transparent;
        }

        .code-body::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(180deg, var(--accent), transparent 78%);
          opacity: 0.68;
        }

        .code-body pre {
          margin: 0 !important;
          padding: 1rem 1.125rem 1.05rem 1.35rem !important;
          border: 0 !important;
          border-radius: 0 !important;
          background: transparent !important;
          box-shadow: none !important;
          font-family: inherit !important;
          font-size: 0.9375rem !important;
          line-height: 1.7 !important;
          overflow: visible !important;
        }

        .code-body code {
          display: block;
          min-width: max-content;
          padding: 0 !important;
          border: 0 !important;
          background: transparent !important;
          color: inherit;
          font-family: inherit !important;
        }

        @media (max-width: 640px) {
          .code-titlebar {
            gap: 0.5rem;
            padding: 0.5625rem 0.75rem;
          }

          .code-title {
            font-size: 0.8125rem;
          }

          .code-lang {
            display: none;
          }

          .copy-button {
            padding: 0.25rem 0.5rem;
          }

          .code-body pre {
            padding: 0.875rem 0.875rem 0.925rem 1.05rem !important;
            font-size: 0.875rem !important;
          }
        }
      `}</style>
    </figure>
  );
}
