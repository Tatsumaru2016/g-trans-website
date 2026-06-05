import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { 
  Globe, 
  MessageSquare, 
  ShieldAlert, 
  Sparkles, 
  Orbit, 
  Zap, 
  Activity, 
  Compass, 
  ChevronDown 
} from "lucide-react";

interface ScrollyOverlayProps {
  activeStage: number;
}

interface StageDetail {
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  metric: string;
  badge: string;
}

const STAGE_DETAILS: StageDetail[] = [
  {
    title: "COSMIC CORE",
    subtitle: "Dissolving Barriers. Connecting Worlds.",
    description: "G.trans centers global speech, linking remote lands and diverse languages through a unified, live digital meridian.",
    icon: Globe,
    metric: "LATENCY: 0.05ms",
    badge: "STAGE 01 // ORBITAL INITIALIZATION"
  },
  {
    title: "UBIQUITOUS CHATS",
    subtitle: "Discord & Telegram Interactive Stream.",
    description: "Holographic panels decode user chats and workspace feeds instantly on the fly. Communicate across platforms with zero friction.",
    icon: MessageSquare,
    metric: "THROUGHPUT: 4.8 GB/s",
    badge: "STAGE 02 // CHAT CONSTELLATION"
  },
  {
    title: "NEBULA DECRYPTION",
    subtitle: "Linguistic Fog Blasted Clean.",
    description: "Where confusion gathers into dense physical barriers, G.trans fires a cognitive pulse, dispersing the nebula cloud instantly.",
    icon: ShieldAlert,
    metric: "PULSE AMP: 980 TeV",
    badge: "STAGE 03 // BARRIER DISSOLUTION"
  },
  {
    title: "COHESIVE SYNERGY",
    subtitle: "Unifying Diverse Cultural Nodes.",
    description: "Different cultures align, dynamically adapting their distinct starting frequencies into a single, highly integrated cyan resonance.",
    icon: Sparkles,
    metric: "CONGRUENCY: 99.8%",
    badge: "STAGE 04 // HARMONIC MERGE"
  },
  {
    title: "INTERSTELLAR NEXUS",
    subtitle: "Connecting Cities to Space Colonies.",
    description: "Scaling past geographical boundaries. High-capacity interstellar Bézier pipelines span across outer space to support Mars-to-Earth linkups.",
    icon: Orbit,
    metric: "RANGE: 1.5 AU",
    badge: "STAGE 05 // SYSTEM EXPANSION"
  },
  {
    title: "WARP TRANSMISSION",
    subtitle: "Absolute Intelligence Speeds.",
    description: "Information streams speed across millions of neural coordinate lines at relativistic warp speeds, creating hyper-kinetic star-trails.",
    icon: Zap,
    metric: "DATA SPEED: c_1.",
    badge: "STAGE 06 // RELATIVISTIC JUMP"
  },
  {
    title: "EVERYTHING CONNECTS",
    subtitle: "The Ultimate Coherent Singularity.",
    description: "The complete Torus Ring coalesce, forming a secure cognitive ring around the Earth. Language differences are permanently obsolete.",
    icon: Compass,
    metric: "STATUS: UNIFIED",
    badge: "STAGE 07 // GRAND HARMONY REACHED"
  }
];

export default function ScrollyOverlay({ activeStage }: ScrollyOverlayProps) {
  const currentDetails = STAGE_DETAILS[activeStage] || STAGE_DETAILS[0];
  const IconComponent = currentDetails.icon;

  // Telemetry status variables
  const [telemetryNodes, setTelemetryNodes] = useState(148041);
  const [systemSync, setSystemSync] = useState(82.4);

  useEffect(() => {
    // Generate organic cyber fluctuation
    const timer = setInterval(() => {
      setTelemetryNodes(prev => prev + Math.floor(Math.random() * 5) - 2);
      setSystemSync(prev => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Number(Math.min(Math.max(prev + delta, 80.0), 100.0).toFixed(2));
      });
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute top-0 left-0 w-full text-white pointer-events-none">
      
      {/* ========================================================
          700vh SCROLL SPAN TRIGGERS (These drive standard web scrolling)
          ======================================================== */}
      <div id="scrolly-sections" className="w-full relative pointer-events-auto">
        <div className="h-[100vh]" /> {/* Trigger 1 */}
        <div className="h-[100vh]" /> {/* Trigger 2 */}
        <div className="h-[100vh]" /> {/* Trigger 3 */}
        <div className="h-[100vh]" /> {/* Trigger 4 */}
        <div className="h-[100vh]" /> {/* Trigger 5 */}
        <div className="h-[100vh]" /> {/* Trigger 6 */}
        <div className="h-[100vh]" /> {/* Trigger 7 */}
      </div>

      {/* ========================================================
          FIXED COCKPIT HUD (Sits on top of the 3D Canvas)
          ======================================================== */}
      <div className="fixed inset-0 w-screen h-screen pointer-events-none flex flex-col justify-between p-6 md:p-8 select-none z-10">
        
        {/* HUD Top bar */}
        <div className="flex justify-between items-start pointer-events-auto">
          {/* Logo & title */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-neon-cyan animate-pulse rounded-sm"></span>
              <h1 className="text-xl font-display font-bold tracking-wider text-glow-cyan text-white">
                G.trans
              </h1>
              <span className="text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/60 px-1.5 py-0.5 rounded-md font-mono">
                BETA v4.0.1
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
              COGNITIVE FREQUENCY TRACER
            </p>
          </div>

          {/* Core Server Stats HUD panels */}
          <div className="hidden md:flex gap-6 text-right items-center text-xs font-mono">
            <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider">ACTIVE HARMONIC HUB</span>
              <span className="text-white text-glow-cyan">GEN-X CONNECTED</span>
            </div>
            
            <div className="h-6 w-px bg-white/10" />

            <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider">HARMONIZATION RATE</span>
              <span className="text-cyan-400 font-bold">{systemSync}%</span>
            </div>

            <div className="h-6 w-px bg-white/10" />

            <div className="flex flex-col">
              <span className="text-gray-500 text-[9px] uppercase tracking-wider">SECURE SESSIONS</span>
              <span className="text-violet-400 font-bold">{telemetryNodes.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* HUD Middle Area: Scrolly stories container */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 w-full max-w-7xl mx-auto mb-6 md:mb-12 pointer-events-auto">
          
          {/* Dynamic Story Display */}
          <div className="w-full md:w-[480px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 35 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -25 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-panel p-6 md:p-8 rounded-2xl flex flex-col gap-4 border-l-4 border-l-cyan-400 relative overflow-hidden"
              >
                {/* Visual glow particle in card backdrop */}
                <span className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 blur-3xl rounded-full" />

                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-widest uppercase bg-cyan-950/40 py-1 px-2.5 rounded-full border border-cyan-900/50 self-start">
                    {currentDetails.badge}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <IconComponent className="w-7 h-7 text-cyan-400 stroke-[1.5]" />
                    <h2 className="text-2xl md:text-3xl font-display font-semibold tracking-tight text-white uppercase">
                      {currentDetails.title}
                    </h2>
                  </div>
                  <h3 className="text-sm font-semibold text-violet-400/90 tracking-wide mt-1 font-mono">
                    {currentDetails.subtitle}
                  </h3>
                </div>

                <p className="text-gray-400 text-xs md:text-sm leading-relaxed tracking-wide font-sans border-t border-white/5 pt-3">
                  {currentDetails.description}
                </p>

                <div className="flex justify-between items-center text-[11px] font-mono bg-space-black/40 p-2.5 rounded-lg border border-white/5 mt-1">
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Activity className="w-3.5 h-3.5 text-violet-500 animate-pulse" />
                    <span>METRIC STATUS</span>
                  </div>
                  <span className="text-white font-bold">{currentDetails.metric}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* HUD Right Panel: Orbit / Progress Indicator */}
          <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-4 w-full md:w-auto">
            
            {/* Visual Steps Navigator Tracker */}
            <div className="flex md:flex-col gap-2 rounded-xl bg-space-black/60 border border-white/5 p-3 self-center md:self-end">
              {STAGE_DETAILS.map((stage, idx) => {
                const isActive = idx === activeStage;
                return (
                  <div 
                    key={idx} 
                    className="flex items-center gap-3 px-3 py-1.5 rounded-lg transition-colors duration-300"
                    style={{
                      backgroundColor: isActive ? "rgba(0, 255, 255, 0.08)" : "transparent"
                    }}
                  >
                    <div 
                      className="w-1.5 h-1.5 rounded-full transition-all duration-300"
                      style={{
                        backgroundColor: isActive ? "#00ffff" : "rgba(255, 255, 255, 0.2)",
                        boxShadow: isActive ? "0 0 8px #00ffff" : "none"
                      }}
                    />
                    <span 
                      className="hidden lg:inline text-[9px] font-mono tracking-widest"
                      style={{
                        color: isActive ? "#ffffff" : "#697280",
                        fontWeight: isActive ? "bold" : "normal"
                      }}
                    >
                      {String(idx + 1).padStart(2, "0")} . {stage.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* HUD Bottom Panel: Scroll Hint */}
        <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 tracking-widest uppercase border-t border-white/5 pt-3">
          <span>SYSTEM // SECURE GATEWAY ENCRYPTED</span>
          
          {activeStage === 0 && (
            <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex flex-col items-center gap-1 text-[9px] animate-fade-in-out">
              <span className="text-cyan-400 font-bold">SCROLL TO PLUNGE</span>
              <div className="w-1.5 bg-cyan-400 fade-scroll-hint rounded-full" />
              <ChevronDown className="w-4.5 h-4.5 text-cyan-400 animate-bounce mt-1" />
            </div>
          )}

          <span>TIME: {new Date().toISOString().substring(11, 19)} UTC</span>
        </div>

      </div>
    </div>
  );
}
