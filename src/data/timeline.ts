import type { TimelineEvent } from "@/types";

export const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: 1904,
    title: "A son of New York.",
    body: "Julius Robert Oppenheimer is born on West 88th Street to a textile-importer family. He reads Greek by twelve, mineralogy by fourteen, and is invited to lecture at the New York Mineralogical Club — they assume he is an adult.",
  },
  {
    year: 1925,
    title: "Harvard, then Cambridge.",
    body: "Graduates summa cum laude in chemistry in three years. Sails for the Cavendish Laboratory to work under J. J. Thomson, but discovers the lab and his temperament agree poorly.",
  },
  {
    year: 1927,
    title: "Göttingen, and the new quantum.",
    body: "Earns his Ph.D. under Max Born at twenty-three. With Born, derives the Born–Oppenheimer approximation — still the working assumption for nearly every molecule we model today.",
    formula: "Ψ_total(r,R) ≈ ψ_e(r;R) · χ_N(R)",
  },
  {
    year: 1930,
    title: "The positron, predicted.",
    body: 'Working from Dirac\'s equation, Oppenheimer argues the "holes" cannot be protons — they must be a new particle, mass of an electron, opposite charge. Anderson finds it two years later.',
  },
  {
    year: 1939,
    title: "Black holes, on paper.",
    body: 'With Snyder, publishes "On Continued Gravitational Contraction" — the first rigorous description of gravitational collapse to what we now call a black hole. The paper appears on 1 Sep 1939: the same day Germany invades Poland.',
  },
];
