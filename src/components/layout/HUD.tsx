import { NAV_CHAPTERS, SCROLL_SECTION_IDS } from "@/data/nav";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useHudClock } from "@/hooks/useHudClock";
import { cn } from "@/lib/cn";

export function HUD() {
  const clock = useHudClock();
  const activeId = useScrollSpy(SCROLL_SECTION_IDS);

  return (
    <header className="fixed top-0 right-0 left-0 z-1000 grid grid-cols-[1fr_auto_1fr] items-center bg-linear-to-b from-bg/90 to-transparent px-8 py-4 font-mono text-xs tracking-[0.12em] text-ink-dim uppercase backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <span className="font-medium tracking-[0.35em] text-paper">OPPENHEIMER</span>
      </div>

      <nav className="hidden items-center gap-10 lg:gap-12 md:flex">
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

      <div className="flex w-full items-center justify-end gap-10 text-right text-xs">
        <span>{clock}</span>
        <div className="hidden flex-col gap-0.5 sm:flex">
          <span>LAT 33.6773° N</span>
          <span>LON 106.4754° W</span>
        </div>
      </div>
    </header>
  );
}
