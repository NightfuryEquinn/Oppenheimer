import { ChapterHead, Section } from "@/components/layout/ChapterHead";
import { ElementPicker } from "@/components/ui/ElementPicker";
import { ELEMENTS } from "@/data/elements";
import { useVisibilityPause } from "@/hooks/useVisibilityPause";
import { distributeElectrons } from "@/lib/physics/atomShells";
import { SceneCanvas } from "@/scenes/SceneCanvas";
import { AtomScene } from "@/scenes/atom/AtomScene";
import type { ElementSymbol } from "@/types";
import { useState } from "react";

export function AtomLab() {
  const { ref, visible } = useVisibilityPause<HTMLElement>();
  const [element, setElement] = useState<ElementSymbol>("U");
  const [spin, setSpin] = useState(25);
  const [spread, setSpread] = useState(80);
  const [trails, setTrails] = useState(true);

  const el = ELEMENTS[element];
  const spinSpeed = (spin / 100) * 1.5;
  const spreadNorm = spread / 100;
  const shellCount = distributeElectrons(el.z).length;

  return (
    <Section id="chapter-02" label="02 The Atom" ref={ref}>
      <ChapterHead
        num="02"
        kicker="CHAPTER II — THE ATOM"
        title="Mostly empty. Mostly impossible."
      />

      <div className="grid gap-0 overflow-hidden border border-rule lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* 3D stage */}
        <div className="relative min-h-[480px] border-b border-rule bg-[#050508] lg:min-h-[560px] lg:border-r lg:border-b-0">
          <SceneCanvas
            active={visible}
            camera={{ fov: 40, position: [0, 0, 32], near: 0.1, far: 200 }}
          >
            <AtomScene
              element={el}
              spinSpeed={spinSpeed}
              spread={spreadNorm}
              showTrails={trails}
              bloom={visible}
            />
          </SceneCanvas>

          {/* crosshair */}
          <div className="pointer-events-none absolute inset-0 z-10" aria-hidden>
            <span className="absolute top-1/2 left-0 h-px w-full bg-rule-strong/40" />
            <span className="absolute top-0 left-1/2 h-full w-px bg-rule-strong/40" />
          </div>

          <div className="pointer-events-none absolute right-5 bottom-5 z-20 font-mono text-xs tracking-[0.12em] text-ink-dim uppercase">
            Drag to orbit
          </div>

          {/* telemetry readout */}
          <div className="absolute top-5 left-5 z-20 min-w-[140px] border border-rule bg-bg/85 p-4 font-mono text-xs tracking-wider backdrop-blur-sm">
            {[
              ["Z", el.z],
              ["A", el.a],
              ["SHELLS", shellCount],
            ].map(([label, val]) => (
              <div key={String(label)} className="flex justify-between gap-6 py-0.5">
                <span className="text-ink-dim">{label}</span>
                <span className="text-paper">{val}</span>
              </div>
            ))}
            <div className="mt-2 flex justify-between gap-6 border-t border-rule pt-2">
              <span className="text-ink-dim">STATE</span>
              <span className={el.stable ? "text-green-400" : "text-orange-400"}>
                {el.stable ? "STABLE" : "UNSTABLE"}
              </span>
            </div>
          </div>
        </div>

        {/* control panel */}
        <aside className="flex flex-col gap-8 bg-bg-2/60 p-8">
          <div className="border border-rule bg-bg/50 p-6 text-center">
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="text-right font-mono text-lg text-ink-dim">{el.z}</div>
              <div className="font-display text-7xl leading-none text-amber">{el.sym}</div>
              <div className="text-left font-mono text-lg text-ink-dim">{el.mass}</div>
            </div>
            <div className="mt-2 font-serif text-2xl text-paper">{el.name}</div>
          </div>

          <p className="m-0 border-l-2 border-amber/40 pl-4 text-[18px] leading-relaxed text-ink">
            {el.caption}
          </p>

          <div>
            <div className="mb-3 font-mono text-base tracking-[0.15em] text-ink-dim uppercase">
              Select element
            </div>
            <ElementPicker active={element} onSelect={setElement} />
          </div>

          <div className="space-y-6 border-t border-rule pt-6">
            <div className="font-mono text-base tracking-[0.15em] text-ink-dim uppercase">
              Instrument controls
            </div>

            <label className="block">
              <div className="mb-2 flex justify-between font-mono text-base text-ink-dim">
                <span>Rotation</span>
                <span className="text-paper">{spin}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={spin}
                onChange={(e) => setSpin(+e.target.value)}
                className="w-full accent-amber"
              />
            </label>

            <label className="block">
              <div className="mb-2 flex justify-between font-mono text-base text-ink-dim">
                <span>Orbit spread</span>
                <span className="text-paper">{spread}%</span>
              </div>
              <input
                type="range"
                min={40}
                max={160}
                value={spread}
                onChange={(e) => setSpread(+e.target.value)}
                className="w-full accent-amber"
              />
            </label>

            <label className="flex cursor-pointer items-center gap-3 font-mono text-[18px] text-ink">
              <input
                type="checkbox"
                checked={trails}
                onChange={(e) => setTrails(e.target.checked)}
                className="h-4 w-4 accent-amber"
              />
              <span>Electron trails</span>
            </label>
          </div>
        </aside>
      </div>
    </Section>
  );
}
