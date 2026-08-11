import { getDpr } from "@/lib/perf/dpr";
import { getBlastParam } from "@/lib/perf/devFlags";
import { getUnmaskedRenderer, recordFrame, setRendererInfo } from "@/lib/perf/frameStats";
import { createVisibilityGate } from "@/lib/perf/visibilityGate";
import { useEffect, useRef } from "react";
import { TRINITY_FRAGMENT_SHADER } from "./trinityShader";

const FRAGMENT_SHADER = TRINITY_FRAGMENT_SHADER;
/** When ?blast= freezes uBlast for a reproducible capture, also freeze uTime so the frame is pixel-deterministic. */
const FROZEN_TIME = getBlastParam() !== null ? 0 : null;

interface TrinityCanvasProps {
  getBlast: () => number;
  className?: string;
}

export function TrinityCanvas({ getBlast, className }: TrinityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const getBlastRef = useRef(getBlast);

  useEffect(() => {
    getBlastRef.current = getBlast;
  }, [getBlast]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const stage = canvas.parentElement;
    if (!stage) return;

    setRendererInfo("trinity", getUnmaskedRenderer(gl));
    const DPR = getDpr();
    const VS = `
      attribute vec2 aQ; varying vec2 vUv;
      void main(){ vUv = aQ * 0.5 + 0.5; gl_Position = vec4(aQ, 0.0, 1.0); }`;

    function sh(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const vShader = sh(gl.VERTEX_SHADER, VS);
    const fShader = sh(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram()!;
    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    const quad = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const aQ = gl.getAttribLocation(program, "aQ");
    gl.enableVertexAttribArray(aQ);
    gl.vertexAttribPointer(aQ, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "uRes");
    const uTime = gl.getUniformLocation(program, "uTime");
    const uBlast = gl.getUniformLocation(program, "uBlast");

    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    let raf = 0;
    let last = performance.now();
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      recordFrame("trinity", now - last);
      last = now;
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, FROZEN_TIME ?? now / 1000);
      gl.uniform1f(uBlast, getBlastRef.current());
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const gate = createVisibilityGate(
      stage,
      () => {
        if (raf) return;
        last = performance.now();
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
      ro.disconnect();
      gl.deleteBuffer(quad);
      gl.deleteProgram(program);
      gl.deleteShader(vShader);
      gl.deleteShader(fShader);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}

export { TRINITY_LOG_SCHEDULE } from "./trinityLog";
