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
  const lastScrollY = useRef(0);
  const lastStage = useRef(0);

  useEffect(() => {
    const scrollyEl = document.getElementById("scrolly-sections");
    if (!scrollyEl) return;

    let frame = 0;

    const tick = () => {
      const total = scrollyEl.offsetHeight - window.innerHeight;
      const scrolled = Math.max(0, -scrollyEl.getBoundingClientRect().top);
      const progress = total > 0 ? Math.min(scrolled / total, 1) : 0;

      scrollProgress.current = progress;
      scrollVelocity.current = window.scrollY - lastScrollY.current;
      lastScrollY.current = window.scrollY;

      const stage = Math.min(Math.floor(progress * STAGE_COUNT), STAGE_COUNT - 1);
      if (stage !== lastStage.current) {
        lastStage.current = stage;
        setActiveStage(stage);
      }

      frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <main
      className="relative bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white"
      data-active-stage={activeStage}
    >
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
