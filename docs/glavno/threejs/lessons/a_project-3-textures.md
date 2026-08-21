---
title: a project-3 - textures
topic: threejs
date: 2026-08-21
tags: [texture, material, RepeatWrapping, wrapS, wrapT, repeat, uv2, aoMap, channel, displacement]
difficulty: beginner
app_path: apps/a_project-3-textures
---

# a Project 3 — Textures, Displacement, and the uv2/AO-Channel Question

Project A continues. The scene (stylized house, 50 tombstones, fog, ambient + directional + point lighting) carries over from [[a_project-2-fog]]. Part three's whole job is **texturing**: every surface of the house is now dressed in loaded PBR-style maps — base color, ambient occlusion, height/displacement, normal, roughness, and (for the door and roof) opacity/metalness.

The heart of the lesson, per the README, is a tangle of genuine questions worth answering precisely:

1. **The `aoMap` / `uv2` / `channel` question** — does ambient occlusion need a second UV channel on WebGPU? The old `setAttribute('uv2', ...)` approach is outdated; what replaced it, and why did the code see no visible AO change plus a console warning about `uv1`?
2. **`wrapS`/`wrapT` and `repeat`** — what do the wrap modes do, why is `repeat.set(8, 1)` needed on the roof, and does it fix the `displacementScale`/`displacementBias` problem the brick wall had?

---

## Concept

### 1. What "a texture" actually is, and the map-category split

A texture is just an **image uploaded to the GPU** with extra sample settings (wrapping, filtering, repeat, color space). In three.js you load one with `TextureLoader`, and the same image × material slot can mean very different things. The material reads the texture's **channels** for a specific job:

- **`map` (base color / albedo)** — the color you see.
- **`normalMap`** — perturbs per-pixel surface direction so lighting reacts to small bumps without changing geometry.
- **`roughnessMap`** — `roughness` sampled per-pixel (1 = rough/diffuse, 0 = sharp/specular).
- **`metalnessMap`** — where the surface behaves like metal.
- **`aoMap`** — a baked *precomputed* global-illumination darkening, painted into corners/crevices by the texture author.
- **`displacementMap`** / `heightMap` — actually **moves vertices** along their normals (a *geometry*-level effect, unlike the others).
- **`alphaMap`** / **`opacityMap`** — per-pixel transparency.

This is the **PBR map stack**: five or six grayscale + one color image, all sampled at the same UVs, each driving one shading term. The project's folders (`bricks`, `grass`, `planks`, `roof`, `wooden_door`, `leaves`) each ship exactly that family of maps under `_basecolor`, `_normal`, `_roughness`, `_height`, `_metalness`, `_ambientOcclusion`, `_opacity`.

### 2. `colorSpace` — only color-bearing maps are `SRGBColorSpace`

```ts
albedoDoorTexture.colorSpace = THREE.SRGBColorSpace;
```

Only the **base-color/albedo** texture gets `SRGBColorSpace`. The data maps (normal, roughness, ao, height, metalness) stay at the default linear color space (`NoColorSpace`). Reason: base color is a *display* value meant to be gamma-decoded/encoded, while normal/roughness/ao are **data** used numerically in shading math — converting them like a color would corrupt the math.

This directly answers the README's "do we set color space only for the albedo texture?" — **yes.** Only color maps. Only `map` gets `SRGBColorSpace`.

### 3. `wrapS` / `wrapT` — how the texture behaves beyond its `[0, 1]` UV range

`wrapS` and `wrapT` control what happens when a UV coordinate is outside the `0…1` range, in the **S** (horizontal / U) and **T** (vertical / V) directions respectively.

```ts
albedoRoofTexture.wrapS = THREE.RepeatWrapping;
albedoRoofTexture.wrapT = THREE.RepeatWrapping;
```

- **`THREE.RepeatWrapping`** — tiles the texture: each extra `1.0` of UV repeats it.
- **`THREE.ClampToEdgeWrapping`** — the default; clamps UVs to the edge pixel, stretching the border (produces smearing/streaking).
- **`THREE.MirroredRepeatWrapping`** — tiles but mirrors each repeat (hides seam).

You need this whenever a surface's UVs span more than `0…1`, or you deliberately scale them to tile — **exactly the roof case**. A `CylinderGeometry` (and planes sized larger than one texture) can expose UVs past `1`. With the default clamp you'd get the border pixels stretched across the whole roof; with repeat you get a clean tiled shingle pattern.

> 💡 `repeat` and `wrap` are different things. `wrapS/T` = *behavior* outside `[0,1]`. `repeat` = *how many times* it tiles inside the surface. Setting `repeat.set(2,2)` without `RepeatWrapping` gets you 1 clear repeat + smearing, not 2 clean tiles. Set both.

### 4. `repeat` — how many copies fit on the geometry

```ts
albedoRoofTexture.repeat.set(8, 1); // 8 tiles horizontally, 1 vertically
```

`.repeat` is a `Vector2` that **scales the UVs before sampling**. `set(8, 1)` = the texture is written 8 times around the cylinder's circumference and once top-to-bottom. Every map that shares the geometry's UVs should get the **same** repeat (which is why the code applies it to all five roof maps, not just the albedo).

For grass the code does `repeat.set(10, 10)` on a 20×20 floor plane → 10×10 small grass tiles. Same idea as the roof but across the floor.

### 5. Displacement map — the one that moves vertices

```ts
displacementMap: heightRoofTexture,
displacementScale: 0.34,
// displacementBias: -0.01,
```

Unlike every other map (which only affect pixel shading), `displacementMap` **offsets the actual vertex positions** along their normals using the height image. Two consequences:

1. It needs **geometry subdivisions** to have anything to displace. That's why the floor uses `PlaneGeometry(20, 20, 64, 64)`, the door `PlaneGeometry(..., 100, 100)`, and the merged walls create planes with `128` segments. Fewer segments → blocky displacement; the plane must be segmented first.
2. `displacementScale` (how strong) and `displacementBias` (a constant subtract/shift) tune it. A **negative bias** retracts everything slightly.

### 6. The `aoMap` / `uv2` / `channel` question — the real answer

This is the README's central question, so let's give it a precise answer.

**Ambient occlusion in three.js has always required a second UV channel** — historically the `uv2` geometry attribute — because the AO map is intentionally *not* aligned to the base color UVs (the AO texture author bakes it in the same unwrap, so it usually *is* aligned, but the engine supports separate UVs for flexibility). The **old** approach (WebGL era):

```ts
doorGeometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(doorGeometry.attributes.uv.array, 2),
);
```

**This is outdated**, and the README's instinct to drop it is correct. On **WebGPU** (`three/webgpu`, the `WebGPURenderer` this project uses), attribute channels are **index-based** and start at `1`: the first UV set is `uv1` (not `uv2`). So the modern replacement is to give the material its AO channel:

```ts
if (doorMaterial.aoMap) {
  doorMaterial.aoMap.channel = 1; // sample uv1 (the 2nd UV set)
}
```

**But here's the catch**, and it explains exactly what the user saw. Setting `channel = 1` only *selects* the second UV set — it does **not create it**. The door's `PlaneGeometry` ships with only **one** UV set (`uv` = the first one). Pointing the AO map at `uv1` with no `uv1` attribute present is what produced the console warning:

```
THREE.AttributeNode: Vertex attribute "uv1" not found on geometry.
```

And because there's no data at `uv1`, **AO contributes nothing** — hence "I didn't see any changes at all" even when cranking `displacementScale`.

So the truthful sequence:

- **If you want AO to read a *dedicated* second UV set** → you still must create that attribute on the geometry (on WebGPU, name it `uv1`, not `uv2`), *then* `aoMap.channel = 1`.
- **If your AO map shares the same unwrap as the base color** (the common case with these downloaded packs — and they do) → you don't need a second channel at all. Leave `aoMap.channel = 0` (default, reads the first UV set) and the AO samples the existing `uv`. **This is what the code now effectively does** (the `if` is commented out), and it is correct for this project.

Your options for *actually* seeing AO on the door, in order of preference:

1. Leave it at the default channel (`0`) since the maps share UVs — simplest, no new geometry attribute needed.
2. Create a real `uv1` attribute (copied from `uv`) and set `channel = 1`, only if you want the flexibility of a separate unwrap later.

The lesson: **AO on WebGPU uses the same `channel` mechanism as every indexed UV channel, and a `channel` value only selects an attribute you still have to supply.** The `uv2`-name approach was the WebGL-era convention; WebGPU renumbers to `uv1`.

### 7. `normalScale` — the knob the code left on the table

```ts
// doorMaterial.normalScale.set(0.9, 0.9);
```

`normalScale` is a `Vector2` that scales how strongly the normal map perturbs lighting, with `x` and `y` potentially different along the two tangent axes. Default is `(1, 1)`. Values below 1 flatten the effect; above 1 exaggerate it. Setting `xy < 1` is a common cheap way to tame an over-strong normal map. It's commented out here because the door's normals read fine — but it's the documented knob to reach for when a normal map looks too dramatic. (An asymmetric `set(a, b)` is useful for anisotropic-looking surfaces, less common.)

### 8. `transparent` + `alphaMap` for the door

```ts
transparent: true,
alphaMap: alphaDoorTexture,
```

A `transparent` material must be set for `alphaMap` to have any effect — otherwise the alpha channel is ignored. This one bit matters: you can wire `alphaMap` all you like but see nothing until `transparent: true`.

### 9. Merged wall geometry with `computeTangents`

The four walls come from `geo-util.ts`'s `createWallBoxGeometry`, which builds a front/back/left/right `PlaneGeometry`, transforms each into place, then `mergeGeometries(geometries, true)` into a single `BufferGeometry` (one draw call). The `// EXPLAIN: this function` comment points here — read it as:

- `PlaneGeometry` already ships **normals, UVs, and tangents** — so nothing needs recomputing after the merge *except* the effect normal mapping relies on.
- **`merged.computeTangents()`** is called explicitly because **normal maps need tangents** (the TBN basis), and after manually merging geometries three.js won't auto-derive them.
- `useGroups=true` keeps each wall as a separate material group — handy if you later want different UV tiling per wall. The project passes one material to all walls (the whole merged mesh gets one `MeshStandardMaterial`), but the groups are preserved for the future anyway.

### 10. We will deal with shadows in next lesson

`renderer.shadowMap.enabled`, `renderer.shadowMap.type`, per-light `castShadow`, per-mesh `castShadow`/`receiveShadow` are all wired (and fully exposable in the GUI). The shadow-mapping algorithm choices are `PCFShadowMap` (default here), `PCFSoftShadowMap`, `VSMShadowMap` — see [[13.0_shadows-intro]] for the deeper treatment. One GUI note: `shadow.radius` (blur) **doesn't work with `PCFSoftShadowMap`**, only with the plain `PCFShadowMap` used here.

---

## Code

in repo - `apps/a_project-3-textures`

```ts
import * as THREE from 'three/webgpu';

const textureLoader = new THREE.TextureLoader();

// 1. Load the map family
const albedoDoor = textureLoader.load('/textures/wooden_door/Door_Wood_001_basecolor.jpg');
const aoDoor = textureLoader.load('/textures/wooden_door/Door_Wood_001_ambientOcclusion.jpg');
const heightDoor = textureLoader.load('/textures/wooden_door/Door_Wood_001_height.png');
const normalDoor = textureLoader.load('/textures/wooden_door/Door_Wood_001_normal.jpg');
const roughDoor = textureLoader.load('/textures/wooden_door/Door_Wood_001_roughness.jpg');

// 2. Color space — ONLY the albedo gets color treatment
albedoDoor.colorSpace = THREE.SRGBColorSpace;

// 3. A surface with UVs > 1 tiles cleanly only with RepeatWrapping + repeat
albedoDoor.wrapS = THREE.RepeatWrapping;
albedoDoor.wrapT = THREE.RepeatWrapping;
albedoDoor.repeat.set(1, 1);

// 4. Build a segmented geometry so displacement has vertices to move
const geo = new THREE.PlaneGeometry(2.2, 2.2, 100, 100);

// 5. Stack the maps on one MeshStandardMaterial
const mat = new THREE.MeshStandardMaterial({
  map: albedoDoor,
  aoMap: aoDoor,        // reads uv (channel 0) -> no uv1 attribute needed
  displacementMap: heightDoor,
  displacementScale: 0.1,
  normalMap: normalDoor,
  roughnessMap: roughDoor,
  transparent: true,
  alphaMap: textureLoader.load('/textures/wooden_door/Door_Wood_001_opacity.jpg'),
});

const mesh = new THREE.Mesh(geo, mat);
```

> 💡 Modern WebGPU rule of thumb for AO: maps that share the base-color unwrap use `channel = 0` (just assign `aoMap`). Only create a `uv1` attribute + `aoMap.channel = 1` when AO genuinely needs a separate unwrap.

---

## Gotchas

- **AO on WebGPU looks like it "does nothing" when you point it at a missing channel.** Assigning `aoMap` and setting `.channel = 1` on a geometry that has no `uv1` (or `uv2`) attribute yields nothing (plus the `Vertex attribute "uv1" not found` warning). If your AO shares the albedo UVs, leave the default channel. If you want a dedicated channel, you must create the `uv1` buffer yourself.
- **The old `setAttribute('uv2', ...)` is WebGL-era.** On WebGPU the second UV channel is `uv1`. Copy two-line snippets from older tutorials without checking and you'll hit the `uv1 not found` warning.
- **`transparent: true` is required for `alphaMap`.** Wire the opacity map all you like, but without `transparent` the alpha channel is ignored and the door renders fully opaque.
- **`colorSpace = SRGBColorSpace` belongs on the albedo only.** Set it on a normal/roughness/ao/height map and you corrupt the shading math — those are data, not color.
- **`wrap` doesn't imply `repeat` and vice-versa.** `RepeatWrapping` governs behavior outside `[0,1]`; `repeat` sets the tile count. Set both, and on **every** map in the stack, not just the albedo — otherwise one map tiles while another clamps/smears, and the material looks internally inconsistent.
- **Displacement on a box/merged-surface architecture pulls corners apart.** Because each vertex moves along *its own* normal, adjacent faces at a corner move in opposite directions and reveal a gap — you can see through the house. This is the brick-wall problem. Mitigations that actually work: small `displacementScale`, a small negative `displacementBias` to retract the whole surface, and/or moving the door a hair inward to hide the pull (the project's `doorMesh.position.z = wallDepth / 2` comment does exactly this).
- **`displacementMap` needs geometry segments.** A low-segment plane won't show displacement meaningfully. Add subdivisions to the geometry, not just the material.
- **`computeTangents()` is required after merging geometry when normal maps are on.** `mergeGeometries` won't keep tangents correct; without it, normal-mapped merged meshes light wrongly. PlaneGeometry provides the rest (normals, UVs, tangents) built-in.
- **`shadow.radius` is ignored by `PCFSoftShadowMap`.** If you tweak blur and see no change, you're on the soft algorithm. It works on plain `PCFShadowMap`.
- **`wrap` on a cylinder.** The roof's `CylinderGeometry` can have side UVs exceeding `[0,1]`; you want `RepeatWrapping`, not the default clamp that would smear the border shingle across the whole cone. That's why the code sets wrap + `repeat.set(8,1)` on every roof map.

---

## Revisit

- **`aoMap.channel` + `uv1` on WebGPU.** This is the README's open question and worth closing properly. Experiment: (a) leave `channel` at the default on the door and verify AO shows up (it should — the maps share an unwrap); (b) create a real `uv1` attribute and set `channel = 1` to compare. Confirm which route actually darkens the door's corners. Also re-visit *why* the old tutorials reach for a second UV set — for baked AO it's usually just convention; a separate unwrap only matters when AO comes from a different projection.
- **`wrapS`/`wrapT` + `repeat` does not fix displacement artifacts.** The README hoped tiling the roof map might solve the displacement seam/gap problem. It won't: displacement is a *geometry*-vertex effect driven by the height image and `displacementScale`/`displacementBias`, independent of how the color texture tiles. The fix is geometry resolution + small scale + negative bias, not wrapping.
- **The `uv2`-name question is a "should I update this?" moment** — if you ever see `uv2` in an older tutorial while running WebGPU, translate it to `uv1`. Worth internalizing once.
- **`normalScale` never used.** `doorMaterial.normalScale.set(0.9, 0.9)` is commented out — try it and feel how shrinking the normal effect softens the door's grain. Good tactile way to learn the knob.
- **Recheck the earlier project.** [[a_project-2-fog]] carried over the scene; this part wraps every surface in a full PBR map set. Could revisit the un-textured pieces (tombstones use a flat color `MeshStandardMaterial`) and imagine what maps would suit them.

---

## Outdated

The **core rendering path here is already modern**: the project runs on **three's WebGPU renderer** (`three/webgpu` + `WebGPURenderer`), not WebGL. **That's a 👍 and worth foregrounding — this is the WebGPU-native approach, not a legacy-bound one.**

The one genuinely **outdated pattern** floating in the README is the old AO second-UV setup:

```ts
doorGeometry.setAttribute('uv2', new THREE.Float32BufferAttribute(...)); // WebGL-era
```

On WebGPU this naming is obsolete (the second UV channel is `uv1`, addressed via `aoMap.channel`), and for maps that share the albedo unwrap you don't need a second channel at all. The code already moved away from it, correctly.

> 💡 More up to date alternative: use WebGPU-era three.js docs (r152+) where UV channels are index-based (`uv1`) and maps are selected via material `.channel` — https://threejs.org/docs/index.html#manual/en/introduction/Installation — the base-three WebGPU examples use this naming. *(same approach, modern channel conventions)*

---

## Links & Resources

### Docs
- [Three.js Textures / LoadingManager](https://threejs.org/docs/#api/en/loaders/LoadingManager) — progress/error tracking while textures load 🤖 suggested
- [THREE.MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) — the full map/property list used here 🤖 suggested
- [THREE.Texture (wrapS/wrapT/repeat/colorSpace)](https://threejs.org/docs/#api/en/textures/Texture) — the sampling settings explained in this lesson 🤖 suggested

### Examples
- [Three.js Manual — Textures](https://threejs.org/manual/#en/textures) — the canonical walkthrough of maps/wrapping/filtering 🤖 suggested
- [Three.js manual — Materials](https://threejs.org/manual/#en/materials) — how the map stack combines onto a material 🤖 suggested

### Tools
- [three.js editor](https://threejs.org/editor/) — inspect textures/materials interactively 🤖 suggested

### Articles
- [Learn OpenGL — Textures](https://learnopengl.com/Getting-started/Textures) — the theory behind UVs, wrap modes, filtering 🤖 suggested

### Videos
- [Three.js Journey — Textures](https://threejs-journey.com) — where this lesson's PBR map stack and displacement idea come from 🤖 suggested

### Courses & Talks
- [Three.js Journey](https://threejs-journey.com) — course that structures these beginner lessons 🤖 suggested

### Repos
- [three.js on GitHub](https://github.com/mrdoob/three.js) — source and examples, the WebGPU additions live here 🤖 suggested

### Other
- [Ambient occlusion (Wikipedia)](https://en.wikipedia.org/wiki/Ambient_occlusion) — the rendering concept the baked AO map approximates 🤖 suggested
- Poly Haven — source of these stylized texture packs (`.content`, cc0) 🤖 suggested