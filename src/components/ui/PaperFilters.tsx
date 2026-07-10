import { PAPER_TAGS } from "@/data/papers";
import { cn } from "@/lib/cn";
import type { Paper, PaperTag } from "@/types";

interface PaperFiltersProps {
  activeTag: PaperTag | "all";
  papers: Paper[];
  onTagChange: (tag: PaperTag | "all") => void;
}

export function PaperFilters({ activeTag, papers, onTagChange }: PaperFiltersProps) {
  return (
    <div className="mb-10 flex flex-wrap gap-2">
      {PAPER_TAGS.map(({ tag, label }) => {
        const count =
          tag === "all" ? papers.length : papers.filter((p) => p.tags.includes(tag)).length;
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onTagChange(tag)}
            className={cn(
              "border px-4 py-2 font-mono text-[11px] tracking-wider uppercase transition-colors",
              activeTag === tag
                ? "border-amber bg-amber/10 text-amber"
                : "border-rule text-ink-dim hover:text-paper",
            )}
          >
            {label} <span className="text-ink-faint">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
