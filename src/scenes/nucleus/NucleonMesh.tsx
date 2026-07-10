import * as THREE from "three";

interface NucleonMeshProps {
  isProton: boolean;
  radius?: number;
  segments?: number;
}

export function NucleonMesh({ isProton, radius = 0.38, segments = 20 }: NucleonMeshProps) {
  const glowColor = isProton ? "#ffb060" : "#e8e2d8";
  const coreColor = isProton ? "#f0b06a" : "#c8c2b4";
  const emissive = isProton ? "#ff9020" : "#8a8478";

  return (
    <group>
      <mesh scale={isProton ? 1.55 : 1.4}>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshBasicMaterial
          color={glowColor}
          transparent
          opacity={isProton ? 0.28 : 0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
        />
      </mesh>
      <mesh>
        <sphereGeometry args={[radius, segments, segments]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={emissive}
          emissiveIntensity={isProton ? 2.2 : 1.1}
          roughness={isProton ? 0.28 : 0.48}
          metalness={0.12}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}
