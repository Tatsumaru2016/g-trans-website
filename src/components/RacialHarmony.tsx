import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { LineFlowMaterial } from "./LineFlowMaterial";

interface HarmonyNode {
  id: string;
  pos: THREE.Vector3;
  baseColor: THREE.Color;
  size: number;
}

export default function RacialHarmony() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Set up 24 human nodes representing different global regions
  const nodes: HarmonyNode[] = useMemo(() => {
    const list: HarmonyNode[] = [];
    const baseColors = [
      new THREE.Color("#ef4444"), // Red / Américas
      new THREE.Color("#eab308"), // Gold / Asia
      new THREE.Color("#3b82f6"), // Blue / Europe
      new THREE.Color("#ec4899"), // Pink / Pacifica
      new THREE.Color("#f97316"), // Orange / Africa
      new THREE.Color("#10b981"), // Emerald / Middle East
    ];

    for (let i = 0; i < 24; i++) {
      // Cylindrical distribution around scrolly corridor
      const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.5;
      const radius = 3.5 + Math.random() * 7.5;
      const z = -45 - i * 1.5 - Math.random() * 4.0; // depth spread from -45 to -85
      
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      
      list.push({
        id: `hn-${i}`,
        pos: new THREE.Vector3(x, y, z),
        baseColor: baseColors[i % baseColors.length],
        size: 0.14 + Math.random() * 0.12
      });
    }
    return list;
  }, []);

  // Set up random line connections between culturally diverse nodes
  const nodeConnections = useMemo(() => {
    const connections: { curve: THREE.CatmullRomCurve3; startColor: THREE.Color; endColor: THREE.Color }[] = [];
    // Link each node to its neighbor, and some random nodes to create a intricate matrix web
    for (let i = 0; i < nodes.length; i++) {
      const nodeA = nodes[i];
      // Connect to next node (closes loop)
      const nodeB = nodes[(i + 1) % nodes.length];
      
      const midPoint = new THREE.Vector3()
        .addVectors(nodeA.pos, nodeB.pos)
        .multiplyScalar(0.5);
      midPoint.x += (Math.random() - 0.5) * 4.0;
      midPoint.y += (Math.random() - 0.5) * 4.0;

      connections.push({
        curve: new THREE.CatmullRomCurve3([nodeA.pos, midPoint, nodeB.pos]),
        startColor: nodeA.baseColor,
        endColor: nodeB.baseColor
      });

      // Connect to a random node further down the screen to increase density
      if (i % 2 === 0) {
        const nodeC = nodes[(i + 5) % nodes.length];
        const midC = new THREE.Vector3()
          .addVectors(nodeA.pos, nodeC.pos)
          .multiplyScalar(0.5);
        midC.y += (Math.random() - 0.5) * 5.0;

        connections.push({
          curve: new THREE.CatmullRomCurve3([nodeA.pos, midC, nodeC.pos]),
          startColor: nodeA.baseColor,
          endColor: nodeC.baseColor
        });
      }
    }
    return connections;
  }, [nodes]);

  // Instantiate standard shader materials safely inside useMemo
  const connectionMaterials = useMemo(() => {
    return nodeConnections.map((conn) => {
      return new (LineFlowMaterial as any)({
        uColor: new THREE.Color(conn.startColor),
        uPulseColor: new THREE.Color("#ffffff"),
        uSpeed: 1.0,
        uPulseWidth: 0.16,
        uDashCount: 1.0,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
    });
  }, [nodeConnections]);

  const unifiedColor = useMemo(() => new THREE.Color("#00ffff"), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cameraZ = state.camera.position.z;

    // Calculate progression of unified connectivity
    const blendProgress = THREE.MathUtils.clamp((-35 - cameraZ) / 38.0, 0, 1);

    if (groupRef.current) {
      // 1. Animate connection nodes color
      const spheresGroup = groupRef.current.children[0] as THREE.Group;
      if (spheresGroup && spheresGroup.children) {
        spheresGroup.children.forEach((meshObj, idx) => {
          const nodeData = nodes[idx];
          if (!nodeData) return;
          const targetMesh = meshObj as THREE.Mesh;
          const mat = targetMesh.material as THREE.MeshBasicMaterial;
          if (mat) {
            mat.color.copy(nodeData.baseColor).lerp(unifiedColor, blendProgress);
            const baseScale = 1.0 + Math.sin(time * 4.0 + idx) * 0.15;
            targetMesh.scale.set(baseScale, baseScale, baseScale);
          }
        });
      }

      // 2. Feed uniforms into material references
      connectionMaterials.forEach((mat, idx) => {
        if (mat.uTime !== undefined) {
          mat.uTime.value = time;
          mat.uSpeed.value = 1.0 + blendProgress * 3.2;
          mat.uDashCount.value = 1.0 + blendProgress * 2.0;

          // Gradient line colors merge into bright neon cyan
          const startCol = nodeConnections[idx]?.startColor || new THREE.Color("#a855f7");
          mat.uColor.value.copy(startCol).lerp(unifiedColor, blendProgress);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Group 0: Interactive Nodes */}
      <group>
        {nodes.map((node) => (
          <mesh key={node.id} position={node.pos}>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshBasicMaterial toneMapped={false} />
          </mesh>
        ))}
      </group>

      {/* Group 1: Glowing fiber connections */}
      <group>
        {nodeConnections.map((conn, idx) => (
          <mesh key={`conn-${idx}`}>
            <tubeGeometry args={[conn.curve, 32, 0.015, 4, false]} />
            <primitive object={connectionMaterials[idx]} attach="material" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
