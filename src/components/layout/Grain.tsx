export function Grain() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9000] opacity-[0.08] mix-blend-overlay"
      style={{
        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/></svg>")`,
      }}
      aria-hidden
    />
  );
}
