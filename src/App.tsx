/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState } from "react";
import DeepSpaceCanvas from "./components/DeepSpaceCanvas";
import ScrollyOverlay from "./components/ScrollyOverlay";

export default function App() {
  const [activeStage, setActiveStage] = useState(0);
  const scrollProgress = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);

  return (
    <main className="relative bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      <DeepSpaceCanvas 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity}
        activeStage={activeStage}
        setActiveStage={setActiveStage}
      />

      {/* 700vh scroll span — must stay in document flow (not absolute/fixed) */}
      <div id="scrolly-sections" className="relative w-full">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="h-screen" aria-hidden="true" />
        ))}
      </div>

      <ScrollyOverlay activeStage={activeStage} />
    </main>
  );
}
