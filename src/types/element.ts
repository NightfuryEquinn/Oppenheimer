export type ElementSymbol = "H" | "He" | "C" | "O" | "Fe" | "U" | "Pu";

export interface ElementData {
  z: number;
  a: number;
  sym: ElementSymbol;
  name: string;
  mass: string;
  caption: string;
  stable: boolean;
}

export interface AtomViewState {
  element: ElementSymbol;
  spinSpeed: number;
  spread: number;
  showTrails: boolean;
}
