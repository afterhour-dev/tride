---
title: a project-4 - shadows
topic: threejs
date: 2026-08-21
tags: [helpers, lighting, drop-shadow, sinus, cosinus, castShadow, receiveShadow, shadowMap, amplitude, frequency]
difficulty: beginner
app_path: apps/a_project-4-shadows
---

# a Project 4 — Shadows Everywhere: castShadow/receiveShadow, Tuned Shadow Cameras, and Lights That Fly on sin/cos

Project A continues. The stylized-house scene (floor, merged brick walls, roof, door, bushes, 50 tombstones, fog, ambient + directional + point lighting) carries over from [[a_project-3-textures]]. Part four's job: **make shadows actually good**. Shadows are enabled  with `renderer.shadowMap.enabled = true` ; and *engineered* — the shadow map algorithm is upgraded to `PCFSoftShadowMap`, the directional "moon" light's shadow camera is tuned box-by-box via its `CameraHelper` in the GUI, all five point lights get their own shadow settings, only a few meshes cast shadows (the rest receive), and four new colored point lights orbit the house on sin/cos curves with deliberately different frequencies and amplitudes.

The heart of the lesson, per the README, is a set of decisions worth understanding precisely:

1. **Which meshes cast vs. receive** — walls and bushes and tombstones cast; floor and tombstones receive; roof and planks do neither. Why spare the roof? Because a multi-mesh house casts weird overlapping shadows — a single merged mesh (e.g. from Blender) would shadow cleanly.
2. **Tuning a directional light's shadow camera** — `mapSize`, `near/far`, `top/right/bottom/left`, and the `CameraHelper` + `updateProjectionMatrix()` dance that makes it possible to eyeball a light that covers the whole scene.
3. **The sin/cos light animation** — frequency (multiplies the *angle*) vs. amplitude (multiplies the *result*), and how flipping sin/cos or negating the angle changes direction.

---

## Concept

### 1. The three switches that must all be on

Three independent flags cooperate to produce a shadow:

1. `renderer.shadowMap.enabled = true` — the renderer works with shadow maps at all.
2. `light.castShadow = true` — *this* light renders a shadow map (every light that can, except `AmbientLight`).
3. `mesh.castShadow` / `mesh.receiveShadow` — per-object participation.

```ts
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
```

There is no global "make everything shadow" knob — you must visit each light and each object. That is exactly why the `// EXPLAIN:` comment stresses "don't forget to go to each light… and don't forget to set castShadow on all appropriate objects and receiveShadow on all appropriate objects."

### 2. `castShadow` vs `receiveShadow` — and why the roof opts out

- **`castShadow = true`** on a mesh — its silhouette is baked into the light's shadow map; it *throws* shadows onto everything behind it.
- **`receiveShadow = true`** on a mesh — it reads the shadow map; shadows *fall* onto it.

The scene's assignment:

| Mesh | cast | receive | Why |
|---|---|---|---|
| floor | — | ✅ | a floor has nothing to cast; it should *show* the shadows of everything above it 🎯 |
| walls (merged box) | ✅ | — | the house body throws the big drop shadow |
| bushes (×4) | ✅ | — | small, sharp objects — nice silhouettes |
| tombstones (×50) | ✅ | ✅ | read this carefully: each tombstone is an isolated object, so it both throws onto the floor **and** receives from neighbors |
| roof, planks, door | — | — | deliberately both off (see below) |

**Why no shadows on the roof?** The house is a *bunch of meshes* — walls, roof, planks, door, bushes. If every piece cast shadows, adjacent pieces would shadow each other in ugly, z-fighting, overlapping ways (the roof rim shadowing the walls, the walls shadowing the door…). The README's point: *in a well-thought-out example the house would be one mesh* — e.g. built in Blender and imported — and then casting shadows everywhere would make sense. For a hand-assembled primitives house, casting from walls + bushes + tombstones is more than enough. 👈 This is the key architectural lesson of the project.

**Why do tombstones receive too?** The README notes it "would look nicer" — a single flat receive-shadow floor makes distant tombstones look pasted on; letting them darken each other grounds them in the scene.

### 3. Directional light (moon light) — intensity and shadow box

The moon light lives at `(4, 5, -2)`, casts shadows, and had its intensity raised to `1.424` **after** GUI tweaking (see the commented-out trail: `1.5 * Math.PI` → `0.9 * Math.PI` → `0.02 * Math.PI` → final `1.424`). Note the mix: some intensities are in physical units (`* Math.PI`), the final one is a plain number — both are legal, it's just inconsistent.

The shadow box is a second **orthographic camera** attached to the light. You size it to exactly cover the scene — bigger wastes shadow-map resolution, smaller clips shadows at the edge:

```ts
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.top = 7.941;
directionalLight.shadow.camera.right = 8.732;
directionalLight.shadow.camera.bottom = -7.512;
directionalLight.shadow.camera.left = -7.069;
```

The asymmetrical `top/right/bottom/left` values are exactly what tuning with the helper produced — the light is positioned off-center at `(4, 5, -2)`, so the box that covers "the whole scene as seen from the moon" is lopsided.

**The eyeballing recipe** (this is the workflow the project used, and it's reusable):

1. Check `renderer.shadowMap.enabled === true` — **the helper will not work without it** (the GUI even warns this).
2. Add `new THREE.CameraHelper(directionalLight.shadow.camera)` to the scene, toggle it visible.
3. Drag `top/right/bottom/left`, `near/far` in the GUI.
4. **After changing any camera value, call `directionalLight.shadow.camera.updateProjectionMatrix()`** — otherwise the frustum the helper (and the shadow render) sees stays stale. The GUI's `onChange` callbacks do exactly this, plus `directionalLightShadowCameraHelper.update()`.
5. Keep `mapSize.width` and `mapSize.height` **the same** (the GUI's divider comment insists on this 👇) — non-square maps are supported but rarely what you want.

`shadow.radius` (blur) and `shadow.bias` are exposed in the GUI too; the defaults (`bias = 0.0002`-ish) were left alone.

### 4. Point lights — shadow setup without helpers

The door-point-light and the four energy lights each get shadow settings *by hand*, no helper:

```ts
doorPointLight.castShadow = true;
doorPointLight.shadow.mapSize.width = 256;
doorPointLight.shadow.mapSize.height = 256;
doorPointLight.shadow.camera.far = 7;
```

A point light's shadow camera is a **cube of six cameras** (omnidirectional), so there's no box to draw — tuning is just `mapSize` + `far`. The README's honest note: *we did it without helpers; in a real-world project we would provide helpers.* The `far = 7` matches the light's responsibility radius (`distance = 8` on the door light).

All five shadowing point lights use **256×256 maps** — 256 is a cheap, soft-looking default; the directional light also uses 256. Six castShadow lights × 256² = six extra render passes — still fine on modern GPUs, but it adds up; this is the same cost-consciousness as [[13.1_shadow-map-optimization-part-one]].

### 5. `PCFSoftShadowMap` — the algorithm choice

```ts
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.shadowMap.type = THREE.PCFShadowMap;
```

The GUI exposes all four options live (`BasicShadowMap`, `PCFShadowMap`, `PCFSoftShadowMap`, `VSMShadowMap`) so you can A/B them in one click. The project settles on **PCFSoft** — shinier, softer edges than plain PCF. **One consequence immediately surfaces in the GUI:** `shadow.radius` (blur) *doesn't work with `PCFSoftShadowMap`* — the blur radius only applies to plain `PCFShadowMap`. The GUI even labels that fact. So you can drag `radius` forever and see nothing on this project. See [[13.0_shadows-intro]] for what the algorithms are actually doing.

### 6. The four energy lights — controlled randomness via sin/cos

Four point lights orbit the house. The code comments do the heavy lifting here, and they spell out the exact mental model:

**Frequency vs amplitude** (the cements-in-your-head line):

- The thing you multiply the **angle** by is the **frequency**. `angle = elapsedTime * 0.5` → each unit of time moves the angle half as fast → slower animation. Multiply by `3` → three times faster.
- The thing you multiply the **result of sin/cos** by is the **amplitude**. `sin/cos` only ever produce `[-1, 1]`; anything above `1` scales the orbit's radius up.

So `x = Math.cos(elapsedTime * 0.5) * 4` is frequency `0.5`, amplitude `4`.

**The four flavors** (each demonstrates one trick):

1. **energy1** — classic circle with a squashed radius: `cos * 4`, `sin * 6` (x and z amplitudes differ → ellipse, not a perfect circle, on purpose). Y bobs on `sin(elapsedTime * 3)` — bouncing up/down across the ground, "frequent up and down."
2. **energy2** — **counter-clockwise movement by swapping sin/cos**: `x = sin, z = cos` (the default `x = cos, z = sin` goes clockwise in three.js's coordinate system; swapping reverses direction). Same amplitude both axes → perfect circle. Y = `sin(t*2.5) + sin(t*4)` — **sum of two sines with different frequencies**: the comment calls out why two different frequency multipliers make a richer, "even✱ frequencies" wobble than one. *(✱ the comment means "equal" — the point is: don't use matching multipliers, or the two sines lock into one boring shape.)*
3. **energy3** — **negative angle**: `angle3 = -elapsedTime * 0.14` also reverses direction, no sin/cos swap needed. Then the Lissajous move: `x = cos(angle)*3 + sin(angle*0.32)*7`, same in z with `*0.5` — two different frequencies summed per axis → a figure-8-ish wobble instead of a circle. The README asks you to figure out the shape: uneven frequencies on x and z is exactly how Lissajous curves arise.
4. **energy4** — **amplitude that itself moves**: `x = cos(angle) * (7 + sin(t*0.32))` — the radius oscillates between ~6 and ~8 while orbiting, so the circle itself breathes/pulses. Plus the same double-sine y-bob.

The takeaway spiral (from the comments, worth internalizing): *the multiplier on the angle is frequency, the multiplier on the result is amplitude, negative angles or swapped sin/cos flip direction, and summing a second sine adds a second frequency* — that's a full toolkit for animating anything along a path without a fixed keyframe.

### 7. Helpers — what each one is for

- **`DirectionalLightHelper`** — a small plane showing where the light sits + a line showing its direction. Toggle in GUI ("visualize directional light").
- **`ArrowHelper`** — a one-frame direction arrow. **Gotcha:** its direction is computed **once at creation and never updated** — move the light and the arrow stays. (GUI label says exactly this; for a dynamic arrow you'd recreate/update it each frame.)
- **`CameraHelper(directionalLight.shadow.camera)`** — draws the shadow-camera frustum. *Requires `renderer.shadowMap.enabled === true`.* The workhorse for the shadow-box tuning above.
- **`AxesHelper(5)`** — red/green/blue x/y/z, toggle "show axes".

---

## Code

in repo - `apps/a_project-4-shadows`

```ts
import * as THREE from 'three/webgpu';

// 1. Enable + choose algorithm — global switches
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 2. Objects: decide who casts, who receives
floorMesh.receiveShadow = true;   // floor shows shadows, casts none
wallsMesh.castShadow = true;      // house body throws the drop shadow
bushOneMesh.castShadow = true;
tomb.castShadow = true;           // tombstones: both sides of the coin
tomb.receiveShadow = true;
// roof, planks, door: deliberately neither

// 3. Directional light: castShadow + a tuned shadow camera box
const directionalLight = new THREE.DirectionalLight('#987dd6', 1.424);
directionalLight.position.set(4, 5, -2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(256, 256);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.top = 7.941;
directionalLight.shadow.camera.right = 8.732;
directionalLight.shadow.camera.bottom = -7.512;
directionalLight.shadow.camera.left = -7.069;

// eyeball the box: helper, then updateProjectionMatrix() after every change
const shadowCamHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
shadowCamHelper.update();

// 4. Point lights: castShadow + just mapSize and far (cube shadow camera)
const energy1 = new THREE.PointLight('#8c499a', 4 * Math.PI, 3);
energy1.castShadow = true;
energy1.shadow.mapSize.set(256, 256);
energy1.shadow.camera.far = 7;

// 5. Animation: frequency multiplies the angle, amplitude multiplies sin/cos
const timer = new THREE.Timer();

function tick(timestamp: number) {
  timer.update(timestamp);
  const t = timer.getElapsed();

  // frequency 0.5 (slow), amplitudes 4 and 6 — an ellipse
  energy1.position.x = Math.cos(t * 0.5) * 4;
  energy1.position.z = Math.sin(t * 0.5) * 6;
  energy1.position.y = Math.sin(t * 3);          // bobbing up and down

  // counter-clockwise: swap sin and cos; perfect circle
  energy2.position.x = Math.sin(t * 0.34) * 5;
  energy2.position.z = Math.cos(t * 0.34) * 5;
  energy2.position.y = Math.sin(t * 2.5) + Math.sin(t * 4); // two frequencies

  renderer.render(scene, camera);
}
```

---

## Gotchas

- **All three switches, or none.** `renderer.shadowMap.enabled`, `light.castShadow`, and `mesh.castShadow`/`receiveShadow` are independent. Shadows silently stay off if you forget any plane of the stack. (The `// EXPLAIN:` lists exactly what to forget.)
- **A multi-mesh house self-casts ugly shadows.** Walls + roof + planks + door shadowing each other overlaps and z-fights. The project's fix is *fewer casters*, not more. One merged mesh (a Blender import) would shadow cleanly — see `geo-util.ts`'s `mergeGeometries(..., true)` which is the first step in that direction (though it's still used for the walls here).
- **`CameraHelper` needs `renderer.shadowMap.enabled === true`** — the GUI warns it, and it's a classic silent-failure: helper seems "dead" when it's actually just gated on the shadow map being on.
- **`shadow.radius` (blur) is a no-op on `PCFSoftShadowMap`.** Drag it all you want — only plain `PCFShadowMap` honors the blur radius. You must change `renderer.shadowMap.type` to see radius do anything.
- **Change a shadow camera value → `updateProjectionMatrix()`.** Without it the frustum and helper show stale values. The GUI's `onChange` handlers on every camera axis exist precisely because this *will* confuse you.
- **Keep `mapSize.width === mapSize.height`** unless you specifically want a non-square map (the GUI's divider comment).
- **`ArrowHelper` direction is frozen at creation.** Move the directional light afterward and the arrow keeps pointing the old way. Recreate or manually update each frame for a live direction indicator.
- **Amplitude ≠ frequency.** Multiplying the *angle* changes speed (frequency); multiplying the *result* changes size (amplitude). Mixing them up is the classic sin/cos animation bug — the code comments hammer this.
- **Default sin/cos direction is clockwise** in three.js terrain. To reverse: swap `sin`/`cos` between x and z, *or* negate the angle (`-elapsedTime * 0.14`). Both are shown in the project.
- **Only the albedo-related *color* map gets `colorSpace = SRGBColorSpace`** — carried over from [[a_project-3-textures]]; data maps (normal/roughness/ao/height) stay linear.
- **Intensity units are mixed here on purpose/inconsistently:** some lights use physical `* Math.PI` values, the tuned moon light uses a raw `1.424`. Both render fine; just be aware when reading the code.

---

## Revisit

- **The merged-mesh house.** The README's real wish: build the house in Blender, import one mesh, and enable casting on everything. Try `mergeGeometries` on *all* house parts (walls + roof + planks + door) — do you still want them as casters? How does `receiveShadow` on a merged single mesh behave?
- **Point-light shadow helpers.** The project set point-light shadows with no helper, and the README says a real project would include them. Investigate what a `PointLightHelper` + `CameraHelper` shows for an omnidirectional cube frustum — and whether 6×256² is what it really costs (see [[13.4_shadow-point-light]]).
- **The Lissajous shapes.** energy3 (`x = cos(ω₁)·3 + sin(0.32ω₁)·7`, etc.) and energy4 (amplitude `7 + sin(t·0.32)`) trace curves the README itself wants explained. Trail them: log the positions, or drop a small `THREE.Points` trail, and identify the curve families (Lissajous, epicycloid-ish, breathing orbit).
- **Even vs. mismatched frequencies.** energy2's y uses `sin(t*2.5) + sin(t*4)`; the comment says mixing *different* frequency multipliers is the point. Try making them equal (`2.5`+`2.5`) and watch the shape collapse — it's the fastest way to *feel* what a summed frequency does.
- **`shadow.bias` / `shadow.normalBias`** — the defaults were kept. The shadow acne/peter-panning tradeoff from [[13.2_shadow-map-optimization-part-two]]: push `bias` in the GUI and watch the "spider legs" appear/disappear.
- **256² everywhere.** The whole scene shadows at 256. Bump a light to 1024 and compare edge softness vs. the four-animated-lights cost.
- **Carried-over scene debt:** the lighting tweak values (`1.424`, the lopsided camera box) were found "by feel" in the GUI — they are magic numbers in code. A `// REVISIT:` on documenting *why* those exact values, or moving them to a config object, would help.

---

## Outdated

The **core approach is fully modern**: the project runs on three.js's **WebGPU renderer** (`three/webgpu` + `WebGPURenderer`), not WebGL. **That's the current, native path — 👍 not legacy.** Shadow-mapping via `castShadow`/`receiveShadow`/`shadowMap.type` with `PCFSoftShadowMap` is still the standard approach in r185, and the light-intensity `* Math.PI` physical units are the current convention.

> 💡 One forward-looking note: WebGPU's shadow pipeline increasingly favors **VSMShadowMap** (variance shadow maps) — the GUI already exposes it — and three.js WebGPU offers post-processing/soft-shadow options (`three/addons/postprocessing/`). If you want blurrier "realistic" shadows, both are where to look next. 🤖 suggested

The only strict *outdated* fragment is inherited, not introduced here: the `uv2`/`uv1` AO-channel naming from [[a_project-3-textures]] — already handled correctly, commented out. This lesson adds no new obsolete patterns.

---

## Links & Resources

### Docs
- [THREE.DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight) — `castShadow`, shadow camera props 🤖 suggested
- [THREE.PointLight](https://threejs.org/docs/#api/en/lights/PointLight) — omnidirectional shadow cube, `far`/`distance` 🤖 suggested
- [THREE.LightShadow](https://threejs.org/docs/#api/en/lights/Shadow) — `mapSize`, `camera`, `radius`, `bias` on any shadowing light 🤖 suggested
- [THREE.CameraHelper](https://threejs.org/docs/#api/en/helpers/CameraHelper) — the shadow-box eyeballing tool 🤖 suggested

### Examples
- [Three.js WebGPU examples](https://threejs.org/examples/#webgpu_shadows) — shadow demos on the WebGPU path 🤖 suggested
- [Three.js Manual — Shadows](https://threejs.org/manual/#en/shadows) — the canonical walkthrough of how shadow maps work and are tuned 🤖 suggested

### Tools
- [three.js editor](https://threejs.org/editor/) — place lights, inspect shadows interactively 🤖 suggested

### Articles
- [The Book of Shaders — sin/cos](https://thebookofshaders.com/05/) — frequency/amplitude as shader-time animation, same mental model 🤖 suggested
- [Lissajous curves (Wikipedia)](https://en.wikipedia.org/wiki/Lissajous_curve) — the curve family energy3's movement traces 🤖 suggested

### Videos
- [Three.js Journey — Shadows](https://threejs-journey.com) — where this lesson's shadow-map workflow comes from 🤖 suggested

### Courses & Talks
- [Three.js Journey](https://threejs-journey.com) — course that structures these beginner lessons 🤖 suggested

### Repos
- [three.js on GitHub](https://github.com/mrdoob/three.js) — source and examples; WebGPU renderer lives here 🤖 suggested

### Other
- [Poly Haven texture packs](https://polyhaven.com) — source of the stylized CC0 texture sets used across Project A 🤖 suggested