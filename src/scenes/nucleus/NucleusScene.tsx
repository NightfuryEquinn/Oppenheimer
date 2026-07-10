import { NucleonBloomEffect } from "@/scenes/NucleonBloom";
import { OrbitingElectron } from "@/scenes/electron/OrbitingElectron";
import { NucleonMesh } from "@/scenes/nucleus/NucleonMesh";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Halo } from "./HaloMaterial";

const N = 70;

export function NucleusCloud() {
  const group = useRef<THREE.Group>(null);
  const meshRefs = useRef<THREE.Group[]>([]);
  const nucleons = useMemo(() => {
    const items: { base: THREE.Vector3; jitter: number; isProton: boolean }[] = [];
    for (let i = 0; i < N; i++) {
      const r = Math.cbrt(Math.random()) * 2.1;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      items.push({
        base: new THREE.Vector3(
          r * Math.sin(p) * Math.cos(t),
          r * Math.sin(p) * Math.sin(t),
          r * Math.cos(p),
        ),
        jitter: Math.random() * Math.PI * 2,
        isProton: i % 2 === 0,
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.15;
      group.current.rotation.x = Math.sin(t * 0.2) * 0.25;
    }
    meshRefs.current.forEach((mesh, i) => {
      const n = nucleons[i];
      if (!mesh || !n) return;
      const j = n.jitter + t * 3;
      mesh.position.set(
        n.base.x + Math.sin(j) * 0.06,
        n.base.y + Math.cos(j * 1.1) * 0.06,
        n.base.z + Math.sin(j * 0.9) * 0.06,
      );
    });
  });

  return (
    <group ref={group}>
      {nucleons.map((n, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
        >
          <NucleonMesh isProton={n.isProton} radius={0.45} segments={24} />
        </group>
      ))}
      <Halo />
    </group>
  );
}

const SHELLS = [
  { r: 5.2, n: 2, tilt: 0.2 },
  { r: 6.8, n: 3, tilt: 1.1 },
  { r: 8.4, n: 4, tilt: 2.0 },
];

export function CoverElectrons() {
  const electrons = useMemo(() => {
    const items: {
      r: number;
      tilt: number;
      rotZ: number;
      phase: number;
      speed: number;
    }[] = [];
    SHELLS.forEach((s, si) => {
      for (let i = 0; i < s.n; i++) {
        items.push({
          r: s.r,
          tilt: s.tilt,
          rotZ: si * 0.6,
          phase: (i / s.n) * Math.PI * 2 + Math.random() * 0.3,
          speed: 0.8 - si * 0.15 + Math.random() * 0.1,
        });
      }
    });
    return items;
  }, []);

  return (
    <group>
      {SHELLS.map((s, si) => (
        <mesh key={`ring-${si}`} rotation={[s.tilt, 0, si * 0.6]}>
          <ringGeometry args={[s.r - 0.01, s.r + 0.01, 128]} />
          <meshBasicMaterial color="#6e7a90" transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {electrons.map((e, i) => (
        <OrbitingElectron key={`e-${i}`} data={e} speedScale={2} />
      ))}
    </group>
  );
}

export function NucleusScene({ bloom = true }: { bloom?: boolean }) {
  return (
    <>
      <fog attach="fog" args={["#07070a", 0.045]} />
      <ambientLight intensity={1} color="#222024" />
      <pointLight position={[6, 4, 8]} intensity={2.5} color="#ffb060" distance={30} />
      <pointLight position={[-8, -3, 6]} intensity={1.4} color="#4a6fbf" distance={30} />
      <NucleusCloud />
      <CoverElectrons />
      <NucleonBloomEffect enabled={bloom} intensity={1.45} luminanceThreshold={0.08} />
    </>
  );
}
