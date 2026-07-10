import type { ElementSymbol } from "@/types";
import { ELEMENT_SYMBOLS } from "@/data/elements";
import { cn } from "@/lib/cn";

interface ElementPickerProps {
  active: ElementSymbol;
  onSelect: (sym: ElementSymbol) => void;
}

export function ElementPicker({ active, onSelect }: ElementPickerProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {ELEMENT_SYMBOLS.map((sym) => (
        <button
          key={sym}
          type="button"
          onClick={() => onSelect(sym)}
          className={cn(
            "min-w-[52px] border px-4 py-2.5 font-mono text-[18px] tracking-wider transition-colors",
            active === sym
              ? "border-amber bg-amber/15 text-amber"
              : "border-rule text-ink-dim hover:border-ink-dim hover:text-paper",
          )}
        >
          {sym}
        </button>
      ))}
    </div>
  );
}
