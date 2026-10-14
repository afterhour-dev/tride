# Simple colors

Learning some basics about color and fragment shader.

## Namera / Intent

Learning basics about color and fragment shader.

## Šta treba objasniti u detalje

- How colors is represented in GLSL?

- Common way in CSS, Photoshop, etc is ether:
  - HEX  ->    `0xFF0FF`
  - RGB  ->    `rgb(255,0,255)`

- But in shader is different, GLSL typically deals with colorss in the range between 0.0 and 1.0; so in floating point nubers betwen 0.0 and 1.0

- Red (0xff0000 or rgb(255,0,0)) in GLSL is:
  - `vec3(1.0,0.0,0.0)`

- So this is the concersion:
  - glslColor = rgbColor / 255.0

- some examples:
  - 0x800000
    - rgb(128,0,0)
    - vec3(0.501,0.0,0.0)
  - 0xFF8000
    - rgb(255,128,0)
      - vec3(1.0,0.501,0.0)

- vec4
  - red green blue, alpha
  - alpha is useful for blending later
    - not used currently in our example

- don't forget to document shader examples from shader files; you can skip documenting code from `main.ts` since it will be the same for this and a lot of examples in the future so I don't need that code documented; we need to be concentrated on shaders code 

