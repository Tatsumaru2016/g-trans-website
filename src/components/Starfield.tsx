import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  scrollVelocity: React.MutableRefObject<number>;
}

export default function Starfield({ scrollVelocity }: StarfieldProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 1200;

  // Generate initial star data
  const stars = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Cylindrical or box distribution along the scrolly path
      const x = (Math.random() - 0.5) * 110;
      const y = (Math.random() - 0.5) * 110;
      const z = Math.random() * 320 - 260; // Spread from +60 to -260 along Z-axis
      
      const size = Math.random() * 0.12 + 0.04;
      const speed = Math.random() * 0.05 + 0.01;
      
      // Warm white to icy blue colors
      const r = 0.8 + Math.random() * 0.2;
      const g = 0.9 + Math.random() * 0.1;
      const b = 1.0;
      const color = new THREE.Color(r, g, b);

      data.push({ x, y, z, size, speed, color });
    }
    return data;
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    // Get velocity, smooth it, clamps it
    const vel = Math.abs(scrollVelocity.current);
    
    // Stretch star along Z based on scroll velocity (Warp speed)
    const stretchZ = 1.0 + Math.min(vel * 40.0, 35.0);

    stars.forEach((star, i) => {
      tempObject.position.set(star.x, star.y, star.z);
      
      // Let stars twinkle or slowly rotate
      const pulse = 1.0 + Math.sin(time * star.speed * 10.0) * 0.15;
      
      // Apply scale (Z-axis stretched during warp speeds)
      tempObject.scale.set(star.size * pulse, star.size * pulse, star.size * pulse * stretchZ);
      
      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      meshRef.current!.setColorAt(i, star.color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh 
      ref={meshRef} 
      args={[null as any, null as any, count]} 
      frustumCulled={false}
    >
      <boxGeometry args={[0.2, 0.2, 0.8]} />
      <meshBasicMaterial 
        color="#ffffff" 
        toneMapped={false}
        transparent
        opacity={0.8}
      />
    </instancedMesh>
  );
}
