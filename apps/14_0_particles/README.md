# Particles

Learning about particles

## Namera / Intent

## Šta treba objasniti u detalje

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