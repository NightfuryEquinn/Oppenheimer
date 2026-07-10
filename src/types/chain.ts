export interface Nucleus {
  x: number;
  y: number;
  r: number;
  spent: boolean;
  glow: number;
}

export interface Neutron {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  gen: number;
}

export interface Flash {
  x: number;
  y: number;
  age: number;
}

export interface ChainStats {
  fissionCount: number;
  currentGen: number;
  kEff: number | null;
}
