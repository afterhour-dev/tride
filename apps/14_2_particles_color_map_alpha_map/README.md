# Particles with WebGL - color, map, alpha map, blending, vertex colors

This app is built to explore and learn particles system in three.js. Not with WebGPU, with WebGL.

## Namera / Intent

Learning about particles color, map, alphaMap attributes and other related attributes for material; also learning how to add different colors for particles

## Šta treba objasniti u detalje

- PointsMaterial instance properties
  - color (also can be set while intatiating)
  - map
  - alphaMap
- textures are downloaded from here: <https://kenney.nl/assets/particle-pack>

- This not the first time we are hearing about alphaMap, We learned about them when we were dealing with textures.
  - texture used for alpahaMap is with black background and white shape (if I can call it like that), and if we set `tansparent` to `true`, a black part will be transparent
  - So my conclusion is you don't want your particles to be rectangles or squares:
    - as `alphaMap` (with transparent true) you should use exactly images that have opaque black and white
    - or as `map` you should use texture that already has transparent part in itself
- but using alphaMap and transparent won't be complete solution because you can still see edges, even yo uhave transparency (as you move orbit controls somtimes you will see through and sometimes you will notice edges). **That is because the particles are drawn in the same order as they are created** and WebGL doesn't really know which one is in front of the other. There are multiple ways of fixing this
  - using alpha test (The alphaTest is a value between 0 and 1 that enables the WebGL to know when not to render the pixel according to that pixel's transparency; by default , the value is 0 meaning that the pixel will be rendered anyway); we used 0.001; This solution also isn't perfect because when you have some stacionary scene without animation, user can look and sometimes see edge of the shape
  - using depth test (When drawing, the WebGL tests if what's being drawn is closer than what's already drawn; That is called depth testing and can be deactivated with depthTest like this: `material.depthTest = false`) But this isn't ideal solution because deactivating depth testing might create bugs if you have other objects in your scene or particles with different colors; which you can see by adding the cube for our scene for example
  - ising depth write (The depth of what's being drawn is stored i nwhat we call a depth buffer ; instead of not testing if particle is closer than what's in this depth buffer, we can tell the WEbGL not to write particles in that depth buffer with depthWrite) (It looks the best from all of these solutions but also you might have bugs)
  (so there are multpile solutions but there is no perfect solution. You'll have to adapt and find the best combination according to the project)
  - There i salso blending (The WebGL currently draws pixels on the top of th other; with the `blending` property ,we ca ntell webgl to add the color of the pixel to the color of the pixel already drawn; by changing blending to THREE.AdditiveBlending with keeping deptWrite disabled) (**This effect will imapct performance**) Also what I noticed with the cube, is that all particles are showing behind the cube while I orbit, even the ones in front of camera

- how to add different colors to particles by providing color buffer attribute with 3 values (in range between 0 and 1) for red green and blue (also don't forget to set `material.vertexColors = true`)