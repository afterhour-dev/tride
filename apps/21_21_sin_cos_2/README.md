# Shaders - Sin and Cos again

Continuing with sin and cos.
We also dealt with these in previous lesson

## Namera / Intent

Learnin how to use sin and cos in more ways in glsl

## Šta treba objasniti u detalje

- we will take x component from uv, multiply it by big number and pass it to sin
  - what you get is this pattern of stripes back and forth from black to white; and this can be basis for many procedural patterns

- but we can also multiply sin of one uv component to the sin of other

- we tried something else also in example, like using `max`

- point is you can use this in interesting ways
- fun effect you can create is when you are using sampler2D with texture to create some pattern that looks like a screen of old tv with those recognizable stripes