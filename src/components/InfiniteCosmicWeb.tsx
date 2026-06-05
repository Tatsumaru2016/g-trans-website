import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LineFlowMaterial } from "./LineFlowMaterial";

interface CosmicWebProps {
  scrollVelocity: React.MutableRefObject<number>;
}

export default function InfiniteCosmicWeb({ scrollVelocity }: CosmicWebProps) {
  const containerRef = useRef<THREE.Group>(null);
  const galaxyPointsRef = useRef<THREE.Points>(null);
  
  // Depth region for Scene 6
  const webStartZ = -145;
  const webEndZ = -210;

  // 1. Generate 1,500 sub-nodes representing background galaxy nodes
  const pointsGeometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(1500 * 3);
    const colors = new Float32Array(1500 * 3);

    for (let i = 0; i < 1500; i++) {
      // Create spiral arms or complex web clusters
      const angle = Math.random() * Math.PI * 2;
      const dist = 6.0 + Math.random() * 30.0;
      const x = Math.cos(angle) * dist + (Math.random() - 0.5) * 8.0;
      const y = Math.sin(angle) * dist + (Math.random() - 0.5) * 8.0;
      
      const z = webStartZ - Math.random() * (Math.abs(webEndZ - webStartZ));

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const r = Math.random() < 0.3 ? 0.0 : 0.5;
      const g = 0.8 + Math.random() * 0.2;
      const b = 1.0;
      
      colors[i * 3] = r;
      colors[i * 3 + 1] = g;
      colors[i * 3 + 2] = b;
    }

    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    return geo;
  }, []);

  // 2. Linear hyper-glowing streams aligned with Z-axis for star-streaks
  const starStreaks = useMemo(() => {
    const lines = [];
    const count = 16;
    for (let i = 0; i < count; i++) {
      // Place them forming a tube corridor around the camera
      const angle = (i / count) * Math.PI * 2;
      const r = 5.0 + Math.random() * 8.0;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      
      const length = 20.0 + Math.random() * 25.0;
      const zMid = (webStartZ + webEndZ) / 2 + (Math.random() - 0.5) * 20.0;
      
      const start = new THREE.Vector3(x, y, zMid + length / 2);
      const end = new THREE.Vector3(x, y, zMid - length / 2);
      
      lines.push({
        curve: new THREE.CatmullRomCurve3([start, end]),
        color: Math.random() < 0.4 ? "#00ffff" : "#a855f7",
        baseLength: length,
        zMid,
        x,
        y
      });
    }
    return lines;
  }, []);

  // Instantiate standard shader materials inside useMemo
  const strokeMaterials = useMemo(() => {
    return starStreaks.map((streak) => {
      return new (LineFlowMaterial as any)({
        uColor: new THREE.Color(streak.color),
        uPulseColor: new THREE.Color("#ffffff"),
        uSpeed: 3.0,
        uPulseWidth: 0.08,
        uDashCount: 2.0,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    });
  }, [starStreaks]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const vel = Math.abs(scrollVelocity.current);

    // 1. Slow cosmic rotation
    if (galaxyPointsRef.current) {
      galaxyPointsRef.current.rotation.z = time * 0.04;
    }

    // 2. Velocity-based warp-scale stretch
    if (containerRef.current) {
      const tubesGroup = containerRef.current.children[1] as THREE.Group;
      if (tubesGroup && tubesGroup.children) {
        tubesGroup.children.forEach((meshObj, idx) => {
          const targetMesh = meshObj as THREE.Mesh;
          const mat = strokeMaterials[idx];
          if (!mat) return;

          // Stretch Z scale dynamically based on speed
          const stretch = 1.0 + Math.min(vel * 30.0, 25.0);
          targetMesh.scale.set(1, 1, stretch);

          if (mat.uTime !== undefined) {
            mat.uTime.value = time;
            mat.uSpeed.value = 3.0 + vel * 25.0;
            mat.uPulseWidth.value = 0.06 + Math.min(vel * 0.1, 0.15);
          }
        });
      }
    }
  });

  return (
    <group ref={containerRef}>
      {/* 1. background galaxy nodes star cluster */}
      <points ref={galaxyPointsRef} geometry={pointsGeometry}>
        <pointsMaterial 
          size={0.16} 
          vertexColors 
          transparent 
          opacity={0.65} 
          toneMapped={false} 
        />
      </points>

      {/* 2. Z-aligned hyper-glowing speed rays */}
      <group>
        {starStreaks.map((streak, idx) => (
          <mesh key={`streak-${idx}`}>
            <tubeGeometry args={[streak.curve, 8, 0.024, 4, false]} />
            <primitive object={strokeMaterials[idx]} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
