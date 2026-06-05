import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Starfield from "./Starfield";
import EarthNode from "./EarthNode";
import ConstellationUI from "./ConstellationUI";
import NebulaBarrier from "./NebulaBarrier";
import RacialHarmony from "./RacialHarmony";
import PlanetarySystem from "./PlanetarySystem";
import InfiniteCosmicWeb from "./InfiniteCosmicWeb";
import TorusRing from "./TorusRing";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface DeepSpaceCanvasProps {
  scrollProgress: React.MutableRefObject<number>;
  scrollVelocity: React.MutableRefObject<number>;
  activeStage: number;
  setActiveStage: (stage: number) => void;
}

// Inner camera controller that listens to the scroll progresses
function CameraScroller({ scrollProgress, scrollVelocity, setActiveStage }: Omit<DeepSpaceCanvasProps, "activeStage">) {
  // Vectors for smooth interpolation (lerping)
  const currentLookAt = useMemo(() => new THREE.Vector3(0, 0, 15), []);
  const lookAtTarget = useMemo(() => new THREE.Vector3(0, 0, 15), []);
  const cameraTargetPos = useMemo(() => new THREE.Vector3(0, 0, 35), []);
  const lastStage = useRef(-1);

  useFrame((state) => {
    const p = scrollProgress.current;
    
    // 1. Calculate active stage for HTML text sync
    const calculatedStage = THREE.MathUtils.clamp(Math.floor(p * 7), 0, 6);
    if (calculatedStage !== lastStage.current) {
      lastStage.current = calculatedStage;
      setActiveStage(calculatedStage);
    }

    // 2. Camera position path calculation
    if (p < 0.82) {
      // Normal progression through scenes 1 to 6
      const targetZ = 35 - p * 240; // Goes from Z = 35 down to -162
      
      const pointerX = state.pointer.x * 0.5;
      const pointerY = state.pointer.y * 0.5;

      cameraTargetPos.set(pointerX, pointerY, targetZ);
      lookAtTarget.set(pointerX * 0.4, pointerY * 0.4, targetZ - 20);
    } else {
      // SCENE 7: Cinematic 180° look back phase
      const t = (p - 0.82) / 0.18;
      
      const targetZ = -162 - t * 86; // Dolly-in to Z = -248 (behind Torus)
      cameraTargetPos.set(0, 0, targetZ);

      // Interpolate look-at target from Z-20 to Z=-235 (Torus core center)
      const straightZ = targetZ - 20;
      const lookZ = THREE.MathUtils.lerp(straightZ, -235, t);
      lookAtTarget.set(0, 0, lookZ);
    }

    // Smoothly interpolate position & look-at vector (Butter-like movement / lerp)
    state.camera.position.lerp(cameraTargetPos, 0.08);
    currentLookAt.lerp(lookAtTarget, 0.08);
    state.camera.lookAt(currentLookAt);

    // 3. Cinematic FOV lens flare/scaling effect (Scene 5)
    if (state.camera instanceof THREE.PerspectiveCamera) {
      if (p > 0.55 && p < 0.76) {
        const fovProgress = Math.sin(((p - 0.55) / 0.21) * Math.PI);
        const targetFOV = 60 + fovProgress * 22; // expands FOV up to 82 degrees!
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, targetFOV, 0.1);
      } else {
        // Return smoothly to normal 60 degrees lenses
        state.camera.fov = THREE.MathUtils.lerp(state.camera.fov, 60, 0.08);
      }
      state.camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function DeepSpaceCanvas({ scrollProgress, scrollVelocity, activeStage, setActiveStage }: DeepSpaceCanvasProps) {
  
  useEffect(() => {
    // Setup ScrollTrigger to bind HTML scroll status to mutable refs
    const trigger = ScrollTrigger.create({
      trigger: "#scrolly-sections",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2, // smoothing scroll lag
      onUpdate: (self) => {
        scrollProgress.current = self.progress;
        scrollVelocity.current = self.getVelocity() / 3500;
      }
    });

    return () => {
      trigger.kill();
    };
  }, [scrollProgress, scrollVelocity]);

  return (
    <div className="fixed top-0 left-0 w-screen h-screen -z-10 bg-space-black overflow-hidden">
      {/* Cinematic grid lines in background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(8,8,26,0.3)_0%,rgba(3,3,7,1)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />

      <Canvas
        camera={{ position: [0, 0, 35], fov: 60, near: 0.1, far: 1000 }}
        gl={{ 
          antialias: true, 
          toneMapping: THREE.ACESFilmicToneMapping,
          alpha: false,
          powerPreference: "high-performance"
        }}
        dpr={[1, 2]} // clamp device pixel ratios for fluid 60FPS output
      >
        <ambientLight intensity={0.4} />
        
        {/* Universal Space Environment components */}
        <Starfield scrollVelocity={scrollVelocity} />

        {/* Scene 1: Cosmic Core */}
        <group>
          <EarthNode />
        </group>

        {/* Scene 2: Cross Platform Constellations */}
        <group>
          <ConstellationUI />
        </group>

        {/* Scene 3: Nebula dissolving barrier */}
        <group>
          <NebulaBarrier />
        </group>

        {/* Scene 4: Galactic Racial Harmony */}
        <group>
          <RacialHarmony />
        </group>

        {/* Scene 5: Orbital Planetary system */}
        <group>
          <PlanetarySystem />
        </group>

        {/* Scene 6: Infinite cosmic web (Warp Speed) */}
        <group>
          <InfiniteCosmicWeb scrollVelocity={scrollVelocity} />
        </group>

        {/* Scene 7: Grand Ring torus */}
        <group>
          <TorusRing />
        </group>

        {/* R3F camera controller */}
        <CameraScroller 
          scrollProgress={scrollProgress} 
          scrollVelocity={scrollVelocity}
          setActiveStage={setActiveStage}
        />
      </Canvas>
    </div>
  );
}
