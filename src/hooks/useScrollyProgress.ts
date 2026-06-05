import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";

function getScrollY() {
  return (
    window.scrollY ||
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    0
  );
}

function getScrollyEl() {
  return document.getElementById("scrolly-sections");
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("scroll", onStoreChange, { passive: true });
  window.addEventListener("wheel", onStoreChange, { passive: true });
  window.addEventListener("resize", onStoreChange);
  onStoreChange();
  return () => {
    window.removeEventListener("scroll", onStoreChange);
    window.removeEventListener("wheel", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

export function useScrollyProgress(stageCount: number) {
  const scrollyElRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef(0);
  const velocityRef = useRef(0);
  const lastScrollY = useRef(0);

  const scrollyRef = useCallback((node: HTMLDivElement | null) => {
    scrollyElRef.current = node;
  }, []);

  const activeStage = useSyncExternalStore(
    subscribe,
    () => {
      const vh = window.innerHeight || 1;
      const scrollY = getScrollY();
      return Math.min(Math.floor(scrollY / vh), stageCount - 1);
    },
    () => 0,
  );

  useEffect(() => {
    let frame = 0;

    const tick = () => {
      const scrollyEl = scrollyElRef.current ?? getScrollyEl();
      const vh = window.innerHeight || 1;
      const scrollY = getScrollY();
      const maxScroll = Math.max((scrollyEl?.offsetHeight ?? vh * stageCount) - vh, 1);

      progressRef.current = Math.min(scrollY / maxScroll, 1);
      velocityRef.current = scrollY - lastScrollY.current;
      lastScrollY.current = scrollY;

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [stageCount]);

  return { scrollyRef, activeStage, progressRef, velocityRef };
}
