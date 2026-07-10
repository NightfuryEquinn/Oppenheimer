import { cn } from "@/lib/cn";
import { forwardRef, type ReactNode } from "react";

interface ChapterHeadProps {
  num: string;
  kicker: string;
  title: string;
  className?: string;
}

export function ChapterHead({ num, kicker, title, className }: ChapterHeadProps) {
  return (
    <div className={cn("mb-12 flex gap-8 border-b border-rule pb-8", className)}>
      <div className="font-display text-6xl leading-none tracking-widest text-amber/80">{num}</div>
      <div>
        <div className="mb-2 font-mono text-base tracking-[0.2em] text-ink-dim uppercase">
          {kicker}
        </div>
        <h2 className="m-0 font-serif text-4xl font-medium text-paper text-balance md:text-5xl">
          {title}
        </h2>
      </div>
    </div>
  );
}

interface SectionProps {
  id: string;
  label: string;
  children: ReactNode;
  className?: string;
}

export const Section = forwardRef<HTMLElement, SectionProps>(function Section(
  { id, label, children, className },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      data-screen-label={label}
      data-chapter-reveal
      className={cn(
        "relative mx-auto w-full max-w-content px-6 py-24 md:px-16",
        className,
      )}
    >
      {children}
    </section>
  );
});
