# Shadow - Spot Light

Exploring shadows with spot light

## Namera / Intent

Cilje je razumeti sta sve mozemo da uradimo u smislu shadow-a, kada imamo spot light.

## Šta treba objasniti u detalje

- mixing shadows doesn't look really good

- we can improve the shadow quality using the same technics that we used for the directional light
  
- mapSize `spotLight.shadow.mapSize.<width/height>`
- amplitude by changing fov (field of view) (what are the ranges for field of view)
- near and far
  
- **I have problems here while using gui to change near far fov. Only effect It gave me as I was increaing near shadow got croper or disapeard, which is expected, but lowering far even to 0 did nothig. As I change near or far fov changes, jumps and increses. Changing fov also had no effect**
 

  - after some digging I found out about why is that problem happening, and this is what is suggested

    This confirms exactly what's happening — this is a known three.js behavior, not a bug in your code.

    **Why `fov` does nothing:** In `SpotLightShadow.updateMatrices()` (called internally every frame before the shadow map renders), three.js **overwrites** `camera.fov` with:

    ```js
    fov = RAD2DEG * 2 * light.angle * light.shadow.focus
    ```

    This runs automatically on every render, and only touches the camera's fov, aspect, and far if any of them differ from the current values — but it always recalculates fov from the light's `angle`, so a value you set by hand through the GUI gets clobbered on the very next frame. That's confirmed straight from the source and matches what other users have hit too: the fov of a spotlight's shadow camera gets overwritten based on the spotlight's angle, so setting it manually isn't enough to make it stick.

    The **actual** knob for this is `spotLight.shadow.focus` (default `1`), which is used to focus the shadow camera, acting as a percentage of the spotlight's field-of-view. So instead of a `fov` GUI slider, add:

    ```ts
    spotLightShadowTweaks
    	.add(spotLight.shadow, 'focus')
    	.min(0)
    	.max(2)
    	.step(0.001)
    	.onChange(() => {
    		spotlightShadowCameraHelper.update();
    	})
    	.name('spotLight.shadow.focus');
    ```

    `focus: 1` matches the light's full angle exactly; lower values (e.g. `0.5`) shrink the shadow camera's fov relative to the light cone (tighter shadow frustum, less wasted shadow-map resolution outside the visible cone); values above `1` widen it. You don't need `updateProjectionMatrix()` here — three.js recalculates the camera itself every frame from `focus`.

    **Why `far` did nothing when you set it to `0`:** Same mechanism — the far plane is recalculated every frame as `light.distance || camera.far`. Since your `spotLight.distance` is `10`, `far` is forced back to `10` every frame regardless of what the GUI slider set it to (and `far = 0` from your slider isn't even a valid clipping plane, so it'd be ignored/clamped even without the override). This is also documented directly: if the SpotLight's distance property is set, the far clipping plane will track that value; otherwise it defaults to 500.

    So to control `far`, don't fight it through the shadow camera — **change `spotLight.distance`** instead, and the shadow far-plane will follow it automatically.

    **Why `near` actually did something:** `near` is genuinely *not* auto-managed by `updateMatrices()` — only fov, aspect, and far are recalculated there. So your `near` slider is the one property behaving as a normal, persistent user-set value — that's why raising it visibly clipped/cropped the shadow, exactly as expected.

    **Practical fix for your GUI:**
    - Remove/disable the `fov` slider on `spotLight.shadow.camera` — replace with `spotLight.shadow.focus`.
    - Remove/disable the `far` slider on `spotLight.shadow.camera` — replace with a `spotLight.distance` slider (you already have one in `spotTweaks`, so the shadow camera's far plane is already following it; you don't need a separate control in `spotLightShadowTweaks` for `far` at all).
    - Keep `near` as-is — it's the one real, persistent control.

- another question. I'm moving spotLight.target, and  drop shadow stays at the same place, but when I change position of the camera shadows also reflects that and changes? Why is this? (shadow helper moves when I move the target also)
  - this is what I found out:
			Good catch — and this is very likely tied to `three/webgpu` specifically, not a mistake in your code.

      **How it's supposed to work:** A `SpotLight`'s shadow camera doesn't have its own independent orientation — every frame, `SpotLightShadow.updateMatrices()` does a `lookAt()` from `light.position` toward `light.target`'s world position (via its `matrixWorld`). Since you've already added `spotLight.target` to the scene (`scene.add(spotLight.target)`), its `matrixWorld` should update automatically every frame along with everything else, and the shadow camera should re-orient itself toward the new target position without you needing to do anything else. Moving `spotLight.position` obviously moves the shadow too, since that's literally where the shadow camera sits.

      So in a normal `WebGLRenderer` scene, both should just work identically — moving either the light or its target should reorient the shadow.

      **Why it's likely broken specifically for you:** You're using `three/webgpu`, and there are several open, confirmed three.js issues about exactly this class of bug — the WebGPU backend's node-based lighting/shadow system caches light data more aggressively than the WebGL path, and doesn't always detect when a light-related property changes:

      - One reported issue describes a DirectionalLight whose position and target are updated every frame — this works correctly with WebGLRenderer, but with WebGPURenderer the shadows visibly glitch every time the light moves.
      - A separate issue shows WebGPURenderer failing to detect dynamically added or removed lights at all — the scene graph updates correctly, but the rendered lighting doesn't reflect it — which the maintainers acknowledged is a caching bug in how lights are keyed internally.
      - There's also an open discussion around the light/shadow cache-key checks added to the WebGPU renderer's shadow rendering path, which affect how updates get picked up per frame.

      Your symptom — `position` updates propagate but `target` updates don't — fits this pattern exactly: `position` is a property read very directly and frequently by the renderer for lots of things (attenuation, direction vectors, etc.), while the `target`-driven shadow camera orientation is a slightly more indirect path (through `matrixWorld` → `lookAt()`) that seems to be one of the spots where the WebGPU node caching isn't invalidating properly.

      **What to try:**
      1. **Confirm it's WebGPU-specific** — temporarily swap to `THREE.WebGLRenderer` with the same scene and see if moving `spotLight.target` works correctly there. If it does, that confirms the WebGPU backend is the culprit, not your code.
      2. **Check your three.js version and update** — this area (lights/shadows in the node-based renderer) has been actively patched over the last several releases; you may be on a version with an already-fixed or partially-fixed variant of this bug.
      3. **Try forcing an explicit update** as a workaround, e.g. in your `tick()`:
         ```ts
         spotLight.target.updateMatrixWorld(true);
         ```
         This won't help if it's a shader/uniform caching issue rather than a matrix issue, but it's cheap to test.
      4. If none of that resolves it, it's worth filing (or searching for/upvoting) a minimal repro on the three.js GitHub issues — this is exactly the kind of WebGPU-renderer lighting bug the maintainers have been fixing piecemeal, and a clean repro helps a lot.