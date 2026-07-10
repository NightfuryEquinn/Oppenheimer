/** Shared Trinity detonation fragment shader (WebGL + R3F). */
export const TRINITY_FRAGMENT_SHADER = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform vec2 uRes;
uniform float uTime;
uniform float uBlast;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float vnoise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i), b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 6; i++) {
    v += a * vnoise(p);
    p = p * 2.03 + vec2(17.3, 9.1);
    a *= 0.5;
  }
  return v;
}

float warpedFbm(vec2 p) {
  vec2 q = vec2(fbm(p + 1.7), fbm(p + vec2(9.2, 3.1)));
  return fbm(p + q * 2.4);
}

float ridged(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(vnoise(p) * 2.0 - 1.0);
    n *= n;
    v += n * a;
    p = p * 2.15 + vec2(4.1, 2.7);
    a *= 0.5;
  }
  return v;
}

float billowCell(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  float d = 1.0;
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 g = vec2(float(x), float(y));
      vec2 cell = i + g;
      vec2 o = vec2(hash(cell), hash(cell + 4.1)) * 0.65 + 0.175;
      float r = 0.22 + hash(cell + 8.3) * 0.18;
      d = min(d, length(g + o - f) / r);
    }
  }
  return 1.0 - smoothstep(0.0, 1.0, d);
}

vec3 fireRamp(float x) {
  x = clamp(x, 0.0, 1.0);
  vec3 coal = vec3(0.06, 0.015, 0.008);
  vec3 deep = vec3(0.55, 0.08, 0.01);
  vec3 ember = vec3(0.95, 0.22, 0.03);
  vec3 flame = vec3(1.0, 0.52, 0.08);
  vec3 hot = vec3(1.0, 0.82, 0.28);
  vec3 core = vec3(1.0, 0.97, 0.88);
  if (x < 0.18) return mix(coal, deep, x / 0.18);
  if (x < 0.40) return mix(deep, ember, (x - 0.18) / 0.22);
  if (x < 0.62) return mix(ember, flame, (x - 0.40) / 0.22);
  if (x < 0.82) return mix(flame, hot, (x - 0.62) / 0.20);
  return mix(hot, core, (x - 0.82) / 0.18);
}

float shockRing(vec2 p, vec2 origin, float bt) {
  float d = distance(p, origin);
  float radius = bt * 0.40;
  float ring = exp(-pow((d - radius) * 17.0, 2.0));
  return ring * exp(-bt * 0.5) * smoothstep(0.04, 0.35, bt);
}

float pileusRing(vec2 q, float y, float rx, float ry, float bt, float phase) {
  vec2 rp = q - vec2(0.0, y);
  float d = length(vec2(rp.x / rx, rp.y / ry));
  float ring = smoothstep(1.0, 0.52, d) * smoothstep(0.38, 0.62, d);
  ring *= 0.45 + fbm(rp * vec2(8.0, 3.0) + bt * 0.1) * 0.9;
  return ring * smoothstep(phase - 0.4, phase + 0.3, bt);
}

// Returns vec3: density, heat, edge softness
vec3 mushroomCloud(vec2 p, vec2 O, float bt, float uTime) {
  float grow = 1.0 - exp(-bt * 0.45);
  float dissipate = 1.0 - smoothstep(8.0, 28.0, bt);
  if (dissipate < 0.006 || grow < 0.02) return vec3(0.0);

  vec2 q = p - O;
  float t = bt * 0.18 + uTime * 0.06;
  vec2 warp = vec2(warpedFbm(q * 3.5 + vec2(t, 0.0)), warpedFbm(q * 3.8 + vec2(0.0, t))) - 0.5;
  q += warp * 0.08 * grow;

  float n1 = warpedFbm(q * vec2(5.5, 7.5) - vec2(0.0, bt * 0.32));
  float n2 = fbm(q * vec2(10.0, 13.0) + vec2(bt * 0.2, -uTime * 0.1));

  float stemH = grow * (0.12 + smoothstep(0.8, 7.0, bt) * 0.32);

  // Billowing turbulent stem
  float stemT = clamp(q.y / max(stemH, 1e-4), 0.0, 1.0);
  float stemW = (0.018 + grow * 0.038) * mix(1.25, 0.5, stemT);
  float inStem = smoothstep(stemW * 1.35, stemW * 0.1, abs(q.x));
  inStem *= smoothstep(-0.01, 0.04, q.y) * (1.0 - smoothstep(stemH * 0.95, stemH * 1.08, q.y));
  float stemBillow = billowCell(vec2(q.x / stemW * 0.9, q.y * 7.0 - bt * 0.55));
  stemBillow = max(stemBillow, ridged(vec2(q.x * 6.0, q.y * 9.0 - bt * 0.4)) * 0.85);
  float stem = inStem * (0.25 + stemBillow * 1.1) * smoothstep(0.5, 1.8, bt);

  // Pileus condensation rings (horizontal disks on stem)
  float ring1 = pileusRing(q, stemH * 0.42, stemW * 3.8 + grow * 0.12, 0.012 + grow * 0.008, bt, 2.2);
  float ring2 = pileusRing(q, stemH * 0.62, stemW * 4.6 + grow * 0.16, 0.010 + grow * 0.007, bt, 3.2);
  float rings = max(ring1, ring2 * 0.88);

  // Cauliflower cap
  float capBase = stemH * 0.82;
  vec2 capP = q - vec2(warp.x * 0.25, capBase);
  float capRx = 0.03 + grow * 0.34;
  float capRy = capRx * (0.38 + n1 * 0.14);
  float capMask = smoothstep(1.15, 0.35, length(vec2(capP.x / capRx, capP.y / capRy)));
  float cauliflower = billowCell(capP * vec2(2.8 / capRx, 3.6 / capRy) + vec2(bt * 0.08, -t * 0.5));
  cauliflower = max(cauliflower, ridged(capP * vec2(4.0, 5.5) - vec2(0.0, bt * 0.25)) * 0.75);
  float cap = capMask * (0.2 + cauliflower * 1.15) * smoothstep(1.0, 3.8, bt);

  // Extra lobes spilling past cap envelope
  float spill = billowCell(capP * vec2(2.0, 2.8) + vec2(1.3, bt * 0.12));
  spill *= smoothstep(capRx * 0.7, capRx * 1.5, abs(capP.x)) * smoothstep(0.0, capRy * 0.8, capP.y);
  spill *= smoothstep(2.5, 5.5, bt) * 0.55;

  // Wisps — soft dissipating fringe
  float edge = length(vec2(capP.x / (capRx * 1.2), capP.y / (capRy * 1.1)));
  float wisps = smoothstep(0.85, 1.25, edge) * (1.0 - smoothstep(1.25, 1.7, edge));
  wisps *= (0.12 + n2 * 0.5) * dissipate * smoothstep(3.0, 9.0, bt);

  float dens = max(stem, max(rings * 0.75, max(cap, max(spill, wisps * 0.6))));
  dens *= dissipate * smoothstep(0.0, 0.3, bt);

  float relH = clamp(q.y / max(stemH + capRy * 1.2, 1e-3), 0.0, 1.4);
  float heat = dens * (1.0 - relH * 0.6) * (0.35 + n1 * 0.65);
  float softness = clamp(1.0 - dens * 1.4, 0.0, 1.0) + wisps * 0.5;

  return vec3(dens, heat, softness);
}

void main() {
  float aspect = uRes.x / uRes.y;
  float bt = uBlast;
  bool blast = bt >= 0.0;
  float horizon = 0.30;
  vec2 O = vec2(0.5 * aspect, horizon);
  vec2 p0 = vec2(vUv.x * aspect, vUv.y);
  vec2 wuv = vUv;

  if (blast) {
    float d0 = distance(p0, O);
    float swR = bt * 0.36;
    float band = exp(-pow((d0 - swR) * 20.0, 2.0)) * exp(-bt * 0.36);
    vec2 dir0 = (p0 - O) / max(d0, 1e-3);
    wuv -= vec2(dir0.x / aspect, dir0.y) * band * 0.02;
    float sh = exp(-d0 * 2.4) * min(bt * 2.2, 1.0) * exp(-bt * 0.07);
    wuv += (vec2(fbm(p0 * 32.0 + uTime * 2.8), fbm(p0 * 32.0 - uTime * 2.1 + 50.0)) - 0.5) * 0.008 * sh;
  }

  vec2 p = vec2(wuv.x * aspect, wuv.y);
  float dissipate = blast ? 1.0 - smoothstep(8.0, 28.0, bt) : 1.0;
  float warm = blast ? clamp(bt / 2.5, 0.0, 1.0) * exp(-max(bt - 7.0, 0.0) * 0.07) * dissipate : 0.0;
  float hotCore = blast ? exp(-max(bt - 0.55, 0.0) * 2.6) : 0.0;
  float coolFire = blast ? exp(-max(bt - 1.8, 0.0) * 0.2) * dissipate : 0.0;
  float sy = clamp((wuv.y - horizon) / (1.0 - horizon), 0.0, 1.0);

  vec3 skyTop = mix(vec3(0.035, 0.048, 0.088), vec3(0.38, 0.16, 0.05), warm * 0.75);
  vec3 skyMid = mix(vec3(0.088, 0.065, 0.058), vec3(0.62, 0.34, 0.12), warm * 0.9);
  vec3 skyBot = mix(vec3(0.105, 0.048, 0.018), vec3(1.05, 0.68, 0.32), warm);
  vec3 col = mix(skyBot, mix(skyMid, skyTop, smoothstep(0.28, 1.0, sy)), smoothstep(0.0, 0.48, sy));

  if (wuv.y > horizon) {
    vec2 sg = p * 38.0;
    vec2 cell = floor(sg);
    float h = hash(cell);
    if (h > 0.91) {
      vec2 off = (vec2(hash(cell + 1.3), hash(cell + 2.7)) - 0.5) * 0.8;
      float sd = length(fract(sg) - 0.5 - off);
      float tw = 0.6 + 0.4 * sin(uTime * 2.0 + h * 40.0);
      float star = exp(-sd * sd * 200.0) * tw * (0.25 + h * 0.6);
      float starFade = blast ? max(1.0 - bt / 1.0, 0.0) : 1.0;
      col += vec3(0.85, 0.92, 1.0) * star * starFade * (1.0 - warm);
    }
  }

  float ridge = horizon + 0.028 + 0.058 * fbm(vec2(p.x * 2.2, 4.7));
  float mt = smoothstep(ridge + 0.004, ridge - 0.004, wuv.y) * step(horizon, wuv.y);
  vec3 mtCol = vec3(0.010, 0.016, 0.028);
  if (blast) {
    float rim = smoothstep(ridge - 0.018, ridge, wuv.y) * mt;
    float lx = exp(-abs(p.x - O.x) * 1.1);
    mtCol += fireRamp(rim * lx * (warm * 0.7 + hotCore * 1.6)) * dissipate;
  }
  col = mix(col, mtCol, mt);

  if (wuv.y < horizon) {
    float gy = wuv.y / horizon;
    vec3 g = mix(vec3(0.028, 0.014, 0.035), vec3(0.095, 0.055, 0.025), gy);
    g *= 0.78 + 0.38 * fbm(p * vec2(24.0, 68.0));
    if (blast) {
      float gd = distance(p, O);
      g += fireRamp(exp(-gd * 1.7) * (warm * 1.1 + hotCore * 3.2) * dissipate) * 0.55;
      g += fireRamp(shockRing(p, O, bt) * 1.3) * 0.65 * dissipate;
    }
    col = g;
  }

  if (blast) {
    float fbLife = smoothstep(0.0, 0.12, bt) * (1.0 - smoothstep(3.0, 7.5, bt));
    float fbR = (1.0 - pow(1.0 - min(bt / 1.7, 1.0), 2.0)) * 0.24;
    float fbDist = distance(p, O);
    float fbShell = smoothstep(fbR, fbR * 0.48, fbDist);
    if (fbShell > 0.001 && fbLife > 0.01) {
      float fbCore = 1.0 - fbDist / max(fbR, 1e-4);
      float turb = warpedFbm(vec2(p.x * 7.5, p.y * 7.5 - bt * 1.0));
      vec3 fbCol = fireRamp((0.45 + fbCore * 1.5) * (0.5 + turb * 0.85) * coolFire);
      fbCol += vec3(1.0, 0.95, 0.85) * pow(fbCore, 3.0) * hotCore * 2.2;
      col = mix(col, fbCol, fbShell * fbLife * 0.95);
    }

    vec3 cloud = mushroomCloud(p, O, bt, uTime);
    float cloudDens = cloud.x;
    float cloudHeat = cloud.y;
    float cloudSoft = cloud.z;
    if (cloudDens > 0.003) {
      float cn = warpedFbm(vec2(p.x * 8.5, p.y * 5.8 - bt * 0.38));
      float grow = 1.0 - exp(-bt * 0.45);
      float lit = smoothstep(-0.12 * grow - 0.04, 0.18 * grow + 0.06, (p.x - O.x));
      lit = mix(lit, lit * (0.7 + cn * 0.5), 0.4);

      vec3 ashShadow = vec3(0.14, 0.11, 0.10);
      vec3 ashMid = vec3(0.32, 0.26, 0.22);
      vec3 ashLit = vec3(0.88, 0.62, 0.42);
      vec3 smokeCol = mix(ashShadow, mix(ashMid, ashLit, lit), clamp(cloudDens * 1.1, 0.0, 1.0));

      float heat = cloudDens * (0.12 + coolFire * 1.1 + cloudHeat * 0.55) * (0.5 + cn * 0.65);
      vec3 cloudCol = mix(smokeCol, fireRamp(heat), clamp(coolFire * 1.35, 0.0, 1.0));

      float alpha = clamp(cloudDens * 1.15 * dissipate, 0.0, 1.0);
      alpha *= 1.0 - cloudSoft * 0.45;
      col = mix(col, cloudCol, alpha);
    }

    float sceneDist = distance(p0, vec2(O.x / aspect, O.y));
    float flash = exp(-bt * 2.5) * hotCore;
    col += fireRamp(exp(-sceneDist * 1.35) * flash * 2.4) * dissipate;
    col += vec3(0.85, 0.55, 0.22) * shockRing(p, O, bt) * 0.32 * dissipate;

    if (bt < 0.55) {
      float flashAmt = pow(1.0 - bt / 0.55, 1.6);
      col = mix(col, vec3(1.0, 0.98, 0.94), flashAmt);
      col += vec3(1.0) * flashAmt * 0.55;
    }
    if (bt < 0.12) col = vec3(1.0);

    float haze = (1.0 - dissipate) * smoothstep(8.0, 28.0, bt);
    col = mix(col, vec3(0.08, 0.075, 0.07), haze * 0.35 * exp(-sceneDist * 1.3));
  }

  col = col / (1.0 + col * 0.28);
  col += (hash(p0 * 511.0 + fract(uTime) * 37.0) - 0.5) * 0.024;
  gl_FragColor = vec4(col, 1.0);
}
`;
