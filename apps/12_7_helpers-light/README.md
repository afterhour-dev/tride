# Helpers, performance, baking

Learning about helpers for all the lights we covered; and some performace tips.

I also refactored and clean up some code for all the lights, especially I clened and added some things inside gui folders for all the lights.

We will learn what baking is.

## Namera / Intent

Want to know important and useful things about helpers and performance, but also to provide good gui options so this app can be a good refrence when we forgot some things about certain light and get back to it to play around with gui and relearn what we forgot.

## Šta treba objasniti u detalje

- lights can cost a lot when it comes to performances
- try to add as few lights as possible and try to use the lights that cost less
- what is the limit of the lights we can put in the scene
- Cost
  - minimal cost 
    - AmbientLight
    - HemisphereLight
  - moderate cost
    - DirectionalLight
    - PointLight
  - high cost
    - SpotLight
    - RectAreaLight
- Baking
  - the idea is to bake the light into texture
  - this can be done in a 3D software like Blender
  - the drowback is that we cannot move the light anymore and we have to load huge textures
- Helpers assist us with positioning the lights
  - `HemisphereLightHelper`
  - `DirectionalLightHelper`
  - `PointLightHelper`
  - `RectAreaLightHelper`
  - `SpotLightHelper`
