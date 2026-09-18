# HTML loader and better intro - Starter

Why Starter? I am using here partially changed app that we built in lesson related to realistic rendering, where there we have currently unfixable problem related to handling shadows, light, normalMap texture in case of only WebGPU (everything worked perfectly in WebGL, but not in WebGPU meaning it's not problem on our side it is problem with the library in case of WebGPU, and also I 'm using currently latest version of three.js: 0.186.0), but since we are WebGPU oriented I am using WebGPU in this starter and leaving problems visible since mentioned problems aren't affecting what we want to learn in this lesson/app (hope threejs will fix this problem in the future but now it is what it is) and also we will be using cube map instead hdri. Also I rewrite starter not to use `await loadAsync` since I don't want blocking code, I don't want loading of textures to block other things related to the scene, since for starter I want to avoid that white screen where texture or model loading blocks rendering which is the case in almost every of previous apps in this monorepo.

Let me restate problem again:
  - without normalMap everything works, shadows works
  - adding normal map on the wall makes wrong side of the wall to be lit (I used Box instead of plane to show this)
  - floor is lit on the correct side and there is shadow, but shadow is also on the back of the wall and it is stripy
  - setting bias doesn't have any effect (I correct myself I works but I don't know how well)
  - setting normalBias has effect but it is strange (I correct myself I works but I don't know how well)
  - rotating wall to be horizontal is only way for shadow to show on lit side

What else we have in the scene:
  - Flight Helmet model (2.0) I downloaded from: <https://github.com/KhronosGroup/glTF-Sample-Models>
  - Gaming console model I built in blender

## Namera / Intent

Napravljeno kao starter, dobar za ucenje kako handle-obvati loader i bolji intro za app.

## Šta treba objasniti u detalje

- Related to problem I presented do you think I made some errors, or I am using something incorrectly so I'm having mentioned bug?

## Šta samo ukratko pomenuti

- {koncept koji nije fokus lekcije, ali se pojavljuje u kodu}

## Gotchas / Stvari koje lako zeznem

- {stvar 1 — šta je zbunjujuće ili lako pogrešiti}
- {stvar 2}
