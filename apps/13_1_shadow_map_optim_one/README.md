# Shadow map optimizations - part one

Exploring optimizations for the shadow

## Namera / Intent

Cilj je razumeti sta se sve moze menjati kako bi se drop shadow optimizovao.

Bavicu se optimizovanjem i u narednim lekcijma ili lekciji.

## Šta treba objasniti u detalje

- we can access the shadow map in the `shadow` propery of the light
    ```ts
    console.log( directionalLight.shadow )
    ```
- directionalLight.shadow.mapSize.width/height
- near and far (also only for precision; won't improve anything)
- THREE.CameraHelper for `directionalLight.shadow.camera`
- why is `directionalLight.shadow.camera` an ortographic
  - does anything about parallle rays of directional light have any mening in this, about camera being Orthographic? 
- amplitude (top bottom left rigt) (because shadow.camera is othographic camera); with helper we can see that amplitude is too large
- why is called amplitude? and why is good to redice it? Is it because if our object fits more between left right bottom top, we have better quality of shadow? So if we would have scene with a huge city, a lot of buildings, qualty of shadows would be bad?
- to low values for top bottom left right will crop the shadow or make it completly invisible; but also wrong values for near and far can crop it or make it full invisible?