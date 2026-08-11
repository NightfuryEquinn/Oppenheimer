/** Query-param based dev flags: ?perf=1 overlay, ?seed=N deterministic sim, ?blast=N frozen Trinity frame. */
function params() {
  return new URLSearchParams(window.location.search);
}

export function isPerfOverlayEnabled() {
  return params().get("perf") === "1";
}

function numberParam(key: string): number | null {
  const raw = params().get(key);
  if (raw === null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function getSeedParam() {
  return numberParam("seed");
}

export function getBlastParam() {
  return numberParam("blast");
}
