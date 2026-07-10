import type { ChainStats, Flash, Neutron, Nucleus } from "@/types";

const MAXF = 32;

export class ChainSimulation {
  nuclei: Nucleus[] = [];
  neutrons: Neutron[] = [];
  flashes: Flash[] = [];
  fissionCount = 0;
  currentGen = 0;
  neutronsByGen: number[] = [0];
  width = 0;
  height = 0;

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
          x: xPad + c * spacing + spacing / 2 + (Math.random() - 0.5) * 8,
          y: yPad + r * spacing + spacing / 2 + (Math.random() - 0.5) * 8,
          r: 7,
          spent: false,
          glow: 0,
        });
      }
    }
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
  }

  resize(w: number, h: number) {
    this.width = w;
    this.height = h;
    this.buildLattice();
    this.reset();
  }

  fireNeutron(x: number, y: number, gen = 0) {
    const ang = Math.random() * Math.PI * 2;
    const speed = 2.6 + Math.random() * 0.6;
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

  step(dt: number) {
    for (let i = this.flashes.length - 1; i >= 0; i--) {
      const flash = this.flashes[i]!;
      flash.age += dt;
      if (flash.age > 3) this.flashes.splice(i, 1);
    }
    this.nuclei.forEach((n) => {
      n.glow *= 0.92;
    });

    for (let i = this.neutrons.length - 1; i >= 0; i--) {
      const p = this.neutrons[i]!;
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
        this.neutrons.splice(i, 1);
        continue;
      }

      let hit: Nucleus | null = null;
      for (const n of this.nuclei) {
        if (n.spent) continue;
        const dx = p.x - n.x;
        const dy = p.y - n.y;
        if (dx * dx + dy * dy < (n.r + 2) * (n.r + 2)) {
          hit = n;
          break;
        }
      }

      if (hit) {
        hit.spent = true;
        hit.glow = 1;
        this.fissionCount += 1;
        this.flashes.push({ x: hit.x, y: hit.y, age: 0 });
        if (this.flashes.length > MAXF) this.flashes.shift();
        const next = p.gen + 1;
        const k = Math.random() < 0.43 ? 3 : 2;
        for (let j = 0; j < k; j++) this.fireNeutron(hit.x, hit.y, next);
        if (next > this.currentGen) this.currentGen = next;
        this.nuclei.forEach((other) => {
          if (other === hit || other.spent) return;
          const dd = (other.x - hit.x) ** 2 + (other.y - hit.y) ** 2;
          if (dd < 80 * 80) other.glow = Math.max(other.glow, 0.5);
        });
        this.neutrons.splice(i, 1);
      }
    }
  }
}

export { MAXF };
