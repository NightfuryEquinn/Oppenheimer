export function Vignette() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-8500"
      style={{
        background: `
          radial-gradient(ellipse at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%),
          linear-gradient(180deg, rgba(0,0,0,0.35), transparent 8%, transparent 92%, rgba(0,0,0,0.5))
        `,
      }}
      aria-hidden
    />
  );
}
