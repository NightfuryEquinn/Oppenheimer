import type { TrinityLogScheduleItem } from "@/types";

export const TRINITY_LOG_SCHEDULE: TrinityLogScheduleItem[] = [
  { at: 9.0, text: "T −09.0 — switches to AUTOMATIC." },
  { at: 7.5, text: "T −07.5 — relays armed. Bainbridge: \"let me check the timing.\"" },
  { at: 6.0, text: "T −06.0 — go on count.", cls: "alert" },
  { at: 4.0, text: "T −04.0 — Oppenheimer braces against post." },
  { at: 2.0, text: "T −02.0 — Bhagavad Gita running through his mind." },
  { at: 0.8, text: "T −00.8 — last contact prior to ignition.", cls: "alert" },
];
