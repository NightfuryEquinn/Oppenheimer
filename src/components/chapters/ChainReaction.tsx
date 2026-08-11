import { ChapterHead, Section } from "@/components/layout/ChapterHead";
import { getSeedParam } from "@/lib/perf/devFlags";
import { ChainCanvas } from "@/scenes/chain/ChainCanvas";
import { ChainSimulation } from "@/scenes/chain/ChainSimulation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

const NOTES = [
  {
    h: "CRITICAL MASS",
    p: "The smallest amount of U-235 that sustains a chain reaction: ~52 kg as a bare sphere; far less when surrounded by a neutron reflector.",
  },
  {
    h: "PROMPT NEUTRONS",
    p: "Most are released within 10⁻¹⁴ s of fission. The entire history of the bomb — from initiator to fireball — is over in under a microsecond.",
  },
  {
    h: "k_eff",
    p: "If k < 1 the reaction dies. If k = 1 it idles, as in a reactor. If k > 1 it grows exponentially. Trinity reached k ≈ 2.",
  },
];

export function ChainReaction() {
  const sim = useMemo(() => new ChainSimulation(getSeedParam() ?? undefined), []);
  const [, setTick] = useState(0);
  const stageRef = useRef<HTMLDivElement>(null);

  const refresh = useCallback(() => setTick((t) => t + 1), []);
  const stats = sim.getStats();

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const onClick = (e: MouseEvent) => {
      const rect = stage.getBoundingClientRect();
      sim.fireNeutron(e.clientX - rect.left, e.clientY - rect.top, 0);
      refresh();
    };
    stage.addEventListener("click", onClick);
    return () => stage.removeEventListener("click", onClick);
  }, [sim, refresh]);

  return (
    <Section id="chapter-04" label="04 Chain Reaction">
      <ChapterHead
        num="04"
        kicker="CHAPTER IV — FISSION · INTERACTIVE"
        title="One neutron. Then everything."
      />

      <div className="mb-8 max-w-3xl space-y-3 text-ink">
        <p>
          A free neutron strikes a{" "}
          <span className="font-mono text-amber">U-235</span> nucleus. The nucleus splits,
          releasing energy — and on average <strong className="text-paper">2.43 more neutrons</strong>.
          If the geometry is right, each of those finds its own nucleus. The doubling cascades.
        </p>
        <p className="font-mono text-base tracking-wide text-ink-dim uppercase">
          Click anywhere on the lattice to fire a neutron.
        </p>
      </div>

      <div
        ref={stageRef}
        className="relative mb-8 aspect-16/10 min-h-[400px] cursor-crosshair border border-rule bg-[#030408]"
      >
        <ChainCanvas sim={sim} onStats={refresh} />

        <div className="absolute top-4 right-4 z-10 space-y-2 border border-rule bg-bg/80 p-4 font-mono text-xs tracking-wider backdrop-blur-sm">
          <div className="flex justify-between gap-8">
            <span className="text-ink-dim">FISSIONS</span>
            <strong className="text-paper">{stats.fissionCount}</strong>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-ink-dim">GENERATION</span>
            <strong className="text-paper">{stats.currentGen}</strong>
          </div>
          <div className="flex justify-between gap-8">
            <span className="text-ink-dim">k_eff</span>
            <strong className="text-paper">
              {stats.kEff !== null ? stats.kEff.toFixed(2) : "—"}
            </strong>
          </div>
          <button
            type="button"
            onClick={() => {
              sim.reset();
              refresh();
            }}
            className="mt-2 w-full border border-rule px-3 py-2 text-ink-dim transition-colors hover:border-amber hover:text-amber"
          >
            RESET LATTICE
          </button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {NOTES.map((note) => (
          <div key={note.h} className="border border-rule bg-bg-2/30 p-5">
            <div className="mb-2 font-mono text-base tracking-widest text-amber">{note.h}</div>
            <p className="m-0 text-[18px] text-ink-dim">{note.p}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
