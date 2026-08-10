# MeshPhysicalMaterial

About MeshPhysicalMaterial.

## Namera / Intent

Learnig about MeshPhysicalMaterial.

## Šta treba objasniti u detalje

- same as MeshStandardMaterial but with support of additional effects:
  - clearcoat
    - simulates thin layer of varnish on top of actual material
    - has it's own reflective properties while we can still see the default material behind it
  - sheen
    - highlights the material when seen from narrow angle
    - usually on fluffy material like fabric
  -  iridescence
     - it creates color artifacts like a fuel paddle, soap bubbles, or even LaserDiscs
  -  transmission
     -  enables light to go through material
     -  more than just transparency with `opcity` because the image behind the object gets deformed
     -  objects feel translucent
     -  ior stands for "Index of Refraction" and depends on type of material you want to simulate
        -  diamond is 2.417
        -  water is 1.333
        -  air is 1.000293
     - tickness is a fixed value and a actual tickness of the object isn't taken into account
- bad for performance, not used that much
- All previous properties are supported because MeshPhysicalMaterial inherits from MeshStandardMaterial
- we are keeping all properties we set up in previous lesson for standard material, but we will explore these ones that are physical specific

- We haven't checked every possible property but the other properties aren't as relevant
- Worst material in terms of performance

## Šta samo ukratko pomenuti

- Thinking to devide this lesson in next lessons, to cover clearcoat, sheen, iridescence and transmission separatelly, because in terms of apps it is better to have "playing around" with relevant properties separatelly, it would be clearer.

- Materials we didn't cover in these lessons about materials are `PointsMaterial` (for particles), `ShaderMaterial`, `RwShaderMaterial` (where we use GLSL to create our own material), these ones requre separate lessons and entire chapter for shaders; we are going to deal with them in the future.

- Materials (in general) can have drastic imapct on performance

## Korisni linkovi

- For transmission propertyy `ior` values: <https://en.wikipedia.org/wiki/List_of_refractive_indices>