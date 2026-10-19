# Shaders - Textures: Filterinh

We are exploring the filteting aspect of textures.

## Namera / Intent

Learning about filtering and understanding filtering.

## Šta treba objasniti u detalje

- We want to know about it and don't want to dive much into it; but it is worth knowing that this exists. and that you have control over it
- Defaults are going to be good enough in most cases

- You have a couple of standart option to tell opengl,How should the texture behave under certain circumstances?
  - what happens when you zoom in on a texture?
  - wha happens when you zoom out?
  - You have couple standard options ( setting `magFilter`)
    - Nearest Filtering
      - you will see everything get pixelated, beccaue in this case we told opengl when zoomed in to grab the nearest pixel for where w asked (give me closest texel and don't do anything else) (it is fast)
    - Linear Filtering
      - gpu samples the four closest texture samples (texels) and blends them together in something called bilinear filtering (same thing happens when you zoom out)
        - is LinearFilter the default?

- As I understand this has to do with performace also? Thes options we mentioned? Is this correct?

- Mipmaps
  - whaen texture are created
    - have an option to specify or create a mipmap chain
    - Often just handled by 3D engines,threejs creats it for you
- in eessece mipmaps are set of textures; instead of the 1 texture you specify
  - you get a set of textures
  - each one half the size of previous
  - treated as just one texture in GLSL
- gives you options on how to sample
  - choose between Nearest/Linear filtering when sampling

- use mipmaps or don't use mipmaps
  - if you use mipmaps, sample from either
    - "Nearest" mipmap level
    - 2 nearest mipmap levels (upper/lower), and blend between them

- Trilinear filtering
  - Bilinear samples + 2 nearest mipmap levels
    - blend it together



- Can you give me solution for this:
  - How many texels get read in trilinear sample?
    - If doing a single bilinear sample means that 4 texels get read by GPU, how many texels get read by trilinear sample?

- don't forget to document and explain shader code, all examples from shader files. Doesn't matter if they are commented out or not. Just follow the info and explain and document code.
