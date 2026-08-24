---
title: b project-2 particle-angle-distribution
topic: threejs
date: 2026-08-24
tags: [geometry, math, particles]
difficulty: intermediate
app_path: apps/b_project-2-angles
---

# B Project 2 — Angles: Distributing Particles Around a Circle

Continuation of the [[b_project-1-particles]] galaxy generator. The random *cube* scatter from part 1 is gone. This lesson asks a different question: **how do you lay particles out in `angle + distance` space instead of raw x/y/z space?** The galaxy is rebuilt so every particle sits on a radius drawn at one of `branchesCount` evenly spaced angles around the full circle — forming a starfish of straight "branches" radiating from the center.

The whole lesson is really one math chain, built up line by line:

```
i  →  i % branchesCount  →  (i % branchesCount) / branchesCount  →  × 2 × Math.PI  →  angle  →  (sin(angle) × radius, cos(angle) × radius)
```

Everything else (dispose logic, `Points`, GUI wiring) is carried over unchanged from part 1.

## Concept

### The two new knobs

```ts
const debugObject = {
  count: 100000,
  size: 0.01,
  // EXPLAIN: adding radius and branchesCount
  radius: 5,
  branchesCount: 3,
};
```

- **`radius`** — how far out a particle may go. Since the value is multiplied by `Math.random()` (see below), it's a *maximum* distance: `0 … radius`, not a fixed one.
- **`branchesCount`** — how many arms the galaxy has. `1` → one straight line through the center; `3` → a three-spoked asterisk; `20` → a nearly-filled wheel.

These are the only two properties added to the part‑1 app — everything else reuses the `generateGalaxy` closure + dispose logic from [[b_project-1-particles]].

### Step 1 — random distance: `Math.random() * radius`

```ts
const radius = Math.random() * debugObject.radius;
```

Each particle picks a random distance from the center, anywhere in `0 … 5`. On its own this isn't enough to make a galaxy — it's just a line of values along a single axis. To point that distance in different directions you need an **angle**.

### Step 2 — the modulo assignment: `i % branchesCount`

The particle's index runs `i = 0, 1, 2, 3, 4, ...`. The modulo operator keeps only the **remainder** after dividing by `branchesCount`.

For `branchesCount = 3`, the sequence is:

```
 i:        0   1   2 | 3   4   5 | 6   7   8 | ...
 i % 3:    0   1   2 | 0   1   2 | 0   1   2 | ...
```

This is the heart of the trick. `i % 3` can only ever produce **3 distinct values** — `0, 1, 2` — no matter how large `i` grows. So it acts as a *classifier*: every particle is sorted into exactly one of `branchesCount` buckets. That is precisely the number of spokes we want.

If the index were used directly as the angle, you'd get one particle per unique angle — `count` distinct spokes. The modulo is what squeezes an unbounded index into a bounded set of remainders, so many particles share each spoke.

### Step 3 — normalize: divide, and the bucket becomes a fraction

```ts
(i % debugObject.branchesCount) / debugObject.branchesCount
```

For a `3`-branch galaxy, `i % 3` gives `{0, 1, 2}`, and dividing by `3` rescales to `{0, 1/3, 2/3}` — fractions of a full turn:

```
 0 / 3 = 0         →  0%
 1 / 3 ≈ 0.333     →  33% of a full turn
 2 / 3 ≈ 0.666     →  66% of a full turn
```

### Step 4 — map the fraction to radians: `* Math.PI * 2`

A full circle is `2π` radians (`360°`). A fraction of a turn × `2π` = an angle in radians:

```
 0      × 2π = 0         radians ≈ 0°
 1/3    × 2π = 2π/3      radians ≈ 120°
 2/3    × 2π = 4π/3      radians ≈ 240°
```

The three spokes land exactly one third of the way around the circle each — evenly spaced over the **full** 360°. This is the same idea as the README snippet:

```ts
Math.random() * 2 * Math.PI
```

a random `0 … 1` value multiplied by `2 × Math.PI` yields *any* angle covering the entire circle of radians. Here the fraction comes from the modulo, not from `Math.random()` — the modulo **deterministically** distributes the spokes; randomness only decides how far along each spoke a particle sits.

### Step 5 — trigonometry: turning "angle + distance" into `x, z`

Radians alone are not coordinates. To place a point at distance `radius` and angle `angle` you need the two trigonometric projections:

```
x = sin(angle) × radius
z = cos(angle) × radius
```

```ts
positions[i3]     = Math.sin(branchAngle) * radius;
positions[i3 + 1] = 0;
positions[i3 + 2] = Math.cos(branchAngle) * radius;
```

`sin` and `cos` read out the x and z offsets on the unit circle, then scale by the particle's own random `radius`.

**`positions[i3 + 1] = 0` is what flattens the galaxy into a thin disk on the XZ‑plane.** Every particle sits at height `y = 0`. The whole shape is a horizontal pinwheel near the origin — you need to tilt the camera up (`camera.position.y = 3`) to see the fan of spokes instead of an edge‑on line.

### Why the disk looks like a wheel (and what a spiral would need)

With random radius but a deterministic angle, each branch is a *straight line* — every particle along one spoke points at the exact same angle and only its distance varies. So the result is a straight-flow asterisk, not a filled disk. To reach a full galaxy disk you need either:

- a **random angle per particle** — replace the modulo's deterministic angle with `Math.random() * 2 * Math.PI` (README snippet) to fill the circle evenly;
- a **spiral** — add an angle offset that grows with `radius` (e.g. `angle += radius / 2`) so the inner and outer ends of each spoke curve into a spiral.

Both are the natural next target (see [[b_project-2_particle-angle-distribution#Revisit|Revisit]]).

## Code

in repo - `apps/b_project-2-angles`

Minimal working example — only the pieces changed since [[b_project-1-particles]]:

```ts
const debugObject = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branchesCount: 3,
};

function generateGalaxy() {
  if (particles && particles.parent) particles.parent.remove(particles);
  if (geometry) geometry.dispose();
  if (material) material.dispose();

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(debugObject.count * 3);

  material = new THREE.PointsMaterial();
  material.size = debugObject.size;
  material.sizeAttenuation = true;

  for (let i = 0; i < debugObject.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * debugObject.radius;

    const branchAngle =
      ((i % debugObject.branchesCount) / debugObject.branchesCount) *
      Math.PI *
      2;

    positions[i3] = Math.sin(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.cos(branchAngle) * radius;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

generateGalaxy();

// tweaked live via lil-gui:
galaxyTweaks
  .add(debugObject, 'radius').min(0.01).max(10).step(0.01)
  .onFinishChange(generateGalaxy);
galaxyTweaks
  .add(debugObject, 'branchesCount').min(1).max(20).step(1)
  .onFinishChange(generateGalaxy);
```

Dependencies beyond `three`:

- **`lil-gui`** — the `/tweaks/` panel (used; `galaxyTweaks` folder, sliders bound with `.onFinishChange(generateGalaxy)`).
- **`three/addons/controls/OrbitControls.js`** — orbit camera (used; damping enabled).
- **`gsap`** — dependency, but the import is commented out in `main.ts`. Not used for now; reserved for a later animated galaxy.

## Gotchas

- **`i % branchesCount` is not the angle — it's the branch selector.** Its values are exactly `0 … branchesCount - 1`, so it selects which spoke the particle lands on. Angles are the *next* step.
- **Remember `Math.PI * 2`, not just `Math.PI`.** A full turn is `2π` radians — `0.5 × 2π = π`, only halfway around. Skipping the `× 2` would pack every spoke into half a circle (or just `π` radians apart instead of `2π`).
- **`(i % branches) / branches` is deliberately less than 1.** The remainder is `0 … branches - 1`, so the quotient is `0 … (branches-1)/branches` — a fraction of a turn, never `1`. That's exactly the range a multiplier like `Math.random() * 2 * Math.PI` or `fraction * 2π` expects.
- **Hardcoded `positions[i3 + 1] = 0`** — the galaxy is *not* 3D; every particle sits on the XZ plane. From a straight-down camera it looks like a flat pinwheel until you orbit away.
- **`branchesCount = 1` yields a straight line** through the origin — a great debug check that the angle math works.

## Outdated

WebGL path (`THREE.WebGLRenderer`) is valid and broadly compatible. `approach is valid`. As in part 1, the app already carries the WebGPU renderer commented out (`'three/webgpu'` + `THREE.WebGPURenderer`), which is the forward-looking path in current three.js. **⚡ WebGPU / `WebGPURenderer`** — the math of this lesson (angles, `sin`/`cos`, positions) is fully renderer-agnostic and carries over without change; only the renderer constructor differs.

> 💡 More up to date alternative: https://threejs.org/examples/ — official examples include up‑to‑date particle and point‑rendering demos.
> 💡 More up to date alternative: https://threejs.org/ — up-to-date docs lead with the WebGPU renderer.

## Revisit

- **Two half-steps toward a real galaxy:**
  1. **Random angle per particle** (`branchAngle = Math.random() * 2 * Math.PI`) → a filled disk instead of spokes.
  2. **Spiral**: add an angle offset that grows with `radius` (e.g. `angle += radius / 2`) so branches twist into a spiral 🌌.
- **Vertex colors from a white-hot core** (`vertexColors` + a `color` attribute), from [[14.2_map-alpha-map-colors-blending]] — makes the spokes read as a live galaxy instead of uniform points.
- **`count * 3` → `count`** in the loop (see Gotchas) — the practical first cleanup.
- **Try the WebGPU renderer** A/B vs WebGL (swap `WebGLRenderer` for `WebGPURenderer`).

## Links & Resources

### Docs

- Three.js [Points](https://threejs.org/docs/#api/en/objects/Points) — `🤖 suggested` — the object the particles get packed into.
- Three.js [PointsMaterial](https://threejs.org/docs/index.html#api/en/materials/PointsMaterial) — `🤖 suggested` — `size`, `sizeAttenuation`, `depthWrite`, `blending`.

### Examples

- [three.js examples — points](https://threejs.org/examples/?q=points) — `🤖 suggested` — official point/particle demos.
- [three.js galaxy generator walkthrough](https://threejs.org/examples/?q=galaxy) — `🤖 suggested` — Bruno Simon-style galaxy patterns via the official examples index.

### Tools

- [GeoGebra — trigonometric circle](https://www.geogebra.org/geometry) — `🤖 suggested` — interactive unit circle: drag the point and watch `sin(θ)`/`cos(θ)`. Perfect for this lesson's trigonometry.
- [Desmos — graphing calculator](https://www.desmos.com/calculator) — `🤖 suggested` — plot `(sin t · R, cos t · R)` and vary `R`/`t` to build intuition for the branch math.

### Videos

- [3Blue1Brown — Trigonometry fundamentals (Lockdown math ep. 2)](https://www.youtube.com/watch?v=yBw67Fb31Cs) — `🤖 suggested` — the unit circle approach to `sin`/`cos`: "trigonometry is about circles", exactly the mental model this lesson needs.

### Repos

- [three.js](https://github.com/mrdoob/three.js) — `🤖 suggested` — the library source + examples live here.

### Other

- [Kenney Particle Pack](https://kenney.nl/assets/particle-pack) — `🤖 suggested` — free particle shapes, the natural next step for `map`/`alphaMap`.