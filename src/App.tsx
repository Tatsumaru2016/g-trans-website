/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Globe, RefreshCw } from "lucide-react";
import DeepSpaceCanvas from "./components/DeepSpaceCanvas";
import ScrollyOverlay from "./components/ScrollyOverlay";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [loadPercentage, setLoadPercentage] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  // High performance refs for scroll position & velocity to feed the Canvas loop directly
  // This bypasses React's diffing state updates at 60Hz.
  const scrollProgress = useRef<number>(0);
  const scrollVelocity = useRef<number>(0);

  useEffect(() => {
    let cancelled = false;
    let timeoutId = 0;
    let progress = 0;

    const tick = () => {
      if (cancelled) return;

      if (progress >= 100) {
        setLoadPercentage(100);
        timeoutId = window.setTimeout(() => {
          if (!cancelled) setLoading(false);
        }, 300);
        return;
      }

      const increment = Math.floor(Math.random() * 12) + 6;
      progress = Math.min(progress + increment, 100);
      setLoadPercentage(progress);
      timeoutId = window.setTimeout(tick, 45);
    };

    timeoutId = window.setTimeout(tick, 45);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="relative min-h-screen bg-space-black text-gray-100 selection:bg-cyan-500/30 selection:text-white">
      
      {/* 1. Cinematic Boot-loader System */}
      <AnimatePresence>
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20, filter: "blur(12px)" }}
            transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            className="fixed inset-0 w-screen h-screen bg-[#030307] z-50 flex flex-col justify-center items-center p-6 select-none"
          >
            {/* Ambient cyan back-glow */}
            <div className="absolute w-[350px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex flex-col items-center gap-6 max-w-sm w-full text-center z-10">
              
              {/* Rotating cyber gyroscope node */}
              <div className="relative flex justify-center items-center w-20 h-20">
                <motion.div 
                  className="absolute inset-0 border-2 border-dashed border-cyan-500/30 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                />
                <motion.div 
                  className="absolute w-14 h-14 border border-violet-500/50 rounded-full flex justify-center items-center"
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                >
                  <Globe className="w-5 h-5 text-cyan-400 stroke-[1.5]" />
                </motion.div>
                <div className="absolute w-2 h-2 bg-white rounded-full animate-ping" />
              </div>

              {/* Loader Header Slogan */}
              <div className="flex flex-col gap-1.5">
                <h2 className="text-sm font-display font-bold text-white tracking-[0.25em] uppercase">
                  G.trans Initializing
                </h2>
                <div className="flex items-center gap-1.5 justify-center text-[10px] text-gray-500 font-mono tracking-widest leading-none">
                  <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />
                  <span>COMMUNICATIVE MERIDIAN INJECT</span>
                </div>
              </div>

              {/* Progress Bar & percentage */}
              <div className="w-full flex flex-col gap-2.5 mt-2">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5 relative">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                    style={{ width: `${loadPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                  <span className="tracking-widest">BOOTING CORE SERVICES</span>
                  <span className="text-cyan-400 font-bold">{loadPercentage}%</span>
                </div>
              </div>

              {/* Decryption credentials */}
              <div className="text-[8px] font-mono text-gray-600 uppercase tracking-widest mt-4">
                SECURE HANDSHAKE // CLIENT ID: {String(Math.floor(Math.random() * 100000)).padStart(6, "0")}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Primary 3D WebGL deep space Canvas — mount after boot to avoid render thrashing */}
      {!loading && (
        <DeepSpaceCanvas 
          scrollProgress={scrollProgress} 
          scrollVelocity={scrollVelocity}
          activeStage={activeStage}
          setActiveStage={setActiveStage}
        />
      )}

      {/* 3. Immersive fixed HUD scrolly screen overlay */}
      {!loading && (
        <ScrollyOverlay activeStage={activeStage} />
      )}

    </main>
  );
}
