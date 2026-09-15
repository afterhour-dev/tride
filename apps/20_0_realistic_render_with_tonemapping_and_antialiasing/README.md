# Realistic render - Tone mapping and antialiasing

Setup for this app:
  - Flight Helmet model: <https://github.com/KhronosGroup/glTF-Sample-Models/tree/main/2.0/FlightHelmet>
  - draco compressed gaming console I built in blender
  - we also have environment map: <https://polyhaven.com/a/abandoned_garage>, with some settings we learned in previous lessons
  - gui where we can tweak environment map among other things

What we added after setup is whatwe want to learn and that is settings we want to cover in order to achive realistic render.

In this lesson we are dealing with toneMapping and antialiasing

## Namera / Intent

Exploring settings we can use to achive realistic render with tone mapping antialiasing (or preventing aliasing).

## Šta treba objasniti u detalje

- `toneMapping`
  - intends to convert High Dynamic Range (HDR) values to Low Dynamic Range (LDR) values; Tone mapping in Three.js will actually fake the process of converting LDR to HDR even if the colors aren't HDR resulting in a very realistic render

  - I can notice difference when I switch different tone mapping values but why it looks the same when I select NoToneMapping and LinearToneMapping

  - I heard that people tend to use only Cineon, Reinhard and ACESFilmic? Why? Is Linear boring or something or looks like there is no tone mapping like default option?

  - THREE.ReinhardToneMapping
    - Colors look washed out, but very realistic like with a poorly set camera; we will use this one through the lesso the most

- `toneMappingExposure`
  - We can change the tone mapping exposure; but what is the effect of setting this property
  - Explain me what are allowed ranges of value for this
  - do we need to have luminosity of our screen rightly set for this one?

- Antialiasing
  - We call aliasing an artifact that might appear in some situations where we can see a stair-like effect; usually on the edge of geometries (You can try checking this out on screens with `window.devicePixelRatio === 1` (which is my screen) I looked at the edge of my gaming console and see that effect model also less noticable but noticable on edges of goggles of flight helmet model, and there are the stairs like effect on the edges, especially when you look at the edge and you have something dark behind (when you have high contrast), you ca nsee them); so on one hand our flight helmet model isn't subject a lort to that problem because there are a lot of details, but on the other hand it also depends on pixel ratio, so if you had desed pixel on the screen you wouldn't notice that
  - Why is mentioned effect happening? When the rendering of pixel occurs it tests what geometry is being rendered in that pixel. It calculates the color, and in the end, that color appears on the screen
  - We need to get rid of that stair-like effect; amd there are many ways of fixing that problem; but we are going to mention one but use just one
    - Super sampling (SSAA) (also called Fullscreen sampling (FSAA))
      - We increase the resolution beyond the actual one; When resized to its normal-sized, each pixel color will automatically be averaged from 4 pixels rendered; Easy but bad for performance (this seems good if you have project where you have less lights or just use matcaps; I might try this one for my projects after completing this monorepo; should I do it? is it deprecated? Is there more modern solution?); but you might be able to explain me this one better practiaclly?
    - Multi sampling (MSAA) which we are going to use
      - Automatically performed by most recent GPUs (does it work on `AMD Lucienne [Integrated]`); Will check the neighbors of the pixel being rendered. If it's the edge of the geometry, will mix its color with those neighbors colors; Only works on geometry edges (and it terms of performance it is ok since only applies on edges) (wont fix inside of geometries if you for example have sharp textures inside geometry, for that fix can be using lower resolution textures mipmapping etc.)
      - You just add `antialias`: `true` when instatiating renderer
      - it will slightly exaust resources; bu screens with a pixel ratio above 1 don't really need antialias
      - can I do something like this when setting it up:
      ```ts
      Math.min(window.devicePixelRatio, 2) === 1 ? true: false
      ```

## Šta samo ukratko pomenuti

- Sometimes we want very realistic render. Many things participate in a wrong looking model.Some of the following techniques can have a performance impact, and some depend on what you want to display (but we should be fine in terms of performace in this series of leassons dealing with realistic render)

- among other settings we need good environment map
  - HDR equirectangular texture
  - Good lighting and reflection
  - it also has performance and weight cost, quite heavy, it is 2k
