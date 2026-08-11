/** Rolling per-loop frame-time samples, read by PerfOverlay. Cheap enough to record unconditionally. */
const WINDOW = 120;

interface Ring {
  samples: number[];
  idx: number;
}

const rings = new Map<string, Ring>();
const rendererInfo = new Map<string, string>();

export function recordFrame(id: string, ms: number) {
  if (!Number.isFinite(ms) || ms <= 0) return;
  let r = rings.get(id);
  if (!r) {
    r = { samples: [], idx: 0 };
    rings.set(id, r);
  }
  if (r.samples.length < WINDOW) {
    r.samples.push(ms);
  } else {
    r.samples[r.idx] = ms;
    r.idx = (r.idx + 1) % WINDOW;
  }
}

export function getFrameStats(id: string) {
  const r = rings.get(id);
  if (!r || r.samples.length === 0) return null;
  const sorted = [...r.samples].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)] ?? 0;
  const p95 = sorted[Math.floor(sorted.length * 0.95)] ?? median;
  return { median, p95 };
}

export function listFrameStatIds() {
  return [...rings.keys()];
}

export function setRendererInfo(id: string, info: string) {
  rendererInfo.set(id, info);
}

export function getRendererInfo(id: string) {
  return rendererInfo.get(id) ?? null;
}

export function listRendererIds() {
  return [...rendererInfo.keys()];
}

export function getUnmaskedRenderer(gl: WebGLRenderingContext | WebGL2RenderingContext): string {
  const ext = gl.getExtension("WEBGL_debug_renderer_info");
  if (!ext) return "unmasked info unavailable";
  return String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL));
}
