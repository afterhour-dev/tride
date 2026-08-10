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
  -  iridescence
  -  transmission
- bad for performance, not used that much
- All previous properties are supported because MeshPhysicalMaterial inherits from MeshStandardMaterial
- we are keeping all properties we set up in previous lesson for standard material, but we will explore these ones that are physical specific