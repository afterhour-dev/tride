---
title: a project-2
topic: threejs
date: 2026-08-20
tags: [lights, fog, background, clearColor]
difficulty: beginner
app_path: apps/a_project-2-fog
---

# a Project 2 — Fog, Background, and the Clear-Color Question

Project A continues. Most of the scene is carried over from [[a_project-1-geo]]: the stylized house built from primitives, the ring of 50 tombstones, the ambient + directional lighting, and the debug GUI. Part two's job is to sharpen two specific rendering ideas the first part left open:

1. **Fog** — how the `Fog` class fades distant objects into a color, what `near`/`far` actually mean, and why you assign it via `scene.fog = fog` instead of `scene.add(fog)`.
2. **Background vs. clear color** — the scene now runs on **WebGPU** (`three/webgpu` + `WebGPURenderer`), and the code deliberately replaces `renderer.setClearColor(...)` with a `scene.background` + matching fog color. The README asks outright: *did I make the right choices?* That's the heart of this lesson.

The two ideas are one problem: on WebGPU, **fog color and background color should agree**, and this project pairs both to a shared `#1b2f` tone.

---

## Concept

### 1. The `Fog` class — fading distance into a color

A `Fog` tints/fades objects based on **how far they are from the camera**. Objects past a certain distance drop out into a flat color instead of clipping visibly. Fog isn't a physical thing in the scene — it's a **post-distance color blend applied per-pixel** by the renderer.

```ts
const fog = new THREE.Fog(color, near, far);
scene.fog = fog;
```

- **`color`** — the color everything fades *toward*. Since fog is applied per-pixel, this should visually match `scene.background` (and the clear color) so distant geometry blends into the environment instead of a hard edge.
- **`near`** — the distance where fog **starts**. Closer than this nothing is fogged.
- **`far`** — the distance where fog becomes **fully opaque**. Beyond `far`, the object is entirely the fog color, no longer readable.

In `main.ts`:

```ts
const fog = new THREE.Fog(mesuresAndColors.fogBackground); // color = '#201b2f'
fog.near = 1;
fog.far = 15;
scene.fog = fog;
```

So within 1 to 15 meters from the camera, objects gradually fade to that dark purple tone. The tombstones scattered out to ~9 m and the far floor edge get `fogged` toward the background instead of showing a hard line.

#### `scene.fog` is a property, not a scene child

A **key surprise** in this project: fog is *not* added like geometry or lights. There's no `scene.add(fog)`. Instead you set the property:

```ts
// WRONG for fog — nothing renders:
// scene.add(fog);

// RIGHT — assigned as a scene property:
scene.fog = fog;
```

Fog doesn't exist in the scene graph; it's a config value the renderer reads. That's why the code comment gently draws attention to `scene.fog = fog`. The same property style shows up elsewhere on WebGPU — e.g. `scene.background`.

Fog is a **WebGPU-era three.js** feature (previously `FogNative` in the WebGL renderer). It piggy-backs on the Scene property `scene.fog`, which can hold a `Fog` or the exponential `FogExp2` flavor. You can also wink a material at per-object control with its `fog` boolean — some materials opt in/out, which is useful later for letting certain objects stay sharp.

### 2. Background, clear color, and fog — three colors that should agree

This is the part the README really wants you to *judge*. On WebGPU you have three related ways to paint the "empty" backdrop of a frame:

- **`renderer.setClearColor(color, alpha)`** — the old/classic way. Tells the renderer what to fill the cleared buffer with before drawing. Commented out in `main.ts`.
- **`scene.background`** — the scene-level property, set to a `THREE.Color`.
- **`Fog.color`** — the tone distant objects fade toward.

In `a_project-2`, the user's choice was:

```ts
scene.background = new THREE.Color(mesuresAndColors.fogBackground);
```

and commented out both `renderer.setClearColor(0x000000, 1)` and `renderer.setClearColor(mesuresAndColors.fogBackground, 1)`. **And** the fog color is the same `fogBackground` (`#201b2f`) used for `scene.background`.

### 3. Reading the choice: is it right?

Let's unpick each question the README raises.

**a) Should background color and fog color match?**

**Yes — strongly.** Here's the *reason*: fog is applied per-pixel to objects at distance, fading them to `fog.color`. If `scene.background` were a different color than `fog.color`, then distant objects would fade toward one color while unpainted backdrop is another — producing exactly the kind of edge/outline you'd otherwise be trying to avoid. Matching them is the whole point. The project does this: one `fogBackground` constant drives **both** `scene.background` **and** `fog`, which is the single most important decision in this file, and it's correct.

**b) Should you set `scene.background` *and* `renderer.setClearColor` to the same value?**

On WebGPU these *can* overlap, but `scene.background` is the higher-level (and better) tool. `setClearColor` predates the scene-level API and is more of a WebGL carry-over. If you set both to the same value you get the same look (clear + background agree), but `scene.background` alone is more *modern* and expresses intent. Setting **different** values is where the two actually fight. So the comment-out of `setClearColor` in favor of `scene.background` is a reasonable, forward-looking choice — you don't need to set both copies of the same color.

**c) Did the user "listen to the internet" correctly by *not* using the grass color?**

The bit from the README: *"I didn't listen to advice of some people on the internet to color clear/ fog color as the grass plane; what I did is use the same color for background and fog"*.

The internet advice — color the backdrop to match the *grass plane* — addresses the visible seam where the plane ends (grass green) and the backdrop starts (clear). If the backdrop ≠ grass, the far floor edge shows as a line. Matching clear/fog to the plane's color *would hide that particular edge*.

But the user chose instead to match fog to **background**, not to the grass. Now the far grass edge *does* fade to fog → background → the scene's horizon blends, but the floor's own fog-tinted color differs from the grass green until it "disappears" into the fog. Whether that's "right" is subjective, but the *principled* answer: **you can only match fog to one thing — either the ground color or the background color** — and matching it to the background (fade-everything-into-the-environment) is the more standard cinematic choice. The grass-seam approach is for scenes where you want the floor itself to read strongly. Seeing this trade-off clearly and picking deliberately is the skill being practiced.

> For what it's worth, the cleaner general rule for **outdoor** scenes is: *fog → background, and let the floor be textured/lit so it doesn't make a flat seam*. For **indoor/void** scenes, fog → a color you'd happily see anywhere. Either way, **fog color ≡ background color** holds.

### 4. The rest of the carried-over scene

Everything else is [[a_project-1-geo]] refined:

- **Lights are the star again.** `AmbientLight` tinted periwinkle (`#987dd6`) at a low `0.12`, `DirectionalLight` same tint at `0.02 * Math.PI` (physically-based units), plus a new `PointLight` (`#c7a87e`) sitting just above the door to spotlight it. Intensities are low, and `PointLight.distance = 7` bounds its reach.
- **Grouping** — the house group now also contains `doorPointLight`, so the warm pool of light at the door *moves with the house* when the group transforms. Worth noting: lights-as-children of a group is legal and keeps light attached to the object.
- **Tombstones + bushes** — same bounded-random placement, no change.
- **Helpers** — `directionalLightHelper`, a `CameraHelper` on the shadow camera, and an `AxesHelper` are all added to the scene and hidden by default (`visible = false`), togglable from the GUI.

### 5. Debug GUI + shadow prep

The lil-gui "Tweaks" panel regroups everything into closed folders. Importantly, running on the **moon-light** folder there's a `castShadow` switch and a dense set of shadow-camera controls (`near`, `far`, `top/right/bottom/left`, `mapSize`). But `renderer.shadowMap.enabled` is left `false` (see the commented `= true`), so all those shadow textures/controls sit **armed but dormant** — a clear "next up" to flip on and actually cast the directional shadow.

---

## Code

in repo - `apps/a_project-2`

```ts
import * as THREE from 'three/webgpu';

const fog = new THREE.Fog('#201b2f');
fog.near = 1;    // fog begins 1m from the camera
fog.far = 15;    // fully fog-visible at 15m
scene.fog = fog; // property assignment, NOT scene.add(fog)

// background color should agree with the fog color
scene.background = new THREE.Color('#201b2f');
// (setClearColor intentionally omitted — scene.background wins on WebGPU)

// lights at arbitrary colors, physical-intensity units on WebGPU
const ambient = new THREE.AmbientLight();
ambient.color = new THREE.Color('#987dd6');
ambient.intensity = 0.12;
scene.add(ambient);

const moon = new THREE.DirectionalLight();
moon.color = new THREE.Color('#987dd6');
moon.intensity = 0.02 * Math.PI;
moon.position.set(4, 5, -2);
scene.add(moon);

// a warm point light attached to the house group, so it travels with it
const doorLight = new THREE.PointLight('#c7a87e');
doorLight.intensity = 1.5 * Math.PI;
doorLight.distance = 7;
doorLight.position.set(0, 2, 4);
house.add(doorLight); // doorLight handles benefit from being a group child
```

---

## Gotchas

- **Fog is *not* added with `scene.add`** — it's `scene.fog = fog`. Add it to the scene object and it silently controls nothing. This is the single easiest misunderstanding in this lesson.
- **Fog color, `scene.background`, and clear color must agree.** Use one constant for all of them; letting fog/background drift apart is how far-separated edges become visible again.
- **`shadow.radius` (blur) doesn't work with `THREE.PCFSoftShadowMap`** — the GUI even warns about it. Blur behaves only with `PCFShadowMap`/`VSMShadowMap`. (Same gotcha as [[a_project-1-geo]].)
- **The shadow camera helper shows nothing unless `renderer.shadowMap.enabled` is `true`.** Since shadows are off in `@ts-src`, the `CameraHelper` / shadow-tweak GUI are inert until you flip it.
- **`ArrowHelper` direction is computed once at creation.** Move the `directionalLight` and the arrow won't follow — it points the old way until recreated.
- **`shadow.mapSize.width` and `height` must stay equal** — non-square maps waste memory and mis-render.
- **Physically-based intensities.** `0.02 * Math.PI` (moon) and `1.5 * Math.PI` (door light) are in real light units; copying naive `1.5` WebGL-style guesses onto a WebGPU light looks off.
- **`lookAt`/`directLookAtCenter` here does not rotate the light as named.** Noted disabled in the GUI — don't trust the name.
- **`scene.background` vs `setClearColor`** — if you set *both* to different colors, or set fog different from both, the scene will peek an edge where they disagree. 'Both same' is harmless; 'different' is the trap.

---

## Revisit

- **Turn the shadow pipeline back on.** `renderer.shadowMap.enabled = true` is commented; every shadow GUI control sits unused. Flip it and observe the shadow camera, the helper, and `shadowMap.type`.
- **The next lesson loads "a lot of textures."** The README says so — a `TextureLoader` + `LoadingManager` are already instantiated and a `public/textures` folder (bricks, grass, planks, roof) ships with the repo, but meshes use plain colors. Recycling is the intended bridge to the next lesson.
- **Re-derive the `createWallBoxGeometry` merge** without peeking — remember rotate + move + `mergeGeometries`.
- **Experiment: `scene.background` vs. both-set-the-same.** Toggle `renderer.setClearColor(...)` back on with the same value as `scene.background` and see nothing break — the "right answer" in the README question is verifiable by experiment.
- **Re-render the clear-color tradeoff.** Try fog color = grass vs. fog color = background on the fly and watch the edge; the `.png` wash is the whole premise of the lesson.

---

## Outdated

**approach is valid ★** — but notably, **this project already runs on WebGPU** (`three/webgpu` + `WebGPURenderer`), the modern renderer that's progressively replacing WebGL. Fog itself is a WebGPU-era feature; on WebGL it still exists as `FogNative`. So there's *nothing to page forward* — you are already on the current WebGPU path. `scene.background`, `Color`, `Fog` — all current three r185 API. The decision to use `scene.background` over `renderer.setClearColor` is *forward-looking*, not legacy.

> 💡 More up to date alternative: switch purely to WebGPU's **Node/material** pipeline (`scene.fogNode`, `Nodes.FogNode`) — already-available in the same renderer and more flexible for shader-level fog tuning. Keep the classic `scene.fog` carpet behavior for simple scenes; the Node versions let you bind `nearColor`, `fogDensity`, and `useNoise` directly.

---

## Links & Resources

### Docs

- [Three.js — Fog](https://threejs.org/docs/pages/Fog.html) — the class used here: `color`, `near`, `far`, the WebGPU fog.   🤖 suggested
- [Three.js — Fog manual](https://threejs.org/manual/en/fog.html) — explains fog selection and per-material `fog` flag.   🤖 suggested
- [Three.js — Scene](https://threejs.org/docs/pages/Scene.html) — documents `scene.fog` and `scene.background`.   🤖 suggested
- [Three.js — WebGPURenderer](https://threejs.org/docs/#api/en/renderers/webgpu/WebGPURenderer)   🤖 suggested
- [Three.js — AmbientLight](https://threejs.org/docs/#api/en/lights/AmbientLight)   🤖 suggested
- [Three.js — DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight)   🤖 suggested
- [Three.js — PointLight](https://threejs.org/docs/#api/en/lights/PointLight)   🤖 suggested

### Examples

- [Three.js — webgpu_scene](https://threejs.org/examples/?q=webgpu#webgpu_scene) — official WebGPU scene, same renderer+`:fog` pattern available.   🤖 suggested

### Tools

- [Color & palette explorer](https://coolors.co) — eyeball background↔fog color agreements.   🤖 suggested

### Articles

- [Fog & atmosphere in three.js (manual)](https://threejs.org/manual/en/fog.html) — practical take on pairing fog with background.   🤖 suggested

### Videos

- [Three.js WebGPU migration talk](https://www.youtube.com/results?search_query=three.js+webgpu+fog) — search results for WebGPU fog/background practice.   🤖 suggested

### Courses & Talks

- [Three.js Journey](https://threejs-journey.com) — the course this series follows; WebGPU + fog chapter mirrors this.   🤖 suggested

### Repos

- [Three.js source](https://github.com/mrdoob/three.js) — `Fog`, `FogExp2`, `Scene.fog`, WebGPURenderer all live here.   🤖 suggested

### Other

- [atmospheric haze rendering (Wikipedia)](https://en.wikipedia.org/wiki/Aerial_perspective) — the physical principle fog approximates.   🤖 suggested