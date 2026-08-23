# Particles WebGL intro

This app is built to explore and learn particles system in three.js.

## Namera / Intent

Intent is Learning about particles; but we have one proble. We can't use WebGPU in this case because I had a problem with sizeAttenuation and discovered that this kind of particle system is not supported in WebGPU. So I decided to use WegGL instead, just to complete this lesson and also I need your advice and a possible solution of how we can learn to use particles in WebGPU.

Actual problem was that sizeAttenuation didn't work in case of WebGPU, and then I found that it shouldn't work or it is not yet implemented and that I should learn how to do particles with TSL, but I am not yet there to learn shaders, because we planned learning of shaders after we complete some classic tecniques and advanced or itermediate techiques and then shaders are on the table after that.

## Šta treba objasniti u detalje

- we are using WebGL for this one
- why are we using WebGL
- soution of how we can learn about particle system in WEbGPU
- will particles system or similar like WebGL will be implemented in WebGPU
- best resources of learning particles in threejs with WebGPU and TSL
- Does it eaven worth learning particles with WebGL and threejs

- particles can be used to create stars, smoke, rain, dust, fire etc.
- you can have thousands of them with a resonable frame rate
- each particle is composed of plane(two triangles) always facing the camera
- creating particles is similar to creating the mesh; what you need is:
  - `BufferGeometry` instance (like `SphereGeometry` for example)
  - `PointsMaterial` instance
  - `Points` instance
- material options
  - `size` controls all particles size
  - `sizeAttenuation` to specify if distant particles should be smaller than close particles
