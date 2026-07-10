export type PaperTag = "quantum" | "nuclear" | "cosmic" | "astro" | "qed";

export interface Paper {
  year: number;
  title: string;
  coAuthors?: string;
  journal: string;
  summary: string;
  href: string;
  linkLabel: string;
  tags: PaperTag[];
  seminal?: boolean;
}
