# MeshToonMaterial

About MeshToonMaterial

## Namera / Intent

Learnig about MeshToonMaterial

## Šta treba objasniti u detalje

- needs light
- not realistic
- can be really cool if you don't go for realistic
- similar to lambert in terms of properties but with a cartoonsih style
- two type coloration by default (one for shadow, and one for the light)
- you can use gradient texture on the `gradientMap` property
  - what is 3x1 texture
  - why in case of 3x1 texture GPU blends the pixel
  - so we are changing minFilter and magFilter to THREE.NearestFilter and deactivating mipmapping (Tell me why?)
  - you'll get three parts, like stripe look in our case if I can say it like that
- not a lot of people tend to use this one but it can be useful using this in the games