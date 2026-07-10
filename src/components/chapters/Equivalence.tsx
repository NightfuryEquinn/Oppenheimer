import { ChapterHead, Section } from "@/components/layout/ChapterHead";
import { cn } from "@/lib/cn";
import { formatCommas, formatSciEnergy, formatTnt } from "@/lib/format/energy";
import { formatMass } from "@/lib/format/mass";
import { computeEmc2 } from "@/lib/physics/emc2";
import { useState } from "react";

const PRESETS = [
  { label: "paperclip", mass: 0.000001 },
  { label: "grain of sand", mass: 0.0001 },
  { label: "penny", mass: 1 },
  { label: "a human", mass: 62 },
  { label: "a car", mass: 1000 },
];

export function Equivalence() {
  const [logMass, setLogMass] = useState(0);
  const [activePreset, setActivePreset] = useState(1);

  const result = computeEmc2(logMass);
  const mScale = 0.65 + ((logMass + 3) / 6) * 0.9;

  return (
    <Section id="chapter-03" label="03 Equivalence">
      <ChapterHead
        num="03"
        kicker="CHAPTER III — MASS-ENERGY EQUIVALENCE"
        title="A spoonful of matter, the sun."
      />

      <div className="mb-12 text-center">
        <div className="flex flex-wrap items-baseline justify-center gap-2 font-display text-6xl text-paper md:text-8xl">
          <span className="text-amber">E</span>
          <span>=</span>
          <span
            className="inline-block text-steel transition-transform"
            style={{ transform: `scale(${mScale}) translateY(${(mScale - 1) * -8}px)` }}
          >
            m
          </span>
          <span>
            c<sup className="text-2xl">2</sup>
          </span>
        </div>
      </div>

      <div className="grid gap-8 border border-rule bg-bg-2/30 p-6 md:grid-cols-2 md:p-10">
        <div>
          <div className="mb-2 font-mono text-[10px] tracking-widest text-ink-dim uppercase">
            Convert this much mass
          </div>
          <div className="mb-4 font-display text-4xl text-paper">{formatMass(result.massG)}</div>
          <input
            type="range"
            min={-3}
            max={3}
            step={0.01}
            value={logMass}
            onChange={(e) => {
              setLogMass(+e.target.value);
              setActivePreset(-1);
            }}
            className="mb-2 w-full accent-amber"
          />
          <div className="mb-6 flex justify-between font-mono text-[10px] text-ink-faint">
            <span>1 µg</span>
            <span>1 mg</span>
            <span>1 g</span>
            <span>1 kg</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p, i) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setLogMass(Math.log10(p.mass));
                  setActivePreset(i);
                }}
                className={cn(
                  "border px-3 py-1.5 font-mono text-xs tracking-wide uppercase",
                  activePreset === i
                    ? "border-amber text-amber"
                    : "border-rule text-ink-dim hover:text-paper",
                )}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[10px] tracking-widest text-ink-dim uppercase">
            Releases energy equal to
          </div>
          <div className="mb-6 font-display text-4xl text-amber">
            {formatSciEnergy(result.energyJ)}
          </div>

          <div className="mb-6 space-y-2 text-sm">
            {[
              ["TNT equivalent", formatTnt(result.tntKt)],
              ["vs. Trinity (~21 kt)", `${result.trinityRatio.toFixed(2)} ×`],
              ["Lightbulbs lit for 1 year", formatCommas(result.bulbs)],
              ["NYC homes powered for 1 year", formatCommas(result.homes)],
            ].map(([label, val]) => (
              <div key={label} className="flex justify-between border-b border-rule py-2">
                <span className="text-ink-dim">{label}</span>
                <strong className="font-mono text-paper">{val}</strong>
              </div>
            ))}
          </div>

          <div className="relative h-2 bg-bg">
            <div
              className="absolute inset-y-0 left-0 bg-linear-to-r from-steel via-amber to-blood"
              style={{ width: `${result.barPercent}%` }}
            />
          </div>
          <div className="mt-2 flex justify-between font-mono text-[9px] text-ink-faint">
            <span>candle</span>
            <span>kg of coal</span>
            <span>truck of TNT</span>
            <span>Trinity</span>
            <span>Tsar Bomba</span>
          </div>
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-lg text-ink italic">
        &ldquo;The release of atomic energy has not created a new problem. It has merely made more
        urgent the necessity of solving an existing one.&rdquo;
        <span className="mt-2 block text-sm not-italic text-ink-dim">
          — J. R. Oppenheimer, 1946
        </span>
      </p>
    </Section>
  );
}
