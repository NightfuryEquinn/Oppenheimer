import { distributeElectrons } from "@/lib/physics/atomShells";
import type { ElementData } from "@/types";
import { OrbitingElectron } from "@/scenes/electron/OrbitingElectron";
import { Halo } from "@/scenes/nucleus/HaloMaterial";
import { NucleonMesh } from "@/scenes/nucleus/NucleonMesh";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface AtomModelProps {
  element: ElementData;
  spinSpeed: number;
  spread: number;
  showTrails: boolean;
}

interface ElectronData {
  r: number;
  tilt: number;
  rotZ: number;
  phase: number;
  speed: number;
}

export function AtomModel({ element, spinSpeed, spread, showTrails }: AtomModelProps) {
  const nucleusGroup = useRef<THREE.Group>(null);
  const shellGroup = useRef<THREE.Group>(null);

  const { nucleonPositions, shellConfig, nucleusRadius } = useMemo(() => {
    const n = element.a;
    const radius = Math.cbrt(n) * 0.48;
    const positions: { base: THREE.Vector3; jitter: number; isProton: boolean }[] = [];
    for (let i = 0; i < n; i++) {
      const r = Math.cbrt(Math.random()) * radius;
      const t = Math.random() * Math.PI * 2;
      const p = Math.acos(2 * Math.random() - 1);
      positions.push({
        base: new THREE.Vector3(
          r * Math.sin(p) * Math.cos(t),
          r * Math.sin(p) * Math.sin(t),
          r * Math.cos(p),
        ),
        jitter: Math.random() * Math.PI * 2,
        isProton: i < element.z,
      });
    }

    const dist = distributeElectrons(element.z);
    const baseR = 4.2;
    const step = 2.1;
    const electrons: ElectronData[] = [];
    dist.forEach((count, si) => {
      const r = (baseR + si * step) * spread;
      for (let i = 0; i < count; i++) {
        electrons.push({
          r,
          tilt: 0.3 + si * 0.5,
          rotZ: si * 0.7,
          phase: (i / count) * Math.PI * 2,
          speed: 0.9 - si * 0.1,
        });
      }
    });

    return {
      nucleonPositions: positions,
      shellConfig: { dist, electrons },
      nucleusRadius: radius * 2.2,
    };
  }, [element, spread]);

  const nucleonMeshRefs = useRef<THREE.Group[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;

    if (nucleusGroup.current) {
      nucleusGroup.current.rotation.y = t * 0.3 * spinSpeed;
      nucleusGroup.current.rotation.x = Math.sin(t * 0.25) * 0.2 * spinSpeed;
    }

    nucleonMeshRefs.current.forEach((mesh, i) => {
      const n = nucleonPositions[i];
      if (!mesh || !n) return;
      const j = n.jitter + t * 4;
      mesh.position.set(
        n.base.x + Math.sin(j) * 0.05,
        n.base.y + Math.cos(j * 1.1) * 0.05,
        n.base.z + Math.sin(j * 0.9) * 0.05,
      );
    });

    if (shellGroup.current) {
      shellGroup.current.rotation.y = t * 0.15 * spinSpeed;
    }
  });

  const baseR = 4.2;
  const step = 2.1;

  return (
    <>
      <group ref={nucleusGroup}>
        <Halo radius={nucleusRadius} />
        {nucleonPositions.map((n, i) => (
          <group
            key={i}
            ref={(el) => {
              if (el) nucleonMeshRefs.current[i] = el;
            }}
          >
            <NucleonMesh isProton={n.isProton} radius={0.38} segments={20} />
          </group>
        ))}
      </group>

      <group ref={shellGroup}>
        {shellConfig.dist.map((_, si) => {
          const r = (baseR + si * step) * spread;
          const tilt = 0.3 + si * 0.5;
          const rotZ = si * 0.7;
          return (
            <group key={`shell-${si}`} rotation={[tilt, 0, rotZ]}>
              <mesh>
                <ringGeometry args={[r - 0.02, r + 0.02, 192]} />
                <meshBasicMaterial
                  color="#7a8aa8"
                  transparent
                  opacity={0.22}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <mesh>
                <ringGeometry args={[r - 0.004, r + 0.004, 192]} />
                <meshBasicMaterial
                  color="#b8c8e8"
                  transparent
                  opacity={0.45}
                  side={THREE.DoubleSide}
                />
              </mesh>
            </group>
          );
        })}

        {shellConfig.electrons.map((e, ei) => (
          <OrbitingElectron
            key={`e-${ei}`}
            data={e}
            spinSpeed={spinSpeed}
            showTrails={showTrails}
          />
        ))}
      </group>
    </>
  );
}

export function AtomSceneLights() {
  return (
    <>
      <ambientLight intensity={0.85} color="#2a2a38" />
      <pointLight position={[10, 10, 12]} intensity={2.4} color="#ffb060" distance={80} />
      <pointLight position={[-12, -6, 10]} intensity={1.4} color="#5a7ed0" distance={80} />
      <pointLight position={[0, 0, 6]} intensity={0.8} color="#6a9fd4" distance={30} />
    </>
  );
}
