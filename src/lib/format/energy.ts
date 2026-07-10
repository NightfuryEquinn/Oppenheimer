import { superscript } from "./superscript";

export function formatSciEnergy(n: number): string {
  if (n === 0) return "0 J";
  const exp = Math.floor(Math.log10(Math.abs(n)));
  const mant = n / Math.pow(10, exp);
  return `${mant.toFixed(2)} × 10${superscript(exp)} J`;
}

export function formatCommas(n: number): string {
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)} billion`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(2)} million`;
  if (n >= 1e3) return Math.round(n).toLocaleString();
  return n.toFixed(0);
}

export function formatTnt(kt: number): string {
  if (kt < 1e-6) return `${(kt * 1e9).toFixed(2)} g of TNT`;
  if (kt < 1e-3) return `${(kt * 1e6).toFixed(2)} kg of TNT`;
  if (kt < 1) return `${(kt * 1e3).toFixed(2)} tons TNT`;
  if (kt < 1e3) return `${kt.toFixed(2)} kilotons`;
  return `${(kt / 1e3).toFixed(2)} megatons`;
}
