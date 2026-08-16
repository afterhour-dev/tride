# Shadows

Exploring shadows.

Imortant things of our setup in this app are:
- a sphere
- a plane
- a directional light
- an ambient light

## Namera / Intent

Goal is to learn important things related to shadows

## Šta treba objasniti u detalje

- dark shadow in the back of the objects are called **core shadows**
- what we also want are **drop shadows** (in our example we want shadow siluete on the plane)
- shadows have always be challenge for real-time 3D rendering, and developers must find tricks to display realistic shadows at a reasonable frame rate. Three.js has a built-in solution; it is not perfect but it is convinient. It lacks modern options like raytracing (Will ever raytracing is going to be implemented in three.js webgpu?), also raytracing requires one our for the render
- how it works:
  - when you do one render, Three.js will do a render for each light supporting shadows
  - Those renders will simulate what the light sees as if it was a camera
  - during these lights renders, a `MeshDepthMaterial` replaces all meshes materials
  - the lights renders are stored as textures and we call those `shadow maps`
  - they are then used on every materials supposed to receive shadows and projected on the geometry
- how to activate shadows
  - it's not that hard, but optimizing shadows is harder
  - renderer.shadowMap.enabled = true (in terms of webgpu, do we do this after or before calling await renderer.init())
  - you need to go through every object and decide if can cast shadow with `castShadow` and if it can receive shadow with `receiveShadow` (floor should only receive shadows while other objects above the floor should cast and receive shadows; am I right about that? But for our simple example sphere doesn't need to recieive shadow)
- only the followinfg types of lights support shadows:
  - PointLight
  - DirectionalLight
  - SpotLight
- so we need to activate the shadows on the lights also, and for our case we need to do it on directional light; we also use **`castShadow`** propert on the light