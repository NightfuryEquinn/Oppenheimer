import { useEffect, useRef } from "react";

const EASE = 0.085;
const WHEEL_MULTIPLIER = 1;
const SETTLE_THRESHOLD = 0.5;

function getMaxScroll() {
  return document.documentElement.scrollHeight - window.innerHeight;
}

export function useSmoothScroll(enabled: boolean) {
  const targetRef = useRef(0);
  const currentRef = useRef(0);
  const frameRef = useRef<number | null>(null);
  const syncingRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    targetRef.current = window.scrollY;
    currentRef.current = window.scrollY;

    const tick = () => {
      const diff = targetRef.current - currentRef.current;

      if (Math.abs(diff) < SETTLE_THRESHOLD) {
        currentRef.current = targetRef.current;
        frameRef.current = null;
        return;
      }

      currentRef.current += diff * EASE;
      syncingRef.current = true;
      window.scrollTo({ top: currentRef.current, behavior: "instant" });
      frameRef.current = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      if (frameRef.current === null) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const maxScroll = getMaxScroll();
      targetRef.current = Math.min(maxScroll, Math.max(0, targetRef.current + event.deltaY * WHEEL_MULTIPLIER));
      requestTick();
    };

    const onScroll = () => {
      if (syncingRef.current) {
        syncingRef.current = false;
        return;
      }
      // External scroll (scrollbar drag, keyboard, anchor links) — resync target.
      targetRef.current = window.scrollY;
      currentRef.current = window.scrollY;
    };

    const onResize = () => {
      const maxScroll = getMaxScroll();
      targetRef.current = Math.min(targetRef.current, maxScroll);
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [enabled]);
}
