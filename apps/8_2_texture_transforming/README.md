# textures - transforming texture

Explanation of how can we apply basic transformations to a texture

## Šta treba objasniti u detalje

- repeat
  - repeting texture by using the repeat property
  - it's Vector2 with x and y properties
  - by default the texture doesn't repeat and the last pixel stretched; we can change this by with `THREE.RepeatWrapping` on the `WrapS` and `wrapT` properties
  - alternating direction with `THREE.MirroredRepeatWrapping` (is it rarely used?)
- offset
  - offseting texture
  - Vector2
- rotation
  - rotating on 2D space
  - radians
  - is this the euler?
- center
  - Vector2

## Šta samo ukratko pomenuti
