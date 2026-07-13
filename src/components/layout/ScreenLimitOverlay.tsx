import { MIN_VIEWPORT_WIDTH, useScreenLimit } from "@/hooks/useScreenLimit";
import { useEffect } from "react";

export function ScreenLimitOverlay() {
  const isLimited = useScreenLimit();

  useEffect(() => {
    if (!isLimited) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isLimited]);

  if (!isLimited) return null;

  return (
    <div className="fixed inset-0 z-3000 flex items-center justify-center bg-bg px-6">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/></svg>")`,
        }}
      />

      <div className="relative w-full max-w-md border border-rule-strong bg-[#1a1712] p-8 shadow-[0_30px_80px_rgba(0,0,0,0.55)] md:p-10">
        <div className="mb-6 inline-block border-4 border-blood px-4 py-1.5 font-mono text-[11px] tracking-[0.32em] text-blood uppercase">
          Viewport restricted
        </div>

        <h2 className="mb-4 font-display text-4xl tracking-[0.06em] text-paper">
          Desktop required
        </h2>

        <p className="mb-8 text-base leading-relaxed text-ink">
          This dossier is designed for larger displays. For the full experience — 3D
          simulations, scroll narrative, and archival layout — please open it on a laptop or
          desktop computer.
        </p>

        <div className="space-y-2 border border-rule bg-bg/40 p-4 font-mono text-[11px] tracking-[0.16em] text-ink-dim uppercase">
          <div>Minimum width: {MIN_VIEWPORT_WIDTH}px</div>
          <div>Recommended: Laptop or PC</div>
          <div>Current window: too narrow</div>
        </div>
      </div>
    </div>
  );
}
