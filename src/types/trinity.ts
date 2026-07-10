export type TrinityMode = "idle" | "countdown" | "flash" | "blast" | "aftermath";

export interface TrinityState {
  mode: TrinityMode;
  countdown: number;
  blastT: number;
  log: TrinityLogEntry[];
}

export interface TrinityLogEntry {
  text: string;
  className?: "alert" | "crit";
}

export interface TrinityLogScheduleItem {
  at: number;
  text: string;
  cls?: "alert" | "crit";
}
