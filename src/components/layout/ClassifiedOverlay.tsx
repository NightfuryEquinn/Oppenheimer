import { useIntro } from "@/context/IntroContext";
import { cn } from "@/lib/cn";
import { animate, createTimeline } from "animejs";
import { useEffect, useRef } from "react";

interface ClassifiedOverlayProps {
  onDeclassified: () => void;
}

export function ClassifiedOverlay({ onDeclassified }: ClassifiedOverlayProps) {
  const { phase, startDeclassify } = useIntro();
  const overlayRef = useRef<HTMLDivElement>(null);
  const folderRef = useRef<HTMLDivElement>(null);
  const lidRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const sealRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const animatingRef = useRef(false);
  const completedRef = useRef(false);

  useEffect(() => {
    if (phase !== "declassifying" || animatingRef.current) return;
    animatingRef.current = true;
    completedRef.current = false;

    const timeline = createTimeline({
      defaults: { ease: "outExpo" },
      onComplete: () => {
        completedRef.current = true;
        animatingRef.current = false;
        onDeclassified();
      },
    });

    timeline
      .add(ctaRef.current, { opacity: [1, 0], y: [0, 8], duration: 220 })
      .add(
        stampRef.current,
        { scale: [1, 1.08, 0.92], rotate: [12, 8, -4], opacity: [1, 1, 0], duration: 520 },
        80,
      )
      .add(sealRef.current, { scale: [1, 1.15], opacity: [1, 0], duration: 380 }, 180)
      .add(
        lidRef.current,
        {
          rotateX: [0, -108],
          y: [0, -28],
          opacity: [1, 0.35],
          duration: 780,
        },
        260,
      )
      .add(
        folderRef.current,
        { scale: [1, 0.96], y: [0, 24], opacity: [1, 0], duration: 620 },
        420,
      )
      .add(overlayRef.current, { opacity: [1, 0], duration: 520 }, 680);

    return () => {
      if (!completedRef.current) timeline.revert();
      animatingRef.current = false;
    };
  }, [onDeclassified, phase]);

  useEffect(() => {
    if (phase !== "classified") return;

    const pulse = animate(ctaRef.current, {
      opacity: [0.55, 1, 0.55],
      duration: 2200,
      loop: true,
      ease: "inOutSine",
    });

    return () => pulse.revert();
  }, [phase]);

  if (phase !== "classified" && phase !== "declassifying") return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-2000 flex items-center justify-center bg-bg/95 px-6 backdrop-blur-md"
      style={{ perspective: "1200px" }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/></svg>")`,
        }}
      />

      <div className="relative w-full max-w-xl">
        <div
          ref={stampRef}
          className="absolute -top-8 right-2 z-30 border-4 border-blood px-5 py-2 font-mono text-sm tracking-[0.35em] text-blood uppercase"
          style={{ transform: "rotate(12deg)" }}
        >
          Top Secret
        </div>

        <div
          ref={folderRef}
          className="relative border border-rule-strong bg-[#1a1712] shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
        >
          <div className="absolute -top-3 left-8 border border-rule-strong bg-[#262018] px-6 py-2 font-mono text-[11px] tracking-[0.28em] text-amber uppercase">
            File 207-B
          </div>

          <div
            ref={lidRef}
            className="relative z-20 origin-bottom border-b border-rule-strong bg-[#2a241c]"
            style={{ transformStyle: "preserve-3d" }}
          >
            <div className="flex items-center justify-between px-8 py-5">
              <div className="font-mono text-[11px] tracking-[0.22em] text-ink-dim uppercase">
                Manhattan Engineer District
              </div>
              <div
                ref={sealRef}
                className="grid h-14 w-14 place-items-center rounded-full border-2 border-blood/70 text-[9px] leading-tight font-mono tracking-[0.12em] text-blood uppercase"
              >
                Classified
              </div>
            </div>
            <div className="h-px bg-rule-strong" />
            <div className="px-8 py-4 font-mono text-[10px] tracking-[0.3em] text-ink-faint uppercase">
              Eyes only — unauthorized disclosure prohibited
            </div>
          </div>

          <div className="relative z-10 px-8 py-10 md:px-12 md:py-12">
            <div className="mb-3 font-mono text-[11px] tracking-[0.28em] text-ink-faint uppercase">
              Subject dossier
            </div>
            <h2 className="mb-2 font-display text-5xl tracking-[0.08em] text-paper md:text-6xl">
              Oppenheimer
            </h2>
            <p className="mb-8 max-w-md text-base text-ink">
              J. Robert Oppenheimer — theoretical physicist, scientific director of Los Alamos
              Laboratory, 1943–1945.
            </p>

            <div className="mb-8 grid gap-3 border border-rule bg-bg/40 p-4 font-mono text-[11px] tracking-[0.18em] text-ink-dim uppercase sm:grid-cols-2">
              <div>Clearance: Q clearance</div>
              <div>Status: Declassify on order</div>
              <div>Compartment: S-10000</div>
              <div>Pages: 07 chapters</div>
            </div>

            <button
              ref={ctaRef}
              type="button"
              onClick={startDeclassify}
              disabled={phase === "declassifying"}
              className={cn(
                "w-full border px-6 py-4 font-mono text-xs tracking-[0.32em] uppercase transition-colors",
                phase === "declassifying"
                  ? "cursor-wait border-rule text-ink-faint"
                  : "border-amber/50 text-amber hover:border-amber hover:bg-amber/10",
              )}
            >
              Click to declassify
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
