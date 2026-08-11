import { getDpr } from "@/lib/perf/dpr";
import { createVisibilityGate } from "@/lib/perf/visibilityGate";
import { useEffect, useRef } from "react";

interface Mote {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  a: number;
  ph: number;
}

const SPRITE_SIZE = 128;
let moteSprite: HTMLCanvasElement | null = null;

/** One radial-gradient sprite, reused for every mote every frame instead of building a
 * fresh CanvasGradient per mote per frame. The alpha falloff is baked in at full opacity;
 * per-mote brightness is applied via globalAlpha at draw time, so this is lossless. */
function getMoteSprite() {
  if (moteSprite) return moteSprite;
  const c = document.createElement("canvas");
  c.width = SPRITE_SIZE;
  c.height = SPRITE_SIZE;
  const sctx = c.getContext("2d")!;
  const cx = SPRITE_SIZE / 2;
  const g = sctx.createRadialGradient(cx, cx, 0, cx, cx, cx);
  g.addColorStop(0, "rgba(255,200,140,1)");
  g.addColorStop(1, "rgba(255,180,100,0)");
  sctx.fillStyle = g;
  sctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
  moteSprite = c;
  return c;
}

export function LegacyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motesRef = useRef<Mote[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = getDpr();
    const stage = canvas.parentElement;
    if (!stage) return;

    function seed(w: number, h: number) {
      const n = Math.max(70, Math.floor((w * h) / 18000));
      motesRef.current = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: -0.05 - Math.random() * 0.1,
        vy: -0.04 - Math.random() * 0.06,
        r: 0.4 + Math.random() * 1.6,
        a: 0.15 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const w = stage!.clientWidth;
      const h = stage!.clientHeight;
      sizeRef.current = { w, h };
      canvas!.width = w * DPR;
      canvas!.height = h * DPR;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed(w, h);
    }

    resize();
    window.addEventListener("resize", resize);

    const sprite = getMoteSprite();

    let raf = 0;
    function step() {
      raf = requestAnimationFrame(step);
      const { w, h } = sizeRef.current;
      ctx!.clearRect(0, 0, w, h);
      const t = performance.now() / 1000;
      motesRef.current.forEach((m) => {
        m.x += m.vx;
        m.y += m.vy;
        if (m.x < -5) m.x = w + 5;
        if (m.y < -5) m.y = h + 5;
        const a = m.a * (0.6 + 0.4 * Math.sin(t * 0.6 + m.ph));
        const d = m.r * 6;
        ctx!.globalAlpha = a;
        ctx!.drawImage(sprite, m.x - m.r * 3, m.y - m.r * 3, d, d);
      });
      ctx!.globalAlpha = 1;
    }
    const gate = createVisibilityGate(
      stage,
      () => {
        if (raf) return;
        raf = requestAnimationFrame(step);
      },
      () => {
        cancelAnimationFrame(raf);
        raf = 0;
      },
    );

    return () => {
      gate.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
