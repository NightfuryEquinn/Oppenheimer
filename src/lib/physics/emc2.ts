import {
  JOULES_PER_KT_TNT,
  SPEED_OF_LIGHT,
  TRINITY_YIELD_KT,
} from "./constants";

export interface Emc2Result {
  massG: number;
  massKg: number;
  energyJ: number;
  tntKt: number;
  trinityRatio: number;
  homes: number;
  bulbs: number;
  barPercent: number;
}

export function computeEmc2(log10Grams: number): Emc2Result {
  const massG = Math.pow(10, log10Grams);
  const massKg = massG / 1000;
  const energyJ = massKg * SPEED_OF_LIGHT * SPEED_OF_LIGHT;
  const tntKt = energyJ / JOULES_PER_KT_TNT;
  const homes = energyJ / 2.59e10;
  const bulbs = energyJ / 1.89e9;
  const logE = Math.log10(Math.max(energyJ, 1));
  const barPercent = Math.max(0, Math.min(100, ((logE - 3) / (17.3 - 3)) * 100));

  return {
    massG,
    massKg,
    energyJ,
    tntKt,
    trinityRatio: tntKt / TRINITY_YIELD_KT,
    homes,
    bulbs,
    barPercent,
  };
}
