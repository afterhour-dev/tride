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
 



-----------------------------------------------------------------
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