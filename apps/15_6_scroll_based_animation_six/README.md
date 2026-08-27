# Scroll based animation - particles

This app is made for learning how we can do scroll based animations in threejs, we want to integrate threejs properly with HTML content.

This project is continuation of previous lesson. Continuation of project will be in next lesson.

## Namera / Intent

Learn how to utalize techique of scroll based animation with Three.js.

## Šta treba objasniti u detalje

- a good way to make the experience more immersive and to help the user feel the depth is to add particles
- for particles to work we must switch from WebGPU to WebGL
- for y (vertical) positioning of particles we need to make the particles start high enough and then spread for enough bellow so that we reach the end with the scroll, so ve use objectDistance property of debugObject
- we won't do more with particles that we did right now, but you can improve them as we did in the previous lessons tied to particles where we have random sizes, random alpha, and we even animate them