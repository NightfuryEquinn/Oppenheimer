import { useEffect, useState } from "react";
import { getFrameStats, getRendererInfo, listFrameStatIds, listRendererIds } from "./frameStats";

/** Dev-only diagnostic panel, mounted when the page is loaded with ?perf=1. */
export function PerfOverlay() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setTick((t) => t + 1), 500);
    return () => window.clearInterval(id);
  }, []);

  const frameIds = listFrameStatIds();
  const rendererIds = listRendererIds();

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 99999,
        background: "rgba(0,0,0,0.78)",
        color: "#7CFC7C",
        fontFamily: "monospace",
        fontSize: 11,
        lineHeight: 1.6,
        padding: "10px 12px",
        borderRadius: 4,
        pointerEvents: "none",
        minWidth: 240,
      }}
    >
      <div style={{ color: "#fff", marginBottom: 4 }}>PERF</div>
      {frameIds.length === 0 && <div>waiting for frame samples…</div>}
      {frameIds.map((id) => {
        const s = getFrameStats(id);
        if (!s) return null;
        const fps = s.median > 0 ? 1000 / s.median : 0;
        return (
          <div key={id}>
            {id.padEnd(9)} {fps.toFixed(0).padStart(3)}fps med {s.median.toFixed(1)}ms p95{" "}
            {s.p95.toFixed(1)}ms
          </div>
        );
      })}
      {rendererIds.length > 0 && <div style={{ color: "#fff", marginTop: 6 }}>GPU</div>}
      {rendererIds.map((id) => (
        <div key={id} style={{ whiteSpace: "normal", wordBreak: "break-word" }}>
          {id}: {getRendererInfo(id)}
        </div>
      ))}
    </div>
  );
}
