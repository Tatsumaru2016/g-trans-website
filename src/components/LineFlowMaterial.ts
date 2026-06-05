import * as THREE from "three";
import { shaderMaterial } from "@react-three/drei";

export const LineFlowMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color("#0088ff"),
    uPulseColor: new THREE.Color("#ffffff"),
    uSpeed: 1.0,
    uPulseWidth: 0.15,
    uDashCount: 1.0
  },
  // Vertex Shader
  `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  `
    uniform float uTime;
    uniform vec3 uColor;
    uniform vec3 uPulseColor;
    uniform float uSpeed;
    uniform float uPulseWidth;
    uniform float uDashCount;
    varying vec2 vUv;

    void main() {
      // Periodic coordinate for traveling pulses
      float x = vUv.x * uDashCount - uTime * uSpeed;
      float progress = fract(x);
      
      // Compute symmetric pulse around progress=0.5
      float dist = abs(progress - 0.5);
      float pulse = smoothstep(uPulseWidth, 0.0, dist);
      
      // Combine base line color with the glowing peak
      vec3 finalColor = mix(uColor, uPulseColor, pulse * 1.5);
      
      // Edge fadeout at both ends of the line
      float edgeFade = smoothstep(0.0, 0.08, vUv.x) * (1.0 - smoothstep(0.92, 1.0, vUv.x));
      
      // Dynamic alpha
      float alpha = mix(0.12, 1.0, pulse) * edgeFade;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `
);
export type LineFlowMaterialType = typeof LineFlowMaterial;
