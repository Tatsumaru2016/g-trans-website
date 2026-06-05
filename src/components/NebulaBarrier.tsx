import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function NebulaBarrier() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const count = 700;
  const barrierZ = -25; // Nebula lies at Z = -25

  // Generate chaotic language barriers (nebula cloud particles)
  const particles = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      // Disk-like random distribution spanning the path
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 8.0; // concentrated around center
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = barrierZ + (Math.random() - 0.5) * 6.0; // slight thickness in depth

      const size = Math.random() * 0.22 + 0.08;
      
      // Nebular colors: hot magenta, crimson, violet
      let color = new THREE.Color();
      const rand = Math.random();
      if (rand < 0.4) {
        color.set("#ff0077"); // Hot Magenta
      } else if (rand < 0.7) {
        color.set("#a855f7"); // Violet
      } else {
        color.set("#ec4899"); // Warm pink
      }

      // Store base coordinates for displacement calculation
      data.push({ x, y, z, originalX: x, originalY: y, size, color, speed: Math.random() * 0.4 + 0.1 });
    }
    return data;
  }, []);

  const tempObject = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    const cameraZ = state.camera.position.z;

    // Detect how close camera is to the barrier Z = -25
    // Camera is moving from Z = 15 to Z = -5 in scene 3
    const distToBarrier = cameraZ - barrierZ; // positive as camera approaches from positive Z

    particles.forEach((p, i) => {
      // 1. Slow drifting animation
      const driftX = Math.sin(time * p.speed + i) * 0.15;
      const driftY = Math.cos(time * p.speed * 0.8 + i) * 0.15;

      let currentX = p.originalX + driftX;
      let currentY = p.originalY + driftY;
      let currentZ = p.z;

      // 2. Compute radial parting (dissolution explosion)
      // As camera is between Z = -5 and -35 (flying past barrier at -25), part the particles
      if (cameraZ > -40 && cameraZ < 10) {
        // Calculate shockwave force
        // The closer the camera gets, or if the camera has passed, push them far outwards
        const triggerDistance = 15.0; // distance at which pushing begins
        const distFromCameraZ = Math.abs(cameraZ - p.z);

        if (distFromCameraZ < triggerDistance) {
          // Push factor peaks when camera is at same Z plane
          const proximityForce = (triggerDistance - distFromCameraZ) / triggerDistance;
          
          // Calculate radial direction from Z-axis center line
          const dx = p.originalX;
          const dy = p.originalY;
          const len = Math.sqrt(dx * dx + dy * dy) || 1.0;
          
          // Outer push vector
          const pushX = (dx / len) * proximityForce * 18.0;
          const pushY = (dy / len) * proximityForce * 18.0;

          // Apply displacement
          currentX += pushX;
          currentY += pushY;
        }

        // Extremely passed particles get displaced permanently
        if (cameraZ < p.z) {
          const dx = p.originalX;
          const dy = p.originalY;
          const len = Math.sqrt(dx * dx + dy * dy) || 1.0;
          currentX += (dx / len) * 12.0;
          currentY += (dy / len) * 12.0;
        }
      }

      tempObject.position.set(currentX, currentY, currentZ);

      // Pulse size slightly based on time
      const scalePulse = p.size * (1.0 + Math.sin(time * 3.0 + i) * 0.2);
      tempObject.scale.set(scalePulse, scalePulse, scalePulse);

      tempObject.updateMatrix();
      meshRef.current!.setMatrixAt(i, tempObject.matrix);
      meshRef.current!.setColorAt(i, p.color);
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
      <sphereGeometry args={[0.2, 8, 8]} />
      {/* Additive blending and neon glow colors create beautiful nebulae */}
      <meshBasicMaterial 
        color="#ffffff" 
        transparent 
        opacity={0.8}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
        depthWrite={false}
      />
    </instancedMesh>
  );
}
