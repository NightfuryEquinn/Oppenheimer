import { createRng, type Rng } from "@/lib/rng";
import type { ChainStats, Flash, Neutron, Nucleus } from "@/types";

const MAXF = 32;

/** Physics runs on a fixed tick so cascade speed and glow decay don't scale with display refresh rate. */
const FIXED_DT = 1 / 60;
const MAX_SUBSTEPS = 5;
const GLOW_DECAY = 0.92;
/** Nucleus capture radius: nucleus.r (7) + a small hit pad, matching the original brute-force check. */
const HIT_RADIUS = 9;
const GLOW_SPREAD_RADIUS = 80;
/** Per-tick chance a free neutron is absorbed by the surrounding medium, independent of hitting a nucleus. */
const ABSORPTION_PROB = 0.0025;
/** Safety valve for runaway cascades; fissions still register, only new neutron spawns are capped. */
const MAX_NEUTRONS = 4000;
/** Grid cell size for the collision broadphase — matches the lattice spacing, so ~1 nucleus per cell. */
const GRID_CELL = 42;

class NucleusGrid {
  readonly cellSize: number;
  readonly cols: number;
  readonly rows: number;
  readonly buckets: Nucleus[][];

  constructor(nuclei: Nucleus[], width: number, height: number, cellSize: number) {
    this.cellSize = cellSize;
    this.cols = Math.max(1, Math.ceil(width / cellSize));
    this.rows = Math.max(1, Math.ceil(height / cellSize));
    this.buckets = new Array(this.cols * this.rows);
    for (let i = 0; i < this.buckets.length; i++) this.buckets[i] = [];
    for (const n of nuclei) {
      const cx = Math.min(this.cols - 1, Math.max(0, Math.floor(n.x / cellSize)));
      const cy = Math.min(this.rows - 1, Math.max(0, Math.floor(n.y / cellSize)));
      this.buckets[cy * this.cols + cx]!.push(n);
    }
  }
}

export class ChainSimulation {
  nuclei: Nucleus[] = [];
  neutrons: Neutron[] = [];
  flashes: Flash[] = [];
  fissionCount = 0;
  currentGen = 0;
  neutronsByGen: number[] = [0];
  width = 0;
  height = 0;
  private rng: Rng;
  private grid: NucleusGrid | null = null;
  private accumulator = 0;

  constructor(seed: number = Date.now()) {
    this.rng = createRng(seed);
  }

  buildLattice() {
    this.nuclei.length = 0;
    const spacing = 42;
    const cols = Math.floor((this.width - 60) / spacing);
    const rows = Math.floor((this.height - 60) / spacing);
    const xPad = (this.width - cols * spacing) / 2;
    const yPad = (this.height - rows * spacing) / 2;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        this.nuclei.push({
          x: xPad + c * spacing + spacing / 2 + (this.rng() - 0.5) * 8,
          y: yPad + r * spacing + spacing / 2 + (this.rng() - 0.5) * 8,
          r: 7,
          spent: false,
          glow: 0,
        });
      }
    }
    this.grid = new NucleusGrid(this.nuclei, this.width, this.height, GRID_CELL);
  }

  reset() {
    this.nuclei.forEach((n) => {
      n.spent = false;
      n.glow = 0;
    });
    this.neutrons.length = 0;
    this.flashes.length = 0;
    this.fissionCount = 0;
    this.currentGen = 0;
    this.neutronsByGen = [0];
    this.accumulator = 0;
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.buildLattice();
    this.reset();
  }

  fireNeutron(x: number, y: number, gen = 0) {
    if (this.neutrons.length >= MAX_NEUTRONS) return;
    const ang = this.rng() * Math.PI * 2;
    const speed = 2.6 + this.rng() * 0.6;
    this.neutrons.push({
      x,
      y,
      vx: Math.cos(ang) * speed,
      vy: Math.sin(ang) * speed,
      life: 0,
      gen,
    });
    this.neutronsByGen[gen] = (this.neutronsByGen[gen] ?? 0) + 1;
  }

  getStats(): ChainStats {
    let kEff: number | null = null;
    if (this.currentGen >= 1 && this.neutronsByGen[this.currentGen - 1]) {
      kEff = this.neutronsByGen[this.currentGen]! / this.neutronsByGen[this.currentGen - 1]!;
    }
    return {
      fissionCount: this.fissionCount,
      currentGen: this.currentGen,
      kEff,
    };
  }

  private swapRemoveNeutron(i: number) {
    const last = this.neutrons.length - 1;
    this.neutrons[i] = this.neutrons[last]!;
    this.neutrons.pop();
  }

  step(dt: number) {
    this.accumulator = Math.min(this.accumulator + dt, FIXED_DT * MAX_SUBSTEPS);
    let steps = 0;
    while (this.accumulator >= FIXED_DT && steps < MAX_SUBSTEPS) {
      this.substep(FIXED_DT);
      this.accumulator -= FIXED_DT;
      steps++;
    }
  }

  private substep(fixedDt: number) {
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const flash = this.flashes[i]!;
      flash.age += fixedDt;
      if (flash.age > 3) this.flashes.splice(i, 1);
    }
    for (let i = 0; i < this.nuclei.length; i++) this.nuclei[i]!.glow *= GLOW_DECAY;

    const grid = this.grid;
    if (!grid) return;
    const { cellSize, cols, rows, buckets } = grid;
    const hitCr = Math.max(1, Math.ceil(HIT_RADIUS / cellSize));
    const glowCr = Math.max(1, Math.ceil(GLOW_SPREAD_RADIUS / cellSize));

    for (let i = this.neutrons.length - 1; i >= 0; i--) {
      const p = this.neutrons[i]!;

      if (this.rng() < ABSORPTION_PROB) {
        this.swapRemoveNeutron(i);
        continue;
      }

      p.x += p.vx;
      p.y += p.vy;
      p.life++;
      if (
        p.x < -10 ||
        p.x > this.width + 10 ||
        p.y < -10 ||
        p.y > this.height + 10 ||
        p.life > 500
      ) {
        this.swapRemoveNeutron(i);
        continue;
      }

      const cx = Math.floor(p.x / cellSize);
      const cy = Math.floor(p.y / cellSize);
      const x0 = Math.max(0, cx - hitCr);
      const x1 = Math.min(cols - 1, cx + hitCr);
      const y0 = Math.max(0, cy - hitCr);
      const y1 = Math.min(rows - 1, cy + hitCr);

      let hit: Nucleus | null = null;
      for (let gy = y0; gy <= y1 && !hit; gy++) {
        const rowBase = gy * cols;
        for (let gx = x0; gx <= x1 && !hit; gx++) {
          const bucket = buckets[rowBase + gx]!;
          for (let k = 0; k < bucket.length; k++) {
            const n = bucket[k]!;
            if (n.spent) continue;
            const dx = p.x - n.x;
            const dy = p.y - n.y;
            if (dx * dx + dy * dy < HIT_RADIUS * HIT_RADIUS) {
              hit = n;
              break;
            }
          }
        }
      }

      if (hit) {
        hit.spent = true;
        hit.glow = 1;
        this.fissionCount += 1;
        this.flashes.push({ x: hit.x, y: hit.y, age: 0 });
        if (this.flashes.length > MAXF) this.flashes.shift();
        const next = p.gen + 1;
        const k = this.rng() < 0.43 ? 3 : 2;
        for (let j = 0; j < k; j++) this.fireNeutron(hit.x, hit.y, next);
        if (next > this.currentGen) this.currentGen = next;

        const gcx = Math.floor(hit.x / cellSize);
        const gcy = Math.floor(hit.y / cellSize);
        const gx0 = Math.max(0, gcx - glowCr);
        const gx1 = Math.min(cols - 1, gcx + glowCr);
        const gy0 = Math.max(0, gcy - glowCr);
        const gy1 = Math.min(rows - 1, gcy + glowCr);
        for (let gy = gy0; gy <= gy1; gy++) {
          const rowBase = gy * cols;
          for (let gx = gx0; gx <= gx1; gx++) {
            const bucket = buckets[rowBase + gx]!;
            for (let k2 = 0; k2 < bucket.length; k2++) {
              const other = bucket[k2]!;
              if (other === hit || other.spent) continue;
              const dd = (other.x - hit.x) ** 2 + (other.y - hit.y) ** 2;
              if (dd < GLOW_SPREAD_RADIUS * GLOW_SPREAD_RADIUS) {
                other.glow = Math.max(other.glow, 0.5);
              }
            }
          }
        }

        this.swapRemoveNeutron(i);
      }
    }
  }
}

export { MAXF };
