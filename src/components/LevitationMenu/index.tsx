import { gsap } from "gsap";
import { useEffect, useRef, useState } from "preact/hooks";

const items = [
  { label: "home",  href: "/" },
  { label: "blog",  href: "/blog" },
  { label: "tags",  href: "/tags" },
  { label: "about", href: "/about" },
];

export default function LevitationMenu() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string>("/");
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setCurrent(window.location.pathname);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    const links = panel?.querySelectorAll(".panel-link");
    if (!panel || !backdrop) return;
    if (reduce) {
      gsap.set([backdrop, panel, ...(links ? Array.from(links) : [])], {
        autoAlpha: 1,
        clearProps: "transform,opacity,visibility",
      });
      return;
    }
    gsap.timeline({ defaults: { ease: "power3.out" } })
      .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.16 }, 0)
      .fromTo(panel, { autoAlpha: 0, y: 14, scale: 0.96 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.24 }, 0)
      .fromTo(links ?? [], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.2, stagger: 0.035 }, 0.08);
  }, [open]);

  function closeMenu() {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (reduce || !panel || !backdrop) {
      setOpen(false);
      return;
    }
    gsap.timeline({ onComplete: () => setOpen(false) })
      .to(panel, { autoAlpha: 0, y: 10, scale: 0.97, duration: 0.16, ease: "power2.in" }, 0)
      .to(backdrop, { autoAlpha: 0, duration: 0.16, ease: "power2.out" }, 0);
  }

  return (
    <>
      <button
        class={`fab ${open ? "fab-open" : ""}`}
        onClick={() => open ? closeMenu() : setOpen(true)}
        aria-label={open ? "close menu" : "open menu"}
        aria-expanded={open}
      >
        <span class="fab-bracket">[</span>
        <span class="fab-char">{open ? "x" : "+"}</span>
        <span class="fab-bracket">]</span>
      </button>

      {open && (
        <>
          <div class="backdrop" ref={backdropRef} onClick={closeMenu} />
          <div class="panel" ref={panelRef}>
            <div class="panel-title">
              <span class="prompt">$</span> cd
            </div>
            <ul class="panel-list">
              {items.map((it) => (
                <li>
                  <a
                    href={it.href}
                    class={`panel-link ${current === it.href ? "active" : ""}`}
                  >
                    <span class="bracket">[</span>
                    <span class="label">{it.label}</span>
                    <span class="bracket">]</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}

      <style>{`
        .fab {
          font-family: inherit;
          background: var(--surface);
          color: var(--accent);
          border: 1px solid var(--border-default);
          border-radius: 2px;
          padding: 0.5rem 0.875rem;
          font-size: 1rem;
          cursor: pointer;
          letter-spacing: 0;
          transition: border-color 150ms ease, background 150ms ease;
        }
        .fab:hover, .fab-open {
          border-color: var(--accent-dim);
          background: var(--elevated);
        }
        .fab-bracket { color: var(--text-faint); }
        .fab-open .fab-bracket { color: var(--accent-dim); }
        .fab-char { margin: 0 0.125rem; }

        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 40;
        }
        .panel {
          position: fixed;
          right: 1rem;
          bottom: 4.5rem;
          z-index: 50;
          min-width: 12rem;
          background: var(--surface);
          border: 1px solid var(--border-default);
          border-radius: 4px;
          padding: 0.5rem 0;
        }
        .panel-title {
          padding: 0.375rem 0.875rem 0.5rem;
          font-size: 0.8125rem;
          color: var(--text-muted);
          border-bottom: 1px dashed var(--border-subtle);
        }
        .prompt { color: var(--accent); margin-right: 0.375rem; }

        .panel-list {
          list-style: none;
          margin: 0;
          padding: 0.5rem 0 0;
        }
        .panel-list li { margin: 0; }
        .panel-link {
          display: block;
          padding: 0.5rem 0.875rem;
          font-size: 0.9375rem;
          color: var(--text-secondary);
          transition: color 120ms ease, background 120ms ease;
        }
        .panel-link:hover {
          color: var(--accent);
          background: var(--elevated);
        }
        .panel-link.active {
          color: var(--accent);
        }
        .panel-link .bracket { color: var(--text-faint); }
        .panel-link:hover .bracket,
        .panel-link.active .bracket { color: var(--accent-dim); }
        .panel-link .label { margin: 0 0.25rem; }
      `}</style>
    </>
  );
}
