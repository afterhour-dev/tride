# Spot Light

Learning about `SpotLight`.

## Namera / Intent

Want to know important and useful things about `SpotLight`

## Šta treba objasniti u detalje

- it is like a flashlight
- it is cone of light starting at a point and oriented in a direction (explain this better, it's nort so clear to me)
- 7 arguments/properties
  - color
  - intensity
  - distance
  - angle
  - penumbra (this is strange name? What is this)
  - decay
- It doesn't seem we need
  ```ts
	THREE.RectAreaLightNode.setLTC(RectAreaLightTexturesLib.init());
  ```
  so I commented it out, so this was required only for rect area light we are not using in current app at all. Is there any other light that would require mentioned?

- so this time target is available, and in order to move it we need to add `spotlight.target` to the scene (is this true?)

- can we? do something like this in terms of target in tick function:
  ```ts
	spotLight.lookAt(sphereMesh.position);
  ```
  From my experiments I think we can't but we can do something like this:

- but we can force our spotlight to follow Object3D like this: 

  ```ts
  // target is Object3D
	spotLight.target = sphereMesh;
  ```

  now light will follow object as we move the object

  you can test this by moving by using `sphereMesh.position` or move by using `spotLight.target.position`

- if we don't want our light to follow the scene, instead we want it to follow just some empty Object3D (that is invisible thing), we must add it to the scene like this (figured this out while playing around)
  ```ts
	scene.add(spotLight.target);
  ```

  and then we use `spotLight.target.position` to move our target

- so I assume we can instatiate some other Object3D, assign it to the targert again and now we have new Object3D we can move, and for example we can switch between targets that easy