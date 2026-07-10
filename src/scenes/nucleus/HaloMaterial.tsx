import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const HaloMaterialImpl = shaderMaterial(
  { uTime: 0 },
  /* glsl */ `
    varying vec3 vN;
    void main() {
      vN = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl */ `
    varying vec3 vN;
    uniform float uTime;
    void main() {
      float f = pow(1.0 - abs(dot(vN, vec3(0.0, 0.0, 1.0))), 2.5);
      vec3 col = mix(vec3(0.95, 0.55, 0.18), vec3(1.0, 0.85, 0.45), f);
      gl_FragColor = vec4(col, f * 0.55);
    }
  `,
);

extend({ HaloMaterial: HaloMaterialImpl });

declare module "@react-three/fiber" {
  interface ThreeElements {
    haloMaterial: THREE.ShaderMaterial & { uTime: number };
  }
}

export function Halo({ radius = 3.4 }: { radius?: number }) {
  const ref = useRef<THREE.ShaderMaterial & { uTime: number }>(null);

  useFrame((state) => {
    if (ref.current) ref.current.uTime = state.clock.elapsedTime;
  });

  return (
    <mesh>
      <sphereGeometry args={[radius, 32, 32]} />
      <haloMaterial ref={ref} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}
