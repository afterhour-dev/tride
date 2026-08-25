---
title: b particle-color-mixing
topic: threejs
date: 2026-08-25
tags: [webgl, colors, particles, lerp, vertex-colors]
difficulty: beginner
app_path: apps/b_project-4-colors
---

## Concept

This lesson extends the particle system by adding **multiple colors** to particles using vertex colors. The main technique is **color interpolation with `lerp()`** to smoothly blend between two colors based on distance from the center.

### Vertex Colors

Instead of using a single color for all particles, we can assign a unique color to each particle vertex. This is done by:

1. Setting `material.vertexColors = true` to tell Three.js to use per-vertex colors
2. Creating a `Float32Array` for the color attribute (same length as positions, 3 values per vertex for R, G, B)
3. Setting the attribute on the geometry with `geometry.setAttribute('color', ...)`

### Color Interpolation with lerp

The `THREE.Color.lerp()` method blends between two colors:

```ts
const colorInside = new THREE.Color('#a54841'); // warm center
const colorOutside = new THREE.Color('#3b5284'); // cold outside

const mixedColors = colorInside.clone();
mixedColors.lerp(colorOutside, ratio); // ratio from 0 to 1
```

The `ratio` parameter controls the blend:
- `0` = pure `colorInside`
- `1` = pure `colorOutside`
- `0.5` = equal mix

In this galaxy generator, the ratio is based on `radius / maxRadius`, so particles near the center get warm colors and particles at the edges get cold colors.

### Why clone before lerp?

`lerp()` modifies the color in place. If you call it directly on `colorInside`, you'll overwrite the original color. Always `.clone()` first!

## Code

in repo - `apps/b_project-4-colors`

```ts
// Enable vertex colors on material
material.vertexColors = true;

// Create color attribute array
const colors = new Float32Array(count * 3);

// Create Color instances
const colorInside = new THREE.Color(debugObject.insideColor);
const colorOutside = new THREE.Color(debugObject.outsideColor);

for (let i = 0; i < count * 3; i++) {
  const i3 = i * 3;
  const radius = Math.random() * maxRadius;

  // Mix colors based on distance from center
  const mixedColors = colorInside.clone();
  mixedColors.lerp(colorOutside, radius / maxRadius);

  // Set RGB values
  colors[i3] = mixedColors.r;
  colors[i3 + 1] = mixedColors.g;
  colors[i3 + 2] = mixedColors.b;
}

// Set the color attribute on geometry
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
```

## Gotchas

- **Must enable `vertexColors`**: Without `material.vertexColors = true`, Three.js ignores the color attribute entirely
- **Clone before lerp**: `lerp()` modifies the color in place - always `.clone()` first or you'll overwrite your original colors
- **Color attribute format**: Must be a `Float32Array` with 3 components per vertex (R, G, B), matching the positions array structure
- **BufferAttribute size**: The second argument to `BufferAttribute` is the item size (3 for RGB), not the total array length

## Revisit

- Experiment with more than two colors (e.g., gradient from center to edge)
- Try different interpolation functions or easing curves
- Consider using `THREE.Color.lerpHSL()` for more perceptually uniform color transitions
- Look into `THREE.Color.setHSL()` for color manipulation using hue/saturation/lightness

## Outdated

approach is valid

## Links & Resources

### Docs

- [Three.js BufferGeometry Documentation](https://threejs.org/docs/#api/en/core/BufferGeometry) > 🤖 suggested
- [Three.js Color Documentation](https://threejs.org/docs/#api/en/math/Color) > 🤖 suggested
- [Three.js PointsMaterial Documentation](https://threejs.org/docs/#api/en/materials/PointsMaterial) > 🤖 suggested

### Examples

- [Three.js Points Example](https://threejs.org/examples/#webgl_points) > 🤖 suggested

### Tools

- [Color Hex Color Picker](https://www.color-hex.com/color-picker/) > 🤖 suggested - for choosing inside/outside colors

### Videos

- [Three.js Particle Systems Tutorial](https://www.youtube.com/watch?v=pUogSiVcWjg) > 🤖 suggested

### Other

- [MDN Color.lerp Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/lerp) > 🤖 suggested
