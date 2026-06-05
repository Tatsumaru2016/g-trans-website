import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function TorusRing() {
  const outerGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const innerEarthRef = useRef<THREE.Group>(null);

  const ringRadius = 7.0;

  // Orbiting satellites around the grand ring
  const satellites = useMemo(() => {
    const list = [];
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      list.push({
        id: `sat-${i}`,
        angle,
        speed: 0.15 + Math.random() * 0.1
      });
    }
    return list;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const { pointer } = state; // Mouse coordinates from -1 to 1

    // 1. Subtle cursor tilt interaction (Raycasting/hover reaction)
    if (outerGroupRef.current) {
      const targetRotationX = -pointer.y * 0.35 + Math.sin(time * 0.1) * 0.05;
      const targetRotationY = pointer.x * 0.35 + time * 0.04;
      
      outerGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        outerGroupRef.current.rotation.x,
        targetRotationX,
        0.05
      );
      outerGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        outerGroupRef.current.rotation.y,
        targetRotationY,
        0.05
      );
    }

    // 2. Rotate the main Ring
    if (ringRef.current) {
      ringRef.current.rotation.z = -time * 0.15;
    }

    // 3. Counter-rotate the inner cyber-Earth
    if (innerEarthRef.current) {
      innerEarthRef.current.rotation.y = time * 0.08;
    }
  });

  return (
    <group ref={outerGroupRef} position={[0, 0, -235]}>
      {/* 1. Cyber-Earth center core */}
      <group ref={innerEarthRef}>
        <mesh>
          <sphereGeometry args={[2.5, 32, 32]} />
          <meshBasicMaterial 
            color="#05051a" 
            transparent 
            opacity={0.8}
          />
        </mesh>
        
        {/* Network lattice */}
        <mesh>
          <sphereGeometry args={[2.52, 24, 24]} />
          <meshBasicMaterial 
            color="#a855f7" 
            wireframe 
            transparent 
            opacity={0.25}
            toneMapped={false}
          />
        </mesh>

        <mesh>
          <sphereGeometry args={[2.58, 12, 12]} />
          <meshBasicMaterial 
            color="#00ffff" 
            wireframe 
            transparent 
            opacity={0.12}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* 2. Colossal Glowing Torus Ring */}
      <mesh ref={ringRef}>
        <torusGeometry args={[ringRadius, 0.32, 12, 48]} />
        <meshBasicMaterial 
          color="#00ffff" 
          wireframe 
          transparent 
          opacity={0.3} 
          toneMapped={false}
        />
      </mesh>

      {/* Coalescing aura ring layer */}
      <mesh>
        <torusGeometry args={[ringRadius + 0.15, 0.06, 8, 32]} />
        <meshBasicMaterial 
          color="#a855f7" 
          transparent 
          opacity={0.18} 
          toneMapped={false}
        />
      </mesh>

      {/* 3. Orbiting Satellites on Ring outer rim */}
      {satellites.map((sat, idx) => {
        const x = Math.cos(sat.angle) * ringRadius;
        const y = Math.sin(sat.angle) * ringRadius;
        return (
          <group key={sat.id} position={[x, y, 0]}>
            {/* Satellite core node */}
            <mesh>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshBasicMaterial color="#ffffff" toneMapped={false} />
            </mesh>
            {/* Satellite pulsing orbit shell */}
            <mesh scale={[2.0, 2.0, 2.0]}>
              <sphereGeometry args={[0.15, 4, 4]} />
              <meshBasicMaterial 
                color="#00ffff" 
                wireframe 
                transparent 
                opacity={0.25} 
                toneMapped={false}
              />
            </mesh>
            {/* Core directional laser connecting to the center Earth */}
            <mesh position={[-x * 0.5, -y * 0.5, 0]}>
              <cylinderGeometry args={[0.005, 0.005, ringRadius, 4]} />
              <meshBasicMaterial 
                color="#00ffff" 
                transparent 
                opacity={0.06} 
              />
            </mesh>
          </group>
        );
      })}

      {/* 4. Elegant holographic coordinates and labels */}
      <Text
        position={[0, ringRadius + 1.4, 0]}
        fontSize={0.45}
        color="#ffffff"
        font="sans-serif"
        outlineColor="#030307"
        outlineWidth={0.03}
      >
        G.TRANS SPATIAL CORE
      </Text>
      
      <Text
        position={[0, ringRadius + 0.9, 0]}
        fontSize={0.18}
        color="#a855f7"
        font="monospace"
      >
        LATENCY: 0.02ms // COGNITIVE DECRYPTION ACTIVE
      </Text>
    </group>
  );
}
