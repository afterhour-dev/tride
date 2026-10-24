# Shaders - Lights: Ambient Hemisphere Lights

We are exploring ambient anf hemisphere light with fragment shader.

## Namera / Intent

Learning about hemisphere and ambient lighting in shaders.

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

- we will ad hemi lighting
  - a slightly better ambient lighting
  - like 2 ambient lights
  - sky and ground colors
  - approximates effect of bounce from sky vs ground

- for hemi lighting we need to bring meshes normal, supplied by threejs, we need to sent it via varying from vertex shader

- Why do we need to renormalize the normal in fragment shader? It has to do with interpolation, you tell me how and why?

- you can bredly visualize the normals by setting color to be normal
  - as you move camera arounfd the monkey head, you can see normals represented by colors, and we can iterpret them visually
    - front face is blue which corresponds of normal vec3 being 0 0 1
    - top is green corresponding to 0 1 0
    - back is red corresponding to 1 0 0

- to make hemi light work you need to have two lights


- we set up our hemi light, and you'll see brownish from bellow, fro mground and bluish from above, from the sky


- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.