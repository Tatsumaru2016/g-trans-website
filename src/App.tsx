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
    <main className="relative min-h-screen bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      <DeepSpaceCanvas 
        scrollProgress={scrollProgress} 
        scrollVelocity={scrollVelocity}
        activeStage={activeStage}
        setActiveStage={setActiveStage}
      />
      <ScrollyOverlay activeStage={activeStage} />
    </main>
  );
}
