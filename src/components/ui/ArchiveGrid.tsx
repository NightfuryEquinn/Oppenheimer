import { ARCHIVE_LINKS } from "@/data/archives";

export function ArchiveGrid() {
  return (
    <div className="mt-16 border-t border-rule pt-12">
      <div className="mb-6 font-mono text-[11px] tracking-[0.2em] text-ink-dim uppercase">
        Primary Archives
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {ARCHIVE_LINKS.map((a) => (
          <a
            key={a.href}
            href={a.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border border-rule bg-bg-2/40 p-6 transition-colors hover:border-amber/40"
          >
            <div className="mb-2 font-serif text-xl text-paper">{a.title}</div>
            <p className="mb-4 text-sm text-ink-dim">{a.description}</p>
            <span className="font-mono text-xs text-amber">{a.linkLabel}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
