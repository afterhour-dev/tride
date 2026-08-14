# RectAreaLight

Learning about RectAreaLight.

## Namera / Intent

Want to know important and useful things about RectAreaLight

## Šta treba objasniti u detalje

- works like the big rectangle lights you can see on the photoshoot set

- mix between directional light and diffuse light

- explain properties/parameters: color, intensity, width, height

- what is the range of allowed values for intesity?

- explain this problem with WebGPU
  ```
  installHook.js:1 THREE.TSL: TypeError: Cannot read properties of null (reading 'LTC_FLOAT_1') "RectAreaLightNode.setupDirectRectArea()" at "three_webgpu.js:38055"
    at RectAreaLightNode.setupDirectRectArea (:5173/three_webgpu.js:38055:28)
    at RectAreaLightNode.setup (:5173/three_webgpu.js:31450:40)
    at RectAreaLightNode.build (:5173/three_webgpu.js:1456:34)
    at LightsNode.setupLights (:5173/three_webgpu.js:30020:49)
    at PhysicalLightingModel.start (:5173/three_webgpu.js:15184:22)
    at PhysicalLightingModel.start (:5173/three_webgpu.js:17042:9)
    at LightsNode.setup (:5173/three_webgpu.js:30046:18)
    at LightsNode.build (:5173/three_webgpu.js:1456:34)
    at LightingContextNode.setup (:5173/three_webgpu.js:5507:13)
    at LightingContextNode.setup (:5173/three_webgpu.js:12793:16)
  ```
  - what I discovered is that we need:
    - ```ts
      import { RectAreaLightTexturesLib } from 'three/addons/lights/RectAreaLightTexturesLib.js';
      import { RectAreaLightNode } from 'three/webgpu';
      // somewhere before your first render, e.g. right after scene setup (can be after await render.init() for my app)
      RectAreaLightNode.setLTC(RectAreaLightTexturesLib.init());
      ```
      it worked after this solution: you explain why? And also is this solution up to date

- It works only with `MeshStandardMaterial` and `MeshPhysicalMaterial`

- you can use `lookAt` but you can't access `target`:
  - RectAreaLight doesn't store a lookAt target as a property — unlike DirectionalLight/SpotLight, it has no .target object. Calling .lookAt() just rotates it once; after that, the "look direction" only exists implicitly in its rotation/quaternion.