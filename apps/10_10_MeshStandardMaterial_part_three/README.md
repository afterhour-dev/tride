# MeshStandardMaterial - Part three

Continuing with MeshStandardMaterial.

## Namera / Intent

Continuing Learnig about MeshStandardMaterial.

To be prcise we will load all of our wooden door textures on the material.

Examining it with debugui.

We have environment map we set up in previous lesson.

## Šta treba objasniti u detalje

- map property allows to apply a simple texture
- aoMap (ambient occlusion map) will add shadows where texture is dark, also what is aoMapIntensity propery doing
  - impacts ambient light (not using currently in app)
  - imapcts environment map light
  - impacts HemispereLight (not using currently in app but I will use in some lesson later)
- displacementMap (what texture is apropriate for this one, I used height texture)
  - you need more subdivisions for this one to work in our example, especailly on torus and sphere, because you will get stretched mesh (we will allow in gui for you to lower geometries to see this effect, and also try looking at wireframe while lowering the subdivisions)
  - but you still need to lower `displacementScale` propery (what are ranges for this); explain why
  - metalnessMap instead of value for metalness
  - roughnessMaap instead of value for metalness
  - or is it better to leave roughness and metallnes wit both value of 1 (I did this one)
- normalMap will fake the noraml orientation and add details to the surface regardless of the subdivision. You can comment out displacementMap and displacementScale for a moment to see that still you will have nice details just with normalMap
  - normalScale is Vector2 instance, and you can use set method to set normal intensity
- alphaMap (don't forget to set transparent to true ); when setting black parts of the texture that cover our mesh will not be visible and white ones will be visible 