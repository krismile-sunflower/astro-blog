import { useEffect, useMemo, useRef, useState } from "preact/hooks";

type PFResultData = {
  url: string;
  excerpt: string;
  meta: Record<string, string>;
  filters: Record<string, string[]>;
  word_count: number;
};
type PFResult = { id: string; data: () => Promise<PFResultData> };
type PFSearch = { results: PFResult[] };
type PFModule = {
  search: (q: string) => Promise<PFSearch>;
  init?: () => Promise<void>;
  options?: (opts: Record<string, unknown>) => Promise<void>;
};

declare global {
  interface Window {
    __pagefind?: PFModule | "loading" | "error";
  }
}

type Row = {
  url: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
};

async function loadPagefind(): Promise<PFModule | null> {
  if (typeof window === "undefined") return null;
  if (window.__pagefind === "error") return null;
  if (window.__pagefind && window.__pagefind !== "loading") {
    return window.__pagefind as PFModule;
  }
  if (window.__pagefind === "loading") {
    return new Promise((resolve) => {
      const tick = () => {
        if (window.__pagefind === "loading") setTimeout(tick, 30);
        else resolve(window.__pagefind === "error" ? null : (window.__pagefind as PFModule));
      };
      tick();
    });
  }
  window.__pagefind = "loading";
  try {
    // Bypass Rollup/Vite static analysis — /pagefind/pagefind.js is generated at build time.
    const dynamicImport = new Function("u", "return import(u)") as (u: string) => Promise<PFModule>;
    const mod = await dynamicImport("/pagefind/pagefind.js");
    if (mod.init) await mod.init();
    window.__pagefind = mod;
    return mod;
  } catch (err) {
    console.warn("[search] pagefind not available — did you `npm run build` yet?", err);
    window.__pagefind = "error";
    return null;
  }
}

function toRow(url: string, data: PFResultData): Row {
  const tags = data.filters?.tag ?? [];
  return {
    url,
    title: data.meta.title ?? url,
    date: data.meta.date ?? "",
    tags,
    excerpt: data.excerpt ?? "",
  };
}

export default function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "searching" | "missing">("idle");
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const reqIdRef = useRef(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isMod = e.metaKey || e.ctrlKey;
      if (isMod && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener("keydown", onKey);
    window.addEventListener("search:open", onOpen as EventListener);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("search:open", onOpen as EventListener);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (status === "ready" || status === "missing") return;
    setStatus("loading");
    loadPagefind().then((mod) => {
      setStatus(mod ? "ready" : "missing");
    });
  }, [open]);

  useEffect(() => {
    if (open) {
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    } else {
      setQuery("");
      setRows([]);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const q = query.trim();
    if (!q) {
      setRows([]);
      return;
    }
    if (status !== "ready") return;

    const reqId = ++reqIdRef.current;
    setStatus("searching");

    (async () => {
      const mod = (window.__pagefind as PFModule) ?? null;
      if (!mod) return;
      try {
        const res = await mod.search(q);
        const top = res.results.slice(0, 12);
        const datas = await Promise.all(top.map(async (r) => ({ id: r.id, data: await r.data() })));
        if (reqId !== reqIdRef.current) return;
        const next: Row[] = datas.map((d) => toRow(d.data.url, d.data));
        setRows(next);
        setStatus("ready");
        setActive(0);
      } catch (err) {
        if (reqId !== reqIdRef.current) return;
        console.warn("[search] query failed", err);
        setRows([]);
        setStatus("ready");
      }
    })();
  }, [query, status, open]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const row = list.querySelector<HTMLElement>(`[data-row="${active}"]`);
    if (!row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < list.scrollTop) list.scrollTop = top - 4;
    else if (bottom > list.scrollTop + list.clientHeight) list.scrollTop = bottom - list.clientHeight + 4;
  }, [active, rows.length]);

  if (!open) return null;

  const go = (url: string) => {
    setOpen(false);
    window.location.href = url;
  };

  const onKeyInput = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(rows.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const row = rows[active];
      if (row) go(row.url);
    }
  };

  const meta = useMemo(() => {
    if (status === "loading") return "loading engine…";
    if (status === "missing") return "index missing";
    if (status === "searching") return "searching…";
    if (query && rows.length === 0) return "no matches";
    if (query) return `${rows.length} match${rows.length > 1 ? "es" : ""}`;
    return "pagefind ready";
  }, [status, rows.length, query]);

  return (
    <div class="sp-backdrop" onClick={() => setOpen(false)}>
      <div class="sp-panel" onClick={(e) => e.stopPropagation()}>
        <div class="sp-titlebar">
          <span class="sp-dots">
            <span class="sp-dot" />
            <span class="sp-dot" />
            <span class="sp-dot" />
          </span>
          <span class="sp-titlebar-text">search · posts</span>
          <span class="sp-titlebar-meta">{meta}</span>
        </div>

        <div class="sp-input-row">
          <span class="sp-prompt">&gt;</span>
          <input
            ref={inputRef}
            class="sp-input"
            type="text"
            value={query}
            placeholder={
              status === "missing"
                ? "构建后可用 · npm run build 生成索引"
                : "搜索文章标题、正文、标签…"
            }
            spellcheck={false}
            autocomplete="off"
            disabled={status === "missing"}
            onInput={(e) => setQuery((e.currentTarget as HTMLInputElement).value)}
            onKeyDown={onKeyInput}
          />
        </div>

        <div ref={listRef} class="sp-list">
          {status === "missing" && (
            <div class="sp-empty">
              <div class="sp-empty-head"><span class="sp-prompt-muted">!</span> pagefind index 不存在</div>
              <div class="sp-empty-line">
                <span class="sp-prompt-muted">$</span> npm run build
              </div>
              <div class="sp-empty-hint">
                build 一次生成 dist/pagefind/* 后，dev 模式也能直接搜索。
              </div>
            </div>
          )}

          {status === "loading" && (
            <div class="sp-empty">
              <span class="sp-prompt-muted">…</span> loading pagefind engine
            </div>
          )}

          {status !== "missing" && status !== "loading" && !query && (
            <div class="sp-empty sp-empty-hint">
              输入关键词开始搜索 · 索引覆盖正文 / 标题 / 标签
            </div>
          )}

          {status !== "missing" && query && rows.length === 0 && status !== "searching" && (
            <div class="sp-empty">
              <span class="sp-prompt-muted">$</span> grep -r "{query}" posts/ · 0 hits
            </div>
          )}

          {rows.map((row, i) => (
            <div
              data-row={i}
              class={`sp-row ${i === active ? "sp-row-active" : ""}`}
              onClick={() => go(row.url)}
              onMouseEnter={() => setActive(i)}
            >
              <div class="sp-row-head">
                <span class="sp-chev">↳</span>
                <span class="sp-title">{row.title}</span>
                {row.date && <span class="sp-date">{row.date}</span>}
              </div>
              {row.excerpt && (
                <div class="sp-desc" dangerouslySetInnerHTML={{ __html: row.excerpt }} />
              )}
              {row.tags.length > 0 && (
                <div class="sp-tags">
                  {row.tags.map((t) => (
                    <span class="sp-tag">#{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div class="sp-statusbar">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>

      <style>{`
        .sp-backdrop {
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(2px);
          -webkit-backdrop-filter: blur(2px);
          display: flex;
          align-items: flex-start;
          justify-content: center;
          padding: 14vh 1rem 1rem;
          animation: sp-fade 120ms ease-out;
        }
        @keyframes sp-fade { from { opacity: 0 } to { opacity: 1 } }

        .sp-panel {
          width: 100%;
          max-width: 640px;
          background: var(--surface);
          border: 1px solid var(--border-default);
          border-radius: 6px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.5);
          display: flex;
          flex-direction: column;
          max-height: 70vh;
          overflow: hidden;
          animation: sp-up 150ms ease-out;
        }
        @keyframes sp-up { from { opacity: 0; transform: translateY(-6px) } to { opacity: 1; transform: translateY(0) } }

        .sp-titlebar {
          display: flex;
          align-items: center;
          gap: 0.875rem;
          padding: 0.625rem 1rem;
          background: var(--elevated);
          border-bottom: 1px solid var(--border-default);
          font-size: 0.875rem;
          color: var(--text-muted);
          user-select: none;
        }
        .sp-dots { display: inline-flex; gap: 0.375rem; }
        .sp-dot {
          width: 11px; height: 11px; border-radius: 50%;
          background: var(--border-strong);
        }
        .sp-titlebar-text { color: var(--text-secondary); }
        .sp-titlebar-meta { margin-left: auto; color: var(--text-muted); font-size: 0.8125rem; }

        .sp-input-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .sp-prompt {
          color: var(--accent);
          font-size: 1.125rem;
          font-weight: 600;
        }
        .sp-input {
          flex: 1;
          background: transparent;
          border: 0;
          outline: 0;
          color: var(--text-primary);
          font: inherit;
          font-size: 1.0625rem;
          padding: 0;
          caret-color: var(--accent);
        }
        .sp-input::placeholder { color: var(--text-muted); }
        .sp-input:disabled { color: var(--text-muted); }

        .sp-list {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem 0;
          min-height: 8rem;
        }

        .sp-row {
          padding: 0.625rem 1rem;
          cursor: pointer;
          border-left: 2px solid transparent;
          transition: background 100ms ease, border-color 100ms ease;
        }
        .sp-row-active {
          background: var(--elevated);
          border-left-color: var(--accent);
        }
        .sp-row-head {
          display: flex;
          align-items: baseline;
          gap: 0.5rem;
          color: var(--text-primary);
          font-size: 1rem;
          font-weight: 600;
        }
        .sp-chev { color: var(--text-faint); }
        .sp-row-active .sp-chev { color: var(--accent); }
        .sp-title { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .sp-row-active .sp-title { color: var(--accent); }
        .sp-date {
          color: var(--text-muted);
          font-size: 0.8125rem;
          font-weight: 400;
        }
        .sp-desc {
          color: var(--text-muted);
          font-size: 0.875rem;
          line-height: 1.6;
          margin-top: 0.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        /* Pagefind 高亮 <mark> 标签的样式 */
        .sp-desc :global(mark) {
          background: transparent;
          color: var(--accent);
          font-weight: 600;
        }
        .sp-row-active .sp-desc :global(mark) { color: var(--accent-soft); }

        .sp-tags {
          margin-top: 0.375rem;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .sp-tag {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .sp-row-active .sp-tag { color: var(--accent-dim); }

        .sp-empty {
          padding: 1rem;
          color: var(--text-muted);
          font-size: 0.9375rem;
          text-align: left;
          line-height: 1.7;
        }
        .sp-empty-head { color: var(--accent); margin-bottom: 0.25rem; }
        .sp-empty-line { color: var(--text-secondary); margin-bottom: 0.375rem; }
        .sp-empty-hint { color: var(--text-faint); font-size: 0.875rem; }
        .sp-prompt-muted { color: var(--text-faint); margin-right: 0.5rem; }

        .sp-statusbar {
          display: flex;
          gap: 1rem;
          padding: 0.5rem 1rem;
          border-top: 1px solid var(--border-subtle);
          background: var(--bg);
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        .sp-statusbar kbd {
          display: inline-block;
          padding: 0 0.3em;
          font-family: inherit;
          font-size: 0.85em;
          background: var(--surface);
          border: 1px solid var(--border-default);
          border-radius: 2px;
          color: var(--text-secondary);
          margin-right: 0.25rem;
        }

        @media (max-width: 640px) {
          .sp-backdrop { padding: 8vh 0.75rem 0.75rem; }
          .sp-panel { max-height: 80vh; }
          .sp-statusbar { display: none; }
        }
      `}</style>
    </div>
  );
}
