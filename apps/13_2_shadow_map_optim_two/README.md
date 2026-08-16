# Shadow map optimizations - part two

Exploring optimizations for the shadow - second part.

## Namera / Intent

Cilj je razumeti sta se sve moze menjati kako bi se drop shadow optimizovao.

Bavio sam se optimizacijam u predhodnoj lekciji, kao u ovoj, a bavicu se optimizovanjem i u narednim lekcijma (sledeca lekcija ce se odnositi ina spot light, dok se trenutna i predhodna lekcija bave iskljucivo directional light-om uz odredjene postavke za renderer.shadowMap (konkretno jedna)).

## Šta treba objasniti u detalje

- blur can be controlled with `radius` property (this technic doesn't use the proximity of the camera with the object, it's a general and cheap blur)
- what are allowed values for radius
- shadow map algorithm with `renderer.shadowMap.type`
  - THREE.BasicShadowMap - Very performant but lousy quality
  - THREE.PCFShadowMap - Less performant but smoother edges (default)
  - THREE.PCFSoftShadowMap - Less performant but even softer edges
  - THREE.VSMShadowMap - Less performant, more constraints, can have unexpected results
  - radius (blur) doesn't work with `THREE.PCFSoftShadowMap`
  