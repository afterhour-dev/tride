
Ovde imam jednu napomenu da bih mogao koristiti VSM: 
[[13.1_shadow-map-optimization-part-one#Outdated]]

vidi kako mozes ovo uraditi i da li je potrebno i da li je komplikovano, a ovo je primer:
<https://threejs.org/examples/webgpu_shadowmap_vsm.html>


# AI mi je rekao

Using Variance Shadow Maps (`VSMShadowMap`) with Three.js's `WebGPURenderer` ==involves modern WebGPU depth/render pipelines and TSL (Three.js Shading Language)==. However, VSM support under the WebGPU backend has certain limitations, constraints, and active precision adjustments compared to the legacy WebGL renderer. [[1](https://discourse.threejs.org/t/webgpu-shadow-tests-and-findings/82561), [2](https://threejs-skills.com/skills/threejs-scalable-real-time-shadows.html), [3](https://github.com/mrdoob/three.js/issues/31885), [4](https://www.webgpu.com/showcase/threejs-webgpu-compute-physics/), [5](https://discourse.threejs.org/t/webgpu-shadow-tests-and-findings/82561/2)]

Current Compatibility & Constraints

- **Point Lights Limitation:** Point lights are not natively compatible with `VSMShadowMap` when using `WebGPURenderer`. The engine automatically falls back or forces default shadow filters for point lights to prevent shader or rendering crashes. [[1](https://discourse.threejs.org/t/webgpu-shadow-tests-and-findings/82561/2), [2](https://altersquare.medium.com/three-js-vs-webgpu-in-2026-what-changed-for-large-scale-construction-viewers-79a7ed8b0b34), [3](https://discourse.threejs.org/t/webgpu-shadow-tests-and-findings/82561)]

- **Depth Textures vs. Packing:** Unlike `WebGLRenderer`—which packs depth into RGBA values—`WebGPURenderer` relies heavily on native depth textures. This shift sometimes introduces precision differences or shadow acne, requiring careful adjustment of shadow bias properties. [[1](https://discourse.threejs.org/t/severe-shadow-acne-after-switching-to-webgpurenderer/89043), [2](https://github.com/mrdoob/three.js/issues/31885)]

Implementation Details

- **Enabling VSM:** Set your renderer's shadow map type globally:
    
    js
    
    ```
    renderer.shadowMap.type = THREE.VSMShadowMap;
    ```
    
    Use code with caution.
    

- **Light and Mesh Setup:** Ensure casting and receiving are explicitly turned on for your lights and objects:
    
    js
    
    ```
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    ```
    
    Use code with caution.
    

- **Bias Tuning:** Because WebGPU shadow implementations handle depth comparisons differently, if you encounter shadow acne or "Peter Panning", adjust `light.shadow.bias` and `light.shadow.normalBias` carefully rather than relying on default WebGL values. [[1](https://discourse.threejs.org/t/no-self-shadow-on-a-model/86561), [2](https://sbcode.net/threejs/shadows/), [3](https://discourse.threejs.org/t/how-to-use-vertexnode-of-nodematerial/69299), [4](https://discourse.threejs.org/t/severe-shadow-acne-after-switching-to-webgpurenderer/89043), [5](https://github.com/mrdoob/three.js/issues/31885)]

Further Exploration

- Read about discussion findings on the [Three.js Forum Thread](https://discourse.threejs.org/t/webgpu-shadow-tests-and-findings/82561) regarding WebGPU shadow tests and limitations.

- Inspect ongoing precision adjustments in the [Three.js GitHub Issues](https://github.com/mrdoob/three.js/issues/31885) tracking TSL VSM shadow map behavior. [[1](https://discourse.threejs.org/t/webgpu-shadow-tests-and-findings/82561)]