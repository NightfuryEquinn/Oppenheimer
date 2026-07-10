import { SceneBloom, type SceneBloomSettings } from "./SceneBloom";

const DEFAULT_NUCLEON_BLOOM: Required<SceneBloomSettings> = {
  intensity: 1.65,
  luminanceThreshold: 0.08,
  luminanceSmoothing: 0.25,
  mipmapBlur: true,
};

interface NucleonBloomEffectProps extends SceneBloomSettings {
  enabled?: boolean;
}

export function NucleonBloomEffect({ enabled = true, ...overrides }: NucleonBloomEffectProps) {
  return <SceneBloom enabled={enabled} {...DEFAULT_NUCLEON_BLOOM} {...overrides} />;
}
