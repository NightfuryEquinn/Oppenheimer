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

export function LegacyParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const motesRef = useRef<Mote[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
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
        const g = ctx!.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 3);
        g.addColorStop(0, `rgba(255,200,140,${a})`);
        g.addColorStop(1, "rgba(255,180,100,0)");
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(m.x, m.y, m.r * 3, 0, Math.PI * 2);
        ctx!.fill();
      });
    }
    step();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />;
}
