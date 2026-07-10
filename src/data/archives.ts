export interface ArchiveLink {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
}

export const ARCHIVE_LINKS: ArchiveLink[] = [
  {
    title: "Library of Congress",
    description:
      "The J. Robert Oppenheimer Papers — 76,000 items: correspondence, lectures, FBI files, 1799–1980.",
    href: "https://www.loc.gov/collections/j-robert-oppenheimer-papers/",
    linkLabel: "loc.gov ↗",
  },
  {
    title: "APS / Physical Review",
    description:
      'Search results for "Oppenheimer" across Phys. Rev., Phys. Rev. Lett., and Rev. Mod. Phys. — the bulk of his peer-reviewed output.',
    href: "https://journals.aps.org/search/results?clauses=%5B%7B%22operator%22%3A%22AND%22%2C%22field%22%3A%22author%22%2C%22value%22%3A%22Oppenheimer%22%7D%5D",
    linkLabel: "journals.aps.org ↗",
  },
  {
    title: "OSTI · DOE",
    description:
      "U.S. Department of Energy archive of declassified Los Alamos technical reports authored or co-authored under his direction.",
    href: "https://www.osti.gov/search/semantic:Oppenheimer",
    linkLabel: "osti.gov ↗",
  },
  {
    title: "Atomic Heritage Foundation",
    description:
      "Oral histories with Oppenheimer's contemporaries; transcripts and audio from Manhattan Project participants.",
    href: "https://ahf.nuclearmuseum.org/voices/oral-histories/",
    linkLabel: "ahf.nuclearmuseum.org ↗",
  },
];
