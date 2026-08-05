# textures - Filtering and Mipmapping

We need to know what are filtering and mipmapping.
\
If you look at the cube's top face while this face is almost hidden (because of the angle camera is looking at him) you'll see a blurrry texture and this is good. And this is because filtering and mipmapping.

## Šta treba objasniti u detalje

- why is mipmapping and filtering good?
- Mipmapping (or mip mapping" with a space) is a technic that consists of creating half a smaller version of texture again and again until we get 1x1 texture (Explain this better). All those texture variations are sent to the GPU, and the GPU will choose the most appropriate version of texture
- all of this is handled by Three.js and the GPU but we can choose different algorithms. There are two types of filter algorithms
  - minification filter happens when the pixels of texture are smaller than the pixels of the render. In other words, the texture is too big for the surface, it covers
    - miniFilter property with 6 values to choose
      - THREE.NearestFilter
      - THREE.LinearFilter
      - THREE.NearestMipmapNearestFilter
      - THREE.NearestMipmapLinearFilter
      - THREE.LinearMipmapNearestFilter
      - THREE.LinearMipmapLinearFilter (default)
  - magnification filter magFilter , happens when the pixels of the texture are bigger than the pixels of the render. In other words the texture is too small for the surface it covers.use it depending on context, if the edffect is too exaggerated, the user will probably not notice. And nearest filter is better for performances
      - THREE.NearestFilter
      - THREE.LinearFilter (default)

- if we use THREE.NearestFilter on minFilter, we don't need mipmaps `texture.generateMipmaps = false`

- Am I missing something, did I forget to set something up
- Am I using outdated approach

## Šta samo ukratko pomenuti
