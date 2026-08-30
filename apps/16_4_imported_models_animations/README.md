# Imported models - animations, editor

In this app wee will import new model that has animations, an animated model, and use the animation/s to animate our model.

We will also explain what is Threejs editor

## Namera / Intent

We want to learn how to use animated model. Therefore we loaded animated `/2.0/Fox` model from <https://github.com/KhronosGroup/glTF-Sample-Models>

We want to learn how to test models in threejs editor

## Šta treba objasniti u detalje

- GLTF supports animations and Three.js can handle those animations;when you print loaded simple Duck model from previous lessons, you can see that its `animations` array is empty

- How to handle animations; well it i a lort of work; it is not that hard but it is a lot of work; you can do a lot with threejs animations, like character that runs and then mix with anoter animation and mix with for example animation for holding gun and aiming, putting gun back etc.; but also yo ucan play an animation and that is also going to be a lot of work

- the loaded gltf object contains a `animations` property composed of multiple `AnimationClip` instances (Are those keyframes, explain them)

- We need to create `AnimationMixer`

- An AnimationMixer is like a player associated with an object that can contain one or many AnimationClip instances

- AnimationAction

- Tell me about threejs editor: <https://threejs.org/editor/>
  - Like a tiny online 3D software (you won't be able to do the same things like in Blender or Maya, but you can have fun in there)
  - Good way to test models
  - Only works with models composed of one file
  
- try dragging and dropping your duck model we used in previous lessons (for example drop binary glTF format Duck.glb). I saw there a mesh and the camera wee talked about in previous lessons. For some reason light is there so I was able to see pbr based material duck is made from, I didn't see just black duck (in older version light wasn't there by default I think). We can also add things like other built in threejs primitive geometries, and also lights etc. .Waht can you tell me more about it.

## Šta samo ukratko pomenuti
