import { useEffect, useRef } from "react";
import { ChainSimulation, MAXF } from "./ChainSimulation";

interface ChainCanvasProps {
  sim: ChainSimulation;
  onStats?: () => void;
  className?: string;
}

export function ChainCanvas({ sim, onStats, className }: ChainCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glStateRef = useRef<ReturnType<typeof createChainGL> | null>(null);

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

    glStateRef.current = createChainGL(gl, canvas);

    function resize() {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      glStateRef.current?.resize(w, h);
      sim.resize(w, h);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(stage);

    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05) || 0.016;
      last = now;
      sim.step(dt);
      glStateRef.current?.render(sim, now / 1000);
      onStats?.();
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      glStateRef.current?.dispose();
      glStateRef.current = null;
    };
  }, [sim, onStats]);

  return (
    <canvas
      ref={canvasRef}
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}

function createChainGL(gl: WebGLRenderingContext, canvas: HTMLCanvasElement) {
  const DPR = Math.min(window.devicePixelRatio, 2);
  let W = 0;
  let H = 0;

  function sh(type: number, src: string) {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }

  function prog(vsSrc: string, fsSrc: string) {
    const p = gl.createProgram()!;
    gl.attachShader(p, sh(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, sh(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    return p;
  }

  const QUAD_VS = `
    attribute vec2 aQ; varying vec2 vUv;
    void main(){ vUv = aQ * 0.5 + 0.5; gl_Position = vec4(aQ, 0.0, 1.0); }`;

  const FADE_FS = `
    precision mediump float; varying vec2 vUv; uniform sampler2D uT;
    void main(){ vec4 c = texture2D(uT, vUv); gl_FragColor = max(c * 0.930 - 0.0045, 0.0); }`;

  const POINT_VS = `
    attribute vec4 aP; uniform vec2 uRes; uniform float uDPR; varying float vI;
    void main(){
      vec2 clip = (aP.xy / uRes) * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      gl_PointSize = aP.z * uDPR; vI = aP.w;
    }`;

  const POINT_FS = `
    precision mediump float; varying float vI; uniform vec3 uCol;
    void main(){
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float a = smoothstep(1.0, 0.0, d); a *= a;
      gl_FragColor = vec4(uCol * a * vI, a * vI);
    }`;

  const NUC_VS = `
    attribute vec2 aPos; attribute vec3 aN; uniform vec2 uRes; uniform float uDPR;
    varying float vSpent; varying float vGlow; varying float vCore;
    void main(){
      vec2 clip = (aPos / uRes) * 2.0 - 1.0;
      gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
      float S = aN.x * 2.0 + 18.0 + aN.z * 14.0;
      gl_PointSize = S * uDPR;
      vCore = (aN.x * 2.0) / S; vSpent = aN.y; vGlow = aN.z;
    }`;

  const NUC_FS = `
    precision mediump float;
    varying float vSpent; varying float vGlow; varying float vCore;
    void main(){
      vec2 pc = gl_PointCoord - 0.5;
      float r = length(pc) * 2.0;
      vec3 col; float a;
      if (vSpent > 0.5) {
        float d1 = length(pc - vec2(vCore * 0.22, 0.0)) * 2.0;
        float d2 = length(pc + vec2(vCore * 0.22, 0.0)) * 2.0;
        float lobe = smoothstep(vCore * 0.55, vCore * 0.25, min(d1, d2));
        col = vec3(1.0, 0.58, 0.28);
        a = lobe * (0.20 + vGlow * 0.65);
        a += exp(-r * 4.0) * vGlow * 0.25;
      } else {
        float body = smoothstep(vCore, vCore * 0.80, r);
        float core = smoothstep(vCore, vCore * 0.15, r);
        col = mix(vec3(0.46, 0.25, 0.10), vec3(0.93, 0.66, 0.36), core);
        a = body * (0.85 + vGlow * 0.3);
        float ring = exp(-pow((r - vCore * 1.55) * 9.0, 2.0)) * vGlow;
        col += vec3(1.0, 0.78, 0.45) * ring;
        a += ring * 0.6 + exp(-r * 3.0) * vGlow * 0.3;
      }
      gl_FragColor = vec4(col * a, a);
    }`;

  const COMP_FS = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTrail;
    uniform vec2 uRes;
    uniform float uTime;
    uniform vec4 uFlash[${MAXF}];
    uniform int uCount;
    void main(){
      vec2 p = vec2(vUv.x * uRes.x, (1.0 - vUv.y) * uRes.y);
      vec2 q = p; float glow = 0.0;
      for (int i = 0; i < ${MAXF}; i++) {
        if (i >= uCount) break;
        vec4 f = uFlash[i];
        float d = distance(p, f.xy);
        float R = f.z * 250.0;
        float ring = exp(-pow((d - R) * 0.055, 2.0)) * exp(-f.z * 1.7);
        vec2 dir = (p - f.xy) / max(d, 1.0);
        q += dir * ring * 8.0;
        glow += ring * 0.45;
        glow += exp(-d * 0.02) * exp(-f.z * 4.5) * 1.5;
      }
      vec2 g = abs(fract(q / 42.0) - 0.5);
      float line = smoothstep(0.455, 0.5, max(g.x, g.y));
      float vig = smoothstep(1.35, 0.3, length(vUv - 0.5) * 1.7);
      vec3 col = vec3(0.013, 0.015, 0.024) * vig;
      col += vec3(0.10, 0.13, 0.19) * line * (0.22 + 0.06 * sin(uTime * 0.7));
      vec2 tuv = vec2(q.x / uRes.x, 1.0 - q.y / uRes.y);
      vec2 px = 1.0 / uRes;
      vec3 tr = texture2D(uTrail, tuv).rgb;
      tr += texture2D(uTrail, tuv + vec2(px.x * 2.5, 0.0)).rgb * 0.55;
      tr += texture2D(uTrail, tuv - vec2(px.x * 2.5, 0.0)).rgb * 0.55;
      tr += texture2D(uTrail, tuv + vec2(0.0, px.y * 2.5)).rgb * 0.55;
      tr += texture2D(uTrail, tuv - vec2(0.0, px.y * 2.5)).rgb * 0.55;
      col += tr * 0.62;
      col += vec3(1.0, 0.60, 0.24) * glow;
      col = col / (1.0 + col * 0.32);
      gl_FragColor = vec4(col, 1.0);
    }`;

  const fadeProg = prog(QUAD_VS, FADE_FS);
  const pointProg = prog(POINT_VS, POINT_FS);
  const nucProg = prog(NUC_VS, NUC_FS);
  const compProg = prog(QUAD_VS, COMP_FS);

  const quadBuf = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

  const pointBuf = gl.createBuffer()!;
  const nucBuf = gl.createBuffer()!;

  let texA: WebGLTexture | null = null;
  let texB: WebGLTexture | null = null;
  let fboA: WebGLFramebuffer | null = null;
  let fboB: WebGLFramebuffer | null = null;

  function makeTarget(w: number, h: number) {
    const tex = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    return { tex, fbo };
  }

  function clearTrails() {
    if (!fboA || !fboB) return;
    gl.clearColor(0, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboA);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  function rebuildTargets(w: number, h: number) {
    if (texA) gl.deleteTexture(texA);
    if (texB) gl.deleteTexture(texB);
    if (fboA) gl.deleteFramebuffer(fboA);
    if (fboB) gl.deleteFramebuffer(fboB);
    const a = makeTarget(w, h);
    const b = makeTarget(w, h);
    texA = a.tex;
    fboA = a.fbo;
    texB = b.tex;
    fboB = b.fbo;
    clearTrails();
  }

  const U = {
    fadeT: gl.getUniformLocation(fadeProg, "uT"),
    ptRes: gl.getUniformLocation(pointProg, "uRes"),
    ptDpr: gl.getUniformLocation(pointProg, "uDPR"),
    ptCol: gl.getUniformLocation(pointProg, "uCol"),
    nRes: gl.getUniformLocation(nucProg, "uRes"),
    nDpr: gl.getUniformLocation(nucProg, "uDPR"),
    cTrail: gl.getUniformLocation(compProg, "uTrail"),
    cRes: gl.getUniformLocation(compProg, "uRes"),
    cTime: gl.getUniformLocation(compProg, "uTime"),
    cFlash: gl.getUniformLocation(compProg, "uFlash"),
    cCount: gl.getUniformLocation(compProg, "uCount"),
  };

  const A = {
    fadeQ: gl.getAttribLocation(fadeProg, "aQ"),
    compQ: gl.getAttribLocation(compProg, "aQ"),
    ptP: gl.getAttribLocation(pointProg, "aP"),
    nPos: gl.getAttribLocation(nucProg, "aPos"),
    nN: gl.getAttribLocation(nucProg, "aN"),
  };

  const flashArr = new Float32Array(MAXF * 4);

  function drawPoints(data: Float32Array, color: [number, number, number]) {
    const n = data.length / 4;
    if (!n) return;
    gl.useProgram(pointProg);
    gl.uniform2f(U.ptRes, W, H);
    gl.uniform1f(U.ptDpr, DPR);
    gl.uniform3f(U.ptCol, color[0], color[1], color[2]);
    gl.bindBuffer(gl.ARRAY_BUFFER, pointBuf);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(A.ptP);
    gl.vertexAttribPointer(A.ptP, 4, gl.FLOAT, false, 16, 0);
    gl.drawArrays(gl.POINTS, 0, n);
    gl.disableVertexAttribArray(A.ptP);
  }

  return {
    resize(w: number, h: number) {
      W = w;
      H = h;
      canvas.width = w * DPR;
      canvas.height = h * DPR;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      rebuildTargets(canvas.width, canvas.height);
    },
    clearTrails,
    dispose() {
      if (texA) gl.deleteTexture(texA);
      if (texB) gl.deleteTexture(texB);
      if (fboA) gl.deleteFramebuffer(fboA);
      if (fboB) gl.deleteFramebuffer(fboB);
    },
    render(sim: ChainSimulation, time: number) {
      if (!texA || !texB || !fboA || !fboB) return;

      gl.viewport(0, 0, canvas.width, canvas.height);

      gl.bindFramebuffer(gl.FRAMEBUFFER, fboB);
      gl.disable(gl.BLEND);
      gl.useProgram(fadeProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.uniform1i(U.fadeT, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(A.fadeQ);
      gl.vertexAttribPointer(A.fadeQ, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disableVertexAttribArray(A.fadeQ);

      if (sim.neutrons.length) {
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.ONE, gl.ONE);
        const d = new Float32Array(sim.neutrons.length * 4);
        sim.neutrons.forEach((p, i) => {
          d[i * 4] = p.x;
          d[i * 4 + 1] = p.y;
          d[i * 4 + 2] = 7;
          d[i * 4 + 3] = 0.55;
        });
        drawPoints(d, [0.62, 0.78, 1.0]);
      }

      [texA, texB] = [texB, texA];
      [fboA, fboB] = [fboB, fboA];

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.disable(gl.BLEND);
      gl.useProgram(compProg);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texA);
      gl.uniform1i(U.cTrail, 0);
      gl.uniform2f(U.cRes, W, H);
      gl.uniform1f(U.cTime, time);
      flashArr.fill(0);
      const fc = Math.min(sim.flashes.length, MAXF);
      for (let i = 0; i < fc; i++) {
        const f = sim.flashes[i]!;
        flashArr[i * 4] = f.x;
        flashArr[i * 4 + 1] = f.y;
        flashArr[i * 4 + 2] = f.age;
      }
      gl.uniform4fv(U.cFlash, flashArr);
      gl.uniform1i(U.cCount, fc);
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.enableVertexAttribArray(A.compQ);
      gl.vertexAttribPointer(A.compQ, 2, gl.FLOAT, false, 0, 0);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.disableVertexAttribArray(A.compQ);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      if (sim.nuclei.length) {
        gl.useProgram(nucProg);
        gl.uniform2f(U.nRes, W, H);
        gl.uniform1f(U.nDpr, DPR);
        const d = new Float32Array(sim.nuclei.length * 5);
        sim.nuclei.forEach((n, i) => {
          d[i * 5] = n.x;
          d[i * 5 + 1] = n.y;
          d[i * 5 + 2] = n.r;
          d[i * 5 + 3] = n.spent ? 1 : 0;
          d[i * 5 + 4] = n.glow;
        });
        gl.bindBuffer(gl.ARRAY_BUFFER, nucBuf);
        gl.bufferData(gl.ARRAY_BUFFER, d, gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(A.nPos);
        gl.enableVertexAttribArray(A.nN);
        gl.vertexAttribPointer(A.nPos, 2, gl.FLOAT, false, 20, 0);
        gl.vertexAttribPointer(A.nN, 3, gl.FLOAT, false, 20, 8);
        gl.drawArrays(gl.POINTS, 0, sim.nuclei.length);
        gl.disableVertexAttribArray(A.nPos);
        gl.disableVertexAttribArray(A.nN);
      }

      if (sim.neutrons.length) {
        gl.blendFunc(gl.ONE, gl.ONE);
        const d = new Float32Array(sim.neutrons.length * 4);
        sim.neutrons.forEach((p, i) => {
          d[i * 4] = p.x;
          d[i * 4 + 1] = p.y;
          d[i * 4 + 2] = 5;
          d[i * 4 + 3] = 1.0;
        });
        drawPoints(d, [1.0, 1.0, 1.0]);
      }
      gl.disable(gl.BLEND);
    },
  };
}
