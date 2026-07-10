import { LegacyParticles } from "@/scenes/legacy/LegacyParticles";

export function Legacy() {
  return (
    <section
      id="chapter-07"
      data-screen-label="07 Legacy"
      className="relative min-h-screen overflow-hidden py-24"
    >
      <LegacyParticles />

      <div className="relative z-10 mx-auto w-full max-w-[var(--max-width-content)] px-6 md:px-16">
        <div className="mb-8 font-mono text-[10px] tracking-[0.3em] text-ink-faint uppercase">
          — Bhagavad Gītā · Ch. 11, V. 32 ———
        </div>

        <blockquote className="mb-6 max-w-3xl border-none p-0 font-serif text-4xl leading-tight text-paper md:text-6xl">
          <span className="block">Now I am become</span>
          <span className="block font-display text-7xl text-amber md:text-8xl">Death,</span>
          <span className="block">the destroyer of worlds.</span>
        </blockquote>

        <div className="mb-12 font-mono text-xs text-ink-dim">
          — recalled by Oppenheimer, NBC interview, 1965.
        </div>

        <p className="mb-16 max-w-2xl text-lg text-ink">
          After the war he chaired the Atomic Energy Commission&apos;s General Advisory Committee and
          argued, against Teller and the political winds, that a hydrogen bomb would be a weapon
          &ldquo;of genocide.&rdquo; In 1954 his security clearance was revoked. It was restored,
          formally, sixty-eight years later — in{" "}
          <span className="font-mono text-sm">December 2022</span>.
        </p>

        <div className="grid gap-10 border-t border-rule pt-12 md:grid-cols-3">
          {[
            {
              h: "SOURCES",
              items: [
                "Bird & Sherwin, American Prometheus",
                "Atomic Heritage Foundation archive",
                "Los Alamos National Lab declassified files",
                "NBC News interview, 1965",
              ],
            },
            {
              h: "FURTHER",
              items: [
                "Born–Oppenheimer approximation (1927)",
                "Oppenheimer–Phillips process (1935)",
                "Oppenheimer–Volkoff limit (1939)",
                "Oppenheimer–Snyder collapse (1939)",
              ],
            },
            {
              h: "THIS DOCUMENT",
              items: [
                "An interactive tribute — not affiliated",
                "Original design · physics rendered live",
                "Type: EB Garamond · JetBrains Mono",
                "v 1.0 · 2026",
              ],
            },
          ].map((col) => (
            <div key={col.h}>
              <div className="mb-4 font-mono text-[10px] tracking-widest text-amber">{col.h}</div>
              <ul className="m-0 list-none space-y-2 p-0 text-sm text-ink-dim">
                {col.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center font-mono text-xs tracking-[0.3em] text-ink-faint flex flex-col gap-10">
          <span><b>Disclaimer:</b> Background music taken from Oppenheimer - Ground Zero by Ludwig Göransson</span>
          <span>END OF FILE</span>
        </div>  
      </div>
    </section>
  );
}
