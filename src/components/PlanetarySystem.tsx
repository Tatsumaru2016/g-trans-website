import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { LineFlowMaterial } from "./LineFlowMaterial";
import { PLANETS } from "../types";

export default function PlanetarySystem() {
  const systemRef = useRef<THREE.Group>(null);
  const planetRefs = useRef<THREE.Mesh[]>([]);

  // Interplanetary massive Bézier fiber cables connecting orbits
  const planetBridges = useMemo(() => {
    const bridges: { curve: THREE.CatmullRomCurve3; color: string }[] = [];
    
    // Connect Earth (idx 0) -> Mars (idx 1)
    const earthPos = new THREE.Vector3(...PLANETS[0].position);
    const marsPos = new THREE.Vector3(...PLANETS[1].position);
    const midEM = new THREE.Vector3().addVectors(earthPos, marsPos).multiplyScalar(0.5);
    midEM.y += 8.0; // Arch curve up
    bridges.push({
      curve: new THREE.CatmullRomCurve3([earthPos, midEM, marsPos]),
      color: "#00ffff"
    });

    // Connect Earth (idx 0) -> Jupiter (idx 2)
    const jupPos = new THREE.Vector3(...PLANETS[2].position);
    const midEJ = new THREE.Vector3().addVectors(earthPos, jupPos).multiplyScalar(0.5);
    midEJ.x += 10.0;
    midEJ.y -= 5.0;
    bridges.push({
      curve: new THREE.CatmullRomCurve3([earthPos, midEJ, jupPos]),
      color: "#f97316"
    });

    // Connect Mars (idx 1) -> Jupiter (idx 2)
    const midMJ = new THREE.Vector3().addVectors(marsPos, jupPos).multiplyScalar(0.5);
    midMJ.z += 12.0; // Arch out in depth
    bridges.push({
      curve: new THREE.CatmullRomCurve3([marsPos, midMJ, jupPos]),
      color: "#ec4899"
    });

    return bridges;
  }, []);

  // Instantiate standard shader materials safely inside useMemo
  const bridgeMaterials = useMemo(() => {
    return planetBridges.map((bridge) => {
      return new (LineFlowMaterial as any)({
        uColor: new THREE.Color(bridge.color),
        uPulseColor: new THREE.Color("#ffffff"),
        uSpeed: 4.2, // High speed light frequency
        uPulseWidth: 0.08, // Sharp bright energy dashes
        uDashCount: 3.0, // Dense information transmission
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    });
  }, [planetBridges]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Orbit/rotation animation of the planetary bodies
    planetRefs.current.forEach((mesh, index) => {
      if (!mesh) return;
      const planetConfig = PLANETS[index];
      
      // Rotate planet on its own axis
      mesh.rotation.y = time * (0.015 * (index + 1) + 0.01);

      // Add a subtle local hovering/orbital floating
      mesh.position.y = planetConfig.position[1] + Math.sin(time * 0.4 + index) * 0.4;
      mesh.position.x = planetConfig.position[0] + Math.cos(time * 0.2 + index) * 0.3;
    });

    // Update uTime uniform references
    bridgeMaterials.forEach((mat) => {
      if (mat.uTime !== undefined) {
        mat.uTime.value = time;
      }
    });
  });

  return (
    <group ref={systemRef}>
      {/* 1. Planetary Orbits & Wireframe Globes */}
      {PLANETS.map((planet, idx) => (
        <group key={planet.id}>
          {/* Main sphere with wireframe wrapper and glowing aura */}
          <mesh 
            ref={(el) => { if (el) planetRefs.current[idx] = el; }}
            position={planet.position}
          >
            <sphereGeometry args={[planet.radius, 24, 24]} />
            <meshBasicMaterial 
              color={planet.color} 
              wireframe 
              transparent 
              opacity={0.15} 
              toneMapped={false}
            />
          </mesh>

          {/* Slightly larger pulsing outline wireframe giving hologram effect */}
          <mesh position={planet.position} scale={[1.05, 1.05, 1.05]}>
            <sphereGeometry args={[planet.radius, 12, 12]} />
            <meshBasicMaterial 
              color="#ffffff" 
              wireframe 
              transparent 
              opacity={0.04} 
              toneMapped={false}
            />
          </mesh>

          {/* Planet Center Node Glow Core */}
          <mesh position={planet.position}>
            <sphereGeometry args={[planet.radius * 0.15, 8, 8]} />
            <meshBasicMaterial color={planet.color} toneMapped={false} />
          </mesh>

          {/* Elegant hologram label in space next to planet */}
          <Text
            position={[planet.position[0], planet.position[1] + planet.radius + 1.2, planet.position[2]]}
            fontSize={0.42}
            color="#ffffff"
            anchorX="center"
            font="sans-serif"
            outlineColor="#030307"
            outlineWidth={0.03}
          >
            {planet.name.toUpperCase()}
          </Text>

          <Text
            position={[planet.position[0], planet.position[1] + planet.radius + 0.6, planet.position[2]]}
            fontSize={0.16}
            color="#00ffff"
            font="monospace"
            anchorX="center"
          >
            SECURE LINK // ACTIVE 100%
          </Text>
        </group>
      ))}

      {/* 2. Massive Interplanetary Light Pipelines */}
      {planetBridges.map((bridge, idx) => (
        <mesh key={`pbridge-${idx}`}>
          <tubeGeometry args={[bridge.curve, 50, 0.05, 5, false]} />
          <primitive object={bridgeMaterials[idx]} attach="material" />
        </mesh>
      ))}
    </group>
  );
}
