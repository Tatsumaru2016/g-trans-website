/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import DeepSpaceCanvas from "./components/DeepSpaceCanvas";
import ScrollyOverlay from "./components/ScrollyOverlay";
import { useScrollyProgress } from "./hooks/useScrollyProgress";

const STAGE_COUNT = 7;

export default function App() {
  const { scrollyRef, activeStage, progressRef, velocityRef } =
    useScrollyProgress(STAGE_COUNT);

  return (
    <main
      className="relative bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white"
      data-active-stage={activeStage}
    >
      <div id="scrolly-sections" ref={scrollyRef} className="relative w-full">
        {Array.from({ length: STAGE_COUNT }).map((_, i) => (
          <div key={i} className="h-screen" aria-hidden="true" />
        ))}
      </div>

      <DeepSpaceCanvas scrollProgress={progressRef} scrollVelocity={velocityRef} />

      <ScrollyOverlay activeStage={activeStage} />
    </main>
  );
}
