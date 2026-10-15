# Shader Inputs - varyings and uv

Exploring shader inputs:

- varyings

Also exploring how uv vector3 works or how effects is producing by using it's components in fragment shader

## Namera / Intent

Lerning more about varyings, also about uv

## Šta treba objasniti u detalje

- varyings
  - plan is to draw gradient across the screen using uv coordinates of the mesh
  - so attribute is already supplied by threejs for the uv and we don't need to declare it ourselfs; it is called uv
  - but we need to declare varying in vertex shader if we want it to come to the fragment shader

- don't forget to document shader examples from shader files; you can skip documenting code from `main.ts` since it will be the same for current and a lot of examples in the future so I don't need that code documented every time; we need to be concentrated on shaders code. 
