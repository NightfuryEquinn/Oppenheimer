import type { Paper, PaperTag } from "@/types";

export const PAPER_TAGS: { tag: PaperTag | "all"; label: string }[] = [
  { tag: "all", label: "All" },
  { tag: "quantum", label: "Quantum mechanics" },
  { tag: "nuclear", label: "Nuclear physics" },
  { tag: "cosmic", label: "Cosmic rays" },
  { tag: "astro", label: "Astrophysics" },
  { tag: "qed", label: "QED & field theory" },
];

export const PAPERS: Paper[] = [
  {
    year: 1926,
    title: "On the Quantum Theory of Vibration-Rotation Bands",
    journal: "Proceedings of the Cambridge Philosophical Society, vol. 23, p. 327 (1926)",
    summary:
      "His first published paper, written at Cambridge under E. C. Stoner. Sets up a matrix-mechanics treatment of diatomic spectra.",
    href: "https://doi.org/10.1017/S0305004100015231",
    linkLabel: "doi 10.1017/S0305004100015231 ↗",
    tags: ["quantum"],
  },
  {
    year: 1927,
    title: "Zur Quantentheorie der Molekeln",
    coAuthors: "with Max Born",
    journal: "Annalen der Physik, vol. 389, no. 20, pp. 457–484 (1927)",
    summary:
      "The Born–Oppenheimer approximation. Separates nuclear and electronic motion because nuclei are thousands of times heavier than electrons. Still the working assumption of essentially every computational chemistry code in use today.",
    href: "https://doi.org/10.1002/andp.19273892002",
    linkLabel: "doi 10.1002/andp.19273892002 ↗",
    tags: ["quantum"],
  },
  {
    year: 1927,
    title: "Bemerkung zur Zerstreuung der α-Teilchen",
    journal: "Zeitschrift für Physik, vol. 43, p. 413 (1927)",
    summary:
      "His Göttingen doctoral thesis, in print. Computes the continuous X-ray spectrum from quantum mechanics — work that earned his Ph.D. under Born at twenty-three.",
    href: "https://doi.org/10.1007/BF01397340",
    linkLabel: "doi 10.1007/BF01397340 ↗",
    tags: ["quantum"],
  },
  {
    year: 1928,
    title: "Three Notes on the Quantum Theory of Aperiodic Effects",
    journal: "Physical Review, vol. 31, pp. 66–81 (Jan 1928)",
    summary:
      "First rigorous quantum-mechanical calculation of electron tunneling through a Coulomb barrier — months before Gamow used the same idea to explain α-decay.",
    href: "https://doi.org/10.1103/PhysRev.31.66",
    linkLabel: "doi 10.1103/PhysRev.31.66 ↗",
    tags: ["quantum"],
  },
  {
    year: 1928,
    title: "On the Quantum Theory of the Capture of Electrons",
    journal: "Physical Review, vol. 31, p. 349 (1928)",
    summary:
      "Quantum theory of an ion picking up a free electron — the inverse of photoionization. Bridges Bohr's correspondence-principle work and the new wave mechanics.",
    href: "https://doi.org/10.1103/PhysRev.31.349",
    linkLabel: "doi 10.1103/PhysRev.31.349 ↗",
    tags: ["quantum"],
  },
  {
    year: 1928,
    title: "On the Quantum Theory of the Polarization of Impact Radiation",
    journal: "Proceedings of the National Academy of Sciences, vol. 14, p. 261 (1928)",
    summary:
      "Predicts the polarization of light emitted when atoms are excited by electron impact — confirmed experimentally a few years later.",
    href: "https://doi.org/10.1073/pnas.14.3.261",
    linkLabel: "doi 10.1073/pnas.14.3.261 ↗",
    tags: ["qed"],
  },
  {
    year: 1930,
    title: "On the Theory of Electrons and Protons",
    journal: "Physical Review, vol. 35, pp. 562–563 (Mar 1930)",
    summary:
      'Argues that the "holes" in Dirac\'s relativistic electron sea cannot be protons — they must be a new particle, electron-mass and opposite charge. Anderson finds the positron two years later.',
    href: "https://doi.org/10.1103/PhysRev.35.562",
    linkLabel: "doi 10.1103/PhysRev.35.562 ↗",
    tags: ["qed"],
  },
  {
    year: 1930,
    title: "Note on the Theory of the Interaction of Field and Matter",
    journal: "Physical Review, vol. 35, pp. 461–477 (Mar 1930)",
    summary:
      "One of the earliest computations of self-energy in quantum electrodynamics — finds the divergences that would torment field theory until renormalization, twenty years later.",
    href: "https://doi.org/10.1103/PhysRev.35.461",
    linkLabel: "doi 10.1103/PhysRev.35.461 ↗",
    tags: ["qed"],
  },
  {
    year: 1931,
    title: "Note on Light Quanta and the Electromagnetic Field",
    journal: "Physical Review, vol. 38, pp. 725–746 (1931)",
    summary:
      "A QED treatment of photon emission and absorption that anticipates the language of second quantization.",
    href: "https://doi.org/10.1103/PhysRev.38.725",
    linkLabel: "doi 10.1103/PhysRev.38.725 ↗",
    tags: ["qed"],
  },
  {
    year: 1933,
    title: "On the Production of Positive Electrons",
    coAuthors: "with M. S. Plesset",
    journal: "Physical Review, vol. 44, pp. 53–55 (1933)",
    summary:
      "Within a year of Anderson's positron discovery, computes the cross section for pair-production by γ-rays in the field of a nucleus.",
    href: "https://doi.org/10.1103/PhysRev.44.53.2",
    linkLabel: "doi 10.1103/PhysRev.44.53.2 ↗",
    tags: ["qed"],
  },
  {
    year: 1935,
    title: "Note on the Transmutation Function for Deuterons",
    coAuthors: "with M. Phillips",
    journal: "Physical Review, vol. 48, pp. 500–502 (Sep 1935)",
    summary:
      "The Oppenheimer–Phillips process: a deuteron approaching a nucleus is polarized so that its proton is repelled while its neutron is captured — explains anomalously high deuteron cross sections at low energies.",
    href: "https://doi.org/10.1103/PhysRev.48.500",
    linkLabel: "doi 10.1103/PhysRev.48.500 ↗",
    tags: ["nuclear"],
  },
  {
    year: 1936,
    title: "On the Stopping of Fast Particles by Electrons",
    coAuthors: "with H. Hall",
    journal: "Physical Review, vol. 49, pp. 925–931 (1936)",
    summary:
      "Quantum-mechanical treatment of energy loss by fast charged particles traversing matter — a tool that the cosmic-ray community would lean on for decades.",
    href: "https://doi.org/10.1103/PhysRev.49.925",
    linkLabel: "doi 10.1103/PhysRev.49.925 ↗",
    tags: ["cosmic"],
  },
  {
    year: 1937,
    title: "On Multiplicative Showers",
    coAuthors: "with J. F. Carlson",
    journal: "Physical Review, vol. 51, pp. 220–231 (Feb 1937)",
    summary:
      "The first complete cascade theory of electromagnetic showers in cosmic rays: an electron radiates a photon, the photon makes a pair, each member radiates, on and on. Still the textbook account.",
    href: "https://doi.org/10.1103/PhysRev.51.220",
    linkLabel: "doi 10.1103/PhysRev.51.220 ↗",
    tags: ["cosmic"],
  },
  {
    year: 1937,
    title: "Note on the Nature of Cosmic-Ray Particles",
    coAuthors: "with R. Serber",
    journal: "Physical Review, vol. 51, p. 1113 (1937)",
    summary:
      "Suggests the penetrating component of cosmic rays is a new heavy charged particle — what would shortly be identified as the muon.",
    href: "https://doi.org/10.1103/PhysRev.51.1113",
    linkLabel: "doi 10.1103/PhysRev.51.1113 ↗",
    tags: ["cosmic"],
  },
  {
    year: 1937,
    title: "Are the Formulae for the Absorption of High-Energy Radiation Valid?",
    coAuthors: "with R. Serber",
    journal: "Physical Review, vol. 51, p. 1037 (1937)",
    summary:
      "Tests Bethe–Heitler theory against high-energy cosmic-ray data. The answer: yes, but new physics is needed at the highest energies.",
    href: "https://doi.org/10.1103/PhysRev.51.1037",
    linkLabel: "doi 10.1103/PhysRev.51.1037 ↗",
    tags: ["nuclear"],
  },
  {
    year: 1938,
    title: "On Nuclear Spins",
    coAuthors: "with J. Schwinger",
    journal: "Physical Review, vol. 53, p. 209 (1938)",
    summary:
      "An early collaboration with the future Nobel laureate, computing the spins of light nuclei within a shell-model framework.",
    href: "https://doi.org/10.1103/PhysRev.53.209",
    linkLabel: "doi 10.1103/PhysRev.53.209 ↗",
    tags: ["nuclear"],
  },
  {
    year: 1938,
    title: "On the Stability of Stellar Neutron Cores",
    coAuthors: "with R. Serber",
    journal: "Physical Review, vol. 54, p. 540 (1938)",
    summary:
      "A note on the equation of state inside collapsed stars — a warm-up for the Tolman–Oppenheimer–Volkoff paper a year later.",
    href: "https://doi.org/10.1103/PhysRev.54.540",
    linkLabel: "doi 10.1103/PhysRev.54.540 ↗",
    tags: ["astro"],
  },
  {
    year: 1939,
    title: "On Massive Neutron Cores",
    coAuthors: "with G. M. Volkoff",
    journal: "Physical Review, vol. 55, pp. 374–381 (Feb 1939)",
    summary:
      "The Tolman–Oppenheimer–Volkoff limit: above ~0.7 solar masses (now revised to ~2.2 M☉), no static neutron star is stable. Gravity wins. The paper that launched compact-object astrophysics.",
    href: "https://doi.org/10.1103/PhysRev.55.374",
    linkLabel: "doi 10.1103/PhysRev.55.374 ↗",
    tags: ["astro"],
  },
  {
    year: 1939,
    title: "On Continued Gravitational Contraction",
    coAuthors: "with H. Snyder",
    journal: "Physical Review, vol. 56, pp. 455–459 (1 Sep 1939)",
    summary:
      'The black-hole paper. Solves Einstein\'s equations for a collapsing pressureless sphere and shows the surface falls inside the Schwarzschild radius in finite proper time but infinite coordinate time — the "frozen star" that becomes a black hole. Published the day Germany invades Poland; ignored for thirty years.',
    href: "https://doi.org/10.1103/PhysRev.56.455",
    linkLabel: "doi 10.1103/PhysRev.56.455 ↗",
    tags: ["astro"],
    seminal: true,
  },
  {
    year: 1939,
    title: "The Disintegration of High Energy Protons",
    coAuthors: "with J. F. Carlson",
    journal: "Physical Review, vol. 51, p. 1003 (1937; expanded 1939)",
    summary:
      "Mechanism for proton-induced cosmic-ray showers. Re-issued with corrections after the muon was recognised as a separate particle.",
    href: "https://doi.org/10.1103/PhysRev.51.1003",
    linkLabel: "doi 10.1103/PhysRev.51.1003 ↗",
    tags: ["cosmic"],
  },
  {
    year: 1941,
    title: "The Mesotron and the Quantum Theory of Fields",
    journal: "Physical Review, vol. 59, p. 462 (1941)",
    summary:
      "Surveys the state of meson theory just before the war shuts pure research down. A snapshot of what Oppenheimer's school believed about the strong force in the spring of 1941.",
    href: "https://doi.org/10.1103/PhysRev.59.462",
    linkLabel: "doi 10.1103/PhysRev.59.462 ↗",
    tags: ["cosmic"],
  },
  {
    year: 1941,
    title: "Internal Conversion in Photosynthesis",
    journal: "Physical Review, vol. 60, p. 158 (1941)",
    summary:
      "An uncharacteristic excursion into biophysics: a quantum-mechanical model of resonant energy transfer between chlorophyll molecules. Half a century later, the same mechanism shows up in coherent excitonic transport.",
    href: "https://doi.org/10.1103/PhysRev.60.158",
    linkLabel: "doi 10.1103/PhysRev.60.158 ↗",
    tags: ["quantum"],
  },
  {
    year: 1946,
    title: "The Radioactivity of the Earth's Crust",
    journal: "Reviews of Modern Physics, vol. 18, p. 466 (1946)",
    summary:
      "His first post-war publication. Resumes the conversation he had paused at Berkeley in 1942.",
    href: "https://doi.org/10.1103/RevModPhys.18.466",
    linkLabel: "doi 10.1103/RevModPhys.18.466 ↗",
    tags: ["nuclear"],
  },
  {
    year: 1948,
    title: "Electron Theory: Description and Discussion",
    coAuthors: "Shelter Island conference report",
    journal: "Reviews of Modern Physics, vol. 20, p. 1 (1948)",
    summary:
      "As chair of the conference that launched modern QED, Oppenheimer writes the keynote: Lamb shift, anomalous moment, renormalization. The agenda for a decade of work by Feynman, Schwinger, Tomonaga.",
    href: "https://doi.org/10.1103/RevModPhys.20.1",
    linkLabel: "doi 10.1103/RevModPhys.20.1 ↗",
    tags: ["qed"],
  },
  {
    year: 1948,
    title: "Note on the Quantum Theory of the Crystalline State",
    journal: "Physical Review, vol. 73, p. 1267 (1948)",
    summary:
      "Reflections on cooperative phenomena in solids, written as solid-state physics begins to spin off from the atomic-physics community at Berkeley.",
    href: "https://doi.org/10.1103/PhysRev.73.1267",
    linkLabel: "doi 10.1103/PhysRev.73.1267 ↗",
    tags: ["qed"],
  },
  {
    year: 1948,
    title: "Physics in the Contemporary World",
    coAuthors: "Arthur D. Little Lecture, MIT",
    journal: "Bulletin of the Atomic Scientists, vol. 4, no. 3, pp. 65–86 (Mar 1948)",
    summary:
      'The "known sin" lecture. Not technical — but the most-cited piece of writing he ever produced.',
    href: "https://doi.org/10.1080/00963402.1948.11460172",
    linkLabel: "doi 10.1080/00963402.1948.11460172 ↗",
    tags: ["nuclear"],
  },
  {
    year: 1950,
    title: "Note on Charged Meson Photoproduction",
    journal: "Physical Review, vol. 77, p. 569 (1950)",
    summary:
      "A late-career return to meson physics. The accelerators are now strong enough to test the theories of his 1941 review.",
    href: "https://doi.org/10.1103/PhysRev.77.569",
    linkLabel: "doi 10.1103/PhysRev.77.569 ↗",
    tags: ["qed"],
  },
  {
    year: 1953,
    title: "Atomic Weapons and American Policy",
    journal: "Foreign Affairs, vol. 31, no. 4, pp. 525–535 (July 1953)",
    summary:
      'Published nine months before his security hearing. Compares the two superpowers to "two scorpions in a bottle."',
    href: "https://www.foreignaffairs.com/articles/united-states/1953-07-01/atomic-weapons-and-american-policy",
    linkLabel: "foreignaffairs.com ↗",
    tags: ["nuclear"],
  },
  {
    year: 1963,
    title: "Niels Bohr and His Times",
    coAuthors: "Pegram Lectures",
    journal: "Brookhaven National Laboratory; reprinted Oxford U. P., 1964",
    summary:
      'His extended reflection on Bohr — the man Oppenheimer called "our Uncle Nicholas" at Los Alamos.',
    href: "https://www.osti.gov/biblio/4683948",
    linkLabel: "osti.gov / OSTI 4683948 ↗",
    tags: ["quantum"],
  },
];
