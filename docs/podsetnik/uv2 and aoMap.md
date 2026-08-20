Pogledaj i ovo, mozda da napomes negde u dokumentaciji:


> So I'm following some threejs project and I apply ing texture, and in notes for that project author specified: "don't forget the `uv2` attribute to support aoMap". Is this still valid for ambient occlusion or I don't need to vory about it? I am on latest three package and I'm using WebGPU?

## Answer

Good news — this got fixed. You no longer need a separate `uv2` attribute for `aoMap`.

Here's what changed: as of the migration in r150+, aoMap and lightMap no longer use uv2 — instead you set material.aoMap.channel (0 for the primary uv, 1 for the second UV set) to pick which UV channel to sample. So the old requirement your project's notes are referring to — manually creating a `uv2` buffer attribute — is outdated advice.

There's an extra wrinkle worth knowing about: the naming convention for UV attributes also changed — what used to be uv, uv2, uv3, uv4 is now uv, uv1, uv2, uv3. So if you do want a second UV channel, the attribute name in geometry is now `uv1`, not `uv2` — and you point to it via `material.aoMap.channel = 1`, not by naming the attribute `uv2`.

Practically, for the "latest" package:

```js
material.aoMap = texture;
material.aoMap.channel = 0; // use the primary UV set — no second UV needed at all now
```

If your geometry only has one UV set (which is common), you can just set `channel = 0` and skip the whole extra-attribute dance entirely. You'd only need `channel = 1` (and a `uv1` attribute on the geometry) if you specifically baked your AO into a separate UV layout — e.g. for lightmap-style unwraps.

As for WebGPU — this `channel` system is part of the core `Material`/`Texture` API, not renderer-specific, so it behaves the same whether you're using `WebGLRenderer` or `WebGPURenderer`. No special handling needed there.

So: the note in your project is stale. Just make sure your `aoMap` texture's `channel` is set (default is 0), and you're fine without touching `uv2`.