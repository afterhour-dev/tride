# Shaders - Lights: Ambient Hemi Lights

## Namera / Intent

## Šta treba objasniti u detalje

- We have here starter I prebuild for series of lesson rlated to lights
  - important things are that we are loading monkey model from blender
  - and we have cube map both as background
    - environment property isn't set because I don't wanr env map lighting for now
    - 
- First thing we are doing is using ShaderMaterial for model and hokking up vertex and fragment shader

- first thing to do in fragment shader we can declare two vec3, one should be for the base color and other one for the lighting
- color vec3 should be hadamard product of base color and lighting

- first lighting we are covering is ambient lighting
  - I have directional light and ambient light in this project, but both are disabled because we will be dealing with lighting through fragment shader

- ambient light
  - very cheap to add
  - directionless lighting
  - extremely simple approcimation to global illumination

- we added ambient lighting with shader
  - suddenlt you will see model color changed, but what you'll notice in model features that nothing really shows yet because you need the actuall directional lighrt source to really see any kind of detail in the model