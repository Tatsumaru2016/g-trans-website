/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from "react";
import DeepSpaceCanvas from "./components/DeepSpaceCanvas";
import ScrollyOverlay from "./components/ScrollyOverlay";

const STAGE_COUNT = 7;

export default function App() {
  const [activeStage, setActiveStage] = useState(0);
  const scrollProgress = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);

  useEffect(() => {
    const bindScroll = () => {
      const scrollyEl = document.getElementById("scrolly-sections");
      if (!scrollyEl) return null;

      let lastY = window.scrollY;
      let lastTime = performance.now();

      const updateScroll = () => {
        const total = scrollyEl.offsetHeight - window.innerHeight;
        const scrolled = Math.max(0, -scrollyEl.getBoundingClientRect().top);
        const progress = total > 0 ? Math.min(scrolled / total, 1) : 0;

        scrollProgress.current = progress;
        setActiveStage(Math.min(Math.floor(progress * STAGE_COUNT), STAGE_COUNT - 1));

        const now = performance.now();
        const dt = now - lastTime;
        if (dt > 0) {
          scrollVelocity.current = ((window.scrollY - lastY) / dt) * 1000 / 3500;
        }
        lastY = window.scrollY;
        lastTime = now;
      };

      window.addEventListener("scroll", updateScroll, { passive: true });
      window.addEventListener("resize", updateScroll);
      updateScroll();

      return () => {
        window.removeEventListener("scroll", updateScroll);
        window.removeEventListener("resize", updateScroll);
      };
    };

    let cleanup = bindScroll();
    if (!cleanup) {
      const frame = requestAnimationFrame(() => {
        cleanup = bindScroll();
      });
      return () => {
        cancelAnimationFrame(frame);
        cleanup?.();
      };
    }

    return cleanup;
  }, []);

  return (
    <main className="relative bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      <DeepSpaceCanvas 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity}
      />

      <div id="scrolly-sections" className="relative w-full">
        {Array.from({ length: STAGE_COUNT }).map((_, i) => (
          <div key={i} className="h-screen" aria-hidden="true" />
        ))}
      </div>

      <ScrollyOverlay activeStage={activeStage} />
    </main>
  );
}
