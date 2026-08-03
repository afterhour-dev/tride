# textures

Exploring textures. Primarly learning about mostly used types or formats. And also learning about ways to load textures.

We used sample texture downloaded from [here](https://3dtextures.me/2019/04/16/door-wood-001/), which is very popular texture.

## Šta treba objasniti u detalje

- What are textures, and why are they also called maps?
- where they are being applied
- Mostly used types of texture
  - Color (or Albedo)
    - most simple one
    - applied on geometry
  - Alpha
    - grayscale image (what does this mean?)
    - white visible (what does this mean?)
    - black part not visible, white part visible, gray half visible (what does this mean?)
    - where is applied (material, geometry ...)?
  - Height (or Displacement)
    - grayscale image
    - moves the vertices to create some relief
    - need enough subdivision
    - where is applied (material, geometry ...)?
  - Normal
    - add details
    - why is purplish or bluish
    - doesn't need subdivisions
    - the verticals won't move
    - lures the light about the face orientation (what does this mean?)
    - better performance then adding height texture with a lot subdivisions
    - where is applied (material, geometry ...)?
  - Ambient occlusion
    - grayscale image
    - adds fake shadows in creavices
    - not physically accurate
    - helps to create contrast and see details
    - where is applied (material, geometry ...)?
  - Metalness
    - grayscale image
    - white is metallic (what does this mean?)
    - black is non-metalic (what does this mean?)
    - mostly for reflection
    - where is applied (material, geometry ...)?
  - Roughness
    - grayscale image
    - in duo with metalness
    - white is rough (what does this mean?)
    - black is smooth (what does this mean?)
    - mostly for light dissipation (what does this mean?)
- What are PBR principales, especially mtallness and roughness follow PBR principles
  - phisically based rendering (i assume this is the menaing)
  - many techics that tend to follow real-life directions to get realistic results
  - becoming the standard for realistic renders (is this the case today?)
  - many software, engines, and libraries are using it

- Explain how to load textures uing image.onload and `THREE.Texture`, because we want to know what happens under the hood when we use textureloader
- explain how to load texture with `THREE.TextureLoader`, and one texture loader can load multiple textures
- explain how to use LoadingManager to mutualize the events (what this means?)
  - it is useful if we want to know the global loading progress or be informed when everything is loaded 

## Šta samo ukratko pomenuti

- there are many other types of textures that the major ones, just mention these other ones brefly