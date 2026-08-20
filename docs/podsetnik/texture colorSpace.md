# My dilema was do I need only to set up SRGBColorSpace to color (albedo) texture, or there are more textures we can set that up for

> when we are setting SRGBColorSpace, are we only doing it for albedo texture?

No — it's not just albedo. The rule is about **color data vs. non-color (numeric) data**, not one specific map slot.

**Needs `SRGBColorSpace`** (any texture that stores actual visible color):
- `.map` (albedo/base color)
- `.emissiveMap`
- `.sheenColorMap`
- `.specularColorMap`

These textures contain color, and must be annotated with texture.colorSpace = SRGBColorSpace — because the pixels were authored/exported assuming a gamma-corrected display, so the renderer needs to know to linearize them before lighting math.

**Stays `NoColorSpace`** (the default — don't touch it) for anything that's really just numeric data encoded as pixels, not color:
- `normalMap`
- `roughnessMap`
- `metalnessMap`
- `aoMap`
- `bumpMap` / `displacementMap`
- `alphaMap`
- `clearcoatMap`, `clearcoatRoughnessMap`, `clearcoatNormalMap`
- `transmissionMap`, `thicknessMap`
- `anisotropyMap`, `iridescenceMap`, `iridescenceThicknessMap`
- `sheenRoughnessMap`
- `specularIntensityMap`

Non-color data includes normal, roughness, metalness, ambient occlusion, height, displacement, alpha masks, thickness, transmission amount, and lookup data — these values are direct multipliers/vectors the shader reads numerically, so applying an sRGB decode to them would corrupt the math (e.g. a roughness of 0.5 would get warped into the wrong number).

One more case worth flagging since you mentioned it's a texture-heavy project: **`envMap` and `lightMap`** are a third bucket — they represent luminance data, and most envMap textures use LinearSRGBColorSpace rather than SRGBColorSpace, especially when loaded from HDR/EXR files via `RGBELoader`/`EXRLoader`, which already tag the data correctly on load — you generally shouldn't override that.

So the mental model: **sRGB = "this pixel is a color someone looked at and picked"; Linear/NoColorSpace = "this pixel is a number the shader reads directly."**