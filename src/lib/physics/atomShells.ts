import { SHELL_CAPACITIES } from "./constants";

export function distributeElectrons(z: number): number[] {
  const out: number[] = [];
  let rem = z;
  for (const cap of SHELL_CAPACITIES) {
    if (rem <= 0) break;
    const e = Math.min(cap, rem);
    out.push(e);
    rem -= e;
  }
  return out;
}
