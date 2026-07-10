import nukeSfx from "@/assets/nuke.mp3";
import { ChapterHead, Section } from "@/components/layout/ChapterHead";
import { cn } from "@/lib/cn";
import { TRINITY_LOG_SCHEDULE, TrinityCanvas } from "@/scenes/trinity/TrinityCanvas";
import type { TrinityLogEntry, TrinityMode } from "@/types";
import { Howl } from "howler";
import { useEffect, useRef, useState } from "react";

const NUKE_SOUND_DELAY_MS = 3000;

export function Trinity() {
  const [mode, setMode] = useState<TrinityMode>("idle");
  const [blastT, setBlastT] = useState(-1);
  const [log, setLog] = useState<TrinityLogEntry[]>([
    { text: "SYSTEM IDLE — Awaiting command." },
  ]);
  const [displayT, setDisplayT] = useState("10.0 s");
  const t0Ref = useRef(0);
  const logIdxRef = useRef(0);
  const modeRef = useRef<TrinityMode>("idle");
  const blastRef = useRef(-1);
  const nukeSoundRef = useRef<Howl | null>(null);
  const nukeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function cancelNukeSound() {
    if (nukeTimerRef.current) {
      clearTimeout(nukeTimerRef.current);
      nukeTimerRef.current = null;
    }
    nukeSoundRef.current?.stop();
  }

  function clearNukeTimer() {
    if (nukeTimerRef.current) {
      clearTimeout(nukeTimerRef.current);
      nukeTimerRef.current = null;
    }
  }

  useEffect(() => {
    const sound = new Howl({
      src: [nukeSfx],
      volume: 1.5,
    });
    nukeSoundRef.current = sound;
    return () => {
      cancelNukeSound();
      sound.unload();
      nukeSoundRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (mode !== "flash") return;

    nukeTimerRef.current = setTimeout(() => {
      nukeSoundRef.current?.play();
      nukeTimerRef.current = null;
    }, NUKE_SOUND_DELAY_MS);

    return clearNukeTimer;
  }, [mode]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    blastRef.current = blastT;
  }, [blastT]);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();

    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;

      const m = modeRef.current;
      if (m === "countdown") {
        const elapsed = (now - t0Ref.current) / 1000;
        const cd = Math.max(0, 10 - elapsed);
        setDisplayT(`${cd.toFixed(1)} s`);

        while (logIdxRef.current < TRINITY_LOG_SCHEDULE.length) {
          const item = TRINITY_LOG_SCHEDULE[logIdxRef.current]!;
          if (cd <= item.at) {
            setLog((prev) => [...prev, { text: item.text, className: item.cls }]);
            logIdxRef.current++;
          } else break;
        }

        if (cd <= 0) {
          setMode("flash");
          setBlastT(0);
          blastRef.current = 0;
          setLog((prev) => [
            ...prev,
            { text: "T 00.0 — IGNITION.", className: "crit" },
            { text: "Implosion lenses fire simultaneously.", className: "crit" },
            { text: "Plutonium pit reaches supercritical density.", className: "crit" },
          ]);
          setDisplayT("— ignition —");
          logIdxRef.current = 0;
        }
      }

      if (m === "flash" || m === "blast" || m === "aftermath") {
        const next = Math.min(blastRef.current + dt, 30);
        blastRef.current = next;
        setBlastT(next);

        if (next > 3 && modeRef.current === "flash") {
          setMode("blast");
          setLog((prev) => [
            ...prev,
            { text: "T +03.0 — fireball ~600 m diameter. Shock front en route.", className: "alert" },
          ]);
        }
        if (next > 6 && modeRef.current === "blast") {
          setMode("aftermath");
          setLog((prev) => [
            ...prev,
            { text: "T +40s — observed yield: 21 kilotons TNT equivalent.", className: "alert" },
            { text: 'Oppenheimer, to Frank: "It worked."' },
            { text: 'Bainbridge, to Oppenheimer: "Now we are all sons of bitches."' },
            { text: "— END TRANSMISSION —" },
          ]);
          setDisplayT("+40 s");
        }
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  function reset() {
    cancelNukeSound();
    setMode("idle");
    setBlastT(-1);
    blastRef.current = -1;
    setDisplayT("10.0 s");
    setLog([{ text: "SYSTEM IDLE — Awaiting command." }]);
    logIdxRef.current = 0;
  }

  function detonate() {
    if (mode !== "idle") return;
    setMode("countdown");
    t0Ref.current = performance.now();
    logIdxRef.current = 0;
    setLog([
      { text: "— 0:00:10 ARMED. Gadget at full charge.", className: "alert" },
      { text: "— BASE CAMP S-10000 to control: holding station." },
    ]);
  }

  return (
    <Section id="chapter-05" label="05 Trinity">
      <ChapterHead
        num="05"
        kicker="CHAPTER V — JORNADA DEL MUERTO · 16 JUL 1945"
        title="05:29:45 Mountain War Time."
      />

      <div className="relative mb-6 aspect-16/10 min-h-[400px] overflow-hidden border border-rule bg-[#030408]">
        <TrinityCanvas blastT={blastT} />

        <div className="pointer-events-none absolute top-4 left-4 z-10 space-y-2 font-mono text-xs tracking-wider">
          <div className="text-ink-dim">
            T − <strong className="text-paper">{displayT}</strong>
          </div>
          <div className="text-ink-dim">
            YIELD <strong className="text-paper">≈ 21 kt</strong>
          </div>
          <div className="text-ink-dim">
            DEVICE <strong className="text-paper">THE GADGET · Pu-239</strong>
          </div>
        </div>

        <div className="pointer-events-none absolute right-0 bottom-[30%] left-0 z-10 border-t border-amber/20" />
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={detonate}
          disabled={mode !== "idle"}
          className="relative flex h-28 w-28 items-center justify-center rounded-full border-2 border-blood/60 bg-blood/10 font-mono text-sm tracking-widest text-blood uppercase transition-all hover:bg-blood/25 disabled:opacity-40"
        >
          <span className="absolute inset-2 rounded-full border border-blood/30" />
          Detonate
        </button>
        <button
          type="button"
          onClick={reset}
          className="border border-rule px-6 py-3 font-mono text-sm tracking-widest text-ink-dim uppercase hover:text-paper"
        >
          Reset
        </button>
      </div>

      <div className="max-h-48 overflow-y-auto border border-rule bg-bg-2/50 p-4 font-mono text-sm">
        {log.map((line, i) => (
          <div
            key={i}
            className={cn(
              "py-0.5 text-ink-dim",
              line.className === "alert" && "text-amber",
              line.className === "crit" && "text-blood",
            )}
          >
            {line.text}
          </div>
        ))}
      </div>
    </Section>
  );
}
