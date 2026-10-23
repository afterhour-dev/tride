# Shaders - Lights: Ambient Hemi Lights

## Namera / Intent

## Šta treba objasniti u detalje

- We have here starter I prebuild for series of lesson rlated to lights
  - important things are that we are loading monkey model from blender
  - and we have cube map both as background and environment
  - shaders aren't hooked yet

- First thing we are doing is using ShaderMaterial for model and hokking up vertex and fragment shader

- first thing to do in fragment shader we can declare two vec3, one should be for the base color and other one for the lighting
- color vec3 should be hadamard product of base color and lighting 