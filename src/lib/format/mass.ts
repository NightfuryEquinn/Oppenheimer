export function formatMass(g: number): string {
  if (g < 1e-3) return `${(g * 1e6).toFixed(2)} µg`;
  if (g < 1) return `${(g * 1e3).toFixed(2)} mg`;
  if (g < 1000) return `${g.toFixed(3)} g`;
  if (g < 1e6) return `${(g / 1e3).toFixed(2)} kg`;
  return `${(g / 1e6).toFixed(2)} t`;
}
