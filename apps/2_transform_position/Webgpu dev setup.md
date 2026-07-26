# WebGPU on Linux (Chrome) — Dev Setup Notes

Context: Fedora Linux, AMD integrated GPU (Renoir/Lucienne, Vega/GCN
architecture), Chrome/Chromium via Mesa RADV Vulkan driver.

## The problem

Even though `chrome://gpu` reports:

```
WebGPU: Hardware accelerated
<Integrated GPU> Vulkan backend - AMD Radeon Graphics (RADV RENOIR)
[WebGPU Status] Available
```

...calling this in the console still failed:

```js
await navigator.gpu.requestAdapter()
// → "No available adapters." → null
```

Root cause: Chrome ships a driver/hardware **blocklist** for WebGPU on
Linux, separate from what `chrome://gpu` shows as theoretically
"available." One of the entries under **Problems Detected** in
`chrome://gpu` was:

```
Disable webgpu on vk via gl interop
Disabled Features: webgpu_on_vk_via_gl_interop
```

This specific Mesa/RADV/ANGLE combo got excluded by Chrome's default
allowlist out of caution — not because the hardware/driver can't do
it, just that Chrome hasn't validated this combo as safe-by-default
yet.

## The fix — flags to set for local development

Go to `chrome://flags` and set:

| Flag | Setting |
|---|---|
| **Force enable WebGPU interop** | **Enabled** (was: Default) |
| **Unsafe WebGPU Support** | **Enabled** (was: Disabled) |

Then click **Relaunch** at the bottom (a full Chrome restart, not
just a tab reload).

Verify with:

```js
await navigator.gpu?.requestAdapter()
// → should now return a real GPUAdapter object, not null
```

If flags alone don't do it, the command-line equivalent (occasionally
unlocks slightly different code paths than the flags UI):

```bash
google-chrome --enable-unsafe-webgpu --enable-features=Vulkan,VulkanFromANGLE
```

## Important: this is a local override, not shippable

These flags only affect **this browser instance on this machine**.
They are not something end users will have set. This setup is for
**developing/testing against the real WebGPU backend locally** —
it does not mean production users on similar Linux/Mesa hardware will
get WebGPU by default.

In `three.js`, `WebGPURenderer` is designed to auto-fallback to
WebGL2 when no adapter is available — this is expected, graceful
behavior for real users on unflagged browsers, not a bug.

## Testing both paths

Since this is a real fallback scenario your users may hit, test both
states of your app periodically:

- **Flags ON** → confirms the actual WebGPU path renders/behaves
  correctly (worth doing before shipping anything that leans on
  WebGPU-only features like compute shaders or TSL).
- **Flags OFF** (default Chrome) → confirms the WebGL2 fallback still
  looks/behaves correctly. This is what most real users will see on
  similar hardware until Chrome's default allowlist changes.

Known fallback-path gotcha we hit: `WebGPURenderer`'s WebGL2 fallback
did not default to an opaque black clear color the way plain
`WebGLRenderer` did. Fix:

```ts
renderer.setClearColor(0x000000, 1);
```

## Quick diagnostic reference

```js
// Check adapter directly, bypassing three.js entirely
await navigator.gpu?.requestAdapter()
```

- Returns `null` → browser/context-level block. Check (in order):
  1. Are you on `http://localhost` or `https://`? (WebGPU requires a
     secure context — a LAN IP like `192.168.x.x` won't work)
  2. Test in Incognito with extensions disabled — privacy/fingerprint
     extensions commonly shim `navigator.gpu` to always return null
  3. Check `chrome://flags` for the WebGPU interop/unsafe flags above
  4. Check `chrome://policy` for an org-managed policy disabling it
- Returns a `GPUAdapter` object → real backend is working. Note: the
  reported `architecture` string (e.g. `"rdna-2"`) may not literally
  match your hardware — Dawn/ANGLE buckets some older AMD chips into
  the nearest capability tier for internal purposes, so don't treat
  it as a literal hardware ID.