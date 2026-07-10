import portrait from "@/assets/oppenheimer.jpg";
import { TIMELINE_EVENTS } from "@/data/timeline";
import { ChapterHead, Section } from "@/components/layout/ChapterHead";
import { Timeline } from "@/components/ui/Timeline";

export function Origin() {
  return (
    <Section id="chapter-01" label="01 Origin">
      <ChapterHead
        num="01"
        kicker="ORIGIN — 1904 to 1942"
        title="A mind tuned to the very small."
      />

      <div className="grid gap-12 lg:grid-cols-[minmax(240px,320px)_1fr]">
        <div>
          <div className="border border-rule bg-bg-2/50 p-3">
            <img
              src={portrait}
              alt="Oppenheimer archival portrait"
              className="aspect-4/5 w-full object-cover grayscale"
            />
            <div className="mt-3 flex items-start gap-2 border-t border-rule pt-3 text-xs text-ink-dim">
              <span className="font-mono text-amber">PLATE I</span>
              <span>Oppenheimer, c. 1944 — Berkeley faculty era.</span>
            </div>
          </div>
        </div>
        <Timeline events={TIMELINE_EVENTS} />
      </div>
    </Section>
  );
}
