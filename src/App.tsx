/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useCallback } from "react";
import DeepSpaceCanvas from "./components/DeepSpaceCanvas";
import ScrollyOverlay from "./components/ScrollyOverlay";

const STAGE_COUNT = 7;

export default function App() {
  const scrollProgress = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);
  const lastScrollY = useRef(0);

  const handleScrollUpdate = useCallback((progress: number) => {
    scrollProgress.current = progress;
    scrollVelocity.current = window.scrollY - lastScrollY.current;
    lastScrollY.current = window.scrollY;
  }, []);

  return (
    <main className="relative bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      <div id="scrolly-sections" className="relative w-full">
        {Array.from({ length: STAGE_COUNT }).map((_, i) => (
          <div key={i} className="h-screen" aria-hidden="true" />
        ))}
      </div>

      <DeepSpaceCanvas 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity}
      />

      <ScrollyOverlay onScrollUpdate={handleScrollUpdate} />
    </main>
  );
}
