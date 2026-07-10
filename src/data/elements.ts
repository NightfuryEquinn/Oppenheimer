import type { ElementData, ElementSymbol } from "@/types";

export const ELEMENTS: Record<ElementSymbol, ElementData> = {
  H: {
    z: 1,
    a: 1,
    sym: "H",
    name: "Hydrogen",
    mass: "1.008 u",
    caption:
      "A lone proton, a lone electron — the simplest atom and the most abundant element in the universe.",
    stable: true,
  },
  He: {
    z: 2,
    a: 4,
    sym: "He",
    name: "Helium",
    mass: "4.0026 u",
    caption: "Two electrons fill the first shell; helium is inert, complete in itself.",
    stable: true,
  },
  C: {
    z: 6,
    a: 12,
    sym: "C",
    name: "Carbon",
    mass: "12.011 u",
    caption:
      "Four valence electrons. The backbone of every molecule that has ever thought a thought.",
    stable: true,
  },
  O: {
    z: 8,
    a: 16,
    sym: "O",
    name: "Oxygen",
    mass: "15.999 u",
    caption:
      "Two unpaired electrons in the second shell — restless, voracious, the engine of combustion.",
    stable: true,
  },
  Fe: {
    z: 26,
    a: 56,
    sym: "Fe",
    name: "Iron",
    mass: "55.845 u",
    caption:
      "The terminus of stellar nucleosynthesis. Beyond iron, fusion costs more energy than it releases.",
    stable: true,
  },
  U: {
    z: 92,
    a: 235,
    sym: "U",
    name: "Uranium-235",
    mass: "235.044 u",
    caption:
      "The heaviest naturally occurring element. Its 235 isotope, separated grain by grain at Oak Ridge, became the core of the Little Boy device.",
    stable: false,
  },
  Pu: {
    z: 94,
    a: 239,
    sym: "Pu",
    name: "Plutonium-239",
    mass: "239.052 u",
    caption:
      "Bred in reactors from U-238. Easier to fission than U-235, and the heart of the Gadget at Trinity.",
    stable: false,
  },
};

export const ELEMENT_SYMBOLS = Object.keys(ELEMENTS) as ElementSymbol[];
