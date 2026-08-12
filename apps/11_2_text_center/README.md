# Text - lesson two - How to center text

Learning about `TextGeometry` and how to center text

## Namera / Intent

In this contination learnig how to center text with computing bounding box wich is a hard way and learning how to do it easy way

## Šta treba objasniti u detalje

- centering the text to the center of the scene (two ways - the complicated long way, and the easy wat)
  - Complicated way: using bounding which is information associated with the geometry that tells what space is taken by geometry (we are going to use the bounding mesures to recenter the geometry)
    - space can be box (`geometry.computeBoundingBox`)
    - space can be sphere (`geometry.computeBoundingSphere`)
    - why spahere or box? It helps THREE.js calculate if the object is on screen: frustum culling (what is frustum culling?)
    - by default Three.js is using sphere bounding, and we will use box bounding
    - instead of moving mesh we will use `translate` method to only move geometry
  - Easy Way:  using `center` method on TextGeometry instance

- I don't think using bounding box gave me exact correct centering, I think over y in wasn't at the middle; but easy method with `boxGeometry.center()` gave me the desired result
  
## Šta samo ukratko pomenuti

- in next lesson we will use different material for our mesh made with text geometry; we will use matcap