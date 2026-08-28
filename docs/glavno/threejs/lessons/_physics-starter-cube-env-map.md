---
title: 16.0 physics-starter
topic: threejs
date: 2026-08-28
tags: [webgpu, material, CubeTextureLoader, envMap, envMapIntensity, background, environment]
difficulty: beginner
app_path: apps/16_0_physics_starter
---
# Abandonde because of old library
## Concept

This is the starter scene for the upcoming physics experiments. There is no physics code yet — the goal of this lesson's app is to build a clean, well-lit environment with **environment-map lighting** and **drop shadows**, plus a lil-gui panel to poke at every setting. The scene is minimal: a sphere above a floor plane, lit by an ambient light, a directional light, and an environment map.

### Environment maps (cube maps)

An *environment map* is a texture that surrounds the scene and represents everything that isn't explicitly modeled to be there — the sky, the walls, the studio lights. Three.js uses it for **Image-Based Lighting (IBL)** on PBR materials: instead of reflecting an actual surrounding geometry, the material reads light from this texture.

A cube map is special: instead of a single flat image, it is six images (faces: +x, -x, +y, -y, +z, -z) arranged as the inner faces of a cube. `CubeTextureLoader` loads exactly that:

```ts
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);
const envMap = await cubeTextureLoader
	.setPath('/textures/environmentMaps/studio/')
	.loadAsync(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
```

You can get cube faces from any **HDRI** (high dynamic range image) — for example from [Poly Haven](https://polyhaven.com/a/barnaslingan_01) — by converting it with a tool like [HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/). One HDRI produces all six faces, and the folder structure in `public/textures/environmentMaps/` keeps each environment separate.

### `scene.environment` vs `scene.background`

Two different scene properties, easily confused:

- **`scene.background`** — what is *drawn behind* the objects. It's a backdrop, it doesn't light anything.
- **`scene.environment`** — the environment map used for *lighting*. It is processed by PMREM and becomes the ambient reflections on every PBR material that doesn't have its own `envMap`. It is pure light — invisible by itself.

```ts
// this scene lights materials from the env map (IBL):
scene.environment = environmentMapTextureStudio;
// deliberately NOT setting scene.background — we don't want to see the map,
// only use its light. (It can be toggled on from the GUI.)
```

This is why the sphere looks "reactive" to the environment even though the only classic lights are ambient + directional.

### PMREM — prefiltered environment maps

An environment map is a texture of a distant scene, but a rough surface reflects it *blurred*, and PBR materials need the map at many pre-blurred levels. Computing that blur per-pixel, per-frame, per-roughness level would be expensive, so Three.js precomputes it once with a **PMREM** (`PMREMGenerator`): it renders the cube map into a special texture with progressively blurrier mip levels — a *prefiltered* radiance map. Reading the right mip level at render time gives you the blur that matches your material's roughness almost for free.

This pipeline is central to one bug you hit and one mystery you noticed — both are explained below.

### Why loading the textures synchronously (top-level `.load()`) crashed

The first version of the app loaded all four cube maps at the top of the module with `.load()`, assigned them to `scene.environment` / `material.envMap`, and crashed with:

```
THREE.TSL: TypeError: Cannot read properties of null (reading 'isRenderTargetTexture')
    at PMREMNode.setup(...)
```

Two things were wrong, both about *timing*:

1. **`CubeTextureLoader.load()` returns immediately.** The texture object exists, but the six PNG images still have to be fetched and decoded — that happens asynchronously, later. Using a cube map before its images exist means PMREMNode has nothing valid to work with.
2. **The WebGPU renderer wasn't ready yet.** `PMREMNode.setup()` runs inside shader compilation on the GPU. With `WebGPURenderer` that happens against the WebGPU device — but the device only exists *after* `await renderer.init()` resolves. Env-map work that triggers before that hits a null render target / context.

The fix in the app is the order of operations: everything moves inside `init()`, the renderer is awaited **first**, then each cube map is loaded with `await loadAsync(...)`. Afterwards the textures are fully decoded, the device is up, and PMREM can build its prefiltered maps safely:

```ts
const renderer = new THREE.WebGPURenderer({ canvas });
await renderer.init();                    // 1. GPU ready

const envMap = await cubeTextureLoader
	.setPath('/textures/environmentMaps/studio/')
	.loadAsync([...]);                    // 2. pixels ready
scene.environment = envMap;               // 3. safe to hand to PMREM
```

### Overriding the global environment map for one material

Normally every PBR material inherits `scene.environment`. You can break that inheritance for a single material by giving it **its own `envMap`**:

```ts
const sphereMaterial = new THREE.MeshStandardMaterial();
sphereMaterial.envMap = environmentMapTextureCreek;   // this material ignores scene.environment
sphereMaterial.envMapIntensity = 0.5;                 // 1 is default; lower it to weaken reflections
```

`envMapIntensity` is the reflection strength for that material. It only makes sense to dial it down once you can actually *see* the reflection — see [Why switching env maps on the sphere looked the same](#why-switching-env-maps-on-the-sphere-looked-the-same) below.

### Why switching env maps on the sphere looked the same

In the GUI you can swap the sphere material's `envMap` between `studio`, `lumber`, `creek`, `glasshouse` — and they all look nearly identical. Only switching to `null` visibly changes anything. Why?

The mechanism (per-material override, PMREM per texture) is **working** — the maps are different objects and each gets its own prefiltered PMREM texture. The problem is that the *visual difference* between them is tiny, because of how the scene is set up:

1. **The PNG cube faces are LDR, not HDR.** `png` is 8 bits per channel — no high dynamic range. The richness of an HDRI lives in its bright highlights and wide tonal range; converting to PNG clips exactly that. After PMREM blur, four LDR maps of similar brightness read as four similar soft tints. This is the biggest, most common cause.
2. **The material isn't reflective enough to show off an env map.** The sphere has `roughness: 0.4` and `metalness: 0.3`. Roughness blurs reflections heavily, low metalness weakens them, and `envMapIntensity: 0.5` halves what's left.
3. **Other light dominates.** `ambientLight.intensity = 2.1` plus the directional light drown out the comparatively subtle IBL contribution.

To *see* per-map differences, push the material toward a mirror: `metalness = 1`, `roughness ≈ 0.1`, `envMapIntensity ≈ 1`, and lower the ambient light. And if you really want distinct environments, keep them HDR (a `.hdr` loaded through `RGBELoader`, or `.exr`) instead of PNG.

**Should you keep the per-material override or just use the global map?** For a starter, the global `scene.environment` is enough and is one less thing to break. The per-material override is a legitimate tool — it is the only way to give *one* object a different environment than the rest of the scene (e.g. a polished chrome ball reflecting a studio booth while the terrain uses an outdoor HDRI). Keep the feature in your toolbox; just don't reach for it until you've verified the visual payoff with proper HDR input and an actually reflective material.

### Drop shadows

Three layers opt in to shadows, and all three are present in this app:

1. **Renderer**: `renderer.shadowMap.enabled = true` + `renderer.shadowMap.type = THREE.PCFSoftShadowMap`.
2. **Mesh**: `sphereMesh.castShadow = true`, `floorMesh.receiveShadow = true`.
3. **Light**: `directionalLight.castShadow = true`, plus a tuned shadow camera.

For a directional light the shadow camera is an **orthographic box** centered on the light — it defines the region the shadow map covers:

```ts
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.left = -7;
```

The smaller this box, the more shadow resolution you get for the same 1024×1024 map. The GUI exposes all of these, plus `radius` (blur), `intensity`, `bias`, and `mapSize` — and every `CameraHelper` view makes it obvious what the box actually covers.

## Code

in repo - `apps/16_0_physics_starter`

```ts
import * as THREE from 'three/webgpu';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. renderer first — needed before anything touches the GPU
const renderer = new THREE.WebGPURenderer({ canvas });
await renderer.init();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();

// 2. load cube maps asynchronously and WAIT for them
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapStudio = await cubeTextureLoader
	.setPath('/textures/environmentMaps/studio/')
	.loadAsync(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
const envMapCreek = await cubeTextureLoader
	.setPath('/textures/environmentMaps/creek/')
	.loadAsync(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

// 3. light the materials from the environment
scene.environment = envMapStudio; // IBL for every material without its own envMap

// 4. classic lights
const ambient = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambient);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.4 * Math.PI);
dirLight.position.set(5, 5, 5);
dirLight.castShadow = true; // light opt-in
scene.add(dirLight);

// 5. objects
const sphereMat = new THREE.MeshStandardMaterial({
	roughness: 0.4,
	metalness: 0.3,
	envMap: envMapCreek, // per-material override of the global env map
	envMapIntensity: 0.5,
});
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), sphereMat);
sphere.position.y = 0.5;
sphere.castShadow = true; // mesh opt-in: cast

const floorMat = new THREE.MeshStandardMaterial({
	roughness: 0.4,
	metalness: 0.3,
	color: new THREE.Color('#928192'),
});
const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMat);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true; // mesh opt-in: receive

scene.add(sphere, floor);

// 6. camera + controls + loop
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 100);
camera.position.set(-3, 3, 3);
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer.setAnimationLoop(() => {
	controls.update();
	renderer.render(scene, camera);
});
```

## Gotchas

- **`CubeTextureLoader.load()` returns the texture immediately** — the pixels are not there yet. Use `await loadAsync([...])` and never assign the result to `scene.environment` or `material.envMap` before it has resolved. The classic crash is `Cannot read properties of null (reading 'isRenderTargetTexture')` thrown in `PMREMNode.setup()`.
- **Order matters in `init()`**: `new WebGPURenderer()` → `await renderer.init()` → `await` the texture loads → only then assign env maps. Any env-map work before the renderer's device is ready hits a PMREM null render target.
- **`scene.background` ≠ `scene.environment`.** Background is a drawn backdrop; environment is light. Thinking one is the other leads to "why is my env map both invisible *and* doing nothing".
- **PNG cube maps are LDR.** After converting an HDRI to PNG you lose the high dynamic range — that's why the "different" environments all look alike. Keep `.hdr`/`.exr` (float) maps for real visual differences.
- **`shadow.radius` (blur) silently does nothing with `THREE.PCFSoftShadowMap`.** It's a `PCFShadowMap`-era setting.
- **The shadow camera helper only works when `renderer.shadowMap.enabled === true`** (flagged in the GUI itself). And after changing any shadow camera value at runtime you must call `camera.updateProjectionMatrix()` and `helper.update()` — the native GUI `onChange` callbacks in this app do exactly that.
- **`ArrowHelper` direction is frozen at creation.** If you move the directional light afterwards, the arrow still points along the original direction (noted next to the "what direction is light coming from" toggle in the GUI).
- **`directionalLight.lookAt(...)` doesn't rotate the direction as you'd expect.** The app's `directLookAtCenter` button was a failed attempt to point the light at center — it ends up doing no rotation at all. Moving the light's `position` (and `target`) is the reliable way.
- **`renderer.shadowMap.mapSize.width` and `height` should stay equal.** Square maps avoid filtering/sampling artifacts (the GUI enforces equal dropdown values).
- **The directional light intensity is in physical units in `three/webgpu`** — hence `0.4 * Math.PI` rather than a bare `0.4`. The same code under a WebGL renderer would be terribly dark. Same for other WebGPU-light intensities.
- **A strong ambient (`2.1`) flattens everything** — it washes out shadow contrast and masks the environment reflections. When you debug env maps, lower the ambient instead of raising `envMapIntensity`.

## Revisit

- **Verify the "switching env maps looks the same" hypothesis.** Crank the sphere to `metalness = 1`, `roughness ≈ 0.1`, kill the ambient, then swap maps from the GUI — you should finally see the four environments differ. Confirm whether the PNG-LDR explanation holds or if a fourth cause was missed.
- **Try real HDR cube maps.** `RGBELoader` for `.hdr`, `EXRLoader` for `.exr`, then PMREM — this is the same pattern as 10.8-10.10 material lessons but with proper dynamic range.
- **Look at `PMREMGenerator.fromScene(RoomEnvironment)` — a *procedural* environment** with no external textures at all. [RoomEnvironment](https://threejs.org/examples/#webgpu_lighting_ies) is a fake studio built from meshes; it's the go-to for clean, in-code reflections.
- **The intended next step**: this starter exists to host a physics library (e.g. Rapier) — the scene is already light, shadow, and env-map ready so physics work can focus on the simulation.
- Re-examine `directionalLight.lookAt` / shadow direction — the `directLookAtCenter` dead-end (notes in the code + GUI) deserves a proper pass if the physics scene needs moving lights.

## Outdated

approach is valid

The app is already on the **modern path**: `three/webgpu` + `WebGPURenderer` + TSL, used across recent lessons. ✅ If anything, the older texture pipeline is the legacy part: manual HDRI → PNG conversion ([HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/)) produces LDR faces; the current Three.js way would keep the map HDR (`RGBELoader` + `PMREMGenerator`). That's an enhancement, not a correction — nothing here can be called outdated.

## Links & Resources

### Docs

- [CubeTextureLoader](https://threejs.org/docs/#api/en/loaders/CubeTextureLoader) — loads the six cube faces
  > 🤖 suggested
- [Scene.environment](https://threejs.org/docs/#api/en/scenes/Scene.environment) — the environment map used for lighting (IBL)
  > 🤖 suggested
- [MeshStandardMaterial envMap](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial) and `envMapIntensity` — per-material environment override
  > 🤖 suggested
- [PMREMGenerator](https://threejs.org/docs/#api/en/extras/PMREMGenerator) — prefiltered environment maps, the reason env maps need care around renderer init
  > 🤖 suggested
- [WebGPURenderer](https://threejs.org/docs/#api/en/renderers/WebGPURenderer) — with `renderer.init()` and physical (candela) light units
  > 🤖 suggested

### Examples

- [Materials — environment maps](https://threejs.org/examples/#webgl_materials_envmaps) — HDRI env maps on reflective objects
  > 🤖 suggested
- [webgpu_lighting_ies](https://threejs.org/examples/#webgpu_lighting_ies) — WebGPU lighting showcase
  > 🤖 suggested

### Tools

- [HDRI-to-CubeMap](https://matheowis.github.io/HDRI-to-CubeMap/) — convert one HDRI into six cube faces (in README)
- [Poly Haven](https://polyhaven.com/) — free CC0 HDRIs, e.g. [barnaslingan_01](https://polyhaven.com/a/barnaslingan_01) (in README)

### Videos

- [Three.js Journey — Environment maps](https://threejs-journey.com/lessons/environment-map) — HDRI + scene.environment from first principles
  > 🤖 suggested
- [Three.js Journey — Realistic reflections](https://threejs-journey.com/lessons/realistic-reflections) — how PMREM and envMapIntensity behave in practice
  > 🤖 suggested

### Courses & Talks

- [Three.js Journey](https://threejs-journey.com/) — the course this lesson sequence follows
  > 🤖 suggested

### Other

- [lil-gui](https://lil-gui.georgealways.com/) — the GUI library behind the `Tweaks` panel
  > 🤖 suggested