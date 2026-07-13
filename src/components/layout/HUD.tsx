import { NAV_CHAPTERS, SCROLL_SECTION_IDS } from "@/data/nav";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useHudClock } from "@/hooks/useHudClock";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { cn } from "@/lib/cn";
import { forwardRef } from "react";

function MusicIcon({ muted }: { muted: boolean }) {
  if (muted) {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="block h-4 w-4 shrink-0" aria-hidden>
        <path d="M9 9v6h3l4 3V6l-4 3H9z" strokeLinejoin="round" />
        <path d="M3 3l18 18" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="block h-4 w-4 shrink-0" aria-hidden>
      <path d="M9 9v6h3l4 3V6l-4 3H9z" strokeLinejoin="round" />
      <path d="M18 8.5a4.5 4.5 0 010 7" strokeLinecap="round" />
      <path d="M20.5 6a7.5 7.5 0 010 12" strokeLinecap="round" />
    </svg>
  );
}

export const HUD = forwardRef<HTMLElement>(function HUD(_, ref) {
  const clock = useHudClock();
  const activeId = useScrollSpy(SCROLL_SECTION_IDS);
  const { enabled: musicOn, toggle: toggleMusic } = useBackgroundMusic();

  return (
    <header
      ref={ref}
      className="fixed top-0 right-0 left-0 z-1000 grid grid-cols-[1fr_3fr_1fr] gap-10 items-center bg-linear-to-b from-bg/90 to-transparent px-8 py-4 font-mono text-xs tracking-[0.12em] text-ink-dim uppercase opacity-0 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <span className="font-medium tracking-[0.35em] text-paper">OPPENHEIMER</span>
      </div>

      <nav className="hidden items-center gap-8 md:flex xl:hidden">
        {NAV_CHAPTERS.map((ch) => (
          <a
            key={ch.id}
            href={ch.href}
            data-nav={ch.dataNav}
            aria-label={ch.label}
            className={cn(
              "relative transition-colors hover:text-paper",
              activeId === ch.id ? "text-amber" : "text-ink-dim",
            )}
          >
            {ch.dataNav}
          </a>
        ))}
      </nav>

      <nav className="hidden items-center gap-10 xl:flex xl:gap-12">
        {NAV_CHAPTERS.map((ch) => (
          <a
            key={ch.id}
            href={ch.href}
            data-nav={ch.dataNav}
            className={cn(
              "relative transition-colors hover:text-paper",
              activeId === ch.id ? "text-paper" : "text-ink-dim",
            )}
          >
            <span className="mr-1.5 text-amber">{ch.dataNav}</span>
            {ch.label}
          </a>
        ))}
      </nav>

      <div className="flex w-full items-center justify-end gap-6 text-right text-xs">
        <span>{clock}</span>
        <button
          type="button"
          onClick={toggleMusic}
          aria-label={musicOn ? "Mute background music" : "Play background music"}
          aria-pressed={musicOn}
          title={musicOn ? "Mute music" : "Play music"}
          className={cn(
            "grid min-h-8 min-w-8 place-items-center border transition-colors",
            musicOn
              ? "border-amber/40 text-amber hover:border-amber"
              : "border-rule text-ink-dim hover:border-ink-dim hover:text-paper",
          )}
        >
          <MusicIcon muted={!musicOn} />
        </button>
      </div>
    </header>
  );
});
