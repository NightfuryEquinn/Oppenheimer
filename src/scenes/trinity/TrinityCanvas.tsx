import { useEffect, useRef } from "react";
import { TRINITY_FRAGMENT_SHADER } from "./trinityShader";

const FRAGMENT_SHADER = TRINITY_FRAGMENT_SHADER;

interface TrinityCanvasProps {
  blastT: number;
  className?: string;
}

export function TrinityCanvas({ blastT, className }: TrinityCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blastRef = useRef(blastT);

  useEffect(() => {
    blastRef.current = blastT;
  }, [blastT]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
    });
    if (!gl) return;

    const stage = canvas.parentElement;
    if (!stage) return;

    const DPR = Math.min(window.devicePixelRatio, 2);
    const VS = `
      attribute vec2 aQ; varying vec2 vUv;
      void main(){ vUv = aQ * 0.5 + 0.5; gl_Position = vec4(aQ, 0.0, 1.0); }`;

    function sh(type: number, src: string) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }

    const program = gl.createProgram()!;
    gl.attachShader(program, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(program, sh(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
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
    const step = (now: number) => {
      raf = requestAnimationFrame(step);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, now / 1000);
      gl.uniform1f(uBlast, blastRef.current);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}

export { TRINITY_LOG_SCHEDULE } from "./TrinityScene";
