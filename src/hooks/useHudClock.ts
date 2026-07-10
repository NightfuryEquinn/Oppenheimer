import { useEffect, useState } from "react";

const GMT8_OFFSET_MS = 8 * 60 * 60 * 1000;

export function useHudClock() {
  const [clock, setClock] = useState("—");

  useEffect(() => {
    function tick() {
      const d = new Date(Date.now() + GMT8_OFFSET_MS);
      const hh = String(d.getUTCHours()).padStart(2, "0");
      const mm = String(d.getUTCMinutes()).padStart(2, "0");
      const ss = String(d.getUTCSeconds()).padStart(2, "0");
      setClock(`${hh}:${mm}:${ss} GMT+8`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return clock;
}
