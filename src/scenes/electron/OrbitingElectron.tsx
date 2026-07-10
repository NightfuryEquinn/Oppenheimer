import { ELECTRON_COLOR, ELECTRON_RADIUS } from "@/scenes/electron/ElectronMesh";
import { Trail } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const TRAIL_COLOR = new THREE.Color(ELECTRON_COLOR);

export interface ElectronOrbitData {
  r: number;
  tilt: number;
  rotZ: number;
  phase: number;
  speed: number;
}

interface OrbitingElectronProps {
  data: ElectronOrbitData;
  spinSpeed?: number;
  speedScale?: number;
  showTrails?: boolean;
}

export function OrbitingElectron({
  data,
  spinSpeed = 1,
  speedScale = 3.2,
  showTrails = false,
}: OrbitingElectronProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const u = data;
    const a = u.phase + t * u.speed * spinSpeed * speedScale;
    const x = Math.cos(a) * u.r;
    const y = Math.sin(a) * u.r;
    const ct = Math.cos(u.tilt);
    const st = Math.sin(u.tilt);
    const cz = Math.cos(u.rotZ);
    const sz = Math.sin(u.rotZ);
    const px = x;
    const py = y * ct;
    const pz = y * st;
    mesh.position.set(px * cz - py * sz, px * sz + py * cz, pz);
  });

  const core = (
    <mesh ref={ref}>
      <sphereGeometry args={[ELECTRON_RADIUS, 12, 12]} />
      <meshBasicMaterial color={ELECTRON_COLOR} />
    </mesh>
  );

  if (!showTrails) return core;

  return (
    <Trail width={0.28} length={18} color={TRAIL_COLOR} attenuation={(t) => t * t * t}>
      {core}
    </Trail>
  );
}
