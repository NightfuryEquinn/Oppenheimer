import { shaderMaterial } from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { TRINITY_FRAGMENT_SHADER } from "./trinityShader";

const TrinityShaderMaterial = shaderMaterial(
  { uRes: new THREE.Vector2(1, 1), uTime: 0, uBlast: -1 },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  TRINITY_FRAGMENT_SHADER,
);

extend({ TrinityShaderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    trinityShaderMaterial: THREE.ShaderMaterial & {
      uRes: THREE.Vector2;
      uTime: number;
      uBlast: number;
    };
  }
}

interface TrinityShaderQuadProps {
  blastT: number;
}

export function TrinityShaderQuad({ blastT }: TrinityShaderQuadProps) {
  const mat = useRef<THREE.ShaderMaterial & { uRes: THREE.Vector2; uTime: number; uBlast: number }>(
    null,
  );
  const { size } = useThree();

  useFrame((state) => {
    if (!mat.current) return;
    mat.current.uRes.set(size.width, size.height);
    mat.current.uTime = state.clock.elapsedTime;
    mat.current.uBlast = blastT;
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <trinityShaderMaterial ref={mat} />
    </mesh>
  );
}

export const TRINITY_LOG_SCHEDULE = [
  { at: 9.0, text: "T −09.0 — switches to AUTOMATIC." },
  { at: 7.5, text: "T −07.5 — relays armed. Bainbridge: \"let me check the timing.\"" },
  { at: 6.0, text: "T −06.0 — go on count.", cls: "alert" as const },
  { at: 4.0, text: "T −04.0 — Oppenheimer braces against post." },
  { at: 2.0, text: "T −02.0 — Bhagavad Gita running through his mind." },
  { at: 0.8, text: "T −00.8 — last contact prior to ignition.", cls: "alert" as const },
];
