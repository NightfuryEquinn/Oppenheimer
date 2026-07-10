import type { NavChapter } from "@/types";

export const NAV_CHAPTERS: NavChapter[] = [
  { id: "chapter-01", dataNav: "01", label: "Origin", href: "#chapter-01" },
  { id: "chapter-02", dataNav: "02", label: "Atom", href: "#chapter-02" },
  { id: "chapter-03", dataNav: "03", label: "Relative", href: "#chapter-03" },
  { id: "chapter-04", dataNav: "04", label: "Chain", href: "#chapter-04" },
  { id: "chapter-05", dataNav: "05", label: "Trinity", href: "#chapter-05" },
  { id: "chapter-06", dataNav: "06", label: "Papers", href: "#chapter-06" },
  { id: "chapter-07", dataNav: "07", label: "Legacy", href: "#chapter-07" },
];

export const SCROLL_SECTION_IDS = ["cover", ...NAV_CHAPTERS.map((c) => c.id)];
