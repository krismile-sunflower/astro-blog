const EFFECT_SELECTOR =
  "a, button, input, textarea, select, summary, [role='button'], [data-click-effect='off']";
const SPARKS = 4;
const MIN_INTERVAL = 70;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

let layer;
let lastRun = 0;

function getLayer() {
  if (layer) return layer;

  layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  layer.style.position = "fixed";
  layer.style.inset = "0";
  layer.style.zIndex = "2147483647";
  layer.style.pointerEvents = "none";
  layer.style.overflow = "hidden";
  layer.style.contain = "strict";
  document.body.appendChild(layer);

  return layer;
}

function shouldSkip(event) {
  if (!event.isPrimary || event.button !== 0) return true;
  if (prefersReducedMotion.matches) return true;

  const target = event.target;
  if (!(target instanceof Element)) return false;
  return target.closest("[data-click-effect='off']") !== null;
}

function animateAndRemove(element, keyframes, options) {
  const animation = element.animate(keyframes, options);
  animation.finished
    .catch(() => {})
    .finally(() => element.remove());
}

function createRing(x, y) {
  const ring = document.createElement("span");
  ring.style.position = "absolute";
  ring.style.left = `${x}px`;
  ring.style.top = `${y}px`;
  ring.style.width = "12px";
  ring.style.height = "12px";
  ring.style.border = "1px solid var(--accent)";
  ring.style.borderRadius = "999px";
  ring.style.boxShadow = "0 0 18px rgba(var(--accent-rgb), 0.32)";
  ring.style.opacity = "0.72";
  ring.style.transform = "translate(-50%, -50%) scale(0.45)";
  ring.style.willChange = "transform, opacity";

  getLayer().appendChild(ring);
  animateAndRemove(
    ring,
    [
      { transform: "translate(-50%, -50%) scale(0.45)", opacity: 0.72 },
      { transform: "translate(-50%, -50%) scale(2.8)", opacity: 0 },
    ],
    { duration: 360, easing: "cubic-bezier(.22,.61,.36,1)" }
  );
}

function createSpark(x, y, index) {
  const spark = document.createElement("span");
  const angle = (Math.PI * 2 * index) / SPARKS + Math.random() * 0.28;
  const distance = 18 + Math.random() * 12;
  const size = 3 + Math.random() * 2;
  const dx = Math.cos(angle) * distance;
  const dy = Math.sin(angle) * distance;

  spark.style.position = "absolute";
  spark.style.left = `${x}px`;
  spark.style.top = `${y}px`;
  spark.style.width = `${size}px`;
  spark.style.height = `${size}px`;
  spark.style.borderRadius = "999px";
  spark.style.background = "var(--accent-soft)";
  spark.style.opacity = "0.8";
  spark.style.transform = "translate(-50%, -50%)";
  spark.style.willChange = "transform, opacity";

  getLayer().appendChild(spark);
  animateAndRemove(
    spark,
    [
      { transform: "translate(-50%, -50%) scale(1)", opacity: 0.8 },
      { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0.2)`, opacity: 0 },
    ],
    { duration: 300 + Math.random() * 120, easing: "cubic-bezier(.16,1,.3,1)" }
  );
}

document.addEventListener(
  "pointerdown",
  (event) => {
    if (shouldSkip(event)) return;

    const now = performance.now();
    if (now - lastRun < MIN_INTERVAL) return;
    lastRun = now;

    const { clientX, clientY } = event;
    const target = event.target;
    createRing(clientX, clientY);

    if (!(target instanceof Element) || !target.closest(EFFECT_SELECTOR)) {
      for (let i = 0; i < SPARKS; i += 1) {
        createSpark(clientX, clientY, i);
      }
    }
  },
  { passive: true }
);
