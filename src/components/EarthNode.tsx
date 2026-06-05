import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import * as THREE from "three";
import { LineFlowMaterial } from "./LineFlowMaterial";
import { CORE_TRANSLATIONS } from "../types";

// Helper to convert lat/lon to 3D vector coordinates
function latLonToVector3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.sin(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.cos(theta);
  return new THREE.Vector3(x, y, z);
}

export default function EarthNode() {
  const earthGroupRef = useRef<THREE.Group>(null);
  const textGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  // Positions on the Earth representing major digital connectivity hub cities
  const cities = useMemo(() => {
    return [
      { lat: 35.6762, lon: 139.6503, name: "Tokyo" },
      { lat: 40.7128, lon: -74.006, name: "New York" },
      { lat: 48.8566, lon: 2.3522, name: "Paris" },
      { lat: -33.8688, lon: 151.2093, name: "Sydney" },
      { lat: -23.5505, lon: -46.6333, name: "Sao Paulo" },
      { lat: 30.0444, lon: 31.2357, name: "Cairo" },
      { lat: 1.3521, lon: 103.8198, name: "Singapore" }
    ];
  }, []);

  const earthRadius = 3.2;

  // Orbiting human nodes in space around the Earth
  const humanNodes = useMemo(() => {
    return [
      { pos: new THREE.Vector3(-6, 3, 19), color: "#00ffff" },
      { pos: new THREE.Vector3(6, -2, 17), color: "#a855f7" },
      { pos: new THREE.Vector3(-4, -4, 13), color: "#00ff88" },
      { pos: new THREE.Vector3(5, 4, 11), color: "#ff3366" },
      { pos: new THREE.Vector3(-5, 0, 10), color: "#38bdf8" }
    ];
  }, []);

  // Compute curved paths from Earth hubs to surrounding human nodes
  const connectionPaths = useMemo(() => {
    const paths: THREE.CatmullRomCurve3[] = [];
    humanNodes.forEach((node, i) => {
      // Map to a random earth city hub
      const city = cities[i % cities.length];
      const startPoint = latLonToVector3(city.lat, city.lon, earthRadius).add(new THREE.Vector3(0, 0, 15));
      const endPoint = node.pos;

      // Animate arc shape (quadratic curve with mid arc control point)
      const midPoint = new THREE.Vector3()
        .addVectors(startPoint, endPoint)
        .multiplyScalar(0.5);
      
      // Push midPoint outward to create a beautiful Bezier arc
      midPoint.add(new THREE.Vector3(
        (Math.random() - 0.5) * 3,
        (Math.random() - 0.5) * 3 + 2,
        (Math.random() - 0.5) * 3
      ));

      paths.push(new THREE.CatmullRomCurve3([startPoint, midPoint, endPoint]));
    });
    return paths;
  }, [cities, humanNodes]);

  // Orbiting typography positions
  const floatingTexts = useMemo(() => {
    return CORE_TRANSLATIONS.map((item, idx) => {
      const angle = (idx / CORE_TRANSLATIONS.length) * Math.PI * 2;
      const radius = 5.5 + Math.random() * 1.5;
      const height = (Math.random() - 0.5) * 4;
      
      return {
        text: item.text,
        sub: item.lang,
        angleFactor: Math.random() * 0.1 + 0.05,
        radius,
        height,
        phase: Math.random() * Math.PI * 2
      };
    });
  }, []);

  // Instantiate standard shader materials safely inside useMemo
  const tubeMaterials = useMemo(() => {
    const speeds = [1.2, 1.6, 2.0, 0.8];
    const dashCounts = [1.0, 2.0];
    return connectionPaths.map((_, idx) => {
      const col = idx % 2 === 0 ? "#00ffff" : "#a855f7";
      return new (LineFlowMaterial as any)({
        uColor: new THREE.Color(col),
        uPulseColor: new THREE.Color("#ffffff"),
        uSpeed: speeds[idx % speeds.length],
        uPulseWidth: 0.12,
        uDashCount: dashCounts[idx % dashCounts.length],
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    });
  }, [connectionPaths]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Rotate Earth system
    if (earthGroupRef.current) {
      earthGroupRef.current.rotation.y = time * 0.08;
    }

    if (cloudsRef.current) {
      cloudsRef.current.rotation.y = -time * 0.12;
      cloudsRef.current.rotation.x = time * 0.05;
    }

    // Twinkle the core
    if (coreRef.current) {
      const s = 1.0 + Math.sin(time * 2.0) * 0.03;
      coreRef.current.scale.set(s, s, s);
    }

    // Rotate and animate orbiting typography
    if (textGroupRef.current) {
      textGroupRef.current.children.forEach((child, i) => {
        const item = floatingTexts[i];
        if (!item) return;
        const currentAngle = (time * item.angleFactor) + item.phase;
        child.position.x = Math.cos(currentAngle) * item.radius;
        child.position.z = Math.sin(currentAngle) * item.radius + 15; // Centered around Earth at Z=15
        child.position.y = item.height + Math.sin(time + item.phase) * 0.2;
        
        // Face the camera
        child.quaternion.copy(state.camera.quaternion);
      });
    }

    // Update uniform time inside our memoized materials
    tubeMaterials.forEach((mat) => {
      if (mat.uTime !== undefined) {
        mat.uTime.value = time;
      }
    });
  });

  return (
    <group>
      {/* 1. Procedural Earth Core Group at Z = 15 */}
      <group ref={earthGroupRef} position={[0, 0, 15]}>
        {/* Glow Core */}
        <mesh ref={coreRef}>
          <sphereGeometry args={[earthRadius, 32, 32]} />
          <meshBasicMaterial 
            color="#08082c" 
            transparent 
            opacity={0.8}
            wireframe={false}
          />
        </mesh>

        {/* Global Digital Grid wireframe */}
        <mesh>
          <sphereGeometry args={[earthRadius + 0.05, 24, 24]} />
          <meshBasicMaterial 
            color="#00ffff" 
            wireframe 
            transparent 
            opacity={0.16}
            toneMapped={false}
          />
        </mesh>

        {/* Atmospheric Clouds wireframe */}
        <mesh ref={cloudsRef}>
          <sphereGeometry args={[earthRadius + 0.3 * 1.05, 16, 16]} />
          <meshBasicMaterial 
            color="#a855f7" 
            wireframe 
            transparent 
            opacity={0.08}
            toneMapped={false}
          />
        </mesh>

        {/* Major hub indicators */}
        {cities.map((city, idx) => {
          const pos = latLonToVector3(city.lat, city.lon, earthRadius);
          return (
            <group key={idx} position={pos}>
              <mesh>
                <sphereGeometry args={[0.08, 8, 8]} />
                <meshBasicMaterial color="#00ffff" toneMapped={false} />
              </mesh>
              <mesh>
                <ringGeometry args={[0.1, 0.25, 16]} />
                <meshBasicMaterial 
                  color="#00ffff" 
                  transparent 
                  opacity={0.4} 
                  side={THREE.DoubleSide} 
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* 2. Orbiting Human Nodes in deep space around Earth Z=15 */}
      {humanNodes.map((node, i) => (
        <group key={i} position={node.pos}>
          {/* Node core */}
          <mesh>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshBasicMaterial color={node.color} toneMapped={false} />
          </mesh>
          
          {/* Outer halo element */}
          <mesh scale={[2, 2, 2]}>
            <sphereGeometry args={[0.12, 8, 8]} />
            <meshBasicMaterial 
              color={node.color} 
              transparent 
              opacity={0.25} 
              wireframe 
            />
          </mesh>
        </group>
      ))}

      {/* 3. Connecting curves shooting high-frequency pulsing line glow */}
      {connectionPaths.map((curve, idx) => {
        const tubeArgs = [curve, 40, 0.022, 6, false] as const;
        return (
          <mesh key={idx}>
            <tubeGeometry args={tubeArgs} />
            <primitive object={tubeMaterials[idx]} attach="material" />
          </mesh>
        );
      })}

      {/* 4. Multilingual Fluttering Typographic elements (R3F Text) */}
      <group ref={textGroupRef}>
        {floatingTexts.map((item, idx) => (
          <group key={idx}>
            <Text
              fontSize={0.25}
              anchorX="center"
              anchorY="middle"
              color="#00ffff"
              font="sans-serif"
              outlineColor="#08082c"
              outlineWidth={0.03}
            >
              {item.text}
            </Text>
            {/* Tiny subtitle indicating language */}
            <Text
              position={[0, -0.22, 0.01]}
              fontSize={0.09}
              color="#a855f7"
              font="sans-serif"
            >
              {"[" + item.sub + "]"}
            </Text>
          </group>
        ))}
      </group>
    </group>
  );
}
