---
title: b_project-3_spin-randomness
topic: threejs
date: 2026-08-25
tags: [math, geometry, webgl]
difficulty: intermediate
app_path: apps/b_project-3-random
---

## Concept

This lesson continues the galaxy generator from the previous two B-project lessons. The core idea is placing thousands of particles in a spiral galaxy shape by:

1. Distributing particles into **branches** using modulo arithmetic
2. Adding a **spin angle** that increases with radius — creating curved, spiral arms
3. Introducing **randomness** to scatter particles around each spiral path, making the galaxy look natural rather than like perfect mathematical curves

### Branch Angle

Particles are assigned to one of `branchesCount` arms by computing an angle per particle:

```
branchAngle = (particleIndex % branchesCount) / branchesCount * Math.PI * 2
```

This evenly spaces the arms around a full circle ($2\pi$ radians). Particle `i` goes to arm `i % 3`, and its angle along that arm is proportional to which arm it landed in.

### Spin Angle — Creating Spiral Arms

A flat, straight branch looks artificial. Real galaxies have curved arms. The trick: particles farther from the center get an additional angular offset proportional to their radius.

```
spinAngle = radius * spin
```

Adding `spinAngle` to `branchAngle` before passing to `sin()` / `cos()` means:

- Particles near the center (`radius` close to 0) have almost no extra rotation — they stay near their branch origin.
- Particles farther out rotate more — the arm curls.

This is what gives the galaxy its spiral shape. The `spin` parameter (controlled via lil-gui) adjusts how tightly the arms curl. Negative values curl in the opposite direction.

### Randomness — Making It Look Natural

Perfect curves don't look like real galaxies. Particles need scatter around the spiral path.

**Basic randomness**: offset each particle by a random value scaled by `randomness * radius`:

```
randomX = (Math.random() - 0.5) * randomness * radius
```

The `-0.5` shifts the range from `[0, 1)` to `[-0.5, 0.5)`, centering the scatter around the spiral path.

### `Math.pow()` and Randomness Distribution

Here's the key insight about `Math.pow()` with randomness:

`Math.random()` gives a **uniform** distribution — every value between 0 and 1 is equally likely. But `Math.pow(Math.random(), power)` changes the shape:

- With `power = 1`: `Math.pow()` has no effect — uniform distribution.
- With `power > 1`: values near 0 become more likely, values near 1 become rarer. The higher the power, the more extreme this bias.

Why does this matter? When you multiply by `radius`, you want most scatter to be small (close to the spiral path), with occasional larger offsets. `Math.pow(Math.random(), 3)` clustered near 0 gives you exactly that — most particles stay close to their arm, a few scatter farther.

**The sign problem**: `Math.pow(Math.random(), n)` always returns a positive value. Applied directly, all scatter goes in one direction (positive X, positive Y, positive Z). That would push every particle away from center, not scatter it around the path.

The fix: multiply by either `1` or `-1` at random:

```js
const sign = Math.random() < 0.5 ? 1 : -1;
randomX = Math.pow(Math.random(), randomnessPow) * sign * randomness * radius;
```

This scatters particles evenly in both directions, centered on the spiral path.

### Putting It Together

```
x = sin(branchAngle + spinAngle) * radius + randomX
y = randomY
z = cos(branchAngle + spinAngle) * radius + randomZ
```

The `sin`/`cos` with the combined angle places the particle on the spiral arm. The random offsets spread particles around that position. The Y-axis randomness gives the galaxy thickness (vertical scatter).

## Code

in repo - `apps/b_project-3-random`

```ts
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

// --- Setup
const canvas = document.querySelector<HTMLCanvasElement>('canvas#tride')!;
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(2, 2, 3);

const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// --- Debug GUI
const gui = new GUI({ width: 350, title: 'Tweaks' });
const galaxyTweaks = gui.addFolder('galaxy tweaks');
galaxyTweaks.close();

const params = {
  count: 100000,
  size: 0.01,
  radius: 5,
  branchesCount: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPow: 3,
};

// --- Galaxy generation
let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null = null;
let particles: THREE.Points | null = null;

function generateGalaxy() {
  // Cleanup previous
  if (particles) { particles.parent?.remove(particles); particles = null; }
  if (geometry) { geometry.dispose(); geometry = null; }
  if (material) { material.dispose(); material = null; }

  geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.count * 3);

  for (let i = 0; i < params.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * params.radius;

    // Which branch (arm) this particle belongs to
    const branchAngle =
      ((i % params.branchesCount) / params.branchesCount) * Math.PI * 2;

    // Spin: particles farther from center rotate more
    const spinAngle = radius * params.spin;

    // Random scatter — clustered near 0 by pow(), spread in both directions
    const randomX =
      Math.pow(Math.random(), params.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), params.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), params.randomnessPow) *
      (Math.random() < 0.5 ? 1 : -1) *
      params.randomness *
      radius;

    positions[i3] = Math.sin(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.cos(branchAngle + spinAngle) * radius + randomZ;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  material = new THREE.PointsMaterial({
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);
}

generateGalaxy();

// --- GUI controls
galaxyTweaks.add(params, 'count').min(100).max(1000000).step(100).onFinishChange(generateGalaxy);
galaxyTweaks.add(params, 'size').min(0.001).max(0.1).step(0.001).onFinishChange(generateGalaxy);
galaxyTweaks.add(params, 'radius').min(0.01).max(10).step(0.01).onFinishChange(generateGalaxy);
galaxyTweaks.add(params, 'branchesCount').min(1).max(20).step(1).onFinishChange(generateGalaxy);
galaxyTweaks.add(params, 'spin').min(-0.5).max(5).step(0.001).onFinishChange(generateGalaxy);
galaxyTweaks.add(params, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateGalaxy);
galaxyTweaks.add(params, 'randomnessPow').min(1).max(10).step(0.001).onFinishChange(generateGalaxy);

// --- Animation loop
const timer = new THREE.Timer();
renderer.setAnimationLoop((t) => {
  timer.update(t);
  controls.update();
  renderer.render(scene, camera);
});
```

## Gotchas

- **`randomnessPow` too high** — values above 6–7 make the scatter so tightly clustered near zero that particles barely deviate from the spiral arm. The galaxy looks unnaturally clean.
- **Sign choice matters** — without the `Math.random() < 0.5 ? 1 : -1` ternary, all scatter is positive. Particles drift away from center instead of scattering around the path.
- **Randomness scales with radius** — `randomness * radius` means outer particles scatter more than inner ones. This is physically realistic for a galaxy, but can produce unexpected results if you tweak `randomness` expecting uniform scatter across the whole galaxy.
- **`spin` can be negative** — negative values curl the arms in the opposite direction. The GUI range allows this (`min: -0.5`).
- **Generating on every tweak** — `onFinishChange(generateGalaxy)` regenerates all geometry when any parameter changes. For 100k+ particles this is fast enough, but for millions the UI would lag. Consider incremental updates for higher counts.

## Revisit

- **Texture map on particles** — currently particles are plain squares. A radial gradient texture (soft circle) would make the galaxy look much better, as done in the particles texture lesson (`14.2_map-alpha-map-colors-blending`).
- **Color per particle** — adding a color attribute (inner particles warm/yellow, outer particles blue/cool) would dramatically improve visual quality.
- **Randomness distribution shapes** — try `Math.pow(Math.random(), 1/n)` (pow with exponent < 1) to bias scatter toward large values instead of small ones. Experiment with non-pow distributions like `Math.tan()` or gaussian noise.
- **Galaxy rotation animation** — the galaxy is static. Animate particle rotation around center over time for a live galaxy feel.

## Outdated

approach is valid

This is a classic Three.js particles technique — directly managing `BufferGeometry` positions, regenerating on parameter change, using `PointsMaterial` with additive blending. It works well in WebGL and is a solid learning exercise for understanding how particle positions translate to visual structure.

## Links & Resources

### Docs

- [Three.js Points](https://threejs.org/docs/#api/en/objects/Points) — official docs for `THREE.Points`
- [Three.js PointsMaterial](https://threejs.org/docs/#api/en/materials/PointsMaterial) — official docs for `PointsMaterial`
- [Three.js BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry) — official docs for `BufferGeometry`
- [lil-gui](https://lil-gui.georgealways.com/) — debug UI library docs
> 🤖 suggested

### Examples

- [Three.js WebGL particles galaxy](https://threejs.org/examples/#webgl_points_random) — official example of random point placement
> 🤖 suggested
- [Three.js WebGL particles spiral](https://threejs.org/examples/#webgl_points_spiral) — official example showing spiral particle patterns
> 🤖 suggested

### Tools

- [Desmos | Math.pow visualizer](https://www.desmos.com/calculator) — plot `y = pow(x, n)` to see how `Math.pow()` changes distribution shape for different exponents
> 🤖 suggested

### Articles

- [Understanding Math.pow for Randomness](https://observablehq.com/@mbostock/understanding-math-pow) — visual explanation of how `Math.pow()` reshapes random distributions
> 🤖 suggested

### Videos

- [Three.js Particles Galaxy Generator — Bruno Simon](https://threejs-journey.com/) — Three.js Journey course chapter covering galaxy generation with particles
> 🤖 suggested
- [3Blue1Brown — Distribution shapes](https://www.youtube.com/playlist?list=PLZHQObOWTQDOjmo3Y6ADm0ScWAl1fAnwX) — excellent visual explanations of probability distributions
> 🤖 suggested

### Repos

- [threejs-journey/galaxy-generator](https://github.com/brunosimon/threejs-journey) — reference implementation covering galaxy particle systems
> 🤖 suggested