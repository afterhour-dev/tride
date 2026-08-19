---
title: a project-1
topic: threejs
date: 2026-08-19
tags: [math, geometry]
difficulty: beginner
app_path: apps/a_project-1
---

# a Project 1 — Building a House from Primitives

Project A is the first **"project"** in the series: instead of one focused concept, we assemble everything learned so far into a single scene — a stylized green house with a roof, a door, bushes, and a ring of 50 tombstones scattered across a floor. The whole point is **practice through combination**: primitives as geometry, `MeshStandardMaterial` colors, ambient + directional lighting, a full debug GUI, and some real trigonometry to place the tombstones in a circle. It's continued in the next lesson.

We also build one custom piece of geometry — the four walls of the house — by transforming simple `PlaneGeometry`s and merging them into a single `BufferGeometry`.

The project runs on **WebGPU** via `three/webgpu` and `WebGPURenderer`, the modern rendering path used by the rest of this series.

---

## Concept

### 1. Measure in real-world units — 1 unit = 1 meter

Everything in the scene is sized in **meters** because one Three.js unit represents one meter in real life. Instead of picking random numbers, we hand-write the measurements as named constants so the scene reads like a real house:

```ts
const mesure = {
	wallHeight: 2.5,
	wallWidt: 4,   // (sic — typo in the repo, "Widt")
	wallDepth: 4,
	roofHeight: 1,
	roofRadiusBottom: 3.4,
	roofRadiusTop: 1,
	doorHeight: 2,
	doorWidth: 2,
};
```

Using real measurements (2.5 m walls, 2 m tall door, etc.) keeps proportions believable and makes later tweaks predictable. There's no ceremony to this — it's just the habit of thinking of units as meters rather than arbitrary numbers.

### 2. Trigonometry to place tombstones in a circle

50 tombstones are scattered in a ring around the house. We want them to sit on the floor at some distance from the house, spread over every angle. That's exactly what `sin`/`cos` give us.

#### The trig recap (cement it in)

- `Math.sin` and `Math.cos` both take **radians**.
- Both return values between **-1 and 1**.
- At `0` radians: `sin(0) = 0` and `cos(0) = 1`.
- As the angle grows: `sin` goes `0 → 1 → 0 → -1`, `cos` goes `1 → 0 → -1 → 0`.

A **full circle is `2 * Math.PI` radians**. If we plot a point at

$$x = \cos(\text{angle}) \cdot \text{radius}$$

$$z = \sin(\text{angle}) \cdot \text{radius}$$

for consecutive angles, the dots trace a **perfect circle**. The radius acts as the multiplier on `sin`/`cos`, and the angle picks the direction. If we keep the radius constant, we stay on a circle; if the radius changes, we get randomness instead.

#### Controlled randomness

Two lines in the code build each tombstone's position. The trick is that the randomness is *bounded*:

```ts
// angle: a full circle split into random radians → any spot on the circle
const angle = Math.random() * Math.PI * 2;

// radius: guarantee a minimum and a maximum distance from center
const radius = 3.5 + Math.random() * 5.5;

const x = Math.cos(angle) * radius;
const z = Math.sin(angle) * radius;
```

- **`Math.random() * Math.PI * 2`** — `Math.random()` returns `0 → 1`, so the product covers every radian value between `0` and `2π`. That's a full circle worth of directions.
- **`3.5 + Math.random() * 5.5`** — the `+ 3.5` is the guaranteed *lower bound* for the radius, and `* 5.5` makes the spread, so radius lands anywhere from `3.5` to `9`.

Why those exact bounds? The floor is `20 × 20`, so the biggest circle that fits has radius `10` — staying at max `9` keeps tombstones on the floor. And the house is about `4` wide (a circle of radius `2` would just touch it), but `3.5` is chosen instead of `2` to leave breathing room between the house and the tombstones. So the tiny tweaks all have a *reason*.

#### Small random rotations for a natural look

Each tombstone is also nudged so they don't all stand perfectly straight:

```ts
toomb.rotation.y = (Math.random() - 0.5) * 0.2;
toomb.rotation.z = (Math.random() - 0.5) * 0.4;
```

`Math.random() - 0.5` produces values in `-0.5 → 0.5`, so when multiplied by `0.2` or `0.4` we always get small radian angles (roughly `-0.1 → 0.1` and `-0.2 → 0.2`). Small angles mean the tombstones are only *slightly* tilted — a graveyard that looks hand-placed rather than a perfect grid.

### 3. The `createWallBoxGeometry` utility — merging planes into a box

The four walls are a single custom `BufferGeometry` built from four `PlaneGeometry`s that are rotated, translated, and merged:

```ts
// Front wall (+Z)
const front = new THREE.PlaneGeometry(width, height, wSegs, hSegs);
front.translate(0, height / 2, depth / 2);
geometries.push(front);

// Back wall (-Z), flip to face inward
const back = new THREE.PlaneGeometry(width, height, wSegs, hSegs);
back.rotateY(Math.PI);
back.translate(0, height / 2, -depth / 2);

// ... right (+X) and left (-X) walls likewise rotated/translated ...
```

Each plane is moved up by `height / 2` (so the box sits on the ground) and out by `depth / 2` / `width / 2` to form the four sides. The back and side walls are rotated `90°`/`180°` so they face inward. Finally:

```ts
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

const merged = mergeGeometries(geometries, true);
merged.computeTangents();
```

`mergeGeometries` fuses all four planes into **one BufferGeometry → one mesh → one draw call**, which is cheaper than four separate meshes. The `true` argument (`useGroups`) keeps a separate material group per wall — handy if you later want different UV tiling or materials per face, and it can be dropped for a single material. `PlaneGeometry` already ships with normals, UVs and correct topology, so only tangents need recomputing afterward (for normal mapping).

### The rest of the scene

- **Floor** — a `20 × 20` `PlaneGeometry` with `MeshStandardMaterial`, rotated flat (`rotation.x = -Math.PI / 2`).
- **Walls** — the merged box, `MeshStandardMaterial` in a dark tone.
- **Roof** — a `CylinderGeometry` (wider at the bottom, narrower at the top), lifted to sit on top of the walls. Turned `45°` so the 4-sided cone lines up with the square walls.
- **Door** — a `PlaneGeometry` placed just outside the front wall.
- **Bushes** — four `TetrahedronGeometry` instances scaled vertically (taller near the door) for variation.
- **Lights** — an `AmbientLight` (base fill) and a `DirectionalLight` positioned above and to the side. Note intensities like `0.9 * Math.PI` — WebGPU's physically-based lighting uses candela/lux units, so there are higher raw values than classic WebGL.
- **Grouping** — `wallsMesh`, `roofMesh`, `doorMesh` and the bushes are all added to a single `house` group, so the whole house moves together.

### Debug GUI

A `lil-gui` panel ("Tweaks") organizes the scene into closed folders: Floor, Ambient Light, Directional Light (moon light), and its shadow tweaks. Everything from [[7.0_debug-ui]] onward is on display — toggling visibility, adjusting intensity/color/position, and a spotlight on the directional light's shadow settings.

---

## Code

in repo - `apps/a_project-1`

```ts
import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const renderer = new THREE.WebGPURenderer({ canvas });
renderer.shadowMap.type = THREE.PCFShadowMap; // shadows disabled globally for now
await renderer.init();

// lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9 * Math.PI);
directionalLight.position.set(4, 5, -2);
scene.add(directionalLight);

// house parts
const wallsMesh = new THREE.Mesh(
	createWallBoxGeometry(THREE, 4, 4, 2.5), // see geo-util.ts
	new THREE.MeshStandardMaterial({ color: '#353042' }),
);

const roofMesh = new THREE.Mesh(
	new THREE.CylinderGeometry(1, 3.4, 1, 4, 8),
	new THREE.MeshStandardMaterial({ color: '#7ea0e9' }),
);
roofMesh.position.y = 2.5 + 1 / 2;
roofMesh.rotation.y = Math.PI / 4;

const house = new THREE.Group();
house.add(wallsMesh, roofMesh, /* door, bushes ... */);
scene.add(house);

// 50 tombstones in a ring via sin/cos
const tombstones = new THREE.Group();
for (let i = 0; i < 50; i++) {
	const angle = Math.random() * Math.PI * 2;      // any direction
	const radius = 3.5 + Math.random() * 5.5;        // 3.5 → 9
	const toomb = new THREE.Mesh(
		new THREE.BoxGeometry(0.6, 0.9, 0.2),
		new THREE.MeshStandardMaterial({ color: '#fde6e3' }),
	);
	toomb.position.set(Math.cos(angle) * radius, 0.35, Math.sin(angle) * radius);
	toomb.rotation.y = (Math.random() - 0.5) * 0.2; // tiny random tilt
	toomb.rotation.z = (Math.random() - 0.5) * 0.4;
	tombstones.add(toomb);
}
scene.add(tombstones);

// camera, controls, resize, fullscreen, animation loop (see main.ts) ...
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.set(5, 2, 4);
scene.add(camera);
```

---

## Gotchas

- **`shadow.radius` (blur) does not work with `THREE.PCFSoftShadowMap`** — the GUI disables/blocks expectations with a warning. Radius blur only behaves with `PCFShadowMap`/`VSMShadowMap`; see [[13.1_shadow-map-optimization-part-one]].
- **The shadow camera helper won't show anything unless `renderer.shadowMap.enabled` is `true`.** The GUI's own note says exactly this — helpers render nothing meaningful while shadows are globally off.
- **Keep `shadow.mapSize.width` and `height` the same.** The GUI warns about this; non-square shadow maps waste memory and can look wrong.
- **`ArrowHelper` direction is computed once at creation** and never updated from the `directionalLight`. Move the light with the GUI and the helper arrow stays pointing the old way — you'd have to recreate it to track movement.
- **`directLookAtCenter` doesn't do what the name suggests.** The disabled GUI label spells this out: calling `directionalLight.lookAt(0,0,0)` does **not** point the light at center / produce rotations the user expected. It's flagged in the code as not behaving as intended — a known surprise, left visible as a note.
- **Physically-based intensities.** `DirectionalLight.intensity = 0.9 * Math.PI` looks different from a WebGL-style `1.5`. Guessing raw intensities tuned for WebGL carries over poorly to the WebGPU lighting units.
- **WebGPU needs `await renderer.init()`** before rendering — forget the `await` and nothing draws.
- **Minor naming hiccup in the repo:** the measurement object spells it `wallWidt` (missing "h"). Harmless but easy to trip over when grepping.
- **Bushes share one material but sit fairly close to the door** — with shadows off there's no overlap problem, but it's a reminder that shared geometry + no shadow reads a bit flat.

---

## Revisit

- **Shadows are disabled for now** (`renderer.shadowMap.enabled = true` is commented out). The whole shadow GUI exists but does nothing until that line is flipped. Revisit once shadows are turned on to see the helpers and tweaks activate — likely in the *next* project lesson.
- **Textures are loaded but not applied.** `TextureLoader` + `LoadingManager` are set up, and a whole `public/textures/` folder (bricks, grass, planks, roof) ships with the repo, but the meshes in `main.ts` are all plain-colored `MeshStandardMaterial`. The intent to use textures (per the README) is scaffolded, not yet wired up — a natural next step.
- **`gsap` is installed but commented out.** `import gsap from 'gsap'` is present but unused — a placeholder for animation practice from [[3.4_animation-gsap]].
- **The wall-box helper is read-only here, but worth re-deriving.** Try writing your own `createWallBoxGeometry` (or an open-top / windowed variant) without peeking, to internalize the rotate + translate + merge dance.
- **Angle/radius bounds are hard-coded to the floor size.** The comment trail explains the `3.5 → 9` radius against the `20 × 20` floor. Recompute these if the floor changes.
- **Normal mapping isn't used yet** — `merged.computeTangents()` is there ready, but no normal maps feed the walls. Wire a normal texture into the material to make the computed tangents meaningful.

---

## Outdated

approach is valid — primitives, `MeshStandardMaterial`, and `sin`/`cos` ring placement remain completely standard Three.js practice. **The notable point: this project is already built on WebGPU (`three/webgpu` + `WebGPURenderer`)** 🌟, the modern renderer that's progressively replacing WebGL. So there's nothing to migrate — you're already on the current path. The `mergeGeometries` utility and `CylinderGeometry` cone roof are all current API as of three r185.

---

## Links & Resources

### Docs

- [Three.js — WebGPURenderer](https://threejs.org/docs/#api/en/renderers/webgpu/WebGPURenderer)
  > 🤖 suggested
- [Three.js — CylinderGeometry](https://threejs.org/docs/#api/en/geometries/CylinderGeometry)
  > 🤖 suggested
- [Three.js — PlaneGeometry](https://threejs.org/docs/#api/en/geometries/PlaneGeometry)
  > 🤖 suggested
- [Three.js — BufferGeometryUtils.mergeGeometries](https://threejs.org/docs/#api/en/utils/BufferGeometryUtils.mergeGeometries)
  > 🤖 suggested
- [Three.js — MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)
  > 🤖 suggested
- [Three.js — DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight)
  > 🤖 suggested

### Examples

- [Three.js examples — webgpu_scene](https://threejs.org/examples/?q=webgpu#webgpu_scene) — official WebGPU-rendered scene demonstrating the renderer used here.
  > 🤖 suggested

### Tools

- [Desmos — Unit circle](https://www.desmos.com/calculator/3ffife6rtx) — watch `cos`/`sin` sweep a circle as the angle grows; exactly the placement logic behind the tombstones.
  > 🤖 suggested
- [GeoGebra — Unit circle & sine/cosine](https://www.geogebra.org/m/ycn5xgsr) — interactive unit circle for cementing the `sin`/`cos` radian behavior.
  > 🤖 suggested

### Articles

- [Sine & cosine — Brilliant](https://brilliant.org/wiki/sin-cos-relation/) — a quick conceptual refresher on why `cos`/`sin` map an angle to x/y on a circle.
  > 🤖 suggested

### Videos

- [But what is the unit circle? — 3Blue1Brown-style intro](https://www.youtube.com/watch?v=WUvTyaaNkzM) — intuition for radians and sine/cosine on a circle.
  > 🤖 suggested

### Courses & Talks

- [Three.js Journey](https://threejs-journey.com) — the course this series follows; its projects chapter mirrors this assemble-a-scene approach.
  > 🤖 suggested

### Repos

- [mrdoob/three.js](https://github.com/mrdoob/three.js) — source for `BufferGeometryUtils`, WebGPURenderer, and every geometry used here.
  > 🤖 suggested

### Other

- [Radians — Wikipedia](https://en.wikipedia.org/wiki/Radian) — why a full circle is `2π` radians, the core unit behind the trig placement.
  > 🤖 suggested
