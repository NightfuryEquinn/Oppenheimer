import { Bloom, EffectComposer } from "@react-three/postprocessing";

export interface SceneBloomSettings {
  intensity?: number;
  luminanceThreshold?: number;
  luminanceSmoothing?: number;
  mipmapBlur?: boolean;
}

const DEFAULT_BLOOM: Required<SceneBloomSettings> = {
  intensity: 0.9,
  luminanceThreshold: 0.2,
  luminanceSmoothing: 0.4,
  mipmapBlur: true,
};

interface SceneBloomProps extends SceneBloomSettings {
  enabled?: boolean;
}

export function SceneBloom({ enabled = true, ...overrides }: SceneBloomProps) {
  if (!enabled) return null;

  const bloom = { ...DEFAULT_BLOOM, ...overrides };

  return (
    <EffectComposer multisampling={0}>
      <Bloom
        intensity={bloom.intensity}
        luminanceThreshold={bloom.luminanceThreshold}
        luminanceSmoothing={bloom.luminanceSmoothing}
        mipmapBlur={bloom.mipmapBlur}
      />
    </EffectComposer>
  );
}
