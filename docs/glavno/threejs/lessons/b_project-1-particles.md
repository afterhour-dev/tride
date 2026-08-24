---
title: b project-1 particles
topic: threejs
date: 2026-08-24
tags: [parts, webgl]
difficulty: beginner
app_path: apps/b_project-1-particles
---

# B Project 1 — Generating Particles: the Galaxy Generator

The first app in the B project series. After working through the particles chapter ([14.0 particles webgl intro](14.0_particles-webgl-intro.md), [14.1 particles custom geometry](14.1_particles-custom-geometry.md), [14.2 map alpha map colors blending](14.2_map-alpha-map-colors-blending.md)), this project stops being about *particles as a concept* and starts being about *particles as an app*: a full galaxy generator with `Points` at its core, a lil-gui panel to tweak it live, and — the true heart of the lesson — proper **dispose logic** so that every regenerate doesn't leak geometry or materials into the GPU.

## Concept

The app is framed by one big design shape: a **closure** named `generateGalaxy` that builds the galaxy from scratch, plus a set of mutable fields **outside** that closure so they can be torn down and rebuilt on demand.

### The mutable fields — geometry, material, particles

Three pointers are declared before the closure and deliberately left `null`:

```ts
let geometry: THREE.BufferGeometry | null = null;
let material: THREE.PointsMaterial | null = null;
let particles: THREE.Points | null = null;
```

They live outside `generateGalaxy` on purpose. Because a galaxy is a *geometry thing* — a chunk of GPU memory holding positions — you cannot just overwrite the reference and walk away. You must explicitly **dispose the old one and remove it from the scene** before you build the next. The closure needs to see and overwrite those outer fields, and the GUI must be able to rebuild the galaxy many times.

### The dispose logic — why the old galaxy must be destroyed

```ts
if (parts && particles.parent) {
  particles.parent.remove(particles);
  particles = null;
}
if (geometry) {
  geometry.dispose();
  geometry = null;
}
if (material) {
  material.dispose();
  geometry = null;        // NOTE: this line resets geometry, not material — a small bug
}
```

Three cleanup passes run before anything new is built:

1. **Remove the `Points` object from its parent** — the scene still holds it, and the `parent` should be this app's `Scene` instance. Note `remove(particles)` only detaches it from the hierarchy; it does **not** free the underlying GPU attributes. That's what `dispose()` is for.
2. **`geometry.dispose()`** — releases the vertex buffers (the `position` attribute) from GPU memory. This is the important one: a `Float32Array` of 100 000 particles × 3 floats is real memory that stays allocated unless you dispose it.
3. **`material.dispose()`** — releases the material's GPU resources (the point shader + its texture handles).

**Why all three?** `Points` is a mesh object that *references* both a geometry and a material. If you only remove it from the scene and set it to `null`, the geometry + material stay alive in the GPU, unreachable — a slow leak every time you drag the count gui. `dispose()` is the three.js way of telling the GPU "this is done, release the buffers". The `// EXPLAIN:` comments put it plainly: *"remember, since this is geometry thing, you must dispose old geometry."*

> ⚠️ There is a real + obvious bug hiding here: the material branch sets `geometry = null` instead of `material = null`. Functionally, since the very next lines rebuild both from scratch, the app still works — but the `material` slot keeps the old material's GPU buffers alive until the *next* regenerate, and then `material.dispose()` on a fresh geometry leak grows by one. A scene regenerated many times leaks across generations. Worth fixing the variable name.

### count × 3 — the interleaved position buffer

```ts
const positions = new Float32Array(count * 3);
for (let i = 0; i < count * 3; i++) {
  const i3 = i * 3;
  positions[i3]  = (Math.random() - 0.5) * 3;
  positions[i3+1] = (Math.random() - 0.5) * 3;
  positions[i3+2] = (Math.random() - 0.5) * 3;
}
```

Same layout as [14.1 particles custom geometry](14.1_particles-custom-geometry.md): three consecutive floats per particle — x, y, z — packed into one flat array. The spelling `i * 3` just reads it in groups of three.

**`(Math.random() - 0.5)` centers the cloud.** `Math.random()` gives `0 … 1`; subtracting `0.5` shifts it to `-0.5 … 0.5`, so the average position sits at the scene's origin — the `// EXPLAIN:` comment calls this centering "in the center of the scene". Multiply by `3` to fan the range out to `-1.5 … +1.5` on each axis. That *3 in a roughly cubic scatter, not a galaxy disk yet* — the app is currently a pure scatter; turning it into a real spiral galaxy shape is a future step.

### PointsMaterial — size, attenuation, no depth-write, additive blending

```ts
material = new THREE.PointsMaterial();
material.size = debugObject.size;
material.sizeAttenuation = true;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending;
```

This uses the "third way we explored in lesson 14.2" — `depthWrite = false` + `AdditiveBlending` (the README comment points back to [14.2 map alpha map colors blending](14.2_map-alpha-map-colors-blending.md)). `sizeAttenuation` makes particles shrink with distance; `depthWrite = false` keeps the particles from writing into the depth buffer (so overlapping semi-transparent points don't z-fight as you orbit); `AdditiveBlending` adds each overlapping particle toward white — that's the glow.

### plain-points — no vertex colors, no map yet

This app deliberately does **not** set `vertexColors`, `map`, or `alphaMap`. Particles here are uniform points, so the cloud is a plain scatter of squares. That's the "first part" of the lesson; color and shape are experiments for the next apps in the series. (Access to the WebGPU renderer is commented out in favor of WebGL for now.)

## Code

in repo - `apps/b_project-1-particles`

```ts
import * as THREE from 'three';
import GUI from 'lil-gui';
import { getRequiredElement } from './util';

const canvas = getRequiredElement<HTMLCanvasElement>('canvas#tride');

const gui = new GUI({ width: 350, title: 'Tweaks', closeFolders: true });
const debugObject = { count: 100000, size: 0.01 };
const galaxyTweaks = gui.addFolder('galaxy tweaks');
galaxyTweaks.close();

const sizes = { width: window.innerWidth, height: window.innerHeight };

function init() {
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({ canvas });

  // mutable, so the gui can rebuild the galaxy after dispose
  let geometry: THREE.BufferGeometry | null = null;
  let material: THREE.PointsMaterial | null = null;
  let particles: THREE.Points | null = null;

  const generateGalaxy = () => {
    // dispose the old galaxy before building a new one
    if (particles && particles.parent) {
      particles.parent.remove(particles);
      particles = null;
    }
    if (geometry) {
      geometry.dispose();
      geometry = null;
    }
    if (material) {
      material.dispose();
      geometry = null;   // BUG: should be `material = null`
    }

    geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(debugObject.count * 3);

    material = new THREE.PointsMaterial();
    material.size = debugObject.size;
    material.sizeAttenuation = true;
    material.depthWrite = false;
    material.blending = THREE.AdditiveBlending;

    for (let i = 0; i < debugObject.count * 3; i++) {
      const i3 = i * 3;
      positions[i3]     = (Math.random() - 0.5) * 3;
      positions[i3 + 1] = (Math.random() - 0.5) * 3;
      positions[i3 + 2] = (Math.random() - 0.5) * 3;
    }

    geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3),
    );

    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  };

  generateGalaxy();

  const camera = new THREE.PerspectiveCamera(
    75, sizes.width / sizes.height, 0.1, 100,
  );
  camera.position.z = 3;
  scene.add(camera);

  const gui folder is bound to the `galaxyTweaks` folder above, and its
  `onFinishChange` rebuilds* generateGalaxy /* when the slider lets go:

  galaxyTweaks
    .add(debugObject, 'count').step(100).name('particle count')
    .min(100).max(1000000)
    .onFinishChange(generateGalaxy);
  galaxyTweaks
    .add(debugObject, 'size')
    .min(0.001).max(0.1).step(0.001)
    .onFinishChange(generateGalaxy);

  const timer = new THREE.Timer();
  renderer.setAnimationLoop(tick);

  function tick(timestamp: number) {
    timer.update(timestamp);
    orbitControls.update();
    renderer.render(scene, camera);
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
  renderer.setClearColor(0x000000, 1);
  renderer.render(scene, camera);
}

init();
```

## Gotchas

- **Geometries are GPU memory — they must be `dispose()`d, not just dropped.** Removing the `Points` from the scene or pointing the variable at `null` does **not** free the GPU `BufferAttribute`s. Every gui regeneration without dispose leaks a chunk of memory.
- **`material.dispose()` followed by `geometry`.** The app's own cleanup ram has a bug `geometry = null` where `material = null` belongs. Since `generateGalaxy` overwrites both slots immediately, the app still runs — but a single old material is left unreleased for one extra cycle (grows if you regenerate in count). This one is worth opening and fixing by hand.
- **`count * 3`, not `count`.** Three floats per particle (x,y,z) in one flat array. `new Float32Array(count)` would only allocate one coordinate per particle and miss-wrap.
- **`(Math.random() - 0.5)` centers; a bare `Math.random()` skews one corner.** The subtraction is the difference between a cloud around the origin and a cloud in the +`+`+`+`+`+` octant.
- **Additive blending costs performance.** Glowing overlaps accumulate toward white — beautiful, but heavier than plain overwrite at high counts. WebGL tolerates it, but it's worth knowing where the cost went when particles seem heavy.

## Outdated

The WebGL path (`THREE.WebGLRenderer`) this lesson uses is valid and broadly compatible. `approach is valid`. The app itself already ships with the WebGPU renderer commented out (`three/webgpu` + `THREE.WebGPURenderer`) as the forward-looking alternative — **WebGPU is the current native path in three.js, and the particle disposal (GPU buffer lifecycle) is exactly the work WebGPU is more aggressive about.**

> 💡 More up to date alternative: https://threejs.org/examples/ — official examples include up-to-date particle and point-rendering demos.
> 💡 More up to date alternative: https://threejs.org/ — the new docs lead with the WebGPU renderer.

## Revisit

- **Fix the `geometry = null` / `material = null` mix-up** in the cleanup branch — an easy and satisfying first bug.
- **Turn the scatter into a disk.** Right now positions are a uniform cube `(Math.random() - 0.5) * 3`. A real galaxy has a disk + spiral — weight the random radius (exponential or Gaussian), squash the Y, and see the cloud read as a galaxy instead of a ball.
- **Wire up vertex colors + `alphaMap`** from [14.2 map alpha map colors blending](14.2_map-alpha-map-colors-blending.md) — a colored, shaped galaxy (smoke/glitter look).
- **Try the WebGPU renderer** — swap `WebGLRenderer` for `WebGPURenderer` from `'three/webgpu'` and A/B the same dispose/regenerate against WebGL.
- **Watch GPU memory.** Keep the gui open and drag count up and down a lot; watch memory climb if the dispose logic leaks — a hands-on way to *feel* why `dispose()` matters.

## Links & Resources

### Docs

- Three.js [PointsMaterial](https://threejs.org/docs/#api/en/three/materials/PointsMaterial) — `🤖 suggested` — the material whose instance properties this lesson tweaks (`size`, `sizeAttenuation`, `depthWrite`, `blending`).
- Three.js [BufferGeometry](https://threejs.org/docs/#api/en/three/buffers/BufferGeometry) — `🤖 suggested` — holds the `'position'` vertex buffer; `.dispose()` releases it.

### Examples

- [Three.js examples — particles/points](https://threejs.org/examples/) — official point-cloud and particle examples.

### Tools

- [lil-gui (fair computed)](https://lucassampères.github.io/lil-gu/) — `🤖 suggested` — the GUI library string this lesson: folders, steppers, `onFinishChange`.
- [ShaderToy](https://www.shadertoy.com/) — `🤖 suggested` — prototype the glow/additive-blend shader yourself in GLSL.

### Articles

- [Three.js Manual — Particles](https://threejs.org/manual) — `🤖 suggested` — contextual reading for vertices and `Points`.

### Videos

- [Three.js particle systems (search)](https://www.youtube.com/) — `🤖 suggested` — look for "three.js particle galaxy".

### Repos

- [three.js](https://github.com/mrdoob/three.js) — `🤖 suggested` — source + examples live here.

### Other

- [Kenney Particle Pack](https://kenney.nl/assets/particle-pack) — free particle shapes, the natural next step for `map`/`alphaMap`.