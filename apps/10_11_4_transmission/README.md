# MeshPhysicalMaterial

About transmission effect of MeshPhysicalMaterial.

## Namera / Intent

Learnig about transmission effect of MeshPhysicalMaterial..

## Šta treba objasniti u detalje

- transmission
  - enables light to go through material
  - more than just transparency with `opcity` because the image behind the object gets deformed
  - objects feel translucent
  - ior stands for "Index of Refraction" and depends on type of material you want to simulate
    - diamond is 2.417
    - water is 1.333
    - air is 1.000293
  - tickness is a fixed value and a actual tickness of the object isn't taken into account

## Korisni linkovi

- For transmission propertyy `ior` values: <https://en.wikipedia.org/wiki/List_of_refractive_indices>