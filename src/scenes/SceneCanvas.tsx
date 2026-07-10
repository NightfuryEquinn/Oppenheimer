import { Canvas, type CanvasProps } from "@react-three/fiber";
import type { ReactNode } from "react";
import { Suspense } from "react";
import { cn } from "@/lib/cn";
import { SceneBloom, type SceneBloomSettings } from "./SceneBloom";

interface SceneCanvasProps extends Omit<CanvasProps, "children"> {
  children: ReactNode;
  className?: string;
  active?: boolean;
  bloom?: boolean | SceneBloomSettings;
}

export function SceneCanvas({
  children,
  className,
  active = true,
  camera,
  bloom,
  ...props
}: SceneCanvasProps) {
  const bloomSettings = bloom === true ? {} : bloom;

  return (
    <div className={cn("absolute inset-0", className)}>
      <Canvas
        dpr={[1, 2]}
        frameloop={active ? "always" : "demand"}
        gl={{ antialias: true, alpha: true }}
        camera={camera ?? { fov: 45, position: [0, 0, 22], near: 0.1, far: 200 }}
        {...props}
      >
        <Suspense fallback={null}>{children}</Suspense>
        {bloom && <SceneBloom enabled={active} {...bloomSettings} />}
      </Canvas>
    </div>
  );
}
