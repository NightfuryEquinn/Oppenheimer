import { ChapterHead, Section } from "@/components/layout/ChapterHead";
import { ArchiveGrid } from "@/components/ui/ArchiveGrid";
import { PaperFilters } from "@/components/ui/PaperFilters";
import { PAPERS } from "@/data/papers";
import { cn } from "@/lib/cn";
import type { PaperTag } from "@/types";
import { useState } from "react";

export function Papers() {
  const [activeTag, setActiveTag] = useState<PaperTag | "all">("all");
  const filtered =
    activeTag === "all" ? PAPERS : PAPERS.filter((p) => p.tags.includes(activeTag));

  return (
    <Section id="chapter-06" label="06 Papers">
      <ChapterHead
        num="06"
        kicker="CHAPTER VI — BIBLIOGRAPHY · PEER-REVIEWED"
        title="The published work, 1926–1963."
      />

      <p className="mb-10 max-w-3xl text-ink">
        Oppenheimer authored or co-authored over a hundred papers. The thirty below — selected from{" "}
        <em>Physical Review</em>, <em>Annalen der Physik</em>, and the{" "}
        <em>Reviews of Modern Physics</em> — trace his arc from quantum tunneling through cosmic-ray
        cascades to the gravitational collapse paper that quietly predicted the black hole.
      </p>

      <PaperFilters activeTag={activeTag} papers={PAPERS} onTagChange={setActiveTag} />

      <ol className="m-0 list-none space-y-0">
        {filtered.map((paper) => (
          <li
            key={`${paper.year}-${paper.title}`}
            className={cn(
              "grid gap-4 border-b border-rule py-8 md:grid-cols-[72px_1fr]",
              paper.seminal && "border-l-2 border-l-amber pl-4",
            )}
          >
            <div className="font-mono text-sm text-amber">{paper.year} - {paper.seminal && 'Seminal'}</div>
            <div>
              <h3 className="mb-1 font-serif text-xl text-paper">
                {paper.title}
                {paper.coAuthors && (
                  <span className="ml-2 text-base font-normal text-ink-dim">{paper.coAuthors}</span>
                )}
              </h3>
              <div className="mb-2 font-mono text-[11px] text-ink-faint italic">{paper.journal}</div>
              <p className="mb-3 text-sm text-ink">{paper.summary}</p>
              <a
                href={paper.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-amber hover:underline"
              >
                {paper.linkLabel}
              </a>
            </div>
          </li>
        ))}
      </ol>

      <ArchiveGrid />
    </Section>
  );
}
