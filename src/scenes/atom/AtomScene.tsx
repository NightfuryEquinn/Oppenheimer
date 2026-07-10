import type { ElementData } from "@/types";
import { OrbitControls } from "@react-three/drei";
import { NucleonBloomEffect } from "@/scenes/NucleonBloom";
import { AtomModel, AtomSceneLights } from "./AtomModel";

interface AtomSceneProps {
  element: ElementData;
  spinSpeed: number;
  spread: number;
  showTrails: boolean;
  bloom?: boolean;
}

export function AtomScene({
  element,
  spinSpeed,
  spread,
  showTrails,
  bloom = true,
}: AtomSceneProps) {
  return (
    <>
      <fog attach="fog" args={["#050508", 28, 90]} />
      <AtomSceneLights />
      <AtomModel
        element={element}
        spinSpeed={spinSpeed}
        spread={spread}
        showTrails={showTrails}
      />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI - 0.2}
      />
      <NucleonBloomEffect enabled={bloom} />
    </>
  );
}
