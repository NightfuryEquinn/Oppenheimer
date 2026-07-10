# Oppenheimer — A Tribute

An interactive scroll narrative tribute to J. Robert Oppenheimer, built with **Bun**, **React 19**, **TypeScript**, **Tailwind CSS 4**, and **React Three Fiber**.

Opens on a classified dossier — click to declassify, then scroll through seven chapters of archival layout, physics interactives, and WebGL scenes. Designed for desktop viewports (1281px and wider).

## Experience

- **Classified intro** — animated dossier overlay with stamp, seal, and folder reveal before the narrative begins
- **HUD** — fixed header with chapter navigation (scroll spy), live clock, and optional background soundtrack
- **Scroll reveals** — chapters fade and rise into view as you scroll (powered by anime.js)
- **Viewport gate** — narrow screens see a desktop-required overlay so 3D scenes and layout stay intact
- **Atmosphere** — film grain, vignette, and monospace archival typography throughout

## Chapters

| # | Chapter | Highlights |
|---|---------|------------|
| 00 | **Cover** | 3D nucleus hero (R3F), post-processing bloom |
| 01 | **Origin** | timeline and archival portrait |
| 02 | **Atom** | interactive Bohr-style 3D atom model |
| 03 | **Relative** | mass–energy equivalence calculator |
| 04 | **Chain** | fission lattice simulation with GLSL rendering |
| 05 | **Trinity** | countdown, procedural detonation shader, blast SFX |
| 06 | **Papers** | filterable bibliography (29 papers) |
| 07 | **Legacy** | Bhagavad Gītā quote and particle drift |

## Setup

```bash
bun install
```

## Development

```bash
bun dev
```

Serves with hot reload at `http://localhost:3000` (default Bun port).

## Production

```bash
bun run build
bun start
```

Deploy to Vercel:

```bash
bun run vercel
```

## Stack

- [Bun](https://bun.com) — runtime, bundler, dev server
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [drei](https://github.com/pmndrs/drei) — 3D scenes and helpers
- [@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing) — bloom and screen effects
- [Three.js](https://threejs.org) — WebGL rendering and custom GLSL shaders
- [anime.js](https://animejs.com) — intro, HUD, and scroll-driven motion
- [Howler.js](https://howlerjs.com) — background music and Trinity blast audio
- [Tailwind CSS 4](https://tailwindcss.com) — UI styling

## Project layout

```
src/
├── components/
│   ├── chapters/     # scroll sections (Cover → Legacy)
│   ├── layout/       # HUD, grain, vignette, overlays
│   └── ui/           # timeline, filters, element picker
├── context/          # intro phase state (classified → ready)
├── data/             # papers, timeline, nav, elements
├── hooks/            # scroll spy, music, reveals, screen limit
├── lib/              # physics helpers, formatting, cn()
├── scenes/           # R3F canvases (nucleus, atom, chain, trinity, legacy)
└── styles/           # global CSS and Tailwind theme
```
