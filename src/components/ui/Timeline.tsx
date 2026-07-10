import type { TimelineEvent } from "@/types";
import { cn } from "@/lib/cn";

interface TimelineProps {
  events: TimelineEvent[];
}

export function Timeline({ events }: TimelineProps) {
  return (
    <ol className="m-0 list-none space-y-0 pl-0">
      {events.map((ev) => (
        <li
          key={ev.year}
          className={cn(
            "grid gap-4 border-b border-rule py-8 md:grid-cols-[100px_1fr]",
          )}
        >
          <div className="font-mono text-sm tracking-widest text-amber">{ev.year}</div>
          <div>
            <h3 className="mb-2 font-serif text-2xl text-paper">{ev.title}</h3>
            <p className="m-0 text-ink">{ev.body}</p>
            {ev.formula && (
              <div className="mt-4 border border-rule bg-bg-2/50 px-4 py-3 font-mono text-sm text-steel">
                {ev.formula}
              </div>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
