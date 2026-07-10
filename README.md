# Oppenheimer — A Tribute

An interactive scroll narrative tribute to J. Robert Oppenheimer, built with **Bun**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **React Three Fiber**.

## Chapters

- **Cover** — 3D nucleus hero (R3F)
- **Origin** — timeline and archival portrait
- **The Atom** — interactive Bohr-style 3D atom model
- **E = mc²** — mass–energy equivalence calculator
- **Chain Reaction** — fission lattice simulation with GLSL rendering
- **Trinity** — countdown and procedural detonation shader
- **Papers** — filterable bibliography (30 papers)
- **Legacy** — Bhagavad Gītā quote and particle drift

## Setup

```bash
bun install
```

## Development

```bash
bun dev
```

## Production

```bash
bun run build
bun start
```

## Stack

- [Bun](https://bun.com) — runtime, bundler, dev server
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) — 3D scenes and shaders
- [Three.js](https://threejs.org) — WebGL rendering
- [Tailwind CSS 4](https://tailwindcss.com) — UI styling
