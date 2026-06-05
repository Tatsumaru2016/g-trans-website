import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { LineFlowMaterial } from "./LineFlowMaterial";
import { PANEL_MESSAGES } from "../types";

// Matrix rain/cyber glyphs for scrambling effect
const CYBER_GLYPHS = "010010101XYZΩΨΣ#@$%&*+=<>?;:•";

function scrambleText(originalText: string, translatedText: string, progress: number, seed: number): string {
  if (progress <= 0) return originalText;
  if (progress >= 1) return translatedText;

  const targetLength = Math.max(originalText.length, translatedText.length);
  let result = "";
  
  for (let i = 0; i < targetLength; i++) {
    // Determine cutoff ratio representing decoded index
    const indexThreshold = progress * targetLength;
    if (i < indexThreshold) {
      // Already fully translated
      result += translatedText[i] || "";
    } else if (i < indexThreshold + 2) {
      // Scrambling glyph border
      const glyphIndex = Math.floor(seed + i) % CYBER_GLYPHS.length;
      result += CYBER_GLYPHS[glyphIndex];
    } else {
      // Still original text or empty space
      result += originalText[i] || translatedText[i] || "";
    }
  }
  return result;
}

export default function ConstellationUI() {
  const containerRef = useRef<THREE.Group>(null);
  const [panelProgresses, setPanelProgresses] = useState<number[]>(PANEL_MESSAGES.map(() => 0));
  const [frameSeed, setFrameSeed] = useState(0);

  // Connection path connecting SNS panels to form a deep constellation
  const constellationBridges = useMemo(() => {
    const bridges: THREE.CatmullRomCurve3[] = [];
    for (let i = 0; i < PANEL_MESSAGES.length - 1; i++) {
      const start = new THREE.Vector3(...PANEL_MESSAGES[i].position);
      const end = new THREE.Vector3(...PANEL_MESSAGES[i+1].position);
      
      const mid = new THREE.Vector3()
        .addVectors(start, end)
        .multiplyScalar(0.5);
      
      // Make line beautiful and sag downwards slightly
      mid.y -= 1.5;
      mid.x += (Math.random() - 0.5) * 2;

      bridges.push(new THREE.CatmullRomCurve3([start, mid, end]));
    }
    return bridges;
  }, []);

  // Pre-instantiated materials safely inside useMemo
  const bridgeMaterials = useMemo(() => {
    return constellationBridges.map(() => {
      return new (LineFlowMaterial as any)({
        uColor: new THREE.Color("#a855f7"),
        uPulseColor: new THREE.Color("#00ffff"),
        uSpeed: 2.2,
        uPulseWidth: 0.15,
        uDashCount: 2.0,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    });
  }, [constellationBridges]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cameraZ = state.camera.position.z;

    setFrameSeed(Math.floor(time * 30)); // fast flicker for text scrambling

    // Update progresses of texts depending on camera distance
    const newProgresses = PANEL_MESSAGES.map((panel) => {
      const dist = cameraZ - panel.position[2];
      
      // We want to trigger decoding when camera is getting close
      // Panels sit from Z = 12 down to -2
      // Camera is moving from Z = 25 to 5 during Scene 2
      if (dist > 18) {
        return 0; // Not yet visible / far
      } else if (dist < -3) {
        return 1; // Already passed
      } else {
        // Linear decode factor as camera flies by
        const factor = (18 - dist) / 15;
        return THREE.MathUtils.clamp(factor, 0, 1);
      }
    });

    // Only update state if values differ slightly to prevent React bottlenecking
    let changed = false;
    for (let i = 0; i < newProgresses.length; i++) {
      if (Math.abs(newProgresses[i] - panelProgresses[i]) > 0.05) {
        changed = true;
        break;
      }
    }

    if (changed) {
      setPanelProgresses(newProgresses);
    }

    // Update uniform speeds across pre-instantiated materials
    bridgeMaterials.forEach((mat) => {
      if (mat.uTime !== undefined) {
        mat.uTime.value = time;
      }
    });
  });

  return (
    <group ref={containerRef}>
      {/* 1. Constellation Connection Bridges */}
      {constellationBridges.map((curve, idx) => (
        <mesh key={`bridge-${idx}`}>
          <tubeGeometry args={[curve, 32, 0.016, 4, false]} />
          <primitive object={bridgeMaterials[idx]} attach="material" />
        </mesh>
      ))}

      {/* 2. Floating Glasmorphic Panels */}
      {PANEL_MESSAGES.map((panel, idx) => {
        const progress = panelProgresses[idx] || 0;
        const scrambled = scrambleText(panel.originalText, panel.translatedText, progress, frameSeed);
        
        // Dynamic scaling: scale up slightly as camera gets closer, and fade at extremely close range
        let scale = 1.0;
        let opacity = 1.0;

        return (
          <group 
            key={panel.id} 
            position={panel.position} 
            scale={[scale, scale, scale]}
          >
            {/* Tiny outer glowing dot anchor */}
            <mesh position={[0, 0, 0]}>
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshBasicMaterial color="#00ffff" toneMapped={false} />
            </mesh>

            {/* Float HUD card in actual 3D space */}
            <Html
              distanceFactor={4.5} // dynamic size mapping
              center
              pointerEvents="none"
              transform
              occlude={false}
            >
              <div 
                className="w-80 glass-panel p-4 rounded-xl text-xs flex flex-col gap-2 transition-all duration-300"
                style={{
                  opacity: opacity,
                  transform: `scale(${1 + progress * 0.05})`,
                  borderLeft: panel.platform === "discord" ? "3px solid #5865F2" : 
                            panel.platform === "telegram" ? "3px solid #0088cc" :
                            panel.platform === "slack" ? "3px solid #4A154B" :
                            panel.platform === "twitter" ? "3px solid #1DA1F2" : "3px solid #07C160"
                }}
              >
                {/* Header info */}
                <div className="flex items-center justify-between border-b border-white/5 pb-1">
                  <div className="flex items-center gap-1.5 font-semibold text-white">
                    <span 
                      className="w-2 h-2 rounded-full" 
                      style={{
                        backgroundColor: panel.platform === "discord" ? "#5865F2" : 
                                        panel.platform === "telegram" ? "#0088cc" :
                                        panel.platform === "slack" ? "#e01e5a" :
                                        panel.platform === "twitter" ? "#1DA1F2" : "#07C160"
                      }}
                    ></span>
                    <span className="font-mono">{panel.sender}</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">
                    {panel.platform}
                  </span>
                </div>

                {/* Content block representing chat */}
                <div className="flex flex-col gap-1.5 pt-0.5">
                  <div className="font-mono text-gray-400 break-words leading-relaxed">
                    {scrambled}
                  </div>
                  
                  {/* Status decoding bar */}
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5 text-[9px]">
                    <span className="text-gray-500 font-mono">G.TRANS AUTO-DECODE</span>
                    <div className="flex items-center gap-1">
                      <span className="text-cyan-400 font-bold font-mono">
                        {Math.floor(progress * 100)}%
                      </span>
                      <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-cyan-400 transition-all duration-100" 
                          style={{ width: `${progress * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
