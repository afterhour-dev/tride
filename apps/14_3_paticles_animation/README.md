# Particles with WebGL - animating particles

This app is built to explore and learn particles system in three.js. Not with WebGPU, with WebGL.

## Namera / Intent

Learning about animating particles

## Šta treba objasniti u detalje

- There are multiple ways of animating particles
  - by using the Points instance as an Object3D instance because it inherits from it. So we can move, rotate and scale the points
  - by changing the attributes (We can update each vertex seperatly in `particlesGeometry.attributes.position.array`. the attribute position we created); because this array contains the particles positions, we have to go 3 by 3 (It is bad I idea but you can do it. Why is bad idea? I gues this is done less costly with vertex shader? Am I right?) (so we should avoid this because updating the whole attribute on each frame is bad for performances)
  