import { SceneCanvas } from "@/scenes/SceneCanvas";
import { NucleusScene } from "@/scenes/nucleus/NucleusScene";
import { useVisibilityPause } from "@/hooks/useVisibilityPause";
import { forwardRef } from "react";
import { cn } from "@/lib/cn";

export const Cover = forwardRef<HTMLElement>(function Cover(_, ref) {
  const { ref: visibilityRef, visible } = useVisibilityPause<HTMLElement>();

  return (
    <section
      id="cover"
      ref={(node) => {
        visibilityRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-screen-label="00 Cover"
      className={cn(
        "relative flex min-h-screen flex-col justify-end overflow-hidden opacity-0",
      )}
    >
      <SceneCanvas active={visible} className="z-0">
        <NucleusScene bloom={visible} />
      </SceneCanvas>

      <div
        className="pointer-events-none absolute inset-0 z-10"
        aria-hidden
        style={{
          background: `
            linear-gradient(90deg, transparent calc(50% - 1px), rgba(199,193,176,0.12) calc(50% - 1px), rgba(199,193,176,0.12) calc(50% + 1px), transparent calc(50% + 1px)),
            linear-gradient(0deg, transparent calc(50% - 1px), rgba(199,193,176,0.12) calc(50% - 1px), rgba(199,193,176,0.12) calc(50% + 1px), transparent calc(50% + 1px))
          `,
        }}
      />

      <div className="relative z-20 mx-auto w-full max-w-content px-6 pb-20 pt-32 md:px-16">
        <div className="mb-8 flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-ink-dim uppercase">
          <span className="inline-block h-px w-8 bg-amber" />
          <span>CLASSIFIED — DECLASSIFIED 1954 · FILE 207-B</span>
        </div>

        <h1 className="mb-10 font-serif leading-none text-paper">
          <span className="block text-3xl md:text-4xl">J. Robert</span>
          <span className="block font-display text-7xl tracking-[0.08em] md:text-9xl">Oppenheimer</span>
        </h1>

        <div className="mb-10 grid gap-6 border-y border-rule py-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["BORN", "22 APR 1904 · New York City"],
            ["DIED", "18 FEB 1967 · Princeton, NJ"],
            ["DISCIPLINE", "Theoretical Physics"],
            ["LEGACY", "Director, Los Alamos · 1943–45"],
          ].map(([label, val]) => (
            <div key={label}>
              <div className="mb-1 font-mono text-xs tracking-widest text-ink-faint">{label}</div>
              <div className="text-base text-paper">{val}</div>
            </div>
          ))}
        </div>

        <p className="max-w-2xl border-l-2 border-amber/50 pl-6 text-xl text-ink italic">
          &ldquo;The physicists have known sin;{" "}
          <em className="text-paper not-italic">and this is a knowledge which they cannot lose.</em>
          &rdquo;
        </p>

        <div className="mt-16 flex items-center gap-4 font-mono text-[11px] tracking-[0.25em] text-ink-dim uppercase">
          <span className="h-px w-12 bg-rule-strong" />
          <span>Scroll to begin</span>
          <span className="text-amber">↓</span>
        </div>
      </div>
    </section>
  );
});
