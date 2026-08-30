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

- Tell me about threejs editor


## Šta samo ukratko pomenuti
