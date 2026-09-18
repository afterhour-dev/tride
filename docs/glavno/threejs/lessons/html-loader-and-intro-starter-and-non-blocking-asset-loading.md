---
title: html-loader-and-intro-starter-and-non-blocking-asset-loading
topic: threejs
date: 2026-09-18
tags:
  - webgpu
  - model
  - loading
  - bug
  - normalMap
difficulty: beginner
app_path: apps/html_loader_and_intro_starter_later
---

## Concept

This app is a **starter** — a base scene for learning how to handle loaders (textures, environment maps, GLTF models) and how to build a better intro for an app. It's built as a partial copy of the realistic-rendering app from the 20.x lessons: same WebGPU renderer, same directional light + shadow map setup, floor and wall with albedo/normal/AO textures, the Flight Helmet and the Blender-built game console models.

Two things make it a *starter* rather than a finished scene:

1. **Non-blocking loading** — the whole point of the app. Almost every previous app in this monorepo did `await loadAsync(...)` for each texture and model before the first render. The browser sits on a blank/white canvas while textures decode and GLTF models parse (and Draco decompresses) — a bad first impression for a scene that's supposed to intro an app. This starter refuses to block: the renderer starts drawing immediately and assets pop in as they finish loading.
2. **A known, documented WebGPU bug is left visible** — the normal-map + shadow problem carried over from the realistic-rendering lessons. Everything works in `WebGL`; in `WebGPU` a wall with a normal map gets lit on the wrong side (see the analysis below). It's a library-side issue in the WebGPU path, not a mistake in this app, so it doesn't get in the way of what the app practices — and three.js is still being fixed on our side in the future. There's no `HDRLoader` here; the environment map is a **cube map** (6 PNG faces) instead of an `.hdr` file.

### The packages used

- **three** `0.186.0` — the current core, imported as `import * as THREE from 'three/webgpu'` to get `WebGPURenderer`, `Scene`, `LoadingManager`, `CubeTextureLoader`, `TextureLoader`, etc.
- **lil-gui** — the debug GUI (`Tweaks` panel) for tone mapping, environment map, directional light, shadow bias/normalBias, shadow camera bounds, wall normalMap toggling.
- **gsap** — installed and available for the future intro animation, but **not used yet** (the import is commented out).

### The loader / LoadingManager pattern

Three.js core has `THREE.LoadingManager` — a small event object that each loader reports progress through. Create one per kind of asset, attach callbacks, and hand it to the loader:

```ts
const textureLoadingManager = new THREE.LoadingManager();

textureLoadingManager.onStart = (filePath) => console.log('loading started', filePath);
textureLoadingManager.onProgress = (filePaths) => console.log('progress', filePaths);
textureLoadingManager.onLoad = () => console.log('loaded');
textureLoadingManager.onError = (e) => console.error(e);

const textureLoader = new THREE.TextureLoader(textureLoadingManager);
```

The scene uses three loaders, each with its own manager:

| Loader | Loads | Notes |
|---|---|---|
| `THREE.CubeTextureLoader` | environment map — 6 cube faces (`px nx py ny pz nz`) via `.setPath(...).load([...])` | Must be set as `scene.environment` + `scene.background` *before* the first render; per the code comment, this load is "blocking either way", so `await loadAsync` buys nothing here |
| `THREE.TextureLoader` | albedo / normal / AO (roughness+metalness) textures | Same `load()` call, no await |
| `GLTFLoader` + `DRACOLoader` | the two glTF models | The real non-blocking win — see below |

### The key trick: models come to you in a callback

For textures the asset is just an image you reference later, so it doesn't matter when it's ready. For models it does: you need to transform it (scale, position) and add it to the scene. The naive way is to `await` the whole model before continuing. The non-blocking way is `gltfLoader.load(path, callback)` — **`load()` doesn't return the model at all**; the loaded `gltf` (with `.scene`, a `Group` of meshes) is handed to your callback:

```ts
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (flightHelmet) => {
	modelSetup(flightHelmet.scene); // castShadow + receiveShadow on every mesh
	flightHelmet.scene.scale.setScalar(10);
	flightHelmet.scene.position.y = -1.85;
	allGroup.add(flightHelmet.scene); // pops into the render loop when ready
});
```

Because the render loop (`renderer.setAnimationLoop(tick)` + `renderer.render(scene, camera)` in `tick`) is already running, the moment the model finishes decoding it appears in the next frame — no white screen, no freeze, and the intro can start over an already-visible scene. `modelSetup` comes from `util.ts`: it walks the model's scene graph (`scene.traverse(...)`) and sets `castShadow = true` + `receiveShadow = true` on every mesh that has a standard material.

The two models:

- **Flight Helmet (2.0)** — downloaded from the KhronosGroup [glTF-Sample-Models](https://github.com/KhronosGroup/glTF-Sample-Models) repo, present in both plain `glTF/` and Draco-compressed `glTF-KTX-BasisU/` flavors (see [[16.3_draco]]).
- **Game console** — built by the user in Blender, exported as glTF (`.gltf` + `.bin`), textured with an extracted Disco Elysium texture.

Both go into an `allGroup` (with the floor/wall group inside it) so the whole scene can be rotated from the GUI. The `DRACOLoader` needs `dracoLoader.setDecoderPath('/draco/')` — the decoder wasm/js files are served from `public/draco/`.

### Other setup details worth knowing

- **Tone mapping before init** — `renderer.toneMapping = THREE.ReinhardToneMapping` and `renderer.toneMappingExposure = 3` are set *before* `await renderer.init()`. The code comment notes this ordering matters (some renderer settings only take effect at init); exposure is exposed as a live GUI slider afterwards.
- **Cube map mapping** — the env map texture marks `mapping = THREE.CubeReflectionMapping`. Setting `EquirectangularReflectionMapping` on a cube map throws — equirectangular mapping is for `.hdr`/`.exr` (see [[19.0_environment-map-intro-with-cube-texture-map]] and [[19.1_equirectangular-hdri]]).
- **Shadow map** — `PCFShadowMap` (default). `PCFSoftShadowMap` is deprecated and `shadow.radius` (blur) doesn't work with it anyway. `mapSize` 512, `near` 2 / `far` 20, frustum ±9. `bias` is set to `-0.0005` and `normalBias` to `0.03` — both live-tunable in the GUI.
- **DOM** — `index.html` is just a `<canvas id="tride">` + the module script; `getRequiredElement('canvas#tride')` grabs it. `h` toggles the GUI, double-click goes fullscreen (with WebKit fallbacks). The palette CSS variables in `style.css` are kept for quick material experiments.

### The wall shadow bug — is anything wrong in this code?

The README asks: *"do you think I made some errors, or am I using something incorrectly?"* — worth being precise about, so you don't chase the wrong thing:

- Without a normal map everything works — floor and wall both get correct shadows.
- Adding `wallMaterial.normalMap = crackedConcretNormalTexture`: the wall is lit on **the wrong side**, the floor is lit correctly, the wall's shadow is "on the back of the wall" and **stripy**, `bias` has almost no visible effect, `normalBias` has an effect but a strange one, and only rotating the wall horizontal makes the shadow land on the lit side.
- Experimenting in the GUI confirms: toggling `wallMaterial.normalMap` off makes the shadow appear; `normalScale` scaled to `(0.2, 0.2)` changed nothing.

Reading the symptoms against how shadow maps work (from [[20.3_shadow-acne-and-biases-and-where-to-go-further]]: the scene is re-rendered from the light's view into a depth texture, then each pixel's depth-from-light is compared against it):

1. **"Stripy shadow on the back of the wall" + "rotating the wall horizontal fixes it"** — this is exactly what you'd expect from **geometry + shadow-camera sampling**, independent of any shader bug. The wall is a `BoxGeometry(8, 8, 0.3)` — deliberately, *"I used Box instead of plane to show this"* — and its material is double-sided. Standing upright, the wall faces the shadow camera nearly **edge-on**: the light's depth texture paints one thin column of pixels across the entire 8-unit back face, so each shadow-map pixel spans a tall strip of surface, and depth quantization shows up as horizontal **banding (stripes)**. Rotate the wall horizontal and the shadow camera sees the face nearly head-on — one pixel now spans a small patch, banding disappears. Try the GUI's own hint: it contains a `wallMaterial.normalMap` toggle (to see the shadow without the map) and a `wallMesh.rotation.x` spinner (to rotate the wall a full circle). Nothing in this app's code is misconfigured for this part — with a single-sided `PlaneGeometry` + explicit `shadowSide` this artifact would mostly vanish.
2. **"Wrong side of the wall lit, only when a normal map is present"** — this is the part that looks genuinely **library-side in the WebGPU path** (WebGL is fine). A normal map perturbs the surface normal per-pixel for lighting; if the WebGPU path interprets the normal map's handedness/Y-sign differently, "which side faces the light" inverts exactly as described. It also explains why `normalScale` at `0.2` changed nothing (a sign flip isn't fixed by scaling), why `bias` (a uniform depth-axis push) feels dead while `normalBias` (which pushes the sample position along that misread normal) acts strangely, and why the floor — which has a matching normal map but correct lighting — doesn't prove the wall path is sound. Your own README assessment is the right one: *"it's not a problem on our side, it is a problem with the library"* — hope three.js fixes it for WebGPU in the future; until then it's documented and left visible, and it doesn't get in the way of what this starter teaches.

## Code

in repo - `apps/21_0_html_loader_and_intro_starter`

```ts
// Non-blocking asset loading: no `await`, no white screen.
// Models arrive in a callback, textures are just kicked off, the
// render loop starts immediately and assets pop in when ready.
import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// -- 1. loaders, each with its own LoadingManager -----------------
const modelLoadingManager = new THREE.LoadingManager();
modelLoadingManager.onStart = (p) => console.log('start', p);
modelLoadingManager.onLoad = () => console.log('all models loaded');
modelLoadingManager.onError = (e) => console.error(e);

const gltfLoader = new GLTFLoader(modelLoadingManager);
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/'); // serve decoder from /public/draco/
gltfLoader.setDRACOLoader(dracoLoader);

const textureLoadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(textureLoadingManager);

// -- 2. kick everything off without awaiting -----------------------
const envMap = new THREE.CubeTextureLoader(new THREE.LoadingManager())
	.setPath('/textures/environmentMaps/abandoned_garage/')
	.load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

const albedo = textureLoader.load('/textures/old_wooden_floor_03_1k/old_wooden_floor_03_diff_1k.jpg');

gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
	// the model is only available *inside* this callback
	gltf.scene.scale.setScalar(10);
	scene.add(gltf.scene); // appears in the running render loop
});

// -- 3. normal scene setup + render loop ---------------------------
const scene = new THREE.Scene();
scene.environment = envMap;
scene.background = envMap;
// ...lights, meshes, camera, OrbitControls...

const tick = (timestamp: number) => {
	timer.update(timestamp);
	orbitControls.update();
	renderer.render(scene, camera);
};
renderer.setAnimationLoop(tick);
```

## Gotchas

- **`gltfLoader.load()` has no usable return value.** The model is delivered to the callback — transform it and add it to the scene *inside* the callback. The commented-out `await gltfLoader.loadAsync(...)` in the source is the old pattern this lesson replaces.
- **`await loadAsync` is what causes the white screen.** For a starter/intro, that blocking await per asset is the anti-pattern; `load()` + callbacks keep the first frame immediate.
- **The cube map load is "blocking either way"** (code comment): the env map must be `scene.environment`/`scene.background` before the first render, so nothing is gained by awaiting it. The genuinely non-blocking win is the **models**.
- **Wrong `mapping` on a cube map throws.** `EquirectangularReflectionMapping` is for `.hdr`/`.exr`; a cube map wants `CubeReflectionMapping`.
- **Tone mapping (and possibly other renderer settings) must be set before `await renderer.init()`** — the `// EXPLAIN:` comment flags this ordering.
- **`PCFSoftShadowMap` is deprecated** — use `PCFShadowMap` (default). `shadow.radius` (blur) doesn't work with the soft map regardless.
- **Changing `shadow.mapSize` at runtime** requires `shadow.map?.dispose(); shadow.map = null` to force regeneration at the new size (the GUI does this).
- **Shadow camera helpers are dead when `renderer.shadowMap.enabled === false`** — the GUI prints exactly this warning.
- **WebGPU + normalMap + shadows = the documented bug.** Wall gets lit on the wrong side, shadow lands on the back of the wall and looks stripy. WebGL is unaffected; it's library-side. Don't burn time re-tuning — either drop the normal map on the wall (GUI toggle) or switch to `WebGLRenderer` for that check.
- **`import * as THREE from 'three/webgpu'`** is what provides `WebGPURenderer`, `Scene`, `LoadingManager`, `CubeTextureLoader`, `TextureLoader`. Importing from `'three'` gives the WebGL-only module surface.
- **Draco needs its decoder served.** `DRACOLoader` without `setDecoderPath('/draco/')` (and the `public/draco/` files behind it) fails on compressed `.gltf`.

## Revisit

- **The wall normal map bug.** Retry on every three.js update (the WebGPU path is where the fix needs to land). Meanwhile, two isolation experiments worth doing: replace the wall `BoxGeometry` with a single-sided `PlaneGeometry` + `shadowSide = THREE.FrontSide` to separate the depth-banding artifact from the normal-map lighting inversion, and compare `PCFShadowMap` / `BasicShadowMap` / `VSMShadowMap` in the GUI at higher `mapSize`.
- **`bias` / `normalBias` — "I don't know how well they work".** The README self-corrects: bias does have an effect, just a subtle one; `normalBias` has an effect but strange. Revisit [[20.3_shadow-acne-and-biases-and-where-to-go-further]] which explains both — `bias` shifts depth uniformly, `normalBias` pushes the sample position along the surface normal.
- **The HDRLoader path** is commented out here (starter uses a cube map only). Revisit [[19.1_equirectangular-hdri]] / [[19.2_hdri-from-blender]] for `.hdr` equirectangular environment maps.
- **glTF vs glTF-KTX-BasisU** — both Flight Helmet flavors ship in `public/models/`. The starter loads the plain one; revisit [[16.3_draco]] for what Draco actually buys you.
- **Intro/animation** — gsap is installed but unused; the "better intro for apps" this starter is meant to host still needs building (animated camera, overlay, etc.).

## Outdated

The approach is valid and current: latest three.js core (`0.186.0`) with `WebGPURenderer`, `Scene`, `LoadingManager`, `CubeTextureLoader` — the loader/callback pattern is the modern one. What *is* outdated is the pattern this starter deliberately moves away from: **awaiting every `loadAsync` before the first render** (the white-screen intro used by almost every earlier app in this monorepo). Also outdated: `PCFSoftShadowMap` (deprecated) and equirectangular `mapping` on cube maps.

This project already runs on **WebGPU** instead of WebGL, so it's fully up to date with the direction three.js core is going. ✅ The only WebGPU-specific limitation remains the library-side normal-map + shadow bug documented above — WebGL is the fallback when that combination is needed (as in the 20.x realistic-rendering lessons).

> ⚠️ Note for the future: when three.js fixes the WebGPU normal-map shadow path, re-check whether this starter's wall can go back to a Box + normal map without the workaround.

## Links & Resources

### Docs

- three.js LoadingManager: <https://threejs.org/docs/#api/en/loaders/LoadingManager> `> 🤖 suggested`
- three.js GLTFLoader: <https://threejs.org/docs/#api/en/loaders/GLTFLoader> `> 🤖 suggested`
- three.js DRACOLoader: <https://threejs.org/docs/#api/en/loaders/DRACOLoader> `> 🤖 suggested`
- three.js CubeTextureLoader: <https://threejs.org/docs/#api/en/loaders/CubeTextureLoader> `> 🤖 suggested`
- three.js manual — Fixing Shadow Acne (bias / normalBias): <https://threejs.org/manual/#en/fixing-shadow-acne> `> 🤖 suggested`

### Examples

- three.js official GLTF loader example (Draco + models): <https://threejs.org/examples/#webgl_loader_gltf> `> 🤖 suggested`

### Tools

- lil-gui — the debug GUI used in the app: <https://lil-gui.georgealways.com> `> 🤖 suggested`

### Articles

- glTF-Sample-Models README — notes on model variants and Draco: <https://github.com/KhronosGroup/glTF-Sample-Models/blob/main/README.md> `> 🤖 suggested`

### Videos

- Draco: Fast compressed 3D (Google) — the clever part of this encoding: <https://www.youtube.com/watch?v=8gpmEJIinivg> `> 🤖 suggested`

### Courses & Talks

- none yet

### Repos

- KhronosGroup glTF-Sample-Models — source of the Flight Helmet (2.0) model: <https://github.com/KhronosGroup/glTF-Sample-Models>
- three.js core source — loaders, LoadingManager, Scene: <https://github.com/three-js/three> `> 🤖 suggested`
- google/draco — the Draco compression codec used via `DRACOLoader`: <https://github.com/google/draco> `> 🤖 suggested`

### Other

- Related lessons: [[16.3_draco]] (compressed models), [[19.0_environment-map-intro-with-cube-texture-map]] (cube maps), [[20.3_shadow-acne-and-biases-and-where-to-go-further]] (bias/normalBias), [[20.2_realistic-render-textures-and-color-space]] (the WebGPU normal-map problem first appeared here).