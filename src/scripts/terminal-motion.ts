import { gsap } from "gsap";

let motionContext: ReturnType<typeof gsap.matchMedia> | null = null;
let hoverController: AbortController | null = null;
let bootFrame = 0;
let bootedKey = "";

const select = <T extends Element>(selector: string) =>
  Array.from(document.querySelectorAll<T>(selector));

function resetMotion() {
  if (bootFrame) {
    cancelAnimationFrame(bootFrame);
    bootFrame = 0;
  }
  motionContext?.revert();
  motionContext = null;
  hoverController?.abort();
  hoverController = null;
}

function scheduleTerminalMotion() {
  const key = `${location.pathname}${location.search}${location.hash}`;

  if (bootFrame) cancelAnimationFrame(bootFrame);
  bootFrame = requestAnimationFrame(() => {
    bootFrame = 0;
    if (bootedKey === key) return;
    bootedKey = key;
    bootTerminalMotion();
  });
}

function bootTerminalMotion() {
  resetMotion();

  const scope = document.querySelector("[data-motion-root]");
  if (!scope) return;

  const shell = select<HTMLElement>("[data-motion='shell']");
  const panels = select<HTMLElement>("[data-motion='panel']");
  const blocks = select<HTMLElement>("[data-motion='block']");
  const rows = select<HTMLElement>("[data-motion='row']");
  const chips = select<HTMLElement>("[data-motion='chip']");
  const glow = select<HTMLElement>("[data-motion='glow']");
  const hoverables = select<HTMLElement>("[data-motion-hover]");

  motionContext = gsap.matchMedia();
  motionContext.add(
    {
      reduce: "(prefers-reduced-motion: reduce)",
      desktop: "(min-width: 768px)",
    },
    (context) => {
      const { reduce } = context.conditions ?? {};
      const animated = [...shell, ...panels, ...blocks, ...rows, ...chips, ...glow];

      if (reduce) {
        gsap.set(animated, {
          autoAlpha: 1,
          clearProps: "transform,opacity,visibility",
        });
        return;
      }

      const tl = gsap.timeline({
        defaults: { duration: 0.62, ease: "power3.out" },
      });

      if (shell.length) {
        tl.fromTo(
          shell,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, stagger: 0.035 }
        );
      }

      if (panels.length) {
        tl.fromTo(
          panels,
          { autoAlpha: 0, y: 10 },
          { autoAlpha: 1, y: 0, stagger: 0.08 },
          shell.length ? "-=0.42" : 0
        );
      }

      if (blocks.length) {
        tl.fromTo(
          blocks,
          { autoAlpha: 0, y: 8 },
          { autoAlpha: 1, y: 0, stagger: 0.075 },
          "-=0.36"
        );
      }

      if (rows.length) {
        tl.fromTo(
          rows,
          { autoAlpha: 0, y: 6 },
          { autoAlpha: 1, y: 0, stagger: { each: 0.035, from: "start" } },
          "-=0.35"
        );
      }

      if (chips.length) {
        tl.fromTo(
          chips,
          { autoAlpha: 0, y: 8, scale: 0.97 },
          { autoAlpha: 1, y: 0, scale: 1, stagger: 0.04 },
          "-=0.28"
        );
      }

      if (glow.length) {
        gsap.fromTo(
          glow,
          { autoAlpha: 0.45, scale: 0.96 },
          {
            autoAlpha: 1,
            scale: 1,
            duration: 1.8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }
        );
      }

      hoverController = new AbortController();
      hoverables.forEach((el) => {
        el.addEventListener(
          "mouseenter",
          () => gsap.to(el, { y: -3, scale: 1.006, duration: 0.2, ease: "power2.out", overwrite: "auto" }),
          { signal: hoverController?.signal }
        );
        el.addEventListener(
          "mouseleave",
          () => gsap.to(el, { y: 0, scale: 1, duration: 0.24, ease: "power2.out", overwrite: "auto" }),
          { signal: hoverController?.signal }
        );
      });
    }
  );
}

document.addEventListener("astro:before-swap", resetMotion);
document.addEventListener("astro:before-swap", () => {
  bootedKey = "";
});
document.addEventListener("astro:page-load", scheduleTerminalMotion);

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", scheduleTerminalMotion, { once: true });
} else {
  scheduleTerminalMotion();
}
